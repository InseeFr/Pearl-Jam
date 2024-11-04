export const formatDate = (time: number, withTime: boolean) => {
  if (!time) {
    return '';
  }
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'full',
    timeStyle: withTime ? 'short' : undefined,
  }).format(new Date(time));
};
