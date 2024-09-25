const typingMindUiOrigin = (function () {
    if (document.currentScript) {
        const url = new URL(document.currentScript.src);
        return `${url.origin}${url.pathname.substring(0, url.pathname.lastIndexOf('/') + 1)}`;
    }

    console.warn('Unable to determine script origin');
    return '';
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
        this.cssLink.href = `${this.#scriptOrigin}theme-${name}.css`;

        document.body.classList.add('custom-theme');
    }
}

new TypingMindUi(typingMindUiOrigin, 'claude');
