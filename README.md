# Bitcoin Bot Sample

A comprehensive Webex Teams bot that provides cryptocurrency price information and interactive features using the Webex Node Bot Framework.

## 🎯 Features

- **Multi-Crypto Support**: Get prices for Bitcoin, Ethereum, Tether, and Matic Network
- **Interactive Cards**: Modern Adaptive Cards UI for price requests and moonshot analysis
- **Hash Functionality**: SHA1 encryption for text messages
- **Real-time Data**: Live cryptocurrency prices from CoinGecko API
- **Multiple Currency Pairs**: Support for USD, EUR, CNY, INR, GBP, AUD, CAD, CHF, HKD, JPY, NZD
- **Threaded Replies**: Reply to messages with price information
- **Moon Analysis**: Get "moonlinessz" ratings with historical price data

## 📺 Webinar

This code was covered during a **Webex Developer Webinar** on **November 2nd, 2022**.

- **Recording Link**: [Watch the webinar](https://developer.webex.com/webinars)  
  **Password**: `8qCvnWBC`

## 🚀 Commands

| Command | Description |
|---------|-------------|
| `help` | Show available commands |
| `explain` | Get bot purpose and functionality overview |
| `bitcoin` | Get current Bitcoin price in USD |
| `ethereum` | Get current Ethereum price in USD |
| `prices` | Interactive card to select cryptocurrency and currency pair |
| `ath` / `wen moon` | Get moonshot analysis with historical data |
| `tell em btc` / `tell em eth` | Reply to message with crypto price |
| `hash it` / `sha1` | Encrypt text using SHA1 algorithm |

## 🛠️ Technology Stack

- **Node.js**: Runtime environment
- **Express.js**: Web framework for webhook handling
- **Webex Node Bot Framework**: Bot development framework
- **CoinGecko API**: Cryptocurrency price data
- **Adaptive Cards**: Interactive UI components
- **SHA1**: Cryptographic hashing

## 📋 Prerequisites

- Node.js (v14 or higher)
- Webex Teams account
- Bot token from [Webex Developer Portal](https://developer.webex.com/)
- Public URL for webhook (use ngrok for local development)

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/WebexSamples/bitcoin-bot-sample.git
   cd bitcoin-bot-sample
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure the bot:**
   - Copy `config-template.json` to `config.json`
   - Update with your bot token and webhook URL:
   ```json
   {
     "webhookUrl": "https://your-ngrok-url.ngrok.io",
     "token": "YOUR_BOT_TOKEN_HERE",
     "port": 7001
   }
   ```

4. **Start the bot:**
   ```bash
   npm start
   ```

## 🔧 Configuration

Create a `config.json` file with the following structure:

```json
{
  "webhookUrl": "https://your-public-url.com",
  "token": "YOUR_WEBEX_BOT_TOKEN",
  "port": 7001
}
```

### Getting Your Bot Token

1. Go to [Webex Developer Portal](https://developer.webex.com/)
2. Sign in with your Webex account
3. Create a new bot application
4. Copy the generated bot token

### Setting Up Webhook URL

For local development, use ngrok:
```bash
ngrok http 7001
```
Copy the HTTPS URL and use it in your config.json.

## 💡 Usage Examples

### Basic Price Commands
```
@YourBot bitcoin
@YourBot ethereum
```

### Interactive Price Card
```
@YourBot prices
```
This displays an interactive card where users can select:
- Cryptocurrency (Bitcoin, Ethereum, Tether, Matic)
- Currency pair (USD, EUR, CNY, INR)

### Moon Analysis
```
@YourBot wen moon
@YourBot ath
```
Returns detailed analysis including:
- Current price vs all-time high
- Price change percentages
- Historical data
- "Moonlinessz" rating

### Hash Functionality
```
@YourBot hash this my secret message
```
Returns SHA1 hash with 0x prefix (EVM-style).

## 🏗️ Architecture

The bot follows an event-driven architecture:

1. **Webhook Endpoint**: Receives messages from Webex
2. **Command Processing**: Pattern matching for user commands
3. **API Integration**: Fetches data from CoinGecko API
4. **Response Generation**: Sends formatted responses or interactive cards
5. **Card Actions**: Handles user interactions with Adaptive Cards

## 📊 API Integration

### CoinGecko API
- **Base URL**: `https://api.coingecko.com/api/v3/`
- **Endpoint**: `/coins/{id}`
- **Rate Limits**: Respects API rate limits
- **Data Points**: Current price, market cap, volume, historical data

### Supported Cryptocurrencies
- Bitcoin (bitcoin)
- Ethereum (ethereum)
- Tether (tether)
- Matic Network (matic-network)
- And 20+ more in moon analysis

## 🔒 Security

- Bot token stored in configuration file (not in source code)
- SHA1 hashing for text encryption
- Input validation for user commands
- Error handling for API failures

## 🐛 Error Handling

The bot includes comprehensive error handling:
- API request failures
- Invalid user inputs
- Network connectivity issues
- Card action processing errors

## 📈 Monitoring

Health check endpoint available at:
```
GET /
Response: "I'm alive."
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

## 🆘 Support

- Create an issue in this repository
- Contact [Webex Developer Support](https://developer.webex.com/support)
- Check the [Webex Bot Framework documentation](https://github.com/WebexCommunity/webex-node-bot-framework)

## 🔗 Related Resources

- [Webex Developer Portal](https://developer.webex.com/)
- [CoinGecko API Documentation](https://www.coingecko.com/en/api)
- [Adaptive Cards Documentation](https://adaptivecards.io/)
- [Webex Bot Framework](https://github.com/WebexCommunity/webex-node-bot-framework)

---

**Author**: Aaron Burns  
**Repository**: https://github.com/WebexSamples/bitcoin-bot-sample
