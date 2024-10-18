/**
 * This module is responsible for loading (or unloading) custom theme assets.
 * Every theme has a single JS and CSS file.
 */

import Asset from '../lib/Asset';
import { THEME_EVENTS } from './EventSystem';

const CUSTOM_THEME_CLASS = 'custom-theme';

class ThemeLoader {
	#asset;
	#eventSystem;
	#iconReplacer;
	#currentTheme = null;

	constructor(config, eventSystem, iconReplacer) {
		this.#asset = new Asset('theme', config.origin);
		this.#eventSystem = eventSystem;
		this.#iconReplacer = iconReplacer;
	}

	async apply(theme) {
		if (this.#currentTheme) {
			this.#unload();
		}

		if (theme) {
			await this.#load(theme);
		}
	}

	async #load(theme) {
		this.#currentTheme = theme;
		this.#asset.style = `theme/${theme}.css`;
		this.#asset.script = `theme/${theme}.js`;

		try {
			await this.#asset.load();

			this.#eventSystem.dispatch(THEME_EVENTS.init, { iconReplacer: this.#iconReplacer });

			document.body.classList.add(CUSTOM_THEME_CLASS);
		} catch (error) {
			console.error(`Failed to load theme: ${theme}`, error);
			this.#unload();
		}
	}

	#unload() {
		if (!this.#currentTheme) {
			return;
		}

		this.#eventSystem.dispatch(THEME_EVENTS.cleanup);

		this.#asset.unload();
		document.body.classList.remove(CUSTOM_THEME_CLASS);

		// Reset icon replacements
		if (this.#iconReplacer) {
			this.#iconReplacer.config = null;
		}

		this.#currentTheme = null;
	}
}

export default ThemeLoader;