import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import jest from 'jest-mock';
import '@testing-library/jest-dom';
import { ButtonLine } from './ButtonLine';

describe('ButtonLine Component', () => {
  it('renders with correct label and style when enabled', () => {
    const label = "Test Label";
    render(<ButtonLine label={label} disabled={false} checked={false} />);
    const button = screen.getByRole('button');
  
    expect(button).toHaveTextContent(label);
    expect(button).toHaveStyle({
      paddingTop: '8px',
      paddingBottom: '8px',
      paddingLeft: '16px',
      paddingRight: '16px'
    });
    
  });

  it('renders with correct icons when checked', () => {
    render(<ButtonLine label="Checked Item" disabled={false} checked={true} />);
    const checkIcon = screen.getByTestId('CheckCircleIcon');
    const arrowIcon = screen.getByTestId('KeyboardArrowRightIcon');
  
    expect(checkIcon).toBeInTheDocument();
    expect(arrowIcon).toBeInTheDocument();
  });
  

  it('displays correct styles and is disabled when props disabled is true', () => {
    render(<ButtonLine label="Disabled Button" disabled={true} checked={false} />);

    const button = screen.getByRole('button');
    expect(button).toHaveStyle({
      backgroundColor: 'surfacePrimary.light',
    });
    expect(button).toBeDisabled();
  });

  it('handles custom properties like onClick', () => {
    const onClick = jest.fn();
    render(<ButtonLine label="Clickable" onClick={onClick} />);
    const button = screen.getByText('Clickable');
    fireEvent.click(button);
  
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
