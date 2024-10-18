// IconReplacer.js

const MUTATION_DEBOUNCE_DELAY = 50;

class IconStorage {
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

export default class IconReplacer {
	#iconMapping = [];
	#iconStorage;
	#observer;
	#debounceTimer;

	constructor() {
		this.#iconStorage = new IconStorage();
		this.#observer = null;
		this.#debounceTimer = null;
	}

	set config(iconMapping) {
		if (iconMapping?.length) {
			this.#apply(iconMapping);
		} else {
			this.#reset();
		}
	}

	#apply(iconMapping) {
		this.#reset();
		this.#iconMapping = iconMapping;
		this.#replaceAllIcons();
		this.#startObserver();
	}

	#reset() {
		const modifiedIcons = this.#iconStorage.getAllModified();
		for (const svg of modifiedIcons) {
			if (svg.__theme) {
				svg.__theme.reset();
			}
		}
		this.#iconMapping = [];
		this.#iconStorage.clear();
		this.#stopObserver();
	}

	#startObserver() {
		if (this.#observer) {
			this.#stopObserver();
		}
		this.#observer = new MutationObserver((mutations) => this.#handleMutations(mutations));
		this.#observer.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: true,
		});
		this.#replaceAllIcons();
	}

	#stopObserver() {
		if (this.#observer) {
			this.#observer.disconnect();
			this.#observer = null;
		}
	}

	#handleMutations(mutations) {
		clearTimeout(this.#debounceTimer);

		this.#debounceTimer = setTimeout(() => {
			const nodesToCheck = new Set();
			for (const mutation of mutations) {
				if (mutation.type === 'childList') {
					mutation.addedNodes.forEach(node => {
						if (node.nodeType === Node.ELEMENT_NODE) {
							nodesToCheck.add(node);
						}
					});
				} else if (mutation.type === 'attributes') {
					nodesToCheck.add(mutation.target);
				}
			}
			nodesToCheck.forEach(node => this.#checkAndReplaceIcons(node));
		}, MUTATION_DEBOUNCE_DELAY);
	}

	#checkAndReplaceIcons(element) {
		if (!element.innerHTML.includes('<svg')) {
			return;
		}
		const svgs = element.querySelectorAll('svg');
		console.log('found svg changes in dom', svgs);
		for (const svg of svgs) {
			this.#applySvgTheme(svg);
		}
	}

	#applySvgTheme(svg) {
		if (!svg.__theme) {
			this.#createSvgTheme(svg);
		}
		svg.__theme.apply();
	}

	#createSvgTheme(svg) {
		const originalClone = svg.cloneNode(true);
		this.#iconStorage.storeOriginal(svg, originalClone);

		svg.__theme = {
			apply: () => {
				const config = this.#findMatch(svg);
				if (config) {
					const newIcon = config.replace(svg);
					if (newIcon) {
						this.#updateSvgContent(svg, newIcon);
					}
				}
			},
			reset: () => {
				const original = this.#iconStorage.getOriginal(svg);
				if (original) {
					svg.innerHTML = original.innerHTML;
					this.#restoreAttributes(svg, original);
				}
			},
		};
	}

	#findMatch(svg) {
		const svgString = svg.outerHTML.toLowerCase();
		return this.#iconMapping.find(config => svgString.includes(config.match.toLowerCase())) || null;
	}

	#updateSvgContent(svg, newIconString) {
		const tempDiv = document.createElement('div');
		tempDiv.innerHTML = newIconString;
		const newIcon = tempDiv.firstElementChild;

		if (newIcon.hasAttribute('viewBox')) {
			svg.setAttribute('viewBox', newIcon.getAttribute('viewBox'));
		}
		svg.innerHTML = newIcon.innerHTML;
		this.#iconStorage.trackModified(svg);
	}

	#restoreAttributes(svg, original) {
		while (svg.attributes.length > 0) {
			svg.removeAttribute(svg.attributes[0].name);
		}
		for (const attr of original.attributes) {
			svg.setAttribute(attr.name, attr.value);
		}
	}

	#replaceAllIcons() {
		this.#checkAndReplaceIcons(document.body);
	}
}