import Config from './lib/config';
import ThemeLoader from './app/themeLoader';
import Asset from './lib/asset';

class TypingMindUi {
	#config;
	#themeLoader;

	constructor(config) {
		if (TypingMindUi.instance) {
			return TypingMindUi.instance;
		}

		TypingMindUi.instance = this;
		this.#config = config;
		this.#themeLoader = new ThemeLoader(this.#config);

		Asset.bypassCache(this.#config.nocache)

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
		this.#themeLoader.apply(this.#config.theme);
	}
}

// Create the instance
const typingMindUi = new TypingMindUi(Config);

// Global theming API.
window.themeApi = typingMindUi;
