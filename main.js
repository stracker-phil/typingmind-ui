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
    #themeUrl = '';
    #icons = null;

    constructor(scriptOrigin, defaultTheme) {
        if (TypingMindUi.instance) {
            return TypingMindUi.instance;
        }

        TypingMindUi.instance = this;
        this.#scriptOrigin = scriptOrigin;
        this.#icons = new UiIconTheme();

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

    #setIcons() {
        this.#icons.setIcon('open sidebar', 'open-sidebar')
        this.#icons.setIcon('new chat', 'new-chat')
    }

    #applyTheme(name) {
        const link = this.cssLink;

        if (!name) {
            this.#currentTheme = '';
            this.#themeUrl = '';
            this.#icons.themeUrl = '';
            link.href = '';
            document.body.classList.remove('custom-theme');
            localStorage.removeItem('custom-theme');
            return;
        }

        this.#themeUrl = `${this.#scriptOrigin}theme/${name}/`;
        this.#currentTheme = name;
        this.#icons.themeUrl = this.#themeUrl;
        link.href = `${this.#themeUrl}style.css`;
        document.body.classList.add('custom-theme');
        localStorage.setItem('custom-theme', name);

        this.#setIcons();
    }
}

class UiIconTheme {
    #themeUrl = '';
    #iconMap = new Map();
    #iconCache = new Map();
    #pendingUpdates = new Set();
    #observer = null;
    #selector = null;

    constructor(selector) {
        this.#selector = selector || new UiElementSelector();
        this.#setupMutationObserver();
    }

    set themeUrl(newUrl) {
        this.#themeUrl = newUrl;
        this.#iconCache.clear();
        this.#updateAllIcons();
    }

    get themeUrl() {
        return this.#themeUrl;
    }

    setIcon(buttonLabel, iconName) {
        if (typeof buttonLabel !== 'string' || typeof iconName !== 'string') {
            console.warn('Invalid input: buttonLabel and iconName must be strings');
            return;
        }
        this.#iconMap.set(buttonLabel, iconName);
        this.#queueUpdate(buttonLabel);
    }

    #queueUpdate(buttonLabel) {
        this.#pendingUpdates.add(buttonLabel);
        this.#processUpdates();
    }

    #updateAllIcons() {
        this.#pendingUpdates = new Set(this.#iconMap.keys());
        this.#processUpdates();
    }

    async #processUpdates() {
        for (const buttonLabel of this.#pendingUpdates) {
            try {
                const button = this.#selector.buttonFromText(buttonLabel);
                if (button) {
                    const svg = button.querySelector('svg');
                    if (svg) {
                        await this.#updateIcon(buttonLabel, svg);
                    }
                }
            } catch (error) {
                console.error(`Error processing update for "${buttonLabel}":`, error);
            }
        }
        this.#pendingUpdates.clear();
    }

    async #updateIcon(buttonLabel, svgElement) {
        const iconName = this.#iconMap.get(buttonLabel);
        if (!iconName) return;

        const themedSvgContent = await this.#fetchThemedSvg(iconName);
        if (themedSvgContent) {
            this.#replaceSvgContent(svgElement, themedSvgContent);
        }
    }

    async #fetchThemedSvg(iconName) {
        if (!this.#themeUrl) {
            console.warn('Theme URL is not set');
            return null;
        }

        const iconUrl = `${this.#themeUrl}/${iconName}.svg`;
        if (!this.#iconCache.has(iconUrl)) {
            try {
                const response = await fetch(iconUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const svgContent = await response.text();
                this.#iconCache.set(iconUrl, svgContent);
            } catch (error) {
                console.error(`Failed to fetch icon: ${iconName}`, error);
                return null;
            }
        }
        return this.#iconCache.get(iconUrl);
    }

    #replaceSvgContent(originalSvg, newContent) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = newContent;
        const newSvgElement = tempDiv.firstElementChild;

        if (newSvgElement && newSvgElement.tagName.toLowerCase() === 'svg') {
            // Preserve original SVG attributes
            Array.from(originalSvg.attributes).forEach(attr => {
                if (!newSvgElement.hasAttribute(attr.name)) {
                    newSvgElement.setAttribute(attr.name, attr.value);
                }
            });

            originalSvg.replaceWith(newSvgElement);
        } else {
            console.warn('Invalid SVG content received');
        }
    }

    #setupMutationObserver() {
        if (this.#observer) {
            this.#observer.disconnect();
        }

        const checkMutations = (mutations) => {
            mutations.forEach(checkMutation);
        };

        const checkMutation = (mutation) => {
            if (mutation.type !== 'childList') return;
            mutation.addedNodes.forEach(checkNode);
        };

        const checkNode = (node) => {
            if (node.nodeType !== Node.ELEMENT_NODE) return;
            this.#processElement(node);
        };

        this.#observer = new MutationObserver(checkMutations);

        this.#observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    #processElement(element) {
        if (element.tagName.toLowerCase() === 'svg') {
            this.#processSvgNode(element);
        }
        element.querySelectorAll('svg').forEach(this.#processSvgNode.bind(this));
    }

    #processSvgNode(node) {
        const button = node.closest('button');
        if (!button) return;

        const buttonLabel = this.#selector.getVisibleTextContent(button);
        if (!buttonLabel || !this.#iconMap.has(buttonLabel)) return;

        //this.#queueUpdate(buttonLabel);
    }
}

class UiElementSelector {
    buttonsFromText(content) {
        const searchText = content.toLowerCase().trim();
        const allButtons = document.querySelectorAll('button');

        return Array.from(allButtons).filter(button => {
            const buttonText = this.getVisibleTextContent(button).toLowerCase().trim();
            return buttonText === searchText;
        });
    }

    buttonFromText(content) {
        return this.buttonsFromText(content)?.[0]
    }

    getVisibleTextContent(element) {
        let text = '';

        for (let node of element.childNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                text += node.textContent;
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.classList.contains('sr-only')) {
                    text += node.textContent;
                } else if (window.getComputedStyle(node).display !== 'none' && node.nodeName !== 'SVG') {
                    text += this.getVisibleTextContent(node);
                }
            }
        }

        return text;
    }
}

// Create the instance
const typingMindUi = new TypingMindUi(config.origin, config.theme);

// Global theming API.
window.themeApi = typingMindUi;
