const MUTATION_DEBOUNCE_DELAY = 50;

export default class IconReplacer {
	#iconMapping = [];
	#modifiedIcons = new Map();
	#observer;
	#debounceTimer;

	constructor() {
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
		for (const [svg, theme] of this.#modifiedIcons) {
			theme.reset();
		}
		this.#iconMapping = [];
		this.#modifiedIcons.clear();
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
				if (mutation.type === 'attributes') {
					nodesToCheck.add(mutation.target);
				} else if (mutation.type === 'childList') {
					mutation.addedNodes.forEach(node => {
						if (node.nodeType === Node.ELEMENT_NODE) {
							nodesToCheck.add(node);
						}
					});
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
		const config = this.#findMatch(svg);
		let appliedIcon = '';

		svg.__theme = {
			apply: () => {
				if (!config) {
					return;
				}
				const newIcon = config.replace(svg);

				if (newIcon && appliedIcon !== newIcon) {
					appliedIcon = newIcon;
					this.#updateSvgContent(svg, newIcon);
					this.#modifiedIcons.set(svg, svg.__theme);
				}
			},
			reset: () => {
				svg.innerHTML = originalClone.innerHTML;
				this.#restoreAttributes(svg, originalClone);
				this.#modifiedIcons.delete(svg);
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