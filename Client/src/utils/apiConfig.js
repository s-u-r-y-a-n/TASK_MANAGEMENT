const defaultApiOrigin = `${window.location.protocol}//${window.location.hostname}:5000`;

export const API_BASE_URL = import.meta.env.VITE_API_URL || defaultApiOrigin;
