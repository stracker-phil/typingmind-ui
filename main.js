const config = (function () {
    if (document.currentScript) {
        const url = new URL(document.currentScript.src);
        const origin = `${url.origin}${url.pathname.substring(0, url.pathname.lastIndexOf('/') + 1)}`;
        const theme = url.searchParams.get('theme') || 'default';
        return {origin, theme};
    }

    console.warn('Unable to determine script origin and theme');
    return {origin: '', theme: ''};
})();

class TypingMindUi {
    #scriptOrigin = '';

    constructor(scriptOrigin, defaultTheme) {
        if (TypingMindUi.instance) {
            return TypingMindUi.instance;
        }

        TypingMindUi.instance = this;
        this.#scriptOrigin = scriptOrigin;
        this.applyTheme(defaultTheme);
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

    applyTheme(name) {
        const link = this.cssLink;

        if (!name) {
            link.href = '';
            return;
        }

        link.href = `${this.#scriptOrigin}theme-${name}.css`;

        document.body.classList.add('custom-theme');
    }
}

new TypingMindUi(config.origin, config.theme);
