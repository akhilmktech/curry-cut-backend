const getFullUrl = (req, relativePath) => {
  if (!relativePath) return null;
  if (relativePath.startsWith('http')) return relativePath;
  
  // Use dynamic host if BASE_URL_TWO looks like a production URL and we are likely in development
  const envBaseUrl = process.env.BASE_URL_TWO;
  const isProductionUrl = envBaseUrl && (envBaseUrl.includes('onrender.com') || envBaseUrl.includes('curry-cut.com'));
  const isLocalHost = req.get('host').includes('localhost') || req.get('host').includes('127.0.0.1');
  
  const baseUrl = (isProductionUrl && !isLocalHost) ? envBaseUrl : `${req.protocol}://${req.get('host')}/`;
  
  // Ensure the relative path is prefixed with uploads/ if it's not already
  const normalizedPath = relativePath.startsWith('uploads/') ? relativePath : `uploads/${relativePath}`;
  
  // Ensure baseUrl ends with / and normalizedPath doesn't start with /
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const cleanPath = normalizedPath.startsWith('/') ? normalizedPath.slice(1) : normalizedPath;
  
  return `${cleanBaseUrl}${cleanPath}`;
};

module.exports = getFullUrl;
