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

	unload() {
		this.#unloadScript();
		this.#unloadStyle();

		this.#style = '';
		this.#script = '';
		this.#dirty = false;
	}

	load() {
		if (!this.#dirty) {
			return;
		}

		this.#unloadScript();
		this.#loadScript();

		this.#unloadStyle();
		this.#loadStyle();

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
		if (!this.#script) {
			return;
		}

		this.#scriptElement = document.createElement('script');
		this.#scriptElement.id = `${this.#id}-script`;
		this.#scriptElement.src = this.#buildUrl(this.#script);
		this.#scriptElement.defer = true;
		document.head.appendChild(this.#scriptElement);
	}

	#loadStyle() {
		if (!this.#style) {
			return;
		}

		this.#styleElement = document.createElement('link');
		this.#styleElement.id = `${this.#id}-style`;
		this.#styleElement.rel = 'stylesheet';
		this.#styleElement.href = this.#buildUrl(this.#style);
		document.head.appendChild(this.#styleElement);
	}
}

export default Asset;
