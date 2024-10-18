import { THEME_EVENTS } from './EventSystem';

/**
 * Observes changes in the sidebar width and adds a CSS class to the body element that reflects
 * the current state. The sidebar is considered closed when its width is 0.
 */
const SIDEBAR_CLOSED_CLASS = 'sidebar-closed';
const SIDEBAR_OPEN_CLASS = 'sidebar-open';

/**
 * Delay in ms before applying CSS classes
 * We need a delay to allow the app to finish internal DOM updates, as some changes might interfere
 * with our class changes if we make them too early.
 *
 * @type {number}
 */
const DOM_UPDATE_DELAY = 100;

class SidebarObserver {
	#eventSystem;
	#navHandler = null;
	#observer = null;

	constructor(eventSystem) {
		this.#eventSystem = eventSystem;
		this.#navHandler = document.getElementById('nav-handler');

		if (!this.#navHandler) {
			console.error('Element with ID "nav-handler" not found');
			return;
		}
		this.#updateBodyClass();
	}

	get sidebarWidth() {
		if (!this.#navHandler) {
			return 0;
		}
		const style = window.getComputedStyle(this.#navHandler);
		const widthStr = style.getPropertyValue('--current-sidebar-width').trim();
		return parseInt(widthStr);
	}

	get isClosed() {
		return this.sidebarWidth === 0;
	}

	#updateBodyClass() {
		setTimeout(() => {
			document.body.classList.remove(SIDEBAR_CLOSED_CLASS, SIDEBAR_OPEN_CLASS);
			document.body.classList.add(this.isClosed ? SIDEBAR_CLOSED_CLASS : SIDEBAR_OPEN_CLASS);

			this.#eventSystem.dispatch(THEME_EVENTS.refresh, { sidebarOpen: !this.isClosed });
		}, DOM_UPDATE_DELAY);
	}

	#onSidebarChange(mutations) {
		for (const mutation of mutations) {
			if (mutation.type !== 'attributes' || mutation.attributeName !== 'style') {
				continue;
			}
			this.#updateBodyClass();
			break;
		}
	}

	start() {
		if (!this.#navHandler) {
			return;
		}

		this.#observer = new MutationObserver(this.#onSidebarChange.bind(this));
		const config = {
			attributes: true,
			attributeFilter: ['style'],
		};
		this.#observer.observe(this.#navHandler, config);
	}

	stop() {
		if (!this.#observer) {
			return;
		}

		this.#observer.disconnect();
		this.#observer = null;
	}
}

export default SidebarObserver;
