class Asset {
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
	}

	load() {
		if (!this.#dirty) {
			return;
		}

		this.unload();
		this.#loadScript();
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

	#loadScript() {
		if (!this.#script) {
			return;
		}

		this.#scriptElement = document.createElement('script');
		this.#scriptElement.id = `${this.#id}-script`;
		this.#scriptElement.src = `${this.#baseUrl}${this.#script}`;
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
		this.#styleElement.href = `${this.#baseUrl}${this.#style}`;
		document.head.appendChild(this.#styleElement);
	}
}

export default Asset;
