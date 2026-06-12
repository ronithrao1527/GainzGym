/**
 * Resolves the backend API host dynamically based on the current environment.
 * In development (localhost, 127.0.0.1, local network IPs), it routes to port 5001.
 * In production (Vercel serverless), it uses relative paths (redirected to backend serverless function).
 */
export const getApiHost = () => {
  const { hostname, protocol } = window.location;

  // Check if current hostname corresponds to a local environment
  const isLocal = 
    hostname === 'localhost' || 
    hostname === '127.0.0.1' || 
    hostname === '0.0.0.0' ||
    hostname.startsWith('192.168.') || 
    hostname.startsWith('10.') || 
    hostname.startsWith('172.') || 
    hostname.endsWith('.local');

  if (isLocal) {
    return `${protocol}//${hostname}:5001`;
  }

  // If a production API URL is supplied via Vite environment variables (for decoupled Render + Vercel deploy)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // In production (Vercel deployment), endpoints are relative and served from the same domain
  return '';
};
