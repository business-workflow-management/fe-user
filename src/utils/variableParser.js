const variableRegex = /\{\{env\.(\w+)\}\}/g;
const dataFlowRegex = /\{\{data\.(\w+)\.([\w.]+)\}\}/g;

/**
 * Replaces environment variable placeholders in a string with their actual values.
 * e.g., "Bearer {{env.API_KEY}}" -> "Bearer sk-123..."
 * @param {any} input - The string or other value to parse.
 * @param {object} envVars - An object of environment variables.
 * @returns {any} The parsed string or the original input if not a string.
 */
export const parseVariables = (input, envVars) => {
  if (typeof input !== 'string') {
    return input;
  }
  
  return input.replace(variableRegex, (match, key) => {
    // If the key exists in envVars, return its value; otherwise, return the original placeholder.
    return envVars.hasOwnProperty(key) ? envVars[key] : match;
  });
};

/**
 * Replaces data flow variable placeholders in a string with their actual values.
 * e.g., "Hello {{data.node1.name}}" -> "Hello John"
 * @param {any} input - The string or other value to parse.
 * @param {object} nodeOutputs - An object containing outputs from previous nodes.
 * @returns {any} The parsed string or the original input if not a string.
 */
export const parseDataFlowVariables = (input, nodeOutputs) => {
  if (typeof input !== 'string') {
    return input;
  }
  
  return input.replace(dataFlowRegex, (match, nodeId, fieldPath) => {
    const nodeOutput = nodeOutputs[nodeId];
    if (!nodeOutput) {
      return match; // Return original placeholder if node output not found
    }
    
    // Navigate nested object structure using dot notation
    const fieldValue = fieldPath.split('.').reduce((obj, key) => {
      return obj && obj[key] !== undefined ? obj[key] : undefined;
    }, nodeOutput);
    
    return fieldValue !== undefined ? fieldValue : match;
  });
};

/**
 * Combines both environment and data flow variable parsing.
 * @param {any} input - The string or other value to parse.
 * @param {object} envVars - An object of environment variables.
 * @param {object} nodeOutputs - An object containing outputs from previous nodes.
 * @returns {any} The parsed string or the original input if not a string.
 */
export const parseAllVariables = (input, envVars, nodeOutputs) => {
  if (typeof input !== 'string') {
    return input;
  }
  
  let result = input;
  result = parseVariables(result, envVars);
  result = parseDataFlowVariables(result, nodeOutputs);
  return result;
};

/**
 * Recursively processes an object or array to parse variables in all its string values.
 * @param {object | any[]} data - The data object or array to process.
 * @param {object} envVars - An object of environment variables.
 * @param {object} nodeOutputs - An object containing outputs from previous nodes.
 * @returns {object | any[]} The processed data with variables substituted.
 */
export const processNodeData = (data, envVars, nodeOutputs = {}) => {
  if (!data || typeof data !== 'object') {
    return data;
  }
  
  // Deep clone to avoid mutating the original node data in the store
  const processedData = JSON.parse(JSON.stringify(data));
  
  for (const key in processedData) {
    if (processedData.hasOwnProperty(key)) {
      const value = processedData[key];
      if (typeof value === 'string') {
        processedData[key] = parseAllVariables(value, envVars, nodeOutputs);
      } else if (typeof value === 'object') {
        // Recurse for nested objects or arrays
        processedData[key] = processNodeData(value, envVars, nodeOutputs);
      }
    }
  }
  
  return processedData;
};

/**
 * Extracts all data flow variables from a string for validation and suggestions.
 * @param {string} input - The input string to analyze.
 * @returns {Array} Array of found data flow variables in format {nodeId, fieldPath}.
 */
export const extractDataFlowVariables = (input) => {
  if (typeof input !== 'string') {
    return [];
  }
  
  const variables = [];
  let match;
  
  while ((match = dataFlowRegex.exec(input)) !== null) {
    variables.push({
      nodeId: match[1],
      fieldPath: match[2],
      fullMatch: match[0]
    });
  }
  
  return variables;
};

/**
 * Validates if all referenced nodes exist in the current project.
 * @param {string} input - The input string to validate.
 * @param {Array} projectNodes - Array of nodes in the current project.
 * @returns {object} Validation result with isValid boolean and errors array.
 */
export const validateDataFlowVariables = (input, projectNodes) => {
  const variables = extractDataFlowVariables(input);
  const errors = [];
  
  variables.forEach(({ nodeId, fieldPath }) => {
    const nodeExists = projectNodes.some(node => node.id === nodeId);
    if (!nodeExists) {
      errors.push(`Node "${nodeId}" not found in project`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
}; 