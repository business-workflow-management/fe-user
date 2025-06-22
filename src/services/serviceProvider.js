import { postToFacebookPage } from './facebookService';
import { appendToGoogleSheet } from './googleSheetsService';
import { sendTelegramMessage } from './telegramService';
import { postToInstagram } from './instagramService';
import { postToReddit } from './redditService';
import { createChatCompletion } from './chatGPTService';
import { executeHttpRequest } from './httpService';

export const serviceProviderMap = {
  'facebook': { fn: postToFacebookPage, displayName: 'Facebook', requiresConnection: true },
  'google-sheets': { fn: appendToGoogleSheet, displayName: 'Google Sheets', requiresConnection: true },
  'telegram-bot': { fn: sendTelegramMessage, displayName: 'Telegram Bot', requiresConnection: true },
  'instagram': { fn: postToInstagram, displayName: 'Instagram', requiresConnection: true },
  'reddit': { fn: postToReddit, displayName: 'Reddit', requiresConnection: true },
  'chatgpt': { fn: createChatCompletion, displayName: 'ChatGPT', requiresConnection: true },
  'http-request': { fn: executeHttpRequest, displayName: 'HTTP Request', requiresConnection: false },
};

/**
 * Retrieves the appropriate service function for a given node type.
 * @param {string} nodeType - The type of the node (e.g., 'facebook', 'google-sheets').
 * @returns {Function|undefined} The service function or undefined if not found.
 */
export const getService = (nodeType) => {
  return serviceProviderMap[nodeType]?.fn;
}; 