class TypingMindUi {
    constructor() {
        if (TypingMindUi.instance) {
            return TypingMindUi.instance;
        }
        
        TypingMindUi.instance = this;
        console.log('Initialize new UI');
    }
}

new TypingMindUi()