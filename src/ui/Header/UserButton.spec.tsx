import { fireEvent, render, screen } from '@testing-library/react';
import D from 'i18n';
import { describe, it, vi } from 'vitest';
import * as useUserHook from '../../utils/hooks/useUser';
import { UserButton } from './UserButton';

describe('UserButton Component', () => {
  it('should render the profile button with correct title', () => {
    render(<UserButton />);

    screen.getByTitle(D.myProfile);
  });

  it('should display user information inside the popover', () => {
    vi.spyOn(useUserHook, 'useUser').mockReturnValue({
      user: {
        lastName: 'Doe',
        firstName: 'John',
        email: 'john.doe@example.com',
        phoneNumber: '1234567890',
        title: 'Mr',
      },
    });

    render(<UserButton />);

    const button = screen.getByTitle(D.myProfile);
    fireEvent.click(button);

    screen.getByText(`Doe`);
    screen.getByText(`John`);
    screen.getByText(`john.doe@example.com`);
    screen.getByText(`1234567890`);
  });
});
