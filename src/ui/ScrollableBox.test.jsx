import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PearlTheme } from './pearlTheme';
import { ScrollableBox } from './ScrollableBox';

describe('ScrollableBox Component', () => {
  const renderWithTheme = (component) => {
    return render(<PearlTheme>{component}</PearlTheme>);
  };

  it('applies the correct height and overflow properties', () => {
    renderWithTheme(<ScrollableBox height="300px" />);
    const box = screen.getByTestId('scrollable-box');
    const style = window.getComputedStyle(box);

    expect(style.height).toBe('300px');
    expect(style.overflow).toBe('auto');
  });

  it('correctly applies marginRight and paddingRight', () => {
    renderWithTheme(<ScrollableBox />);
    const box = screen.getByTestId('scrollable-box');
    const style = window.getComputedStyle(box);
  
    expect(style.marginRight).toMatch(/^-?0?\.5rem$/);
    expect(style.paddingRight).toMatch(/^0?\.5rem$/);
  });

  it('overrides styles via sx prop correctly', () => {
    const customStyles = {
      backgroundColor: 'blue',
      padding: '20px'
    };
    renderWithTheme(<ScrollableBox sx={customStyles} />);
    const box = screen.getByTestId('scrollable-box');
    const style = window.getComputedStyle(box);

    expect(style.backgroundColor).toBe('rgb(0, 0, 255)');
    expect(style.padding).toBe('20px');
  });

  it('passes additional props to the underlying Box component', async () => {
    const customTestId = "scrollable-box";
    renderWithTheme(<ScrollableBox data-testid={customTestId} />);
    const box = await screen.findByTestId(customTestId);
    expect(box).toBeInTheDocument();
  });
});
