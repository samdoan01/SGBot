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
	if(data.username === bot.name) {
		return;
	}
	
	handleMessage(data.text);
});

// Respond to Data
function handleMessage(message) {
	
	// /(?:\d\s*)?     -> 1/2
	// [A-Z]?[a-z]+\s* -> Letter and spaces
	// \d+             -> Chapter number
	// (?:[:-]\d+)?    -> Additional chapters
	// (?:\s*-\s*\d+)? -> Spaces and numbers
	var regex = new RegExp(/(?:\d\s*)?[A-Z]?[a-z]+\s*\d+(?:[:-]\d+)?(?:\s*-\s*\d+)?(?::\d+|(?:\s*[A-Z]?[a-z]+\s*\d+:\d+))?/);
	//var regex = new RegExp(/(?:\d\s*)?[A-Z]?[a-z]+\s*\d(?:\s*-\s*\d+)?(?::\d+|(?:\s*[A-Z]?[a-z]+\s*\d+:\d+))?/);
	if(regex.test(message) == true) {
		getBibleVerse(regex.exec(message));
	}

}

function getBibleVerse(verse) {
	var src = 'https://bible-api.com/' + verse;
	axios.get(src)
	
	.then(res => {
		
		const text = res.data.text;
		const reference = res.data.reference;
		const formattedText = "```".concat(reference).concat("\n").concat(text).concat("```");
		if(text.length > 4000) {
			bot.postMessageToChannel(
					'general',
					`Ahh...${reference} is too long. Please try a smaller reference.`
					)
		}
		else {
			bot.postMessageToChannel(
					'general',
					`${formattedText}`
			);
		}
	});
}


