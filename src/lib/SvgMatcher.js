export default class SvgMatcher {
	#mapping = [];
	#cache = new Map();

	constructor() {
		this.clear();
	}

	/**
	 * @return {{}[]}
	 */
	get mapping() {
		return this.#mapping;
	}

	/**
	 * @param {{match: string, replace: () => string}[]} newMap
	 */
	set mapping(newMap) {
		this.#mapping = newMap;
		this.#cache.clear();
	}

	findMatchAndReplace(svg) {
		const svgString = svg.outerHTML.toLowerCase();  // Convert to lowercase for case-insensitive matching

		// Check cache first
		if (this.#cache.has(svgString)) {
			const cachedConfig = this.#cache.get(svgString);
			return cachedConfig ? cachedConfig.replace(svg) : null;
		}

		for (const config of this.#mapping) {
			if (!svgString.includes(config.match.toLowerCase())) {
				continue;
			}

			// Cache the matched configuration
			this.#cache.set(svgString, config);

			const newIcon = config.replace(svg);
			if (!newIcon) {
				continue;
			}

			return newIcon;
		}

		// Cache the fact that no match was found
		this.#cache.set(svgString, null);
		return null;
	}

	clear() {
		this.#mapping = [];
		this.#cache = new Map();
	}
}