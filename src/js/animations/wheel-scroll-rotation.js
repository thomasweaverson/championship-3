import {
  ROTATING_WHEEL_RANGE,
  ROTATING_WHEEL_SMOOTHNESS,
  ROTATING_WHEEL_START_ANGLE,
  WHEEL_OBSERVER_MARGIN,
  WHEEL_OBSERVER_THRESHOLD
} from './settings';

// Класс обеспечивает вращение логотипа Академии в секции .about при скролле
// Вполне универсален, так что можно переиспользовать

export default class WheelScrollRotation {
  #wheel;
  #section;
  #initialRotation = ROTATING_WHEEL_START_ANGLE;
  #currentRotation = ROTATING_WHEEL_START_ANGLE;
  #targetRotation = ROTATING_WHEEL_START_ANGLE;
  #isActive = false;
  #observer = null;
  #animationId = null;
  #ticking = false;

  #smoothness = ROTATING_WHEEL_SMOOTHNESS;
  #rotationRange = ROTATING_WHEEL_RANGE;
  #invertDirection = false;

  constructor(wheelElement, section) {
    this.#wheel = wheelElement;
    this.#section = section;
  }

  init() {
    if (!this.#wheel) {
      return;
    }

    this.#setupVisibilityObserver();
    this.#animate();

    this.#updateTargetRotation();
  }

  #onWindowScroll = () => {
    if (!this.#isActive) {
      return;
    }

    if (!this.#ticking) {
      requestAnimationFrame(() => {
        this.#updateTargetRotation();
        this.#ticking = false;
      });
      this.#ticking = true;
    }
  };

  #onIntersection = (entries) => {
    entries.forEach((entry) => {
      const wasActive = this.#isActive;
      this.#isActive = entry.isIntersecting;

      if (this.#isActive && !wasActive) {
        this.#addScrollListener();
        this.#updateTargetRotation();
      } else if (!this.#isActive && wasActive) {
        this.#removeScrollListener();
      }
    });
  };

  #updateTargetRotation() {
    const rotation = this.#calculateRotation();
    if (rotation !== undefined) {
      this.#targetRotation = rotation;
    }
  }

  #calculateRotation() {
    if (!this.#section) {
      return this.#initialRotation;
    }

    const rect = this.#section.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    let progress;

    if (rect.height > windowHeight) {
      progress = (windowHeight - rect.top) / (rect.height + windowHeight);
    } else {
      const visibleStart = Math.max(0, -rect.top);
      const visibleEnd = Math.min(windowHeight, rect.bottom);
      const visibleHeight = Math.max(0, visibleEnd - visibleStart);
      progress = visibleHeight / rect.height;
    }

    progress = Math.min(Math.max(progress, 0), 1);

    let rotation = this.#initialRotation + (this.#rotationRange * progress);

    if (this.#invertDirection) {
      rotation = this.#initialRotation + (this.#rotationRange * (1 - progress));
    }

    return rotation;
  }

  #animate = () => {
    if (this.#isActive) {
      this.#currentRotation += (this.#targetRotation - this.#currentRotation) * this.#smoothness;
      this.#wheel.style.transform = `rotate(${this.#currentRotation}deg)`;
    }

    this.#animationId = requestAnimationFrame(this.#animate);
  };

  #setupVisibilityObserver() {
    if (!this.#section) {
      this.#isActive = true;
      this.#addScrollListener();
      return;
    }

    this.#observer = new IntersectionObserver(this.#onIntersection, {
      threshold: WHEEL_OBSERVER_THRESHOLD,
      rootMargin: WHEEL_OBSERVER_MARGIN
    });

    this.#observer.observe(this.#section);
  }

  #addScrollListener() {
    window.addEventListener('scroll', this.#onWindowScroll);
  }

  #removeScrollListener() {
    window.removeEventListener('scroll', this.#onWindowScroll);
  }

  destroy() {
    this.#isActive = false;
    this.#removeScrollListener();
    this.#observer?.disconnect();
    if (this.#animationId) {
      cancelAnimationFrame(this.#animationId);
    }
  }
}
