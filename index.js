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
	if(message.includes(' chucknorris')) {
		chuckJoke();
	}
	else if(message.matches('(?:\d\s*)?[A-Z]?[a-z]+\s*\d+(?:[:-]\d+)?(?:\s*-\s*\d+)?(?::\d+|(?:\s*[A-Z]?[a-z]+\s*\d+:\d+))?')) {
		getBibleVerse();
	}
}


// Tell a Chuck Norris Joke
function chuckJoke() {
	axios.get('http://api.icndb.com/jokes/random')
	.then(res => {
		const joke = res.data.value.joke;
	
		const params = {
				icon_emoji: ':laughing:'
		};
		
		bot.postMessageToChannel(
		'general',
		`Chuck Norris: ${joke}`,
		params
		);
	});

// Retrieve bible verse; if exists 
function getBibleVerse() {
	axios.get('http://api.icndb.com/jokes/random')
	.then(res => {
		const joke = res.data.value.joke;
	
		const params = {
				icon_emoji: ':laughing:'
		};
		
		bot.postMessageToChannel(
		'general',
		`Chuck Norris: ${joke}`,
		params
		);
	});
}
}

