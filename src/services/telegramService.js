import axios from 'axios';

const TELEGRAM_BOT_API_URL = 'https://api.telegram.org/bot';

/**
 * Sends a message using the Telegram Bot API.
 * This is a mock implementation.
 * @param {object} data - The node data.
 * @param {object} credentials - The connection credentials.
 * @returns {Promise<object>}
 */
export const sendTelegramMessage = async (data, credentials) => {
  const { chatId, text } = data;
  const { botToken } = credentials;

  console.log('Mocking sending Telegram message:', { chatId, text });

  if (!chatId || !text || !botToken) {
    throw new Error('Missing required parameters: chatId, text, or botToken from connection.');
  }

  // REAL IMPLEMENTATION
  const endpoint = `${TELEGRAM_BOT_API_URL}${botToken}/sendMessage`;

  const params = {
    chat_id: chatId,
    text,
    parse_mode: 'Markdown',
  };

  try {
    const response = await axios.post(endpoint, params);
    return response.data;
  } catch (error) {
    console.error('Telegram API Error:', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to send Telegram message');
  }

  /*
  // MOCK IMPLEMENTATION
  await new Promise(resolve => setTimeout(resolve, 500));

  // Return mock data that was previously in workflowExecutionService
  return {
    messageId: 987654321,
    chatId: data.chatId,
    timestamp: new Date().toISOString(),
    status: 'sent'
  };
  */
}; 