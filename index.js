/**
 * SGBot index.js
 */

const SlackBot = require('slackbots');
const axios = require('axios');

const bot = new SlackBot({
	token: 'xoxb-482580549056-484411099463-j1R8ptANL6ysJXAcix56uEJR',
	name: 'sgbot'
});

// Start handler
bot.on('start', () => {
	
	bot.postMessageToChannel(
	'general',
	'Get blessed by @SGBot!'
	);
	
});

// ERROR Handling
bot.on('error', (err) => console.log(err));

// Message Handling
bot.on('message', data => {
	if(data.type !== 'message') {
		return;
	}
	
	handleMessage(data.text);
});

// Respond to Data
function handleMessage(message) {
	//var regex = new RegExp(/(?:\d\s*)?[A-Z]?[a-z]+\s*\d+(?:[:-]\d+)?(?:\s*-\s*\d+)?(?::\d+|(?:\s*[A-Z]?[a-z]+\s*\d+:\d+))?/);
	var regex = new RegExp(/(?:\d\s*)?[A-Z]?[a-z]+\s*\d+(?::\d+|(?:\s*[A-Z]?[a-z]+\s*\d+:\d+))?/);
	if(regex.test(message) == true) {
		getBibleVerse(regex.exec(message));
	}

}

function getBibleVerse(verse) {
	var src = 'https://bible-api.com/' + verse;
	console.log(src);
	axios.get(src)
	.then(res => {
		const text = res.data.text;
		const textInLine = "```".concat(text).concat("```");
		
		bot.postMessageToChannel(
		'general',
		`${textInLine}`
		);
	});
}


