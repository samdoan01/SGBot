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
	
//	const params = {
//			icon_emoji: ':smiley:'
//	};
	
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
	var regex = new RegExp(/(?:\d\s*)?[A-Z]?[a-z]+\s*\d+(?:[:-]\d+)?(?:\s*-\s*\d+)?(?::\d+|(?:\s*[A-Z]?[a-z]+\s*\d+:\d+))?/);
	//var regex = new RegExp(/[A-Z][a-z]{1,}$/);
	if(message.includes(' chucknorris')) {
		chuckJoke();
	}
	else if(regex.test(message) == true) {
		getBibleVerse(regex.exec(message));
	}
//	else if(regex.test(message) == true) {
//		chuckJoke();
//	}
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
}

// Retrieve bible verse; if exists 
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


