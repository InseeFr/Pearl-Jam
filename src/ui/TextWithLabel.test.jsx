import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TextWithLabel } from './TextWithLabel';

describe('TextWithLabel Component', () => {
  it('renders the label text correctly', () => {
    const labelText = 'Test Label';
    const { getByText } = render(<TextWithLabel label={labelText}>Content</TextWithLabel>);
    expect(getByText(`${labelText} :`)).toBeInTheDocument();
  });

  it('renders CheckOutlinedIcon for true children', () => {
    const { container } = render(<TextWithLabel label="Test True">{true}</TextWithLabel>);
    const checkIcon = container.querySelector('svg');
    if (!checkIcon) {
      throw new Error('CheckOutlinedIcon not found');
    }
    expect(checkIcon).toBeInTheDocument();
  });
  
  it('renders CloseOutlinedIcon for false children', () => {
    const { container } = render(<TextWithLabel label="Test False">{false}</TextWithLabel>);
    const closeIcon = container.querySelector('svg');
    if (!closeIcon) {
      throw new Error('CloseOutlinedIcon not found');
    }
    expect(closeIcon).toBeInTheDocument();
  });
  

  it('displays a dash when children are not provided', () => {
    const { getByText } = render(<TextWithLabel label="No Children" />);
    expect(getByText('-')).toBeInTheDocument();
  });
});
