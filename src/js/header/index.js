import HeaderHeightController from './header-height-controller';
import MobileMenuController from './mobile-menu-controller';

const mobileMenuController = new MobileMenuController();
const headerHeightController = new HeaderHeightController();

const initHeaderServices = () => {
  mobileMenuController.init();
  headerHeightController.init();
};

export { initHeaderServices };

