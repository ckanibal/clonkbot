#!/usr/bin/env node

const EventSource = require('eventsource');
const irc = require('irc');
const util = require('util');

const config = require('config');
const ircConfig = config.get('irc');

var bot = new irc.Client(ircConfig.server, ircConfig.nick, {
	channels: ircConfig.channels,
	userName: ircConfig.username,
	realName: ircConfig.realname,
	port: ircConfig.port,
	secure: true
});

bot.addListener('registered', function(message) {
	this.send('MODE', this.nick, '+B');
});

(function initES() {
	let es = null;
	if (es == null || es.readyState == 2) {
		es = new EventSource(config.get('masterserver.url'));
		es.onerror = function(e) {
			if (es.readyState == 2) {
				setTimeout(initES, 5000);
			}
		};
		es.addEventListener('create', function(e) {
			const data = JSON.parse(e.data);
			ircConfig.channels.forEach(function(chan) {
				bot.notice(chan, util.format("Yarr, ye brave matey %s be hostin' %s", data.host, data.title));
			});
		});
	}
})();
