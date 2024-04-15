import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TimeIcon from './TimeIcon';

describe('TimeIcon Component', () => {
  it('should render the TimeIcon component', () => {
    render(<TimeIcon />);
    const timeIcon = screen.getByTestId('time-icon');
    expect(timeIcon).toBeInTheDocument();
  });

  it('should have the correct styles', () => {
    render(<TimeIcon />);
    const timeIcon = screen.getByTestId('time-icon');
    expect(timeIcon).toHaveStyle(`
      color: #FD8A02;
      width: 15px;
      height: 15px;
      margin-left: 5px;
    `);
  });
});