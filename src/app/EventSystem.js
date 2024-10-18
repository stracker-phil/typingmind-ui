export const THEME_EVENTS = {
	init: 'theme:init',
	cleanup: 'theme:cleanup',
	refresh: 'theme:refresh',
};

class EventSystem {
	#verifyEvent(eventName) {
		if (!Object.values(THEME_EVENTS).includes(eventName)) {
			throw new Error(`Invalid theme event: ${eventName}`);
		}
	}

	dispatch(eventName, details = null) {
		let event;

		this.#verifyEvent(eventName);

		if (null !== details) {
			console.log('DISPATCH WITH DETAILS', eventName, { detail: details });
			event = new CustomEvent(eventName, { detail: details });
		} else {
			console.log('DISPATCH NO DETAILS', eventName);
			event = new CustomEvent(eventName);
		}

		document.dispatchEvent(event);
	}

	observe(eventName, handler) {
		this.#verifyEvent(eventName);

		document.addEventListener(eventName, handler);
	}

	unobserve(eventName, handler) {
		this.#verifyEvent(eventName);

		document.removeEventListener(eventName, handler);
	}
}

export default EventSystem;