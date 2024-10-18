import './style.scss';

import BaseTheme from '../Theme';

class Theme extends BaseTheme {
	onInit() {
		console.log('PURPLE initialized');
	}

	onCleanup() {
		console.log('PURPLE cleaned up');
	}
}

export default new Theme();