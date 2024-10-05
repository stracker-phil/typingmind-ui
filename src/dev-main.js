import config from './lib/config';

/**
 * This script if the main entry point during development.
 * It's only purpose is to load the extension's `main.js` script
 * using a timestamped URL to bypass caching.
 *
 * For production environments, this script should not be used.
 */
class ScriptLoader {
	#config;

	constructor(config) {
		this.#config = config;
	}

	loadExtension() {
		const script = document.createElement('script');
		const timestamp = Date.now();
		script.src = `${this.#config.origin}main.js?t=${timestamp}`;
		script.defer = true; // defer: Wait for the DOM to finish.
		document.head.appendChild(script);
	}
}

const devMain = new ScriptLoader(config);
devMain.loadExtension();
