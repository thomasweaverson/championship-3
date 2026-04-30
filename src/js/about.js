import '../scss/pages/about.scss';

import { initAnimations } from './animations';
import { initFocusVisibilityService } from './common/focus-visibility-service';
import { initFooterServices } from './footer';
import { initHeaderServices } from './header';

const initAboutPageServices = () => {
  initFocusVisibilityService();
  initAnimations();
  initHeaderServices();
  initFooterServices();
};

document.addEventListener('DOMContentLoaded', () => {
  initAboutPageServices();
});

