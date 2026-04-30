import '../scss/pages/not-found.scss';
import { initFooterServices } from './footer';
import { initHeaderServices } from './header';

const initNotFoundPageServices = () => {
  initHeaderServices();
  initFooterServices();
};

document.addEventListener('DOMContentLoaded', () => {
  initNotFoundPageServices();
});
