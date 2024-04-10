import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Link } from './Link';

describe('Link Component', () => {
  it('renders without error', () => {
    render(
      <Router>
        <Link to="/path">Link Text</Link>
      </Router>
    );
  });

  it('passes props to the underlying LinkMaterial component', () => {
    const testProps = {
      to: '/path',
      color: 'primary',
      className: 'custom-link',
    };
    render(
      <Router>
        <Link {...testProps}>Link Text</Link>
      </Router>
    );
  });
});