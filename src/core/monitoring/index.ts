import { init } from '@elastic/apm-rum';
import { version as appVersion } from '../../../package.json';

const monitoringEnabled = import.meta.env.VITE_ENABLE_MONITORING === 'true';
const monitoringServer = import.meta.env.VITE_MONITORING_SERVER_URL;

const getOrigin = (url: string) => {
  const uri = new URL(url);
  return uri.origin;
};

export const monitoringService = init({
  serviceName: 'sabiane-collecte-ui',
  serviceVersion: appVersion,
  serverUrl: monitoringServer,
  active: monitoringEnabled,
  distributedTracingOrigins: [
    import.meta.env.VITE_PEARL_API_URL,
    import.meta.env.VITE_QUEEN_URL,
    // we need QUEEN_API_URL, only known by Queen...
  ].map(uri => getOrigin(uri)),
});
