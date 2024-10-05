import Config from './lib/config';

class TypingMindUi {
	#config;

	constructor(config) {
		if (TypingMindUi.instance) {
			return TypingMindUi.instance;
		}

		TypingMindUi.instance = this;
		this.#config = config;

		this.#applyTheme();
	}

	get themeLink() {
		let element = document.querySelector('link.custom-theme-style');

		if (!element) {
			element = document.createElement('link');
			element.rel = 'stylesheet';
			element.className = 'custom-theme-style';
			document.head.appendChild(element);
		}

		return element;
	}

	get themeScript() {
		let element = document.querySelector('script.custom-theme-script');

		if (!element) {
			element = document.createElement('script');
			element.defer = true;
			element.className = 'custom-theme-script';
			document.head.appendChild(element);
		}

		return element;
	}

	get theme() {
		return this.#config.theme;
	}

	set theme(name) {
		this.#config.theme = name;
		this.#applyTheme();
	}

	#applyTheme() {
		const link = this.themeLink;
		const script = this.themeScript;
		const theme = this.#config.theme;

		if (!theme) {
			link.href = '';
			script.src = '';
			document.body.classList.remove('custom-theme');
			return;
		}

		link.href = `${this.#config.origin}/theme/${theme}.css`;
		script.src = `${this.#config.origin}/theme/${theme}.js`;

		document.body.classList.add('custom-theme');
	}
}

// Create the instance
const typingMindUi = new TypingMindUi(Config);

// Global theming API.
window.themeApi = typingMindUi;
