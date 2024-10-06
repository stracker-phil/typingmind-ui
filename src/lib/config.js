import Storage from './storage';

class Config {
	#scriptUrl;
	#origin;
	#theme;

	constructor() {
		const currentScript = document.currentScript;

		if (currentScript) {
			this.#scriptUrl = new URL(currentScript.src);
		} else {
			console.warn('Unable to determine script URL.');
			this.#scriptUrl = null;
		}
	}

	get nocache() {
		if (!this.#scriptUrl) {
			return false;
		}
		return !!this.#scriptUrl.searchParams.get('nocache');
	}

	get origin() {
		if (undefined === this.#origin) {
			if (this.#scriptUrl) {
				this.#origin =
					`${this.#scriptUrl.origin}${this.#scriptUrl.pathname.substring(0,
						this.#scriptUrl.pathname.lastIndexOf('/') + 1,
					)}`;
			} else {
				this.#origin = '';
			}
		}

		return this.#origin;
	}

	get theme() {
		if (undefined === this.#theme) {
			const savedTheme = Storage.getItem('custom-theme');
			if (savedTheme) {
				this.#theme = savedTheme;
			} else if (this.#scriptUrl) {
				this.#theme = this.#scriptUrl.searchParams.get('theme') || '';
			} else {
				this.#theme = '';
			}
		}

		return this.#theme;
	}

	set theme(theme) {
		this.#theme = theme;
		Storage.setItem('custom-theme', theme);
	}
}

const config = new Config();
export default config;
