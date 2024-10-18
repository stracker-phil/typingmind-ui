export default class IconStorage {
	#originalIcons;
	#modifiedIcons;

	constructor() {
		this.clear();
	}

	storeOriginal(element, original) {
		if (!this.#originalIcons.has(element)) {
			this.#originalIcons.set(element, original);
			this.#modifiedIcons.add(element);
		}
	}

	getOriginal(element) {
		return this.#originalIcons.get(element);
	}

	getAllModified() {
		return this.#modifiedIcons;
	}

	trackModified(element) {
		this.#modifiedIcons.add(element);
	}

	clear() {
		this.#originalIcons = new WeakMap();
		this.#modifiedIcons = new Set();
	}
}