import axios from 'axios';

/**
 * Executes an HTTP request.
 * Includes a real, but commented-out, implementation and an active mock.
 * @param {object} data - The node data, including url, method, headers, and body.
 * @returns {Promise<object>}
 */
export const executeHttpRequest = async (data) => {
  const { url, method = 'GET', headers: headersStr, body: bodyStr } = data;

  if (!url) {
    throw new Error('Missing required parameter: url.');
  }

  // REAL IMPLEMENTATION
  try {
    let headers = {};
    if (headersStr) {
      try {
        headers = JSON.parse(headersStr);
      } catch (e) {
        throw new Error('Headers field is not valid JSON.');
      }
    }

    let body = {};
    if (bodyStr) {
      try {
        body = JSON.parse(bodyStr);
      } catch (e) {
        throw new Error('Body field is not valid JSON.');
      }
    }

    const config = {
      method,
      url,
      headers,
      ...((method === 'POST' || method === 'PUT') && { data: body }),
    };

    const response = await axios(config);
    return { status: response.status, data: response.data, headers: response.headers };
  } catch (error) {
    console.error('HTTP Request Error:', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to execute HTTP request');
  }

  /*
  // MOCK IMPLEMENTATION
  console.log(`Mocking HTTP ${method} request to:`, url);
  await new Promise(resolve => setTimeout(resolve, 500));

  if (method === 'POST' || method === 'PUT') {
    console.log(`Mock ${method} request received with body:`, bodyStr);
    return {
      status: method === 'POST' ? 201 : 200,
      data: { message: `Resource ${method === 'POST' ? 'created' : 'updated'} successfully (mock)`, receivedBody: bodyStr },
    };
  }

  if (method === 'DELETE') {
    return {
      status: 200,
      data: { message: 'Resource deleted successfully (mock)' },
    };
  }

  return {
    status: 200,
    data: {
      articles: [
        { title: 'Tech Breakthrough (Mock)', content: 'New AI technology revolutionizes industry' },
        { title: 'Market Update (Mock)', content: 'Stocks reach new highs' }
      ]
    },
    headers: { 'content-type': 'application/json' }
  };
  */
}; 