import { BASE_OBSERVER_THRESHOLD, COUNTER_ACCELERATION_COEFFICIENT } from './settings';

// Передать элемент в котором будут только цифры, начальное и конечное значение.
// При необходимости можно настроить длительность

export default class Counter {
  #element;
  #startValue;
  #endValue;
  #duration;
  #hasAnimated = false;
  #observer = null;

  constructor(element, startValue, endValue, duration = 1000) {
    this.#element = element;
    this.#startValue = startValue;
    this.#endValue = endValue;
    this.#duration = duration;
  }

  init() {
    if (!this.#element) {
      return;
    }

    this.#element.textContent = this.#startValue;
    this.#setupObserver();
  }

  #onIntersection = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !this.#hasAnimated) {
        this.#hasAnimated = true;
        this.#startCounter();

        this.#observer.unobserve(this.#element);
      }
    });
  };

  #startCounter() {
    const difference = this.#endValue - this.#startValue;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / this.#duration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, COUNTER_ACCELERATION_COEFFICIENT);
      const currentValue = this.#startValue + (difference * easeOutQuart);

      this.#element.textContent = Math.round(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.#element.textContent = this.#endValue;
      }
    };

    requestAnimationFrame(animate);
  }

  #setupObserver() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: BASE_OBSERVER_THRESHOLD
    };

    this.#observer = new IntersectionObserver(this.#onIntersection, options);
    this.#observer.observe(this.#element);
  }
}
