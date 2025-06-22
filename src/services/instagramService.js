import axios from 'axios';

const INSTAGRAM_GRAPH_API_URL = 'https://graph.facebook.com/v18.0';

/**
 * Creates a media container on Instagram for a photo or story.
 * This is a mock implementation. The actual Instagram Graph API requires a multi-step process:
 * 1. Upload the media to a URL.
 * 2. Create a media container with the uploaded media's URL.
 * 3. Publish the media container.
 *
 * @param {string} userId - The ID of the Instagram Business or Creator account.
 * @param {string} accessToken - The user's access token.
 * @param {string} imageUrl - The publicly accessible URL of the image.
 * @param {string} [caption] - The caption for the post.
 * @param {boolean} [isStory=false] - Whether to post as a story.
 * @returns {Promise<object>} - A promise that resolves with the API response.
 */
export const postToInstagram = async ({ userId, accessToken, imageUrl, caption, isStory = false }) => {
  console.log('Mock posting to Instagram:', { userId, imageUrl, caption, isStory });

  if (!userId || !accessToken || !imageUrl) {
    return Promise.reject({
      error: { message: 'Missing required parameters: userId, accessToken, or imageUrl.' }
    });
  }

  // In a real implementation, this is a multi-step process.
  // This is a simplified mock of the final publishing step.
  /*
  // Step 1: Create media container
  const containerEndpoint = `${INSTAGRAM_GRAPH_API_URL}/${userId}/media`;
  const containerParams = {
    image_url: imageUrl,
    caption: caption,
    access_token: accessToken,
  };
  if (isStory) {
    containerParams.media_type = 'STORIES';
  }

  try {
    const containerResponse = await axios.post(containerEndpoint, containerParams);
    const creationId = containerResponse.data.id;

    // Step 2: Publish media container
    const publishEndpoint = `${INSTAGRAM_GRAPH_API_URL}/${userId}/media_publish`;
    const publishParams = {
      creation_id: creationId,
      access_token: accessToken,
    };
    const publishResponse = await axios.post(publishEndpoint, publishParams);
    return publishResponse.data;
    
  } catch (error) {
    console.error('Instagram API Error:', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to post to Instagram');
  }
  */

  // Mock response
  await new Promise(resolve => setTimeout(resolve, 1000));

  const response = {
    id: `17841400000000000_${Date.now()}`
  };

  console.log('Mock Instagram post successful:', response);
  return Promise.resolve(response);
}; 