// client/src/services/api.js
// Fixed: body stream already read error

// Environment-aware API base URL
const API_BASE_URL = ""; // Use proxy for all environments

// Request deduplication cache
const pendingRequests = new Map();

export const getToken = () => localStorage.getItem("token");

export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const token = getToken();
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`;
  }

  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  // Create a unique key for request deduplication
  const requestKey = `${finalOptions.method || "GET"}_${url}_${JSON.stringify(finalOptions.body || {})}`;

  // Check if the same request is already pending
  if (pendingRequests.has(requestKey)) {
    return pendingRequests.get(requestKey);
  }

  // Create and cache the request promise
  const requestPromise = (async () => {
    try {
      const response = await fetch(url, finalOptions);

      // Clone the response to make it safely readable multiple times
      const responseClone = response.clone();

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        // If JSON parsing fails, try with the clone
        try {
          data = await responseClone.json();
        } catch (cloneError) {
          // If both fail, return empty object or throw error
          data = {};
        }
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return data;
    } finally {
      // Remove from cache when completed
      pendingRequests.delete(requestKey);
    }
  })();

  pendingRequests.set(requestKey, requestPromise);
  return requestPromise;
};

export const postWithToken = async (url, data) => {
  return apiCall(url, {
    method: "POST",
    body: JSON.stringify(data),
  });
};
