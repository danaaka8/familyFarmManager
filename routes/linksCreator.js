const axios = require('axios');
const express = require('express');
const router = express.Router();

const RewardLink = require('../models/RewardLink');

function generateKey() {
  var keyLength = 32; // Change this value to modify the length of the key
  var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  var key = '';

  for (var i = 0; i < keyLength; i++) {
    var randomIndex = Math.floor(Math.random() * characters.length);
    key += characters.charAt(randomIndex);
  }

  return key
}

function parseRewardIdIntoText(code){
  let options = {
    '10005':'water can',
    '100254':'gasoline',
    '5011':'organic fertilizer',
    '10003':'super fertilizer',

  }

  return options[code]
}


router.post('/links/create', async (req, res) => {
  const { farms } = req.body;
  const { type } = req.body;
  const { reward } = req.body;

  const headers = {
    'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'sec-ch-ua-mobile': '?0',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
    'sec-ch-ua-platform': '"Windows"',
    'Origin': 'https://farm.centurygames.com',
    'Sec-Fetch-Site': 'same-site',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Dest': 'empty',
    'Referer': 'https://farm.centurygames.com/',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-GB,en;q=0.9',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Connection': 'keep-alive'
  };

  for(let farm of farms){
    let key = generateKey()

    const formData = new URLSearchParams();
    formData.append('uss', farm.uss);
    formData.append('type', type);
    formData.append('key', key);
    formData.append('hash', farm.hash);

    let originalUrl = `https://apps.facebook.com/family-farm/facebook/get_reward/?vk=${key}_${farm.snsid}___${type}`
    const response = await axios.post(`${process.env.BASE_URL}shorten`, { originalUrl });
    const shortUrl = response.data;

    try {
      const response = await axios.post('https://farm-us.centurygames.com/index.php/webasync/get_feed_key/', formData, {
        headers: headers
      });

      console.log(response.data)

      if(response.data.ok){
        const newLink = new RewardLink({
          originalUrl:originalUrl,
          shortUrl:shortUrl,
          owner:farm.name,
          uss: farm.uss,
          type: type,
          reward:parseRewardIdIntoText(response.data.payload.reward.items.split(':')[0]),
          key: key,
          hash: farm.hash,
          response: response.data
        });
        await newLink.save();
      }

    } catch (error) {
      return res.status(500).json({ error: 'An error occurred while creating the link.' });
    }
  }
  return res.sendStatus(200)
});

module.exports = router;
