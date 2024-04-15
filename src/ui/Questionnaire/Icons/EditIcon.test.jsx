import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditIcon from './EditIcon';

describe('EditIcon Component', () => {
  it('should render the EditIcon component', () => {
    render(<EditIcon />);
    const editIcon = screen.getByTestId('edit-icon');
    expect(editIcon).toBeInTheDocument();
  });

  it('should have the correct class', () => {
    render(<EditIcon />);
    const editIcon = screen.getByTestId('edit-icon');
    expect(editIcon).toHaveClass('MuiSvgIcon-root');
  });
});
