import Config from './lib/config';
import Asset from './lib/asset';

class TypingMindUi {
	#config;
	#themeAsset;

	constructor(config) {
		if (TypingMindUi.instance) {
			return TypingMindUi.instance;
		}

		TypingMindUi.instance = this;
		this.#config = config;
		this.#themeAsset = new Asset('custom-theme', this.#config.origin);

		this.#loadTheme();
	}

	get theme() {
		return this.#config.theme;
	}

	set theme(name) {
		this.#config.theme = name;
		this.#loadTheme();
	}

	#loadTheme() {
		const theme = this.#config.theme;

		if (!theme) {
			this.#themeAsset.unload();
			document.body.classList.remove('custom-theme');
			return;
		}

		this.#themeAsset.style = `theme/${theme}.css`;
		this.#themeAsset.script = `theme/${theme}.js`;
		this.#themeAsset.load();

		document.body.classList.add('custom-theme');
	}
}

// Create the instance
const typingMindUi = new TypingMindUi(Config);

// Global theming API.
window.themeApi = typingMindUi;
