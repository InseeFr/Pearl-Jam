/**
 * Add a listener to the target while returning a cleaning function
 * @param {HTMLElement|Window} target
 * @param {string} event
 * @param {() => void} listener
 * @return {() => void}
 */
export function addListener(target, event, listener) {
  target.addEventListener(event, listener);
  return () => {
    target.removeEventListener(event, listener);
  };
}
