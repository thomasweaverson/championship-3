import { TABLET_BREAKPOINT } from '../utils/const';
import {
  FAST_PARALLAX_COEFFICIENT,
  PARALLAX_MAX_SHIFT,
  PARALLAX_OBSERVER_THRESHOLD,
  SLOW_PARALLAX_COEFFICIENT
} from './settings';

// Класс заточен под параллакс трёх карточек. По сути под .about
// Настройки вынесены в ./settings.js

export default class Parallax {
  #root;
  #items;
  #breakpoint = TABLET_BREAKPOINT;
  #speeds = [SLOW_PARALLAX_COEFFICIENT, FAST_PARALLAX_COEFFICIENT, SLOW_PARALLAX_COEFFICIENT];
  #maxShift = PARALLAX_MAX_SHIFT;
  #threshold = PARALLAX_OBSERVER_THRESHOLD;

  #isActive = false;
  #ticking = false;
  #mediaQuery;
  #observer = null;

  constructor({ rootElement, cardSelector }) {
    this.#root = rootElement;
    this.#items = this.#root?.querySelectorAll(cardSelector);
    this.#mediaQuery = window.matchMedia(`(min-width: ${this.#breakpoint}px)`);
  }

  init() {
    if (!this.#root || !this.#items?.length) {
      return;
    }

    this.#setupObserver();
    this.#setListeners();
  }

  #onWindowScroll = () => {
    if (!this.#isActive) {
      return;
    }

    if (!this.#ticking) {
      requestAnimationFrame(() => {
        this.#updatePosition();
        this.#ticking = false;
      });
      this.#ticking = true;
    }
  };

  #onWindowResize = () => {
    if (!this.#mediaQuery.matches) {
      this.#stopParallax();
    }
  };

  #onMediaQueryChange = (event) => {
    if (event.matches) {
      this.#checkVisibilityAndStart();
    } else {
      this.#stopParallax();
    }
  };

  #onIntersection = ([entry]) => {
    this.#isActive = entry.isIntersecting && this.#mediaQuery.matches;

    if (this.#isActive) {
      window.addEventListener('scroll', this.#onWindowScroll);
      this.#updatePosition();
    } else {
      window.removeEventListener('scroll', this.#onWindowScroll);
      this.#resetStyles();
    }
  };

  #updatePosition() {
    const rect = this.#root.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    const progress = (windowHeight - rect.top) / (windowHeight + rect.height);

    this.#items.forEach((item, index) => {
      const speed = this.#speeds[index % this.#speeds.length];
      const translateY = progress * this.#maxShift * speed;

      item.style.transform = `translateY(${translateY}px)`;
    });
  }

  #checkVisibilityAndStart() {
    const rect = this.#root.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

    if (isVisible) {
      this.#isActive = true;
      window.addEventListener('scroll', this.#onWindowScroll);
      this.#updatePosition();
    }
  }

  #stopParallax() {
    this.#isActive = false;
    window.removeEventListener('scroll', this.#onWindowScroll);
    this.#resetStyles();
  }

  #resetStyles() {
    this.#items?.forEach((item) => {
      item.style.transform = '';
    });
  }

  #setupObserver() {
    this.#observer = new IntersectionObserver(this.#onIntersection, {
      threshold: this.#threshold,
    });
    this.#observer.observe(this.#root);
  }

  #setListeners() {
    window.addEventListener('resize', this.#onWindowResize);
    this.#mediaQuery.addEventListener('change', this.#onMediaQueryChange);
  }

  destroy() {
    this.#observer?.disconnect();
    window.removeEventListener('scroll', this.#onWindowScroll);
    window.removeEventListener('resize', this.#onWindowResize);
    this.#mediaQuery.removeEventListener('change', this.#onMediaQueryChange);
    this.#resetStyles();
  }
}
