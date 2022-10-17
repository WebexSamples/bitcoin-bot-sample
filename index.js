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

framework.on("initialized", () => {
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
// Buttons & Cards data
// this card is for the 'prices' command
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
};

// this is card is for the 'wen moon' command'
let moonCardJSON = {
    "type": "AdaptiveCard",
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "version": "1.2",
    "body": [
        {
            "type": "TextBlock",
            "text": "Hello an0n, pick your moonshot.",
            "wrap": true,
            "fontType": "Monospace",
            "size": "Medium",
            "weight": "Bolder",
            "color": "Default"
        },
        {
            "type": "Input.ChoiceSet",
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
                    "title": "BNB",
                    "value": "binancecoin"
                },
                {
                    "title": "XRP",
                    "value": "ripple"
                },
                {
                    "title": "Cardano",
                    "value": "cardano"
                },
                {
                    "title": "Solana",
                    "value": "solana"
                },
                {
                    "title": "Dogecoin",
                    "value": "dogecoin"
                },
                {
                    "title": "Polkadot",
                    "value": "polkadot"
                },
                {
                    "title": "Shiba Inu",
                    "value": "shiba-inu"
                },
                {
                    "title": "Polygon",
                    "value": "matic-network"
                },
                {
                    "title": "Tron",
                    "value": "tron"
                },
                {
                    "title": "Lido Staked Ether",
                    "value": "staked-ether"
                },
                {
                    "title": "Avalanche",
                    "value": "avalanche-2"
                },
                {
                    "title": "Uniswap",
                    "value": "uniswap"
                },
                {
                    "title": "Chainlink",
                    "value": "chainlink"
                },
                {
                    "title": "Algorand",
                    "value": "algorand"
                },
                {
                    "title": "Filecoin",
                    "value": "filecoin"
                },
                {
                    "title": "Aave",
                    "value": "aave"
                },
                {
                    "title": "Maker",
                    "value": "maker"
                },
                {
                    "title": "Ethereum Name Service",
                    "value": "ethereum-name-service"
                }
            ],
            "placeholder": "Pick a coin",
            "id": "coinId"
        },
        {
            "type": "Input.ChoiceSet",
            "choices": [
                {
                    "title": "US Dollar",
                    "value": "usd"
                },
                {
                    "title": "Euro",
                    "value": "eur"
                },
                {
                    "title": "Japanese Yen",
                    "value": "jpy"
                },
                {
                    "title": "Pound Sterling",
                    "value": "gbp"
                },
                {
                    "title": "Australian Dollar",
                    "value": "aud"
                },
                {
                    "title": "Chinese Renminbi",
                    "value": "cny"
                },
                {
                    "title": "Canadian Dollar",
                    "value": "cad"
                },
                {
                    "title": "Swiss Franc",
                    "value": "chf"
                },
                {
                    "title": "Hong Kong Dollar",
                    "value": "hkd"
                },
                {
                    "title": "New Zealand Dollar",
                    "value": "nzd"
                }
            ],
            "placeholder": "Currency pair",
            "id": "currencyPair",
            "value": "usd"
        },
        {
            "type": "ActionSet",
            "actions": [
                {
                    "type": "Action.Submit",
                    "title": "Check moonlinessz"
                }
            ],
            "id": "submit"
        }
    ]
};

/* On mention explain
User enters @botname 'explain' bot will respond with a simple explanation of what it's purpose is 
*/
framework.hears('explain', function(bot, trigger) {
  let explanation = 'Hello an0n'+'\n'+'I am a simple bot that was built to show how easy it is to get a Webex bot up and running and talking to other services, like APIs.\n'+'I am using CoinGecko\'s API to obtain all of the information I respond with.\n'+'My source code is available on here on [GitHub](https://github.com/WebexSamples)';
  bot.say('markdown', explanation);
  responded = true;
});

framework.hears('tell em bitcoin', function(bot, trigger) {
  console.log("someone asked for a reply about bitcoin's price");
  responded = true;
  getCurrency(bot, trigger, 'bitcoin');
  });


framework.hears('tell em ethereum', function(bot, trigger) {
  console.log("someone asked for a reply about ethereum's price");
  responded = true;
  getCurrency(bot, trigger, 'ethereum');
});
/* On mention tell em ... example
ex User enters @botname 'tell em (bitcoin | ethereum)' phrase, the bot will post a threaded reply. For use within a thread
*/
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
});

/* On mention with prices
ex User enters @botname 'prices' phrase,- bot will repond with card that offers currencies and returns price
https://developer.webex.com/docs/api/guides/cards
*/
framework.hears('prices', function(bot, trigger) {
  console.log("someone asked for a prices card");
  responded = true;
  bot.sendCard(coinCardJSON, 'This is customizable fallback text for clients that do not support buttons & cards');
});
/* On mention with wen moon
ex User enters @botname 'wen moon'  or other phrase below,- bot will repond with card that gives "moonlinessz" rating and market data printout
https://developer.webex.com/docs/api/guides/cards
*/
framework.hears(/ath|(when|wen) moon|(number|price|line) go up/i, function(bot, trigger) {
  console.log("a moonboi has entered the chat");
  responded = true;
  
  bot.sendCard(moonCardJSON, 'This is customizable fallback text for clients that do not support buttons & cards. Im going to leave this text here');
});

// Process an Action.Submit button press
framework.on('attachmentAction', function(bot, trigger) {
  if (trigger.type != 'attachmentAction') {
    throw new Error(`Invaid trigger type: ${trigger.type} in attachmentAction handler`);
  }
  let attachmentAction = trigger.attachmentAction;
  if (attachmentAction.inputs.currency || !attachmentAction.inputs.currencyPair) {
    getCurrency(bot, attachmentAction);
  } else {
    getMoonlinessz(bot, attachmentAction, trigger);
  };
  responded = true;

});

const getCurrency = (bot, attachment, path) => {
  if (path) {
    let trigger = attachment;
      const options = {
      method: 'GET',
      hostname: 'api.coingecko.com',
      path: `/api/v3/coins/${path}`,
      port: 443,
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const req = https.request(options, (res) => {
      console.log(`statusCode: ${res.statusCode}`);
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', async () => {
        console.log(` price fetched successfully`);
        let price = await JSON.parse(data).market_data.current_price.usd;
        bot.reply(trigger.message, `The current price of 1 ${JSON.parse(data).name} is $${price} USD`);
      })
      res.on('error', (e) => {
        console.error(`Error: ${e.message}`);
      });
    });
    req.end();
  } else ;//why is this semi-colon here and why does it not break this whole file? I guess i need to look at the docs for ES6? tried replacing it with a '{' but that DOES break this file..?
     const options = {
      method: 'GET',
      hostname: 'api.coingecko.com',
      path: `/api/v3/coins/${attachment.inputs.currency ?attachment.inputs.currency : 'bitcoin'}`,
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
      let price;
      console.log(` price fetched successfully`);
      if (attachment.inputs.pair) {
        price = await JSON.parse(data).market_data.current_price[`${attachment.inputs.pair}`];} else {
        price = await JSON.parse(data).market_data.current_price.usd;
        };
      let symbol = {
        'usd': '$',
        'eur': '€',
        'cny': '¥',
        'inr': '₹'
      };
      bot.say(`The current price of 1 ${JSON.parse(data).name} is ${attachment.inputs.pair ? symbol[attachment.inputs.pair]: symbol.usd}${price} ${attachment.inputs.pair? attachment.inputs.pair.toUpperCase():'USD'}`);
      bot.censor(attachment.messageId);
    })
    res.on('error', (e) => {
      console.error(`Error: ${e.message}`);
    });
  });
  req.end();
  };
   
/*This function will take bot instance and trigger object as parameters and return moonlinessz, bro */
const getMoonlinessz = (bot, attachment) => {
  if (attachment.inputs.coinId == '') {
    bot.say(`Please input a coin & currency pair using the card, e.g. 'Bitcoin, US Dollar`);
  } else {
    let currencyPair = attachment.inputs.currencyPair;
  
  let symbol = {
        'usd': '$',
        'eur': '€',
        'cny': '¥',
        'inr': '₹',
        'gbp': '£',
        'aud': '$',
        'cad': '$',
        'hkd': '$',
        'chf': 'Fr.',
        'jpy': '¥',
        'nzd': '$',
      };
  const options = {
    method: 'GET',
    hostname: 'api.coingecko.com',
    path: `/api/v3/coins/${attachment.inputs.coinId}`,
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
      // parse API 'string' response to {JSON} object
      const dataJson = await JSON.parse(data);
      // save moon data in lil package here
      let moonData = {
        currentPrice: dataJson.market_data.current_price[currencyPair],
        ath: dataJson.market_data.ath[currencyPair],
        athChange: dataJson.market_data.ath_change_percentage[currencyPair],
        athDate: dataJson.market_data.ath_date[currencyPair],
        atl: dataJson.market_data.atl[currencyPair],
        atlChange: dataJson.market_data.atl_change_percentage[currencyPair],
        atlDate: dataJson.market_data.atl_date[currencyPair],
        priceChange60Day: dataJson.market_data.price_change_percentage_60d,
        moonlinessz: ''
        
      };
      // add moonlinessz opinion after some processing
      if(moonData.priceChange60Day < 0) {
        moonData.moonlinessz = `I dunno, broh. Ever tried hopium? ${dataJson.name}'s current price is ${symbol[attachment.inputs.currencyPair]}${moonData.currentPrice}; which is down ${moonData.athChange}% from its all-time high of ${symbol[attachment.inputs.currencyPair]}${moonData.ath} on ${moonData.athDate.slice(0,10)} and down ${moonData.priceChange60Day}% in the past 60 days.`;
      } else {
        moonData.moonlinessz = `Looks like FOMO, time to APE in! (DYOR, lulz) ${dataJson.name}'s current price is ${symbol[attachment.inputs.currencyPair]}${moonData.currentPrice}; which is up ${moonData.priceChange60Day}% in the past 60 days and ${moonData.atlChange}% from it's all time low of ${symbol[attachment.inputs.currencyPair]}${moonData.atl} on ${moonData.atlDate.slice(0,10)}.`;
      };
      
      let msg_attach = {
        text: moonData.moonlinessz,
        file: `${dataJson.image.large}`
      };
      bot.say(msg_attach);
      bot.say('markdown', '***🚀moon report🌕***\n\n'+'***'+`${dataJson.name}`+'***');
      bot.censor(attachment.messageId);
      
      console.log(` moon data fetched successfully: moonData: `, moonData);
      
    });
    res.on('error', (e) => {
      console.error(`Error: ${e.message}`);
    });
  });
  req.end();
  }
  
};




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
    '5. ***ath/ wen moon*** get moon report \n' + 
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
