import svgChats from './chats.svg';
import svgNewChat from './new-chat.svg';
import svgOpenSidebar from './open-sidebar.svg';

const icons = [];

icons.push({
	match: 'M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083',
	replace: (el) => {
		if (el.closest('[data-element-id="new-chat-button-in-side-bar"]')) {
			return svgNewChat;
		}

		return svgChats;
	},
});

icons.push({
	match: 'M3 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4z',
	replace: (el) => {
		return svgOpenSidebar;
	},
});

export default icons;
