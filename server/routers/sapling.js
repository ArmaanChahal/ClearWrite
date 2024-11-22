/*
 *** textGears.js
 ***
 *** Description : API used for 3 features :
 ***               Correcting grammatical mistakes and making suggested changes
 ***               Evaluate the readability of the text
 ***               Summarize the essay by looking for key points
 */

// Import necessary modules
const express = require("express");
const router = express.Router();
const axios = require("axios");

// Load environmental variables
require("dotenv").config();

if (process.env.NODE_ENV === "test") {
  jest.mock("axios");
}

// Rephrasing
router.post("/rephrase", async (req, res) => {
  // Get text to rephraser
  const text = req.body.text;

  // Get apiKey from dotenv file
  const apiKey = process.env.Sapling_API_KEY;

  // Seperate sentences
  // From https://stackoverflow.com/questions/11761563/javascript-regexp-for-splitting-text-into-sentences-and-keeping-the-delimiter
  const seperated = text.match(/[^\.!\?]+[\.!\?]+/g);

  try {
    let resultingData = [];

    if (text.length > 0) {
      for (var i = 0; i < 1; i++) {
        let textToEvaluate = seperated[i].trim();

        // if there is input text is > 0

        const response = await axios.post(
          "https://api.sapling.ai/api/v1/rephrase",
          {
            key: `${apiKey}`,
            text: `${textToEvaluate}`,
            mapping: "informal_to_formal",
          }
        );

        resultingData.push({
          originalText: text,
          rephrasing: response?.data?.results,
        });
      }
    } else {
      // If there are no input text
      resultingData.push({
        originalText: text,
        rephrasing: [],
      });
    }

    res.json({ rephrase: resultingData });
  } catch (error) {
    // If there is an error

    res.status(500).send(`Error: ${error}`);
  }
});

// 2. AI detection
router.post("/aidetect", async (req, res) => {
  // Get text to AI detector
  const text = req.body.text;

  // Get apiKey from dotenv file
  const apiKey = process.env.Sapling_API_KEY;

  try {
    const response = await axios.post(
      "https://api.sapling.ai/api/v1/aidetect",
      {
        key: `${apiKey}`,
        text,
        sent_scores: true, // Enable sentence-level scoring
        score_string: false, // Disable token heatmap
        version: "20240606", // Default version
      }
    );
    const { data } = response;
    // console.log({status});
    // console.log(JSON.stringify(data, null, 4));
    // res.json(response.data);

    res.json({
      overallScore: data.score,
      sentenceScores: data.sentence_scores,
    });
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
  }
});

// 3. feature sentimentt
router.post("/tone", async (req, res) => {
  // Get text to AI detector
  const text = req.body.text;

  // Get apiKey from dotenv file
  const apiKey = process.env.Sapling_API_KEY;

  try {
    const response = await axios.post(
      "https://api.sapling.ai/api/v1/sentiment",
      {
        key: `${apiKey}`,
        text,
      }
    );

    const { status, data } = response;
    console.log({ status });
    console.log(JSON.stringify(data, null, 4));
    res.json({
      sentences: data.sents,
      overallSentiment: data.overall,
      detailedResults: data.results,
    });
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
  }
});

// Export router
module.exports = router;
