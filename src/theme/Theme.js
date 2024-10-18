import IconReplacer from '../app/IconReplacer';

/**
 * Base class that all themes must extend from.
 */
class ThemeBase {
	/**
	 * @type {IconReplacer|null} The IconReplacer instance.
	 */
	#iconReplacer;

	/**
	 * @type {Function} Bound init handler
	 */
	#boundInitHandler;

	/**
	 * @type {Function} Bound cleanup handler
	 */
	#boundCleanupHandler;

	constructor() {
		this.#boundInitHandler = this.#handleInit.bind(this);
		this.#boundCleanupHandler = this.#handleCleanup.bind(this);
		this.#addEventListeners();
	}

	#addEventListeners() {
		document.addEventListener('theme-init', this.#boundInitHandler);
		document.addEventListener('theme-cleanup', this.#boundCleanupHandler);
	}

	#removeEventListeners() {
		document.removeEventListener('theme-init', this.#boundInitHandler);
		document.removeEventListener('theme-cleanup', this.#boundCleanupHandler);
	}

	/**
	 * @param {{detail: {iconReplacer: any}}}
	 */
	#handleInit({ detail }) {
		if (detail?.iconReplacer) {
			this.#iconReplacer = detail.iconReplacer;
		}
		this.onInit();
	}

	#handleCleanup() {
		this.onCleanup();
		this.#iconReplacer = null;
		this.#removeEventListeners();
	}

	/**
	 * @return {IconReplacer|null} The IconReplacer instance.
	 */
	get IconReplacer() {
		return this.#iconReplacer;
	}

	// Default implementation of onInit (to be overridden by themes)
	onInit() {
		console.log('Theme initialized');
	}

	// Default implementation of onCleanup (to be overridden by themes)
	onCleanup() {
		console.log('Theme cleaned up');
	}
}

export default ThemeBase;