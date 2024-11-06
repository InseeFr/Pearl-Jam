import { render, screen } from '@testing-library/react';
import { SyncContext } from 'ui/Sync/SyncContextProvider';
import { Notification } from './Notification';

vi.mock('@mui/material/Button', () => ({
  default: props => <button {...props}>{props.children}</button>,
}));

const renderWithContext = notification => {
  return render(
    <SyncContext.Provider value={{}}>
      <Notification notification={notification} />
    </SyncContext.Provider>
  );
};

describe('Notification Component', () => {
  it('should render the notification with the correct date format', () => {
    vi.setSystemTime(new Date(2023, 0, 2));

    const mockDate = new Date(2023, 0, 1);
    const notification = { date: mockDate, messages: ['New message'], read: true };

    renderWithContext(notification);

    screen.getByText('New message');
    screen.getByText('1 day ago');

    vi.useRealTimers();
  });
});
