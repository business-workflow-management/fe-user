import axios from 'axios';

const GOOGLE_SHEETS_API_URL = 'https://sheets.googleapis.com/v4/spreadsheets';

/**
 * Appends data to a Google Sheet.
 * This is a mock implementation.
 * @param {object} data - The node data.
 * @param {object} credentials - The connection credentials.
 * @returns {Promise<object>}
 */
export const appendToGoogleSheet = async (data, credentials) => {
  const { spreadsheetId, range, values } = data;
  const { token } = credentials;

  console.log('Mocking appending to Google Sheet:', { spreadsheetId, range, values });

  if (!spreadsheetId || !range || !token) {
    throw new Error('Missing required parameters: spreadsheetId, range, or token from connection.');
  }

  /*
  // REAL IMPLEMENTATION
  const endpoint = `${GOOGLE_SHEETS_API_URL}/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED`;

  const body = {
    values: [values], // Assumes values is an array of cells for the row
  };

  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await axios.post(endpoint, body, config);
    return response.data;
  } catch (error) {
    console.error('Google Sheets API Error:', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to append to Google Sheet');
  }
  */

  // MOCK IMPLEMENTATION
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock data that was previously in workflowExecutionService
  return {
    data: [
      { name: 'John Doe', email: 'john@example.com', interests: 'technology', profileImage: 'https://example.com/john.jpg' },
      { name: 'Jane Smith', email: 'jane@example.com', interests: 'fashion', profileImage: 'https://example.com/jane.jpg' }
    ],
    metadata: {
      title: 'Customer Leads Q4',
      rowCount: 2
    }
  };
}; 