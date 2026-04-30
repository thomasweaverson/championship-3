import { ElementClass } from '../utils/const';

// Управление формой в футере. В основном управляет вводом телефона
// Также добавляет класс ElementClass.FORM_INPUT_TOUCHED если с полем взаимодействовали
// Что позволяет сделать стили для невалидного ввода только в случае "if touched"

export default class FormController {
  #form;
  #phoneInput;
  #tags;

  constructor() {
    this.#form = document.querySelector(`.${ElementClass.FORM}`);

    if (this.#form) {
      this.#phoneInput = this.#form.querySelector('.input-field--phone .input-field__input');
      this.#tags = this.#form.querySelectorAll(`.${ElementClass.INPUT_TAG}`);
    }
  }

  init() {
    if (!this.#form) {
      return;
    }

    this.#resetTagsTransition();
    this.#setListeners();
  }

  #resetTagsTransition() {
    this.#tags.forEach((tag) => {
      tag.classList.remove(`${ElementClass.INPUT_TAG}--block-transition`);
    });
  }

  #getDigits(value) {
    return value.replace(/\D/g, '');
  }

  #formatPhoneValue(digits) {
    if (!digits) {
      return '';
    }

    let val = digits;
    if (val[0] === '8') {
      val = `7${val.slice(1)}`;
    }
    if (val[0] !== '7') {
      val = `7${val}`;
    }

    val = val.substring(0, 11);
    let result = '+7';

    if (val.length > 1) {
      result += ` (${val.slice(1, 4)}`;
    }
    if (val.length >= 4) {
      result += `) ${val.slice(4, 7)}`;
    }
    if (val.length >= 7) {
      result += `-${val.slice(7, 9)}`;
    }
    if (val.length >= 9) {
      result += `-${val.slice(9, 11)}`;
    }

    return result;
  }

  #setCursor(position) {
    requestAnimationFrame(() => {
      this.#phoneInput.setSelectionRange(position, position);
    });
  }

  #onPhoneInput = (event) => {
    const digits = this.#getDigits(event.target.value);
    event.target.value = this.#formatPhoneValue(digits);
  };

  #onPhoneKeyDown = (event) => {
    const input = event.target;

    if (event.key === '+') {
      event.preventDefault();
      input.value = '+7';
      this.#setCursor(input.value.length);
      return;
    }

    if (event.key === 'Backspace') {
      const start = input.selectionStart;
      if (input.value[start - 1] && /\D/.test(input.value[start - 1])) {
        event.preventDefault();
        input.setSelectionRange(start - 1, start - 1);
      }
    }
  };

  #onPhoneFocus = () => {
    if (!this.#phoneInput.value) {
      this.#phoneInput.value = '+7';
      this.#setCursor(this.#phoneInput.value.length);
    }
  };

  #onPhoneBlur = () => {
    const digits = this.#getDigits(this.#phoneInput.value);
    if (digits.length <= 1) {
      this.#phoneInput.value = '';
    }
  };

  #onFormFieldFocusOut = (event) => {
    if (event.target.classList.contains(ElementClass.FORM_INPUT)) {
      event.target.classList.add(ElementClass.FORM_INPUT_TOUCHED);
    }
  };

  #setListeners() {
    this.#form.addEventListener('focusout', this.#onFormFieldFocusOut);

    if (this.#phoneInput) {
      this.#phoneInput.addEventListener('input', this.#onPhoneInput);
      this.#phoneInput.addEventListener('keydown', this.#onPhoneKeyDown);
      this.#phoneInput.addEventListener('focus', this.#onPhoneFocus);
      this.#phoneInput.addEventListener('blur', this.#onPhoneBlur);
    }
  }
}
