import { ElementClass } from './const';

const body = document.body;
const main = body.querySelector(`.${ElementClass.MAIN}`);
const header = body.querySelector(`.${ElementClass.HEADER}`);
const footer = body.querySelector(`.${ElementClass.FOOTER}`);

const getScrollbarWidth = () => window.innerWidth - document.documentElement.clientWidth;

const setHeaderWidth = (isScrollLocked, scrollbarWidth) => {
  if (isScrollLocked) {
    const widthInPercentWithoutScrollBar = 100 - (scrollbarWidth / window.innerWidth) * 100;
    const newHeaderWidth = `${widthInPercentWithoutScrollBar}%`;
    header.style.width = newHeaderWidth;
  } else {
    header.style.width = '100%';
  }
};

const processPageInert = (isMobileMenuOpen) => {
  main.inert = isMobileMenuOpen;
  footer.inert = isMobileMenuOpen;
};

const setBodyPaddingRight = (isMobileMenuOpen, scrollbarWidth) => {
  if (isMobileMenuOpen) {
    body.style.paddingRight = `${scrollbarWidth}px`;
  } else {
    body.style.paddingRight = '';
  }
};

const setBodyScrollLock = (isMobileMenuOpen) => {
  const scrollbarWidth = getScrollbarWidth();
  setHeaderWidth(isMobileMenuOpen, scrollbarWidth);
  setBodyPaddingRight(isMobileMenuOpen, scrollbarWidth);
  processPageInert(isMobileMenuOpen);
  body.classList.toggle(`${ElementClass.BODY}--scroll-lock`, isMobileMenuOpen);
};

const getElementsWithClassSuffix = (root, suffix) => {
  const all = root.querySelectorAll('*');
  return Array.from(all).filter((element) =>
    Array.from(element.classList).some((className) => className.endsWith(suffix))
  );
};

export { getElementsWithClassSuffix, getScrollbarWidth, setBodyScrollLock };

