import axios from 'axios';

const REDDIT_API_URL = 'https://oauth.reddit.com/api/submit';

/**
 * Submits a post to a subreddit on Reddit.
 * This is a mock implementation. The actual Reddit API requires OAuth 2.0 authentication.
 *
 * @param {string} accessToken - The user's OAuth 2.0 access token.
 * @param {string} subreddit - The name of the subreddit (e.g., 'test').
 * @param {string} title - The title of the post.
 * @param {string} [text] - The self-text of the post (for text posts).
 * @param {string} [url] - The URL for the post (for link posts).
 * @returns {Promise<object>} - A promise that resolves with the API response.
 */
export const postToReddit = async ({ accessToken, subreddit, title, text, url }) => {
  console.log('Mock posting to Reddit:', { subreddit, title, text, url });

  if (!accessToken || !subreddit || !title || (!text && !url)) {
    return Promise.reject({
      error: { message: 'Missing required parameters: accessToken, subreddit, title, and either text or url.' }
    });
  }

  // In a real implementation, you would use axios to make the call:
  /*
  const kind = url ? 'link' : 'self';
  
  const params = new URLSearchParams();
  params.append('sr', subreddit);
  params.append('title', title);
  params.append('kind', kind);
  if (url) {
    params.append('url', url);
  } else {
    params.append('text', text);
  }
  
  const config = {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'User-Agent': 'YourApp/1.0 by YourUsername',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  try {
    const response = await axios.post(REDDIT_API_URL, params, config);
    return response.data;
  } catch (error) {
    console.error('Reddit API Error:', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to post to Reddit');
  }
  */

  // Mock response
  await new Promise(resolve => setTimeout(resolve, 1000));

  const response = {
    json: {
      errors: [],
      data: {
        url: url || `https://www.reddit.com/r/${subreddit}/comments/mockid/mock_post/`,
        id: 'mockid',
        name: `t3_mockid`,
      },
    },
  };

  console.log('Mock Reddit post successful:', response);
  return Promise.resolve(response);
}; 