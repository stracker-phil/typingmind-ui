import SvgMatcher from '../lib/SvgMatcher.js';
import IconStorage from '../lib/IconStorage.js';

const MUTATION_DEBOUNCE_DELAY = 50;

export default class IconReplacer {
	#svgMatcher;
	#iconStorage;
	#observer;
	#debounceTimer;

	constructor() {
		this.#svgMatcher = new SvgMatcher();
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
		this.#svgMatcher.mapping = iconMapping;
		this.#replaceAllIcons();
		this.#startObserver();
	}

	#reset() {
		const modifiedIcons = this.#iconStorage.getAllModified();

		for (const svg of modifiedIcons) {
			const original = this.#iconStorage.getOriginal(svg);
			if (!original) {
				continue;
			}

			svg.innerHTML = original.innerHTML;
			this.#restoreAttributes(svg, original);
		}

		this.#svgMatcher.clear();
		this.#iconStorage.clear();
		this.#stopObserver();
	}

	#restoreAttributes(svg, original) {
		// Remove all attributes
		while (svg.attributes.length > 0) {
			svg.removeAttribute(svg.attributes[0].name);
		}
		// Restore original attributes
		for (const attr of original.attributes) {
			svg.setAttribute(attr.name, attr.value);
		}
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
		if (!this.#observer) {
			return;
		}
		this.#observer.disconnect();
		this.#observer = null;
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
			const newIconString = this.#svgMatcher.findMatchAndReplace(svg);
			if (!newIconString) {
				continue;
			}

			this.#updateSvgContent(svg, newIconString);
		}
	}

	#updateSvgContent(svg, newIconString) {
		// Store the original SVG state if not already stored
		if (!this.#iconStorage.getOriginal(svg)) {
			const originalClone = svg.cloneNode(true);
			this.#iconStorage.storeOriginal(svg, originalClone);
		}

		// Create a temporary element to parse the new icon string
		const tempDiv = document.createElement('div');
		tempDiv.innerHTML = newIconString;
		const newIcon = tempDiv.firstElementChild;

		// Update viewBox
		if (newIcon.hasAttribute('viewBox')) {
			svg.setAttribute('viewBox', newIcon.getAttribute('viewBox'));
		}

		// Replace innerHTML
		svg.innerHTML = newIcon.innerHTML;

		// Ensure the modified SVG is tracked
		this.#iconStorage.trackModified(svg);
	}

	#replaceAllIcons() {
		this.#checkAndReplaceIcons(document.body);
	}
}