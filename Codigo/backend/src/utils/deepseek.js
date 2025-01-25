// utils/deepseek.js

import OpenAI from 'openai';

const deepSeekClient = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com', // URL base para DeepSeek
});

export default deepSeekClient;
