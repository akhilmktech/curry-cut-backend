const getFullUrl = (req, relativePath) => {
  if (!relativePath) return null;
  if (relativePath.startsWith('http')) return relativePath;
  
  // Use BASE_URL_TWO if provided, otherwise reconstruct from request
  const baseUrl = process.env.BASE_URL_TWO || `${req.protocol}://${req.get('host')}/`;
  
  // Ensure the relative path is prefixed with uploads/ if it's not already
  const normalizedPath = relativePath.startsWith('uploads/') ? relativePath : `uploads/${relativePath}`;
  
  // Ensure baseUrl ends with / and normalizedPath doesn't start with /
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const cleanPath = normalizedPath.startsWith('/') ? normalizedPath.slice(1) : normalizedPath;
  
  return `${cleanBaseUrl}${cleanPath}`;
};

module.exports = getFullUrl;
