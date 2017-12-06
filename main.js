/**
 * This twitch bot is based on the tmi.js package.
 * Below is a list of all the things this code does:
 * - create array.clean function to strip certain elements from arrays
 * - load the neccesary modules and start the bot with a configuration object
 * - define variables for later use
 * - create client
 * - define commands
 * - open client connection
 */

Array.prototype.clean = function (deleteValue)
{
    for (var i = 0; i < this.length; i++)
    {
        if (this[i] == deleteValue)
        {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
};

function getRandomListItem(list)
{
    var rand = Math.floor(Math.random() * (list.length - 1));
    console.log(rand);
    return list[rand];
}

// LOAD MODULES
var tmi = require('tmi.js');
var fs = require('fs');
var http = require('http');


// VARIABLES FOR LATER USE
var greetings = [
        "Did you bring me my doughnut xMustang?",
        "Greetings earthling!",
        "Hi there!",
        "Wazzup bro",
        "Eyyyyyyyyy",
        "Welcome! Did you bring any beer?",
        "Welcome to the dark side...",
    ],
    interMessagesCounter = 0,
    intervalMessages = [
        "If you like whatcha see, follow! You can access my youtube here: https://www.youtube.com/channel/UC4XryR0fHLOlwCO4KLvn-ow",
        "Stalk me here! https://twitter.com/MyKatEvolved"
    ],
    emotes = [
        "Kappa",
        "KappaPride",
        "BrokeBack",
        "DansGame",
        "Kreygasm",
        "SwiftRage",
        "BabyRage",
        "SMOrc",
        "FrankerZ",
        "4Head",
        "WutFace",
        "VoHiYo"
    ],
    welcometext =
        "Welcome! chat messages should not be longer than 500 characters. " +
        "Here's a list of the available commands: !about, !hello, !saymyname, !testsafe.",
    channelName = "katevolved",
    commandCounter = 0,
    chatMaxLength = 500;

// COMMAND SPAM COUNTER
setInterval(function ()
{
    commandCounter = 0;
}, 10000);

var options = {
    options: {
        debug: true
    },
    connection: {
        cluster: "aws",
        reconnect: true
    },
    identity: {
        username: "KatEvoBot",
        password: "oauth:vwohov7is1pou2rw9sylme9bra0z64"
    },
    channels: [
    "KatEvolved",
    "minterhero"
    ]
}

// CREATE CLIENT OBJECT
var client = new tmi.client(options);

// COMMANDS OBJECT
var Commands = {
    '!about': function (channel, user, message, self)
    {
        client.action(channel, welcometext);
    },

    '!bye': function (channel, user, message, self)
    {
        client.action(channel, "Until next time " + user['display-name'] + "! " + getRandomListItem(emotes) );
    },

    '!hi': function (channel, user, message, self)
    {
        client.action(channel, getRandomListItem(greetings) + " " + getRandomListItem(emotes));
    },

    '!saymyname': function (channel, user, message, self)
    {
        client.action(channel, user['display-name'] + "! " + getRandomListItem(emotes));
    },

    '!testsafe': function (channel, user, message, self)
    {
        if (user['display-name'] === "minterhero" || "KatEvolved")
        {
            client.action(channel, "Bot is working!")
        }
        else
        {
            client.action(channel, "This command is for the admin only.");
        }
    }
};

client.on("resub", function (channel, username, months, message) {
    client.action(channel, 'Thank you ' + user['display-name'] + ' for subscribing! <3')
});
client.on("subscribers", function (channel, enabled) {
    client.action(channel, 'Thank you ' + user['display-name'] + ' for subscribing! <3')
});

// LIST COMMAND KEYS
var commandList = Object.keys(Commands);

// CHAT MESSAGE LISTENER
client.on("chat", function (channel, user, message, self)
{
    // timeout big messages
    if (message.length > chatMaxLength)
    {
        client.timeout(channel, user['display-name'], 180, "please limit your chat messages to " + chatMaxLength + " characters");
        client.whisper(user['display-name'], "please limit your chat messages to " + chatMaxLength + " characters");
        return;
    }

    // check if message contains "!"
    if (message.indexOf('!') === 0 && message.length > 1)
    {
        // count commands, when more than 3 = timeout
        commandCounter++;

        var parsedCommand = message.split(" ")[0];

        // check if command exists
        if (Commands.hasOwnProperty(parsedCommand))
        {


            // execute command
            Commands[parsedCommand](channel, user, message, self);
        }
    }
});

// display channel message every 10 minutes
setInterval(function() {
    client.action(channelName, intervalMessages[interMessagesCounter]);
    if (interMessagesCounter < (intervalMessages.length - 1))
    {
        interMessagesCounter++;
    } else {
        interMessagesCounter = 0;
    }
}, 1200000);

// CONNECT BOT
client.connect();

client.on("connected", function(address, port) {
    client.action("KatEvolved", "Bot connected!")
})