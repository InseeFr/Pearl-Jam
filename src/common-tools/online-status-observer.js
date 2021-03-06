const ONLINE = 'online';
const OFFLINE = 'offline';
const observers = [];

const online = e => {
  observers.forEach(o => {
    o(true);
  });
};
const offline = e => {
  observers.forEach(o => {
    o(false);
  });
};

const init = () => {
  window.addEventListener(ONLINE, online);
  window.addEventListener(OFFLINE, offline);
};

export const clean = () => {
  if (init) {
    window.removeEventListener(ONLINE, online);
    window.removeEventListener(OFFLINE, offline);
  }
};

let isInit = false;
export default o => {
  if (!isInit) {
    isInit = true;
    init();
  }
  if (typeof o === 'function') {
    observers.push(o);
    o(navigator.onLine);
  }
};
