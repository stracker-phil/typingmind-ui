/**
 * This module is responsible for loading (or unloading) custom theme assets.
 * Every theme has a single JS and CSS file.
 */

import Asset from '../lib/Asset';

const CUSTOM_THEME_CLASS = 'custom-theme';

const THEME_INIT_EVENT = 'theme-init';
const THEME_CLEANUP_EVENT = 'theme-cleanup';

class ThemeLoader {
	#asset;
	#iconReplacer;
	#currentTheme = null;

	constructor(config, iconReplacer) {
		this.#asset = new Asset('theme', config.origin);
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

			// Dispatch the init event after the assets have loaded
			const initEvent = new CustomEvent(THEME_INIT_EVENT, {
				detail: { iconReplacer: this.#iconReplacer },
			});
			document.dispatchEvent(initEvent);

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

		// Dispatch the cleanup event
		const cleanupEvent = new CustomEvent(THEME_CLEANUP_EVENT);
		document.dispatchEvent(cleanupEvent);

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