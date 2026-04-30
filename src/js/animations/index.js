import { ElementClass } from '../utils/const';
import Appearing from './appearing';
import Counter from './counter';
import HeroFloatingBackground from './hero-floating-background';
import Parallax from './parallax';
import { CERTIFICATE_APPEARING_THRESHOLD, COUNTER_GRADUATES, COUNTER_QUALITY, COUNTER_RECOMMENDATIONS, PRICE_APPEARING_THRESHOLD, ABOUT_APPEARING_THRESHOLD } from './settings';
import WheelScrollRotation from './wheel-scroll-rotation';

const body = document.body;
const main = body.querySelector(`.${ElementClass.MAIN}`);
const footer = body.querySelector(`.${ElementClass.FOOTER}`);

const heroSection = main.querySelector(`.${ElementClass.SECTION_HERO}`);
const heroBackgroundContainer = heroSection.querySelector(`.${ElementClass.HERO_BACKGROUND_CONTAINER}`);

const aboutSection = main.querySelector(`.${ElementClass.ABOUT_SECTION}`);
const aboutAdvantages = aboutSection.querySelector(`.${ElementClass.ABOUT_ADVANTAGES}`);
const rotatingWheel = aboutSection.querySelector(`.${ElementClass.ROTATING_WHEEL}`);

const priceSection = main.querySelector(`.${ElementClass.PRICE_SECTION}`);
const workHeader = main.querySelector(`.${ElementClass.WORK_HEADER}`);
const certificateSection = main.querySelector(`.${ElementClass.CERTIFICATE_SECTION}`);
const form = footer.querySelector(`.${ElementClass.FORM}`);

const communitySection = main.querySelector(`.${ElementClass.COMMUNITY_SECTION}`);
const counterGraduates = communitySection.querySelector(`.${ElementClass.COUNTER_GRADUATES}`);
const counterRecommendations = communitySection.querySelector(`.${ElementClass.COUNTER_RECOMMENDATIONS}`);
const counterQuality = communitySection.querySelector(`.${ElementClass.COUNTER_QUALITY}`);

const heroFloatingBackgroundService = new HeroFloatingBackground(heroBackgroundContainer, heroSection);

const logoRotationAnimation = new WheelScrollRotation(rotatingWheel, aboutSection);

const aboutSectionAnimation = new Appearing(aboutSection, true, ABOUT_APPEARING_THRESHOLD);
const priceSectionAnimation = new Appearing(priceSection, true, PRICE_APPEARING_THRESHOLD);
const workHeaderAnimation = new Appearing(workHeader);
const certificateSectionAnimation = new Appearing(certificateSection, false, CERTIFICATE_APPEARING_THRESHOLD);
const formAnimation = new Appearing(form);

const statisticsCounters = [
  new Counter(counterGraduates, 0, COUNTER_GRADUATES),
  new Counter(counterRecommendations, 0, COUNTER_RECOMMENDATIONS),
  new Counter(counterQuality, 0, COUNTER_QUALITY),
];

const aboutParallax = new Parallax({
  rootElement: aboutAdvantages,
  cardSelector: `.${ElementClass.ABOUT_ADVANTAGE}`,
});

// Отключаем часть анимации для статичной страницы
const isStaticPage = window.location.pathname.includes('about-static.html');

const initAnimations = () => {
  if (!isStaticPage) {
    heroFloatingBackgroundService.init();
    logoRotationAnimation.init();
    aboutParallax.init();
  }

  aboutSectionAnimation.init();
  priceSectionAnimation.init();
  workHeaderAnimation.init();
  certificateSectionAnimation.init();
  formAnimation.init();

  statisticsCounters.forEach((counter) => {
    counter.init();
  });
};

export { initAnimations };

