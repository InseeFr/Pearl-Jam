import { fireEvent, render, screen } from '@testing-library/react';
import { SyncContext } from 'ui/Sync/SyncContextProvider';
import { Notification } from './Notification';
import D from 'i18n';

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
    const notification = {
      title: 'Notification',
      date: mockDate,
      messages: ['New message'],
      read: true,
    };

    renderWithContext(notification);

    screen.getByText('New message');
    screen.getByText('1 day ago');

    const button = screen.getByRole('button', { name: 'Notification 1 day ago' });
    fireEvent.click(button);

    screen.getByRole('button', { name: D.delete });

    vi.useRealTimers();
  });
});
