import svgChats from './chats.svg';
import svgNewChat from './new-chat.svg';
import svgOpenSidebar from './open-sidebar.svg';
import svgSettings from './settings.svg';
import svgSearch from './search.svg';
import svgTrash from './trash.svg';
import svgCross from './cross.svg';
import svgStarEmpty from './star-empty.svg';
import svgStarFull from './star-full.svg';

const icons = [];

icons.push({
	match: 'M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3',
	replace: (el) => {
		return svgSettings;
	},
});

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

icons.push({
	match: 'M456.69 421.39 362.6 327.3a173.81 173.81 0 0 0 34.84-104.58C397.44',
	replace: (el) => {
		return svgSearch;
	},
});

icons.push({
	match: 'M864 256H736v-80c0-35.3-28.7-64-64-64H352c',
	replace: (el) => {
		if (el.closest('[data-element-id="custom-chat-item"]')) {
			return svgCross;
		}

		return svgTrash;
	},
});

icons.push({
	match: 'M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8',
	replace: (el) => {
		if (el.classList.contains('text-yellow-500')) {
			return svgStarFull;
		}

		return svgStarEmpty;
	},
});

icons.push({
	match: 'M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z',
	replace: (el) => {
		return svgNewChat;
	},
});


export default icons;