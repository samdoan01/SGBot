/**
 * 
 */

const SlackBot = require('slackbots');
const axios = require('axios');

const bot = new SlackBot({
	token: 'xoxb-482580549056-484411099463-j1R8ptANL6ysJXAcix56uEJR',
	name: 'sgbot'
});

// Start handler
bot.on('start', () => {
	
	const params = {
			icon_emoji: ':smiley:'
	};
	
	bot.postMessageToChannel(
	'general',
	'Get Ready For SGBot!',
	params
	);
	
}

	
	
	
);


