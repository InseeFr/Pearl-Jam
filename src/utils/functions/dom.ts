/**
 * Add a listener to the target while returning a cleaning function
 */
export function addListener(target: HTMLElement | Window, event: string, listener: VoidFunction) {
  target.addEventListener(event, listener);
  return () => {
    target.removeEventListener(event, listener);
  };
}
