const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const CryptoJS = require('crypto-js');
const cors = require('cors'); // Import the cors middleware

const app = express();
const port = 4000;

const API_URL = 'https://www.coinpayments.net/api.php';
const API_KEY = '676efb6aa01aeb850bd951a24e448690ea7cb1b337474b9311b8834b564358a4'; // Replace with your CoinPayments Public Key
const API_SECRET = '859e404d456E7B8e7b01d1488dd72a4796040D92fA249b264FB621d35E4Eb737'; // Replace with your CoinPayments Private Key

app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

app.post('/create-transaction', async (req, res) => {
  const { amount, currency, buyerEmail } = req.body;

  const payload = {
    cmd: 'create_transaction',
    amount,
    currency1: 'USD',
    currency2: currency,
    buyer_email: buyerEmail,
    key: API_KEY,
    format: 'json',
    version: '1' 
  };

  const formData = new URLSearchParams(payload).toString();
  const hmac = CryptoJS.HmacSHA512(formData, API_SECRET).toString();

  try {
    const response = await axios.post(API_URL, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'HMAC': hmac
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Proxy server running on http://localhost:${port}`);
});
