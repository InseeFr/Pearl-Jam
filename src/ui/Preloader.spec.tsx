import { render, screen } from '@testing-library/react';
import { describe, it } from 'vitest';
import { PearlTheme } from './PearlTheme';
import { Preloader } from './Preloader';
import D from 'i18n';

const renderWithTheme = (ui: React.ReactElement) => render(<PearlTheme>{ui}</PearlTheme>);

describe('Preloader Component', () => {
  it('renders the Preloader component correctly', () => {
    const message = 'Loading data...';

    renderWithTheme(<Preloader message={message} />);

    screen.getByRole('heading', { name: D.pleaseWait, level: 2, hidden: true });
    screen.getByRole('heading', { name: D.message, level: 3, hidden: true });
    screen.getByRole('progressbar', { hidden: true });
  });
});
