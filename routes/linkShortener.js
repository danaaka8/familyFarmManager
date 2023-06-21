const express = require('express')
const validUrl = require('valid-url')
const RewardLink = require('../models/RewardLink')
const shortid = require('shortid')
const router = express.Router()

// Routes
router.post('/shorten', async (req, res) => {
  const { originalUrl } = req.body;

  // Validate URL
  if (!validUrl.isUri(originalUrl)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  try {
    // Check if URL already exists in the database
    let link = await RewardLink.findOne({ originalUrl });

    if (link) {
      res.json(link.shortUrl);
    } else {
      // Generate a short URL
      const shortUrl = `http://localhost:3000/api/${shortid.generate()}`;

      res.json(shortUrl);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error From Link Shortener' });
  }
});

router.get('/:shortUrl', async (req, res) => {
  const { shortUrl } = req.params;

  try {
    // Find the link with the provided short URL
    const link = await RewardLink.findOne({ shortUrl:process.env.BASE_URL + shortUrl });

    if (link) {
      // Redirect to the original URL
      res.redirect(link.originalUrl);
    } else {
      res.status(404).json({ error: 'RewardLink not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router
