import { render, screen } from '@testing-library/react';
import { ContactOutcome } from 'types/pearl';
import { describe, expect, it } from 'vitest';
import { ContactOutcomeDisplay } from './ContactOutcomeDisplay';

describe('ContactOutcomeDisplay', () => {
  it('should not render anything if contact is undefined', () => {
    const { container } = render(<ContactOutcomeDisplay />);
    expect(container.innerHTML).toBe('');
  });

  it('should not render anything if contact type is missing', () => {
    const { container } = render(
      <ContactOutcomeDisplay contact={{ date: 1736002414160 } as unknown as ContactOutcome} />
    );
    expect(container.innerHTML).toBe('');
  });

  it('should render the contact outcome details correctly', () => {
    const contact = {
      type: 'IMP',
      date: 1736002414160,
    } as unknown as ContactOutcome;

    render(<ContactOutcomeDisplay contact={contact} />);
    screen.getByText('Impossible to reach');
    screen.getByText('Saturday, January 4, 2025');
  });
});
