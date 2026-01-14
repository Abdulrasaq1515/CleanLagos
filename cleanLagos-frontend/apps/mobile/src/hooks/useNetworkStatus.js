import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import { setNetworkStatus, syncOfflineReports, addNotification } from '../store';

export const useNetworkStatus = () => {
  const dispatch = useDispatch();
  const { networkStatus } = useSelector((state) => state.ui);
  const { pendingReports } = useSelector((state) => state.reports);

  useEffect(() => {
    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener((state) => {
      const status = state.isConnected ? 'online' : 'offline';
      dispatch(setNetworkStatus(status));
      console.log('Network status:', status);

      // Trigger offline sync when network is restored
      if (status === 'online' && networkStatus === 'offline' && pendingReports && pendingReports.length > 0) {
        console.log('Network restored. Triggering offline sync...');
        dispatch(addNotification({
          type: 'info',
          message: `Syncing ${pendingReports.length} pending report(s)...`,
        }));
        dispatch(syncOfflineReports());
      }
    });

    // Get initial network state
    NetInfo.fetch().then((state) => {
      const status = state.isConnected ? 'online' : 'offline';
      dispatch(setNetworkStatus(status));
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch, networkStatus, pendingReports]);
};
