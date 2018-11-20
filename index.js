/**
 * SGBot index.js
 */

const SlackBot = require('slackbots');
const axios = require('axios');

var hasDoneService = false;
var verseRegex = new RegExp(/(?:\d\s*)?[A-Z]?[a-z]+\s*\d+(?:[:-]\d+)?(?:\s*-\s*\d+)?(?::\d+|(?:\s*[A-Z]?[a-z]+\s*\d+:\d+))?/);
var helloRegex = new RegExp(/(H|h)ello|(H|h)i|(W|w)(h?)at('?)s (up|good|gud|gucci)/);
var sgbotRegex = new RegExp(/((S|s)(G|g)(B|b)(O|o)(T|t))|@UE8C32XDM/);
var thanksRegex = new RegExp(/(T|t)(h(a?)nks|hx|y)/);
var insultRegex = new RegExp(/((S|s)tupid)|((D|d)um(b?))|((U|u)gly)|((L|l)ame)/);
var weatherRegex = new RegExp(/((W|w)eather)|((R|r)ain)|((S|s)(now|torm))/);
var dateRegex = new RegExp(/((T|t)(mr|omorrow))|((M|m)(on|onday))|((T|t)(ues|hur|uesday|ursday))|((W|w)(ed|ednesday))|((F|f)(ri|iday))|((S|s)(at|un|aturday|unday))/);
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
//	else if(weatherRegex.test(message) && dateRegex.test(message)) {
//		checkFutureWeather(dateRegex.exec(message));
//	}
	else if(weatherRegex.test(message)) {
		checkWeather();
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

function checkWeather() {
	var src = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22champaign%2Cil%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
	axios.get(src)
	
	.then(res => {
		hasDoneService = true;
		const condition = res.data.query.results.channel.item.condition.text;
		const temp = res.data.query.results.channel.item.condition.temp;
		const forecast = res.data.query.results.channel.item.forecast[0].text;
		console.log(condition);
		const formattedText = "```".concat(condition).concat("```");
		bot.postMessageToChannel(
				'general',
				`_Today is ${condition} at ${temp}°F with a chance of ${forecast}!_`
				)
	});
}

//function getDesiredDayIndex(startDay, endDay) {
//	var startDayInt = asInt(startDay);
//	var endDayInt = asInt(endDay);
//	return (startDayInt < endDayInt) ? endDayInt-startDayInt : (7-(startDayInt-endDayInt));
//}
//
//function asInt(day) {
//	if(day == "Mon") {
//		return 1;
//	}
//	else if(day == "Tue") {
//		return 2;
//	}
//	else if(day == "Wed") {
//		return 3;
//	}
//	else if(day == "Thu") {
//		return 4;
//	}
//	else if(day == "Fri") {
//		return 5;
//	}
//	else if(day == "Sat") {
//		return 6;
//	}
//	else if(day == "Sun") {
//		return 7;
//	}
//}
//
//function checkFutureWeather(day) {
//	
//	var desiredDay;
//	console.log("DAY: " + day);
//	if(day == ("Mon"|"Monday"|"mon"|"monday")) {
//		desiredDay = "Mon";
//	}
//	else if(day == ("Tues"|"Tuesday"|"tues"|"tuesday")) {
//		desiredDay = "Tue";
//	}
//	else if(day == "Wed"|"Wednesday"|"wed"|"wednesday") {
//		desiredDay = "Wed";
//	}
//	else if(day == ("Thurs"|"Thursday"|"thurs"|"thursday")) {
//		desiredDay = "Thu";
//	}
//	else if(day == ("Fri"|"Friday"|"fri"|"friday")) {
//		desiredDay = "Fri";
//	}
//	else if(day == ("Sat"|"Saturday"|"sat"|"saturday")) {
//		desiredDay = "Sat";
//	}
//	else if(day == ("Sun"|"Sunday"|"sun"|"sunday")) {
//		desiredDay = "Sun";
//	}
//	
//	console.log("DESIRED DAY: " + desiredDay);
//	
//	var src = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22champaign%2Cil%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
//	axios.get(src)
//	
//	.then(res => {
//		hasDoneService = true;
//		const today = res.data.query.results.channel.item.forecast[0].day;
//		const desiredDayIndex = getDesiredDayIndex(today, desiredDay);
//		console.log("Desired Day Index: " + desiredDayIndex);
//		const date = res.data.query.results.channel.item.forecast[desiredDayIndex].date;
//		const day = res.data.query.results.channel.item.forecast[desiredDayIndex].day;
//		const high = res.data.query.results.channel.item.forecast[desiredDayIndex].high;
//		const low = res.data.query.results.channel.item.forecast[desiredDayIndex].low;
//		const condition = res.data.query.results.channel.item.forecast[desiredDayIndex].text;
//		
//		const formattedText = "```".concat(condition).concat("```");
//		bot.postMessageToChannel(
//				'general',
//				`_${day}, ${date}:\n It will be ${condition} at a high of ${high}°F and low of ${low}!_`
//				)
//	});
//}


