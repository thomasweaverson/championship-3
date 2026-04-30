import { ElementClass } from '../utils/const';

// Нужно для тестирования на переполнение

export default class HeaderHeightController {
  #header;
  #resizeObserver;
  #property = '--header-height';
  #currentHeight = 0;

  constructor() {
    this.#header = document.querySelector(`.${ElementClass.HEADER}`);
  }

  init() {
    if (!this.#header) {
      return;
    }
    this.#setListeners();
    this.updateHeight();
  }

  updateHeight = () => {
    requestAnimationFrame(() => {
      if (!this.#header) {
        return;
      }

      const newHeight = this.#header.offsetHeight;

      if (Math.abs(this.#currentHeight - newHeight) > 0.1) {
        this.#currentHeight = newHeight;
        document.documentElement.style.setProperty(this.#property, `${newHeight}px`);
      }
    });
  };

  #setListeners() {
    this.#resizeObserver = new ResizeObserver(this.updateHeight);
    this.#resizeObserver.observe(this.#header);
  }
}
