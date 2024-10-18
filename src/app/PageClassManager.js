/**
 * Observes changes in the current "page" and adds a CSS class to the body element that reflects
 * the current state. Pages are accessible via the buttons in the workspace bar.
 */
import { THEME_EVENTS } from './EventSystem';

const ACTIVE_BUTTON_CLASS = 'active-button';

/**
 * Delay in ms before applying CSS classes and DOM attributes
 * We need a delay to allow the app to finish internal DOM updates, as some changes will replace our
 * attributes (mainly classes) if we make them too early.
 *
 * @type {number}
 */
const DOM_UPDATE_DELAY = 100;

function getTabSlug(tabButton) {
	if (!tabButton) {
		return '';
	}

	const elementId = tabButton.dataset.elementId;
	if (!elementId || !elementId.startsWith('workspace-tab-')) {
		return '';
	}

	return elementId.replace('workspace-tab-', '');
}

function loopButtons(callback) {
	return document
		.querySelectorAll('[data-element-id="workspace-bar"] button[data-element-id]')
		.forEach(callback);
}

class PageClassManager {
	#eventSystem;
	#activeSlug = '';
	#activeTab = null;

	constructor(eventSystem) {
		this.#eventSystem = eventSystem;
		this.onButtonClick = this.onButtonClick.bind(this);
		this.refreshCurrentPage();
	}

	get activeSlug() {
		return this.#activeSlug;
	}

	#updatePageIdentifier() {
		if (this.activeSlug) {
			document.body.setAttribute('data-app-page', this.activeSlug);
		} else {
			document.body.removeAttribute('data-app-page');
		}

		if (this.#activeTab) {
			this.#activeTab.classList.add(ACTIVE_BUTTON_CLASS);

			this.#eventSystem.dispatch(THEME_EVENTS.refresh, { activeTab: this.activeSlug });
		}
	}

	set activeTab(newTab) {
		if (this.#activeTab) {
			/*
			 * Practically not needed, as TypingMind already fully replaces all tab-classes.
			 * But to stay future-proof, we want to clean up here.
			 */
			this.#activeTab.classList.remove(ACTIVE_BUTTON_CLASS);
		}

		const tabSlug = getTabSlug(newTab);

		if (tabSlug) {
			this.#activeTab = newTab;
			this.#activeSlug = tabSlug;

			setTimeout(() => this.#updatePageIdentifier(), DOM_UPDATE_DELAY);
		} else {
			this.#activeTab = null;
		}
	}

	refreshCurrentPage() {
		this.activeTab = null;

		loopButtons((button) => {
			if (!button.classList.contains('text-white')) {
				return;
			}

			const pageId = getTabSlug(button);

			if (!pageId) {
				return;
			}
			this.activeTab = button;
		});
	}

	onButtonClick(event) {
		this.activeTab = event.currentTarget;
	};

	observe() {
		loopButtons((button) => {
			button.addEventListener('click', this.onButtonClick);
		});
	}

	unobserve() {
		loopButtons((button) => {
			button.removeEventListener('click', this.onButtonClick);
		});
	}
}

export default PageClassManager;
