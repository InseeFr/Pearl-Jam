import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import DisturbIcon from './DisturbIcon';

describe('DisturbIcon Component', () => {
  it('renders without crashing', () => {
    render(<DisturbIcon />);
  });
});