import IconReplacer from '../app/IconReplacer';
import EventSystem, { THEME_EVENTS } from '../app/EventSystem';

/**
 * Base class that all themes must extend from.
 */
class ThemeBase {
	/**
	 * @type {IconReplacer|null} The IconReplacer instance.
	 */
	#iconReplacer;

	/**
	 * @type {EventSystem} The apps event handler instance.
	 */
	#eventSystem;

	/**
	 * @type {Function} Bound init handler
	 */
	#boundInitHandler;

	/**
	 * @type {Function} Bound cleanup handler
	 */
	#boundCleanupHandler;

	/**
	 * @type {Function} Bound refresh handler
	 */
	#boundRefreshHandler;

	/**
	 * @type {Object} The theme's internal state
	 */
	#state;

	constructor() {
		this.#eventSystem = new EventSystem();
		this.#state = {};

		this.#boundInitHandler = this.#handleInit.bind(this);
		this.#boundCleanupHandler = this.#handleCleanup.bind(this);
		this.#boundRefreshHandler = this.#handleRefresh.bind(this);
		this.#addEventListeners();
	}

	#addEventListeners() {
		this.#eventSystem.observe(THEME_EVENTS.init, this.#boundInitHandler);
		this.#eventSystem.observe(THEME_EVENTS.cleanup, this.#boundCleanupHandler);
		this.#eventSystem.observe(THEME_EVENTS.refresh, this.#boundRefreshHandler);
	}

	#removeEventListeners() {
		this.#eventSystem.unobserve(THEME_EVENTS.init, this.#boundInitHandler);
		this.#eventSystem.unobserve(THEME_EVENTS.cleanup, this.#boundCleanupHandler);
		this.#eventSystem.unobserve(THEME_EVENTS.refresh, this.#boundRefreshHandler);
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

	#handleRefresh({ detail }) {
		if (!detail || 'object' !== typeof detail) {
			return;
		}

		this.#state = { ...this.#state, ...detail };

		this.onRefresh(this.#state);
	}

	/**
	 * @return {IconReplacer|null} The IconReplacer instance.
	 */
	get IconReplacer() {
		return this.#iconReplacer;
	}

	onInit() {
		console.log('Theme initialized');
	}

	onCleanup() {
		console.log('Theme cleaned up');
	}

	onRefresh(state) {
		if (this.IconReplacer) {
			// todo ...
		}
	}
}

export default ThemeBase;