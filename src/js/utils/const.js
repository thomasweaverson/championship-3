const TABLET_BREAKPOINT = 960;
const MENU_SLIDE_UP_DELAY = 150;
const NAVIGATION_WRAPPER_TRANSITION_DURATION = 150;
const SAFE_TIME_OUT = 1000;

// =====================
// animations
// =====================

//Appearing
const APPEAR_SUFFIX = '--will-appear';
const REVEAL_SUFFIX = '--will-reveal-up';
const WRAPPER_SUFFIX = '__hiding-wrapper';
const APPEAR_ANIMATION_CLASS = 'appear-animate';
const REVEAL_ANIMATION_CLASS = 'reveal-up-animate';
const ANIMATION_CLASS_RELAXED_SUFFIX = '-relaxed';

const VISIBILITY_FOCUS_THRESHOLD = 50;

const ElementClass = {
  BODY: 'page',
  HEADER: 'page__header',
  HEADER_BUTTON: 'header__button',
  MAIN: 'page__main',
  FOOTER: 'page__footer',
  MOBILE_MENU: 'header__navigation',
  MOBILE_MENU_LIST: 'navigation__list',
  MOBILE_MENU_LIST_WRAPPER: 'navigation__wrapper',
  MOBILE_MENU_LINK: 'navigation__link',
  TOGGLER: 'toggler',
  SECTION_HERO: 'hero',
  HERO_BACKGROUND_CONTAINER: 'hero__animated-background',
  ABOUT_SECTION: 'about',
  ABOUT_ADVANTAGES: 'about__advantages',
  ABOUT_ADVANTAGE: 'about__advantage',
  ROTATING_WHEEL: 'advantage__wheel',
  WORK_HEADER: 'work__header',
  PRICE_SECTION: 'price',
  CERTIFICATE_SECTION: 'certificate',
  FORM: 'form',
  FORM_INPUT: 'input-field__input',
  FORM_INPUT_TOUCHED: 'input-field__input--is-touched',
  INPUT_TAG: 'input-field__tag',
  COMMUNITY_SECTION: 'community',
  COUNTER_GRADUATES: 'statistics__counter--graduates',
  COUNTER_RECOMMENDATIONS: 'statistics__counter--recommendations',
  COUNTER_QUALITY: 'statistics__counter--quality',
};

export {
  ElementClass,
  MENU_SLIDE_UP_DELAY,
  NAVIGATION_WRAPPER_TRANSITION_DURATION,
  SAFE_TIME_OUT,
  TABLET_BREAKPOINT,
  APPEAR_SUFFIX,
  REVEAL_SUFFIX,
  WRAPPER_SUFFIX,
  APPEAR_ANIMATION_CLASS,
  REVEAL_ANIMATION_CLASS,
  ANIMATION_CLASS_RELAXED_SUFFIX,
  VISIBILITY_FOCUS_THRESHOLD
};

