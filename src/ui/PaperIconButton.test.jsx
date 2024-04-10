import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import jest from 'jest-mock';
import { PearlTheme } from './pearlTheme';
import { PaperIconButton } from './PaperIconButton';

describe('PaperIconButton Component', () => {
  const renderWithTheme = (component) => {
    return render(<PearlTheme>{component}</PearlTheme>);
  };

  it('renders correctly with default styles', () => {
    renderWithTheme(<PaperIconButton />);
    const button = screen.getByRole('button', { name: "delete" });
    const computedStyle = window.getComputedStyle(button);
  
    expect(computedStyle.width).toBe('24px');
    expect(computedStyle.height).toBe('24px');
    expect(computedStyle.display).toBe('inline-block');
    expect(computedStyle.padding).toBe('2px');
    expect(computedStyle.backgroundColor).toBe('rgb(230, 234, 240)');
  });
  
  it('changes background color on hover', () => {
    renderWithTheme(<PaperIconButton />);
    const button = screen.getByRole('button', { name: "delete" });
    button.style.backgroundColor = 'rgb(240, 241, 242)';
    expect(button).toHaveStyle('background-color: rgb(240, 241, 242)');
  });

  it('passes additional props to the button element', () => {
    const handleClick = jest.fn();
    renderWithTheme(<PaperIconButton onClick={handleClick} />);
    const button = screen.getByRole('button', { name: "delete" });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
