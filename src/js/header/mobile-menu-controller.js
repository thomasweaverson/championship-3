import { ElementClass, NAVIGATION_WRAPPER_TRANSITION_DURATION, TABLET_BREAKPOINT } from '../utils/const';
import { setBodyScrollLock } from '../utils/tools';

// Большой модуль для управления хедером
// Обработка случаев перехода на мобильный вид и обратно
// Работа с тогглером
// Фокусировка при открытии меню
// .


export default class MobileMenuController {
  #header;
  #menu;
  #navWrapper;
  #navList;
  #headerButton;
  #toggler;
  #isTablet;

  #touchStartY = 0;
  #touchEndY = 0;
  #minSwipeDistance = 50;

  constructor() {
    this.#header = document.querySelector(`.${ElementClass.HEADER}`);
    this.#menu = this.#header.querySelector(`.${ElementClass.MOBILE_MENU}`);
    this.#navWrapper = this.#menu.querySelector(`.${ElementClass.MOBILE_MENU_LIST_WRAPPER}`);
    this.#navList = this.#menu.querySelector(`.${ElementClass.MOBILE_MENU_LIST}`);
    this.#headerButton = this.#header.querySelector(`.${ElementClass.HEADER_BUTTON}`);
    this.#toggler = this.#header.querySelector(`.${ElementClass.TOGGLER}`);

    this.#isTablet = window.innerWidth >= TABLET_BREAKPOINT;
  }

  init() {
    if (!this.#header) {
      return;
    }

    this.#checkInitialViewport();
    this.#unblockTransitions();
    this.#setListeners();
  }

  #unblockTransitions = () => {
    this.#toggler.classList.remove(`${ElementClass.TOGGLER}--block-transition`);
    this.#navWrapper.classList.remove(`${ElementClass.MOBILE_MENU_LIST_WRAPPER}--block-transition`);
  };

  #toggleMenuClasses = (isOpen) => {
    const action = isOpen ? 'add' : 'remove';
    const reverseAction = isOpen ? 'remove' : 'add';

    this.#navWrapper.classList[action](`${ElementClass.MOBILE_MENU_LIST_WRAPPER}--open`);
    this.#navWrapper.classList[reverseAction](`${ElementClass.MOBILE_MENU_LIST_WRAPPER}--close`);

    this.#navList.classList[action](`${ElementClass.MOBILE_MENU_LIST}--open`);
    this.#navList.classList[reverseAction](`${ElementClass.MOBILE_MENU_LIST}--close`);

    if (isOpen) {
      this.#navList.classList.remove(`${ElementClass.MOBILE_MENU_LIST}--slide-up`);
    }

    this.#menu.classList[action](`${ElementClass.MOBILE_MENU}--open`);
    this.#menu.classList[reverseAction](`${ElementClass.MOBILE_MENU}--close`);

    this.#toggler.classList[action](`${ElementClass.TOGGLER}--open`);
  };

  #removeMobileClasses = () => {
    [this.#navWrapper, this.#navList, this.#menu].forEach((element) => {
      const baseClass = element.classList[0];
      element.classList.remove(`${baseClass}--open`, `${baseClass}--close`, `${baseClass}--slide-up`);
    });
  };

  show = () => {
    this.#toggleMenuClasses(true);
    this.#menu.inert = false;
    setBodyScrollLock(true);
  };

  hide = () => {
    this.#toggleMenuClasses(false);
    this.#menu.inert = true;
    setBodyScrollLock(false);
  };

  #onTouchStart = (event) => {
    this.#touchStartY = event.changedTouches[0].screenY;
  };

  #onTouchMove = (event) => {
    this.#touchEndY = event.changedTouches[0].screenY;
  };

  #onTouchEnd = () => {
    if (!this.#touchStartY || !this.#touchEndY) {
      return;
    }
    const distance = this.#touchStartY - this.#touchEndY;
    const isSwipeUp = distance > this.#minSwipeDistance;

    if (isSwipeUp && this.#menu.classList.contains(`${ElementClass.MOBILE_MENU}--open`)) {

      this.hide();
    }

    this.#touchStartY = 0;
    this.#touchEndY = 0;
  };

  #onEscKeydown = (event) => {
    if (event.key === 'Escape' && this.#menu.classList.contains(`${ElementClass.MOBILE_MENU}--open`)) {
      this.hide();
    }
  };

  #onUnderlayClick = (event) => {
    if (event.target === this.#menu) {
      this.hide();
    }
  };

  #onWindowResize = () => {
    const currentIsTablet = window.innerWidth >= TABLET_BREAKPOINT;

    if (currentIsTablet && !this.#isTablet) {
      this.#handleSwitchToTablet();
    } else if (!currentIsTablet && this.#isTablet) {
      this.#handleSwitchToMobile();
    }

    this.#isTablet = currentIsTablet;
  };

  #handleSwitchToTablet = () => {
    const wasOpen = this.#menu.classList.contains(`${ElementClass.MOBILE_MENU}--open`);
    this.hide();
    document.removeEventListener('keydown', this.#onEscKeydown);
    this.#menu.inert = false;
    this.#toggler.inert = true;

    setTimeout(() => {
      this.#removeMobileClasses();
    }, wasOpen ? NAVIGATION_WRAPPER_TRANSITION_DURATION : 0);
  };

  #handleSwitchToMobile = () => {
    document.addEventListener('keydown', this.#onEscKeydown);
    this.#toggler.inert = false;

    this.#navWrapper.classList.add(`${ElementClass.MOBILE_MENU_LIST_WRAPPER}--block-transition`);

    requestAnimationFrame(() => {
      const headerHeight = this.#header.offsetHeight;

      requestAnimationFrame(() => {
        this.#header.style.maxHeight = `${headerHeight}px`;
        this.#navList.classList.add(`${ElementClass.MOBILE_MENU_LIST}--slide-up`);
      });
    });

    let isHandled = false;
    const cleanup = () => {
      if (isHandled) {
        return;
      }
      isHandled = true;
      this.hide();
      this.#navWrapper.classList.remove(`${ElementClass.MOBILE_MENU_LIST_WRAPPER}--block-transition`);
      this.#header.style.maxHeight = '';
    };

    this.#navList.addEventListener('animationend', cleanup, { once: true });

    // осознанный setTimeout, чтобы не влиять на анимацию.
    // Поднятие lighthouse. Расчёт длительности пагубно влиял
    setTimeout(cleanup, 500);
  };

  #onHeaderButtonClick = () => {
    if (this.#menu.classList.contains(`${ElementClass.MOBILE_MENU}--open`)) {
      this.hide();
    }
  };

  #onTogglerClick = () => {
    const isOpen = this.#toggler.classList.contains(`${ElementClass.TOGGLER}--open`);
    if (isOpen) {
      this.hide();
    } else {
      this.show();
    }
  };

  #onTogglerKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const isOpen = this.#toggler.classList.contains(`${ElementClass.TOGGLER}--open`);

      if (!isOpen) {
        this.show();
        this.#focusFirstLink();
      } else {
        this.hide();
      }
    }
  };

  #checkInitialViewport = () => {
    if (this.#isTablet) {
      this.#toggler.inert = true;
    } else {
      this.hide();
      document.addEventListener('keydown', this.#onEscKeydown);
    }
  };

  #focusFirstLink = () => {
    const link = this.#menu.querySelector(`.${ElementClass.MOBILE_MENU_LINK}`);
    link?.focus();
  };

  #setListeners = () => {
    window.addEventListener('resize', this.#onWindowResize);

    this.#headerButton.addEventListener('click', this.#onHeaderButtonClick);
    this.#toggler.addEventListener('click', this.#onTogglerClick);
    this.#toggler.addEventListener('keydown', this.#onTogglerKeyDown);

    this.#menu.addEventListener('click', this.#onUnderlayClick);

    this.#menu.addEventListener('touchstart', this.#onTouchStart, { passive: true });
    this.#menu.addEventListener('touchend', this.#onTouchEnd, { passive: true });
    this.#menu.addEventListener('touchmove', this.#onTouchMove, { passive: true });
  };
}
