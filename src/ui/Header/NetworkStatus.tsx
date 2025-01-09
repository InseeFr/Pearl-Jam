import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import { useNetworkOnline } from '../../utils/hooks/useOnline';

/**
 * Displays an icon that indicates if the browser is online or offline
 */
export function NetworkStatus() {
  const isOnline = useNetworkOnline();
  return isOnline ? <WifiIcon color="success" /> : <WifiOffIcon color="error" />;
}
