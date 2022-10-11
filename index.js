//Webex Bot Starter - featuring the webex-node-bot-framework - https://www.npmjs.com/package/webex-node-bot-framework

var framework = require('webex-node-bot-framework');
var webhook = require('webex-node-bot-framework/webhook');
var https = require('https');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
app.use(express.static('images'));
const config = require("./config.json");

// init framework
var framework = new framework(config);
framework.start();
console.log("Starting framework, please wait...");

framework.on("initialized", function() {
  console.log("framework is all fired up! [Press CTRL-C to quit]");
});

// A spawn event is generated when the framework finds a space with your bot in it
// If actorId is set, it means that user has just added your bot to a new space
// If not, the framework has discovered your bot in an existing space
framework.on('spawn', (bot, id, actorId) => {
  if (!actorId) {
    // don't say anything here or your bot's spaces will get
    // spammed every time your server is restarted
    console.log(`While starting up, the framework found our bot in a space called: ${bot.room.title}`);
  } else {
    // When actorId is present it means someone added your bot got added to a new space
    // Lets find out more about them..
    var msg = 'You can say `help` to get the list of words I am able to respond to.';
    bot.webex.people.get(actorId).then((user) => {
      msg = `Hello there ${user.displayName}. ${msg}`;
    }).catch((e) => {
      console.error(`Failed to lookup user details in framwork.on("spawn"): ${e.message}`);
      msg = `Hello there. ${msg}`;
    }).finally(() => {
      // Say hello, and tell users what you do!
      if (bot.isDirect) {
        bot.say('markdown', msg);
      } else {
        let botName = bot.person.displayName;
        msg += `\n\nDon't forget, in order for me to see your messages in this group space, be sure to *@mention* ${botName}.`;
        bot.say('markdown', msg);
      }
    });
  }
});


//Process incoming messages

let responded = false;
/* On mention with command
ex User enters @botname help, the bot will write back in markdown
*/
framework.hears(/help|what can i (do|say)|what (can|do) you do/i, function(bot, trigger) {
  console.log(`someone needs help! They asked ${trigger.text}`);
  responded = true;
  bot.say(`Hello ${trigger.person.displayName}.`)
    .then(() => sendHelp(bot))
    .catch((e) => console.error(`Problem in help hander: ${e.message}`));
});

/* On mention with command, using other trigger data, can use lite markdown formatting
ex User enters @botname 'info' phrase, the bot will provide personal details
*/
framework.hears(/ath|(when|wen) moon|(number|price|line) go up/i, function(bot, trigger) {
  console.log("a moonboi has entered the chat");
  responded = true;
  
  bot.say("markdown", outputString);
});

/* On mention with bot data 
ex User enters @botname 'space' phrase, the bot will provide details about that particular space
*/
framework.hears('space', function(bot) {
  console.log("space. the final frontier");
  responded = true;
  let roomTitle = bot.room.title;
  let spaceID = bot.room.id;
  let roomType = bot.room.type;

  let outputString = `The title of this space: ${roomTitle} \n\n The roomID of this space: ${spaceID} \n\n The type of this space: ${roomType}`;

  console.log(outputString);
  bot.say("markdown", outputString)
    .catch((e) => console.error(`bot.say failed: ${e.message}`));

});

/* 
   Say hi to every member in the space
   This demonstrates how developers can access the webex
   sdk to call any Webex API.  API Doc: https://webex.github.io/webex-js-sdk/api/
*/
framework.hears("say hi to everyone", function(bot) {
  console.log("say hi to everyone.  Its a party");
  responded = true;
  // Use the webex SDK to get the list of users in this space
  bot.webex.memberships.list({ roomId: bot.room.id })
    .then((memberships) => {
      for (const member of memberships.items) {
        if (member.personId === bot.person.id) {
          // Skip myself!
          continue;
        }
        let displayName = (member.personDisplayName) ? member.personDisplayName : member.personEmail;
        bot.say(`Hello ${displayName}`);
      }
    })
    .catch((e) => {
      console.error(`Call to sdk.memberships.get() failed: ${e.messages}`);
      bot.say('Hello everybody!');
    });
});

// Buttons & Cards data
let cardJSON =
{
  $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
  type: 'AdaptiveCard',
  version: '1.0',
  body:
    [{
      type: 'ColumnSet',
      columns:
        [{
          type: 'Column',
          width: '5',
          items:
            [{
              type: 'Image',
              url: 'Your avatar appears here!',
              size: 'large',
              horizontalAlignment: "Center",
              style: 'person'
            },
            {
              type: 'TextBlock',
              text: 'Your name will be here!',
              size: 'medium',
              horizontalAlignment: "Center",
              weight: 'Bolder'
            },
            {
              type: 'TextBlock',
              text: 'And your email goes here!',
              size: 'small',
              horizontalAlignment: "Center",
              isSubtle: true,
              wrap: false
            }]
        }]
    }]
};

/* On mention with card example
ex User enters @botname 'card me' phrase, the bot will produce a personalized card - https://developer.webex.com/docs/api/guides/cards
*/
framework.hears('card me', function(bot, trigger) {
  console.log("someone asked for a card");
  responded = true;
  let avatar = trigger.person.avatar;

  cardJSON.body[0].columns[0].items[0].url = (avatar) ? avatar : `${config.webhookUrl}/missing-avatar.jpg`;
  cardJSON.body[0].columns[0].items[1].text = trigger.person.displayName;
  cardJSON.body[0].columns[0].items[2].text = trigger.person.emails[0];
  bot.sendCard(cardJSON, 'This is customizable fallback text for clients that do not support buttons & cards');
});

/* On mention reply example
ex User enters @botname 'reply' phrase, the bot will post a threaded reply
*/
framework.hears('reply', function(bot, trigger) {
  console.log("someone asked for a reply.  We will give them two.");
  responded = true;
  bot.reply(trigger.message,
    'This is threaded reply sent using the `bot.reply()` method.',
    'markdown');
  var msg_attach = {
    text: "This is also threaded reply with an attachment sent via bot.reply(): ",
    file: 'https://media2.giphy.com/media/dTJd5ygpxkzWo/giphy-downsized-medium.gif'
  };
  bot.reply(trigger.message, msg_attach);
});

let coinCardJSON = {
  "type": "AdaptiveCard",
  "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
  "version": "1.2",
  "body": [
    {
      "type": "RichTextBlock",
      "inlines": [
        {
          "type": "TextRun",
          "text": "Choose the prices you want to see."
        }
      ],
      "spacing": "Medium",
      "separator": true
    },
    {
      "type": "TextBlock",
      "wrap": true,
      "text": "Which currency's price?",
      "id": "currencytext"
    },
    {
      "type": "Input.ChoiceSet",
      "placeholder": "Bitcoin",
      "spacing": "Medium",
      "id": "currency",
      "choices": [
        {
          "title": "Bitcoin",
          "value": "bitcoin"
        },
        {
          "title": "Ethereum",
          "value": "ethereum"
        },
        {
          "title": "Tether",
          "value": "tether"
        },
        {
          "title": "Matic",
          "value": "matic-network"
        }
      ]
    },
    {
      "type": "TextBlock",
      "text": "Which pairing?",
      "wrap": true,
      "id": "pairtext"
    },
    {
      "type": "Input.ChoiceSet",
      "choices": [
        {
          "title": "USD",
          "value": "usd"
        },
        {
          "title": "EUR",
          "value": "eur"
        },
        {
          "title": "CNY",
          "value": "cny"
        },
        {
          "title": "INR",
          "value": "inr"
        }
      ],
      "placeholder": "USD",
      "id": "pair"
    },
    {
      "type": "ActionSet",
      "actions": [
        {
          "type": "Action.Submit",
          "title": "Get Price",
          "id": "submit"
        }
      ]
    }
  ]
}
/* On mention with coin me
ex User enters @botname 'coin me' phrase, the bot will produce a personalized card - https://developer.webex.com/docs/api/guides/cards
*/
framework.hears('prices', function(bot, trigger) {
  console.log("someone asked for a card");
  responded = true;
  bot.sendCard(coinCardJSON, 'This is customizable fallback text for clients that do not support buttons & cards');
});

// Process an Action.Submit button press
framework.on('attachmentAction', function(bot, trigger) {
  if (trigger.type != 'attachmentAction') {
    throw new Error(`Invaid trigger type: ${trigger.type} in attachmentAction handler`);
  }
  let attachmentAction = trigger.attachmentAction;
  console.log(attachmentAction);
  getCurrency(bot, attachmentAction);
  responded = true;

});

const getCurrency = (bot, attachment) => {
  const options = {
    method: 'GET',
    hostname: 'api.coingecko.com',
    path: `/api/v3/coins/${attachment.inputs.currency}`,
    port: 443,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const req = https.request(options, (res) => {
    console.log(`statusCode: ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', async () => {
      console.log(` price fetched successfully`);
      price = await JSON.parse(data).market_data.current_price[`${attachment.inputs.pair}`];
      console.log('price:', price);
      let symbol = '';
      symbol = {
        'usd': '$',
        'eur': '€',
        'cny': '¥',
        'inr': '₹'
      };

      bot.say(`The current price of 1 ${attachment.inputs.currency == 'matic-network'? 'Matic': attachment.inputs.currency.charAt(0).toUpperCase() + attachment.inputs.currency.slice(1)} is ${symbol[attachment.inputs.pair]}${price} ${attachment.inputs.pair.toUpperCase()}`);
    })
    res.on('error', (e) => {
      console.error(`Error: ${e.message}`);
    });
  });
  req.end();
}




/* On mention bitcoin example
ex User enters @botname 'bitcoin' phrase, the bot will respond with the current price of bitcoin in USD
*/
framework.hears('bitcoin', function(bot, trigger) {
  console.log("someone wants to check the price of bitcoin");
  responded = true;
  let price = '';
  const options = {
    method: 'GET',
    hostname: 'api.coingecko.com',
    path: '/api/v3/coins/bitcoin',
    port: 443,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const req = https.request(options, (res) => {
    console.log(`statusCode: ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', async () => {
      console.log('bitcoin price fetched successfully');
      price = await JSON.parse(data).market_data.current_price.usd;
      console.log('price:', price);
      bot.say(`The current price of 1 ₿itcoin is $${price} USD`);
    })
    res.on('error', (e) => {
      console.error(`Error: ${e.message}`);
    });
  });
  req.end();
  // bot.say(`The current price of Bitcoin is ${price}`);
})
/* On mention ethereum example
ex User enters @botname 'ethereum' phrase, the bot will respond with the current price of ethereum in USD*/
framework.hears('ethereum', function(bot, trigger) {
  console.log("someone wants to check the price of ethereum");
  responded = true;
  let price = '';
  const options = {
    method: 'GET',
    hostname: 'api.coingecko.com',
    path: '/api/v3/coins/ethereum',
    port: 443,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const req = https.request(options, (res) => {
    console.log(`statusCode: ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', async () => {
      console.log('ethereum price fetched successfully');
      price = await JSON.parse(data).market_data.current_price.usd;
      console.log('price:', price);
      bot.say(`The current price of 1 Ξthereum is $${price} USD`);
    })
    res.on('error', (e) => {
      console.error(`Error: ${e.message}`);
    });
  });
  req.end();
  // bot.say(`The current price of Bitcoin is ${price}`);
})
/* On mention with unexpected bot command
   Its a good practice is to gracefully handle unexpected input
*/
framework.hears(/.*/, function(bot, trigger) {
  // This will fire for any input so only respond if we haven't already
  if (!responded) {
    console.log(`catch-all handler fired for user input: ${trigger.text}`);
    bot.say(`Sorry, I don't know how to respond to "${trigger.text}"`)
      .then(() => sendHelp(bot))
      .catch((e) => console.error(`Problem in the unexepected command hander: ${e.message}`));
  }
  responded = false;
});

function sendHelp(bot) {
  bot.say("markdown", 'These are the commands I can respond to:', '\n\n ' +
    '1. **explain**   (what is the pupose of this bot?) \n' +
    '2. **bitcoin**  (fetches the current price of 1 BTC in USD) \n' +
    '3. **ethereum**  (fetches the current price of 1 ETH in USD) \n' +
    '4. **prices** (pick a coin/currency pair and check latest price) \n' +
    '5. **say hi to everyone** (everyone gets a greeting using a call to the Webex SDK) \n' +
    '6. ***ath/ wen moon***' +
    '6. **tell em (bitcoin | ethereum)** (have bot reply to your message with the current price you request) \n' +
    '7. **help** (what you are reading now)');
}


//Server config & housekeeping
// Health Check
app.get('/', function(req, res) {
  res.send(`I'm alive.`);
});

app.post('/', webhook(framework));

var server = app.listen(config.port, function() {
  framework.debug('framework listening on port %s', config.port);
});

// gracefully shutdown (ctrl-c)
process.on('SIGINT', function() {
  framework.debug('stoppping...');
  server.close();
  framework.stop().then(function() {
    process.exit();
  });
});
