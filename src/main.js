import Config from './lib/Config';
import ThemeLoader from './app/ThemeLoader';
import PageClassManager from './app/PageClassManager';
import IconReplacer from './app/IconReplacer';
import Asset from './lib/Asset';

class TypingMindUi {
	#config;
	#themeLoader;
	#pageClassManager;
	#iconReplacer;

	constructor(config) {
		if (TypingMindUi.instance) {
			return TypingMindUi.instance;
		}

		TypingMindUi.instance = this;
		this.#config = config;
		this.#iconReplacer = new IconReplacer();
		this.#themeLoader = new ThemeLoader(this.#config, this.#iconReplacer);
		this.#pageClassManager = new PageClassManager();

		Asset.bypassCache(this.#config.nocache);

		this.#pageClassManager.observe();
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
