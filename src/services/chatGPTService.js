import axios from 'axios';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

/**
 * Creates a chat completion using the OpenAI API.
 * This is a mock implementation.
 * @param {object} data - The node data.
 * @param {object} credentials - The connection credentials.
 * @returns {Promise<object>}
 */
export const createChatCompletion = async (data, credentials) => {
  const { prompt, model = 'gpt-3.5-turbo', maxTokens = 150 } = data;
  const { apiKey } = credentials;

  console.log('Mocking ChatGPT completion:', { prompt, maxTokens });

  if (!prompt || !apiKey) {
    throw new Error('Missing required parameters: prompt or apiKey from connection.');
  }

  /*
  // REAL IMPLEMENTATION
  const config = {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  };

  const body = {
    model,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: maxTokens,
  };

  try {
    const response = await axios.post(OPENAI_API_URL, body, config);
    return response.data;
  } catch (error) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to create chat completion');
  }
  */

  // MOCK IMPLEMENTATION
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Return mock data that was previously in workflowExecutionService
  return {
    response: {
      text: `🎯 Personalized Ad for a mock customer! 
      
Discover amazing products that will transform your life. 
      
Limited time offer - don't miss out!
      
This ad was generated based on the prompt: "${prompt.substring(0, 50)}..."`
    },
    tokens: {
      prompt: 45,
      completion: 67
    }
  };
}; 