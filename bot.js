#!/usr/bin/env node

const EventSource = require('eventsource');
const irc = require('irc');
const util = require('util');

const config = require('config');
const ircConfig = config.get('irc');


var es = new EventSource(config.get('masterserver.url'));
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

es.addEventListener('create', function (e) {
  const data = JSON.parse(e.data);
  ircConfig.channels.forEach(function(chan) {
  	bot.notice(chan, util.format('New game %s on %s', data.title, data.host));
  });
});
