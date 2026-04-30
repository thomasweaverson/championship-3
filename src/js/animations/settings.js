// =================================
// Плавающий от указателя фон в секции .hero
// =================================

// Максимальное смещение в px
const HERO_BACKGROUND_OFFSET = -10;
// Плавность (0-1, меньше - плавнее)
const HERO_BACKGROUND_SMOOTHNESS = 0.08;

// =================================
// Вращение логотипа Академии в секции .about
// =================================

// Плавность (0-1, меньше - плавнее)
const ROTATING_WHEEL_SMOOTHNESS = 0.06;
// Насколько градусов провернуться за viewport
const ROTATING_WHEEL_RANGE = 180;
// Стартовое положение в градусах
const ROTATING_WHEEL_START_ANGLE = -145;
const WHEEL_OBSERVER_THRESHOLD = 0;
const WHEEL_OBSERVER_MARGIN = '50px';

// =================================
// PArallax .about
// =================================
// коэффициенты скорости смещения. зависит от maxShift
const FAST_PARALLAX_COEFFICIENT = 1.25;
const SLOW_PARALLAX_COEFFICIENT = 0.25;
// максимальное смещение
const PARALLAX_MAX_SHIFT = 260;
const PARALLAX_OBSERVER_THRESHOLD = 0;

const BASE_OBSERVER_THRESHOLD = 0.5;

// =================================
// Appering
// =================================

const ABOUT_APPEARING_THRESHOLD = 0.1;
const PRICE_APPEARING_THRESHOLD = 0.1;
const CERTIFICATE_APPEARING_THRESHOLD = 0.8;
const TRANSITION_BLOCK_ON_FOCUS_DURATION = 100;

// ==================================
// Счетчики статистики
// ==================================

const COUNTER_ACCELERATION_COEFFICIENT = 4;

// Более 100 выпускников за все время работы академии
const COUNTER_GRADUATES = 100;
// Более 78% рекомендаций за все время работы академии
const COUNTER_RECOMMENDATIONS = 78;
// Более 89% качественных работ за все время работы академии
const COUNTER_QUALITY = 89;

export {
  BASE_OBSERVER_THRESHOLD, CERTIFICATE_APPEARING_THRESHOLD, COUNTER_ACCELERATION_COEFFICIENT, COUNTER_GRADUATES, COUNTER_QUALITY, COUNTER_RECOMMENDATIONS, FAST_PARALLAX_COEFFICIENT, HERO_BACKGROUND_OFFSET,
  HERO_BACKGROUND_SMOOTHNESS, PARALLAX_MAX_SHIFT,
  PARALLAX_OBSERVER_THRESHOLD, PRICE_APPEARING_THRESHOLD, ABOUT_APPEARING_THRESHOLD, ROTATING_WHEEL_RANGE,
  ROTATING_WHEEL_SMOOTHNESS,
  ROTATING_WHEEL_START_ANGLE,
  SLOW_PARALLAX_COEFFICIENT,
  WHEEL_OBSERVER_MARGIN, WHEEL_OBSERVER_THRESHOLD,
  TRANSITION_BLOCK_ON_FOCUS_DURATION
};

