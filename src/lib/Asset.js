class Asset {
	static #bypassCache = false;
	#id;
	#baseUrl;
	#dirty = false;
	#script = '';
	#style = '';
	#scriptElement = null;
	#styleElement = null;

	constructor(id, baseUrl) {
		this.#id = id;
		this.#baseUrl = baseUrl;
	}

	static bypassCache(state) {
		Asset.#bypassCache = state;
	}

	set script(script) {
		if (this.#script !== script) {
			this.#script = script;
			this.#dirty = true;
		}
	}

	set style(style) {
		if (this.#style !== style) {
			this.#style = style;
			this.#dirty = true;
		}
	}

	get scriptElement() {
		return this.#scriptElement;
	}

	get styleElement() {
		return this.#styleElement;
	}

	unload() {
		this.#unloadScript();
		this.#unloadStyle();
		this.#style = '';
		this.#script = '';
		this.#dirty = false;
	}

	async load() {
		if (!this.#dirty) {
			return;
		}

		this.#unloadScript();
		this.#unloadStyle();

		const loadPromises = [];

		if (this.#script) {
			loadPromises.push(this.#loadScript());
		}

		if (this.#style) {
			loadPromises.push(this.#loadStyle());
		}

		await Promise.all(loadPromises);

		this.#dirty = false;
	}

	#unloadScript() {
		if (!this.#scriptElement) {
			return;
		}
		document.head.removeChild(this.#scriptElement);
		this.#scriptElement = null;
	}

	#unloadStyle() {
		if (!this.#styleElement) {
			return;
		}
		document.head.removeChild(this.#styleElement);
		this.#styleElement = null;
	}

	#buildUrl(filename) {
		let url = `${this.#baseUrl}${filename}`;
		if (Asset.#bypassCache) {
			url += `?nocache=${Date.now()}`;
		}
		return url;
	}

	#loadScript() {
		return new Promise((resolve, reject) => {
			this.#scriptElement = document.createElement('script');
			this.#scriptElement.id = `${this.#id}-script`;
			this.#scriptElement.src = this.#buildUrl(this.#script);
			this.#scriptElement.onload = resolve;
			this.#scriptElement.onerror = reject;
			document.head.appendChild(this.#scriptElement);
		});
	}

	#loadStyle() {
		return new Promise((resolve, reject) => {
			this.#styleElement = document.createElement('link');
			this.#styleElement.id = `${this.#id}-style`;
			this.#styleElement.rel = 'stylesheet';
			this.#styleElement.href = this.#buildUrl(this.#style);
			this.#styleElement.onload = resolve;
			this.#styleElement.onerror = reject;
			document.head.appendChild(this.#styleElement);
		});
	}
}

export default Asset;