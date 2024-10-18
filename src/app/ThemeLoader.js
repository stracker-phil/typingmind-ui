/**
 * This module is responsible for loading (or unloading) custom theme assets.
 * Every theme has a single JS and CSS file.
 */

import Asset from '../lib/Asset';

const CUSTOM_THEME_CLASS = 'custom-theme';

class ThemeLoader {
	#asset;
	#iconReplacer;

	constructor(config, iconReplacer) {
		this.#asset = new Asset('theme', config.origin);
		this.#iconReplacer = iconReplacer;
	}

	apply(theme) {
		if (!theme) {
			this.#unload();
		} else {
			this.#load(theme);
		}
	}

	#load(theme) {
		this.#asset.style = `theme/${theme}.css`;
		this.#asset.script = `theme/${theme}.js`;
		this.#asset.load();

		document.body.classList.add(CUSTOM_THEME_CLASS);
	}

	#unload() {
		this.#asset.unload();
		document.body.classList.remove(CUSTOM_THEME_CLASS);
	}
}

export default ThemeLoader;