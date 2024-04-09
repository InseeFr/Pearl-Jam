import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Accordion } from './Accordion';

describe('Accordion Component', () => {
  it('renders with title and no children when collapsed', () => {
    const titleText = "Test Title";
    render(<Accordion title={titleText} />);

    expect(screen.getByText(titleText)).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
  });

  it('expands/collapses when clicked', () => {
    const titleText = "Test Title";
    const childrenText = "Test Children";
    render(<Accordion title={titleText} defaultOpen={false}>{childrenText}</Accordion>);
  
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(childrenText)).toBeInTheDocument();
  
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText(childrenText)).toBeInTheDocument();
  });  

  it('renders dense variant correctly', () => {
    const titleText = "Test Title";
    const variant = "dense";
    render(<Accordion title={titleText} variant={variant} />);
  
    const details = screen.getByTestId('accordion-details');
    const style = window.getComputedStyle(details);
  
    expect(style.margin).toBe('0px');
    expect(style.paddingTop).toBe('.5rem');
    expect(style.paddingRight).toBe('0px');
    expect(style.paddingBottom).toBe('0px');
    expect(style.paddingLeft).toBe('0px');
  });
  
  it('handles custom properties', () => {
    const testId = "test-accordion";
    render(<Accordion title="Custom Props" data-testid={testId} />);

    const accordion = screen.getByTestId(testId);
    expect(accordion).toBeInTheDocument();
  });
});
