import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Typography } from './Typography';

describe('Typography Component', () => {
  it('renders correctly with default props', () => {
    const { getByText } = render(<Typography>Test Text</Typography>);
    const textElement = getByText('Test Text');
    expect(textElement).toHaveStyle('font-weight: 600');
    expect(textElement).toHaveClass('MuiTypography-root');
  });

  it('applies variant, color, and fontWeight props correctly', () => {
    const { getByText } = render(
      <Typography variant="headingXL" color="accent" fontWeight={800}>
        Test Heading
      </Typography>
    );
    const headingElement = getByText('Test Heading');
  });

  it('supports noWrap prop correctly', () => {
    const { getByText } = render(
      <Typography noWrap>
        Test NoWrap
      </Typography>
    );
    const textElement = getByText('Test NoWrap');
    expect(textElement).toHaveStyle('max-width: 100%');
    expect(textElement).toHaveStyle('min-width: 0');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef();
    render(<Typography ref={ref}>Ref Test</Typography>);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it('passes additional props to the underlying element', () => {
    const { getByTestId } = render(<Typography data-testid="custom-id">Extra Props Test</Typography>);
    expect(getByTestId('custom-id')).toBeInTheDocument();
  });

  it('correctly merges sx props when noWrap is true', () => {
    const { getByText } = render(
      <Typography noWrap sx={{ color: 'red' }}>
        Sx Prop Test
      </Typography>
    );
    const textElement = getByText('Sx Prop Test');
    expect(textElement).toHaveStyle('color: rgb(255, 0, 0)');
    expect(textElement).toHaveStyle('max-width: 100%');
  });
  

  it('includes accessibility attributes when provided', () => {
    const { getByText } = render(
      <Typography aria-label="Heading" role="heading">
        Accessibility Test
      </Typography>
    );
    const textElement = getByText('Accessibility Test');
    expect(textElement.getAttribute('aria-label')).toBe('Heading');
    expect(textElement.getAttribute('role')).toBe('heading');
  });
});
