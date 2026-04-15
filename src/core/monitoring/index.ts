import { init } from '@elastic/apm-rum';
import { version as appVersion } from '../../../package.json';

type MonitoringType = 'synchronisation';

const monitoringEnabled = import.meta.env.VITE_ENABLE_MONITORING === 'true';
const monitoringServer = import.meta.env.VITE_MONITORING_SERVER_URL;
const monitoringServiceName = import.meta.env.VITE_MONITORING_SERVICE_NAME;

const getOrigin = (url: string) => {
  try {
    const uri = new URL(url);
    return uri.origin;
  } catch (error) {
    return '';
  }
};

export const monitoringService = init({
  serviceName: monitoringServiceName,
  serviceVersion: appVersion,
  serverUrl: monitoringServer,
  active: monitoringEnabled,
  distributedTracingOrigins: [
    import.meta.env.VITE_PEARL_API_URL,
    import.meta.env.VITE_QUEEN_URL,
    // we need QUEEN_API_URL, only known by Queen...
  ].map(uri => getOrigin(uri)),
});

export const MONITORING_SYNC_TYPE = 'synchronisation';
