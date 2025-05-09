import { io } from 'socket.io-client';
// "undefined" means the URL will be computed from the `window.location` object

export const URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const socket = io(URL, {
  autoConnect: false,
});
