import '../scss/pages/landing.scss';
import { initHeaderServices } from './header';

const initLandingPageServices = () => {
  initHeaderServices();
};

document.addEventListener('DOMContentLoaded', () => {
  initLandingPageServices();
});
