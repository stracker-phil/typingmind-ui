import './style.scss';

import BaseTheme from '../Theme';
import icons from './icons';

class Theme extends BaseTheme {
	onInit() {
		if (this.IconReplacer) {
			this.IconReplacer.config = icons;
		}

		console.log('CLAUDE initialized');
	}

	onCleanup() {
		console.log('CLAUDE cleaned up');
	}
}

export default new Theme();