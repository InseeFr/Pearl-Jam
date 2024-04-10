import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PearlTheme } from './pearlTheme';
import { Preloader } from './Preloader';
import D from 'i18n';

describe('Preloader Component', () => {
  const testMessage = "Loading your data...";

  const renderWithTheme = (component) => {
    return render(<PearlTheme>{component}</PearlTheme>);
  };

  it('renders correctly with open backdrop', () => {
    renderWithTheme(<Preloader message={testMessage} />);
    const backdrop = screen.getByTestId('backdrop');
    expect(backdrop).toHaveStyle('color: #FFF');
    expect(backdrop).toBeVisible();
  });

  it('displays a CircularProgress with correct size and color', () => {
    renderWithTheme(<Preloader message={testMessage} />);
    const progress = screen.getByTestId('circularProgress');
    expect(progress).toBeInTheDocument();
    expect(progress).toHaveStyle({
      color: 'rgb(255, 255, 255)',
      width: '6em',
      height: '6em'
    });
  });
  
  it('displays correct static and dynamic text', () => {
    renderWithTheme(<Preloader message={testMessage} />);
    const staticText = screen.getByText(D.pleaseWait);
    const dynamicText = screen.getByText(testMessage);

    expect(staticText).toBeInTheDocument();
    expect(dynamicText).toBeInTheDocument();
    expect(dynamicText).toHaveStyle('opacity: 0.75');
  });
});
