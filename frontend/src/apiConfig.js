const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://multi-postcomposer.onrender.com';

export const getApiUrl = (path = '') => {
  if (!path) return API_BASE_URL;
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};

export default API_BASE_URL;
