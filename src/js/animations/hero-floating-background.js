import { HERO_BACKGROUND_OFFSET, HERO_BACKGROUND_SMOOTHNESS } from './settings';

// Класс заточен под .hero.
// Передаём div с фоном и секцию для observer'a
// Класс реализует покачивание фона от положения указателя мыши

export default class HeroFloatingBackground {
  #background;
  #section;
  #currentX = 0;
  #currentY = 0;
  #targetX = 0;
  #targetY = 0;
  #isActive = false;
  #observer = null;
  #animationId = null;

  #strength = HERO_BACKGROUND_OFFSET;
  #smoothness = HERO_BACKGROUND_SMOOTHNESS;

  constructor(backgroundContainer, section) {
    this.#background = backgroundContainer;
    this.#section = section;
  }

  init() {
    if (!this.#background) {
      return;
    }

    this.#setupVisibilityObserver();
    this.#animate();
  }

  #onMouseMove = (event) => {
    if (!this.#isActive) {
      return;
    }

    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = (event.clientY / window.innerHeight) * 2 - 1;

    this.#targetX = mouseX * this.#strength;
    this.#targetY = mouseY * this.#strength;
  };

  #onIntersection = (entries) => {
    entries.forEach((entry) => {
      this.#isActive = entry.isIntersecting;

      if (this.#isActive) {
        document.addEventListener('mousemove', this.#onMouseMove);
      } else {
        this.#resetPosition();
        document.removeEventListener('mousemove', this.#onMouseMove);
      }
    });
  };

  #resetPosition() {
    this.#targetX = 0;
    this.#targetY = 0;
    this.#currentX = 0;
    this.#currentY = 0;
    this.#background.style.transform = 'translate(0, 0)';
  }

  #setupVisibilityObserver() {
    if (!this.#section) {
      this.#isActive = true;
      document.addEventListener('mousemove', this.#onMouseMove);
      return;
    }

    this.#observer = new IntersectionObserver(this.#onIntersection, {
      threshold: 0.1,
      rootMargin: '30px'
    });

    this.#observer.observe(this.#section);
  }

  #animate = () => {
    if (this.#isActive) {
      this.#currentX += (this.#targetX - this.#currentX) * this.#smoothness;
      this.#currentY += (this.#targetY - this.#currentY) * this.#smoothness;

      this.#background.style.transform = `translate(${this.#currentX}px, ${this.#currentY}px)`;
    }

    this.#animationId = requestAnimationFrame(this.#animate);
  };

  destroy() {
    this.#isActive = false;
    this.#observer?.disconnect();
    cancelAnimationFrame(this.#animationId);
    document.removeEventListener('mousemove', this.#onMouseMove);
  }
}
