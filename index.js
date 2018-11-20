/**
 * SGBot index.js
 */

const SlackBot = require('slackbots');
const axios = require('axios');

var hasDoneService = false;

const bot = new SlackBot({
	token: 'xoxb-482580549056-484411099463-j1R8ptANL6ysJXAcix56uEJR',
	name: 'sgbot'
});

// Start handler
bot.on('start', () => {
	
	bot.postMessageToChannel(
	'general',
	`*_Get blessed with @SGBot!_*\n _Hi, I'm *@SGBot*! I'm your virtual small group helper. Please be nice to me._`
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
	
	var verseRegex = new RegExp(/(?:\d\s*)?[A-Z]?[a-z]+\s*\d+(?:[:-]\d+)?(?:\s*-\s*\d+)?(?::\d+|(?:\s*[A-Z]?[a-z]+\s*\d+:\d+))?/);
	var helloRegex = new RegExp(/(H|h)ello|(H|h)i|(W|w)(h?)at('?)s (up|good|gud|gucci)/);
	var sgbotRegex = new RegExp(/((S|s)(G|g)(B|b)(O|o)(T|t))|@UE8C32XDM/);
	var thanksRegex = new RegExp(/(T|t)(hanks|hx|y)/);
	var insultRegex = new RegExp(/((S|s)tupid)|((D|d)um(b?))|((U|u)gly)|((L|l)ame)/);
	if(verseRegex.test(message) == true) {
		getBibleVerse(verseRegex.exec(message));
	}
	else if(helloRegex.test(message) && sgbotRegex.test(message)) {
		sayHiBack(message);
	}
	else if(thanksRegex.test(message) && sgbotRegex.test(message)) {
		respondToThanks();
	}
	else if(insultRegex.test(message) && sgbotRegex.test(message)) {
		respondToInsult();
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
					`_Ahh...${reference} is too long. Please try a smaller reference._`
					)
		}
		else {
			hasDoneService = true;
			bot.postMessageToChannel(
					'general',
					`${formattedText}`
			);
		}
	});
	
}

function sayHiBack(message) {
	bot.postMessageToChannel(
			'general',
			`_Hello there!_`
			);
}

function respondToThanks() {
	if(hasDoneService == true) {
		hasDoneService = false;
		var rng = Math.floor((Math.random() * 10) + 1);
		var msg;
		if(rng < 5) {
			msg = `_You're very welcome!_`;
		}
		else if(rng < 9) {
			msg = `_It's no problem at all!_`;
		}
		else {
			msg = `_Please venmo Sam Doan if you like this service! (JK)_`;
		}
		bot.postMessageToChannel(
			'general',
			msg
			);
	}
	else {
		bot.postMessageToChannel(
				'general',
				`_Thanks for what?_`
				);
	}
	
}

function respondToInsult() {
	
	var rng = Math.floor((Math.random() * 10) + 1);
	var msg;
	if(rng < 5) {
		msg = `_Umm...that wasn't very nice._`;
	}
	else {
		msg = `_Hey, c'mon now!_`;
	}
	bot.postMessageToChannel(
		'general',
		msg	
	)
	
}


