const config = (function () {
    if (document.currentScript) {
        const url = new URL(document.currentScript.src);
        const origin = `${url.origin}${url.pathname.substring(0, url.pathname.lastIndexOf('/') + 1)}`;
        let theme = url.searchParams.get('theme') || '';

        // Check localStorage for a saved theme
        const savedTheme = localStorage.getItem('custom-theme');
        if (savedTheme) {
            theme = savedTheme;
        }

        return {origin, theme};
    }

    console.warn('Unable to determine script origin and theme');
    return {origin: '', theme: ''};
})();

class TypingMindUi {
    #scriptOrigin = '';
    #currentTheme = '';

    constructor(scriptOrigin, defaultTheme) {
        if (TypingMindUi.instance) {
            return TypingMindUi.instance;
        }

        TypingMindUi.instance = this;
        this.#scriptOrigin = scriptOrigin;
        this.#applyTheme(defaultTheme);
    }

    get cssLink() {
        let link = document.querySelector('link.custom-theme-style');

        if (!link) {
            link = document.createElement('link');
            link.rel = 'stylesheet';
            link.className = 'custom-theme-style';
            document.head.appendChild(link);
        }

        return link;
    }

    get theme() {
        return this.#currentTheme;
    }

    set theme(name) {
        this.#applyTheme(name);
    }

    #applyTheme(name) {
        const link = this.cssLink;

        if (!name) {
            link.href = '';
            document.body.classList.remove('custom-theme');
            localStorage.removeItem('custom-theme');
            this.#currentTheme = '';
            return;
        }

        link.href = `${this.#scriptOrigin}theme-${name}.css`;
        document.body.classList.add('custom-theme');
        localStorage.setItem('custom-theme', name);
        this.#currentTheme = name;
    }
}

// Create the instance
const typingMindUi = new TypingMindUi(config.origin, config.theme);

// Global theming API.
window.themeApi = typingMindUi;
