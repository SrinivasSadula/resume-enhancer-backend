const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/api/enhance', async (req, res) => {
  const { resumeText, jobRole } = req.body;

  try {
    const prompt = `Improve this resume for the role of ${jobRole}:\n\"\"\"\n${resumeText}\n\"\"\"`;

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a resume writing assistant." },
        { role: "user", content: prompt }
      ],
      max_tokens: 800
    });

    const responseText = completion.data.choices[0].message.content;
    res.json({ result: responseText });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
