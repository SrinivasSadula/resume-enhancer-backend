const express = require('express');
const cors = require('cors');
const { OpenAI } = require("openai");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/enhance', async (req, res) => {
  console.log("inside api/enhance")
  const { resume, jobRole } = req.body;
  const prompt = `Enhance the following resume for a ${jobRole} role:\n\n${resume}`;

  try {
    const response = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o"
    });

    const enhanced = response.choices[0].message.content;
    res.json({ result: enhanced });
  } catch (err) {
    console.log(err.message)
    console.log(err.error)
    console.log(err.error.message)
    res.status(500).json({
      error: err.message ,
      //statusMessage : err.error.message,
      statusCode: err.status
    });
  }
});

app.get('/', async (req, res) => {
  res.send('Server running on http://localhost:3000')
});
app.listen(3000, () => console.log('Server running on http://localhost:3000'));