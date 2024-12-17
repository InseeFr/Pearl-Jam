import { fireEvent, render, screen } from '@testing-library/react';
import { SyncContext } from 'ui/Sync/SyncContextProvider';
import { Notification } from './Notification';
import D from 'i18n';
import { describe, it, vi } from 'vitest';
import { Notification as NotificationType } from 'types/pearl';
import { ComponentPropsWithRef } from 'react';

vi.mock('@mui/material/Button', () => ({
  default: (props: ComponentPropsWithRef<'button'>) => <button {...props}>{props.children}</button>,
}));

const renderWithContext = (notification: NotificationType) => {
  return render(
    <SyncContext.Provider value={{}}>
      <Notification notification={notification} onExit={vi.fn()} />
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
    } as unknown as NotificationType;

    renderWithContext(notification);

    screen.getByText('New message');
    screen.getByText('1 day ago');

    const button = screen.getByRole('button', { name: 'Notification 1 day ago' });
    fireEvent.click(button);

    screen.getByRole('button', { name: D.delete });

    vi.useRealTimers();
  });
});
