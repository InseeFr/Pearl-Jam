export function initializeSyncDate(): void {
  if (!localStorage.getItem('LAST_SYNCH_SUCCESS_DATE')) {
    localStorage.setItem('LAST_SYNCH_SUCCESS_DATE', 'no synch yet');
  }
}