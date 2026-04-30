import {
  ANIMATION_CLASS_RELAXED_SUFFIX,
  APPEAR_ANIMATION_CLASS,
  APPEAR_SUFFIX,
  REVEAL_ANIMATION_CLASS,
  REVEAL_SUFFIX,
  SAFE_TIME_OUT,
  WRAPPER_SUFFIX
} from '../utils/const';
import { getElementsWithClassSuffix } from '../utils/tools';
import { BASE_OBSERVER_THRESHOLD, TRANSITION_BLOCK_ON_FOCUS_DURATION } from './settings';

// Элемент, который выскакивает снизу - добавить класс с суффиксом REVEAL_SUFFIX
// Элемент, который появляется (сертификат) - добавить класс с суффиксом APPEAR_SUFFIX
// Все элементы с анимацией обернуть в обертку с классом с суффиксом __hiding-wrapper
// Используются классы для анимаций - appear-animate, reveal-up-animate и их модификации -relaxed
// Обеспечить стили.
// Wrapper - overflow hidden
// у --will-reveal-up - transform: translateY (...);
// у --will-appear - transform: scale (...), opacity (...);

const getAnimationClass = (isFast, isReveal = true) => {
  const suffix = isFast ? '' : ANIMATION_CLASS_RELAXED_SUFFIX;
  const baseClass = isReveal ? REVEAL_ANIMATION_CLASS : APPEAR_ANIMATION_CLASS;
  return `${baseClass}${suffix}`;
};

export default class Appearing {
  #container;
  #revealAnimationClass;
  #appearAnimationClass;
  #appearingElements;
  #revealingUpElements;
  #wrappers;
  #observingThreshold;
  #observer;

  constructor(container, isFast = true, threshold = BASE_OBSERVER_THRESHOLD) {
    this.#container = container;
    this.#observingThreshold = threshold;

    // Подготавливаем классы анимации сразу
    this.#revealAnimationClass = getAnimationClass(isFast);
    this.#appearAnimationClass = getAnimationClass(isFast, false);
  }

  init() {
    if (!this.#container || this.#isAlreadyAnimated()) {
      return;
    }

    this.#collectElements();
    this.#setupObserver();
  }

  #collectElements() {
    this.#appearingElements = getElementsWithClassSuffix(this.#container, APPEAR_SUFFIX);
    this.#revealingUpElements = getElementsWithClassSuffix(this.#container, REVEAL_SUFFIX);
    this.#wrappers = getElementsWithClassSuffix(this.#container, WRAPPER_SUFFIX);
  }

  #isAlreadyAnimated() {
    return this.#container.dataset.appearAnimated === 'true';
  }

  #runAnimate() {
    this.#appearingElements?.forEach((element) => {
      element.classList.add(this.#appearAnimationClass);
    });

    this.#revealingUpElements?.forEach((element) => {
      if (document.activeElement === element) {
        element.style.transition = 'none';
        setTimeout(() => {
          element.style.transition = '';
        }, TRANSITION_BLOCK_ON_FOCUS_DURATION);
        const wrapper = element.closest(`[class*="${WRAPPER_SUFFIX}"]`);
        if (wrapper) {
          wrapper.style.overflow = 'visible';
        }
        return;
      }
      element.classList.add(this.#revealAnimationClass);
    });
  }

  #cleanPreparationClasses() {
    const removeBySuffix = (elements, suffix) => {
      elements?.forEach((element) => {
        const classesToRemove = [...element.classList].filter((className) => className.endsWith(suffix));
        element.classList.remove(...classesToRemove);
      });
    };

    removeBySuffix(this.#appearingElements, APPEAR_SUFFIX);
    removeBySuffix(this.#revealingUpElements, REVEAL_SUFFIX);
  }

  #removeAnimationClasses() {
    this.#appearingElements?.forEach((element) => element.classList.remove(this.#appearAnimationClass));
    this.#revealingUpElements?.forEach((element) => element.classList.remove(this.#revealAnimationClass));
  }

  #onIntersection = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        this.#runAnimate();
        requestAnimationFrame(() => {
          this.#cleanPreparationClasses();
        });

        this.#container.dataset.appearAnimated = 'true';
        observer.unobserve(this.#container);

        this.#finalizeAnimation();
      }
    });
  };

  #finalizeAnimation() {
    setTimeout(() => {
      this.#removeAnimationClasses();
      this.#wrappers?.forEach((wrapper) => {
        wrapper.style.overflow = 'visible';
      });
    }, SAFE_TIME_OUT);
  }

  #setupObserver() {
    this.#observer = new IntersectionObserver(this.#onIntersection, {
      threshold: this.#observingThreshold
    });

    this.#observer.observe(this.#container);
  }
}
