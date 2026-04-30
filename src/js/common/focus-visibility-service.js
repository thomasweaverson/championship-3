import { ElementClass, VISIBILITY_FOCUS_THRESHOLD } from '../utils/const';

// Модуль защищает от перекрытия элемента фиксированным хедером
// при перемещении на него по tab

const initFocusVisibilityService = () => {
  window.addEventListener('focusin', (event) => {
    const activeElement = event.target;

    // чтобы не реагировал, на обычный фокус при клике мышью
    if (!activeElement.matches(':focus-visible')) {
      return;
    }

    const header = document.querySelector(`.${ElementClass.HEADER}`);
    // если активный элемент не внутри документа
    if (!activeElement || activeElement === document.body) {
      return;
    }

    // чтобы исключить элементы из хедера
    if (header && header.contains(activeElement)) {
      return;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const rect = activeElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        const headerHeight = header ? header.offsetHeight : 0;
        const scrollThresholdTop = headerHeight + VISIBILITY_FOCUS_THRESHOLD;

        if (rect.top < scrollThresholdTop) {

          const viewCenter = viewportHeight / 2;
          const elementCenter = rect.top + (rect.height / 2);

          const scrollDistance = elementCenter - viewCenter;

          window.scrollBy({
            top: scrollDistance,
            behavior: 'smooth'
          });
        }
      });
    });
  });
};

export { initFocusVisibilityService };
