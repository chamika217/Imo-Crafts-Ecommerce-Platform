// Ping backend to prevent Vercel cold start
const API_URL = import.meta.env.VITE_API_URL;

export const startKeepAlive = () => {
  const ping = () => {
    fetch(`${API_URL?.replace('/api', '') || ''}/`)
      .catch(() => {}); // silent
  };

  ping(); // immediate ping on app load
  // Ping every 4 minutes to prevent cold start
  const interval = setInterval(ping, 4 * 60 * 1000);
  return () => clearInterval(interval);
};
