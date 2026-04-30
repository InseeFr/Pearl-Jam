import { format } from 'date-fns';
import { version } from '../../package.json';

const DEFAULT_QUEEN_VERSION = 'error when getting queen version';
const DEFAULT_SYNC_DATE = 'no synch yet';

async function getQueenVersionSafely(): Promise<string> {
  try {
    const { getQueenVersion } = await import('dramaQueen/DramaIndex');
    return getQueenVersion();
  } catch (error) {
    return DEFAULT_QUEEN_VERSION;
  }
}

export async function getSupportData(): Promise<{
  currentUrl: string;
  appVersion: string;
  queenVersion: string;
  navigatorInfo: string;
  lastSyncDate: string;
}> {
  return {
    currentUrl: window.location.href,
    appVersion: `Pearl : v ${version}`,
    queenVersion: await getQueenVersionSafely(),
    navigatorInfo: navigator.userAgent,
    lastSyncDate: localStorage.getItem('LAST_SYNCH_SUCCESS_DATE') || DEFAULT_SYNC_DATE
  };
}

export function generateSupportFileContent(data: {
  currentUrl: string;
  appVersion: string;
  queenVersion: string;
  navigatorInfo: string;
  lastSyncDate: string;
}): string {
  return `
Support Data - ${format(new Date(), 'dd/MM/yyyy HH:mm:ss')}

Current URL: ${data.currentUrl}
App Version: ${data.appVersion}
Queen Version: ${data.queenVersion}
Navigator: ${data.navigatorInfo}
Last Sync: ${data.lastSyncDate}
`.trim();
}

export async function downloadSupportFile(): Promise<void> {
  const data = await getSupportData();
  const content = generateSupportFileContent(data);
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'support.txt';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}