const Post = require('../models/Post');
const axios = require('axios');

// This function will call the Gemini API
const callGeminiAPI = async (keywords, instructions) => {
  const prompt = `Generate a social media post with hashtags. The post should be about the following keywords: "${keywords}". The instructions are: "${instructions}". Respond with a JSON object containing two fields: "post" (string) and "hashtags" (an array of strings).`;
  
  const payload = {
      contents: [{
          parts: [{ text: prompt }]
      }],
      generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
              type: "OBJECT",
              properties: {
                  "post": { "type": "STRING" },
                  "hashtags": {
                      "type": "ARRAY",
                      "items": { "type": "STRING" }
                  }
              },
              "propertyOrdering": ["post", "hashtags"]
          }
      }
  };

  const apiKey = process.env.GEMINI_API_KEY;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  let retries = 0;
  const maxRetries = 5;
  let response;

  while (retries < maxRetries) {
    try {
      response = await axios.post(apiUrl, payload, {
        headers: { 'Content-Type': 'application/json' }
      });
      const result = response.data;

      if (result.candidates && result.candidates.length > 0 && result.candidates[0].content && result.candidates[0].content.parts && result.candidates[0].content.parts.length > 0) {
        const json = result.candidates[0].content.parts[0].text;
        const parsedJson = JSON.parse(json);
        return parsedJson;
      }
    } catch (error) {
      console.error(`Attempt ${retries + 1} failed:`, error.message);
      retries++;
      const delay = Math.pow(2, retries) * 1000;
      await new Promise(res => setTimeout(res, delay));
    }
  }

  throw new Error('Failed to get a valid response from the Gemini API after multiple retries.');
};

// Controller to generate a post
exports.generatePost = async (req, res) => {
  try {
    const { keywords, instructions } = req.body;
    const userId = req.user.id;

    const geminiResponse = await callGeminiAPI(keywords, instructions);

    const newPost = new Post({
      user: userId,
      post: geminiResponse.post,
      hashtags: geminiResponse.hashtags,
    });

    await newPost.save();

    res.status(201).json(newPost);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Controller to get a user's post history
exports.getPostsHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const history = await Post.find({ user: userId }).sort({ createdAt: -1 });

    res.json(history);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
