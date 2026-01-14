import { io } from 'socket.io-client';
import { store } from '../store';

let socket = null;

export const connectWebSocket = () => {
  const state = store.getState();
  
  if (!state.auth.token) {
    console.log('No auth token, skipping WebSocket connection');
    return;
  }
  
  socket = io(process.env.API_BASE_URL, {
    auth: {
      token: state.auth.token,
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });
  
  socket.on('connect', () => {
    console.log('WebSocket connected');
  });
  
  socket.on('disconnect', () => {
    console.log('WebSocket disconnected');
  });
  
  socket.on('connect_error', (error) => {
    console.error('WebSocket connection error:', error);
  });
  
  // Listen for events
  socket.on('report_status_changed', (data) => {
    store.dispatch(addNotification({
      type: 'info',
      message: data.message,
    }));
    
    // Refresh reports
    store.dispatch(fetchMyReports());
  });
  
  socket.on('task_assigned', (task) => {
    store.dispatch(addNotification({
      type: 'success',
      message: `New task assigned at ${task.location.address}!`,
    }));
    
    // Refresh tasks
    store.dispatch(fetchMyTasks());
  });
  
  return socket;
};

export const disconnectWebSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const sendLocationUpdate = (latitude, longitude) => {
  if (socket && socket.connected) {
    socket.emit('psp_location_update', {
      latitude,
      longitude,
    });
  }
};