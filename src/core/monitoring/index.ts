import { init } from '@elastic/apm-rum';
import { version as appVersion } from '../../../package.json';

const monitoringEnabled = import.meta.env.VITE_ENABLE_MONITORING === 'true';
const monitoringServer = import.meta.env.VITE_MONITORING_SERVER_URL;

export const monitoringService = init({
  serviceName: 'sabiane-collecte-ui',
  serviceVersion: appVersion,
  serverUrl: monitoringServer,
  active: monitoringEnabled,
});
