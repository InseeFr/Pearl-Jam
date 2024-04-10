import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RadioLine } from './RadioLine'; 
import { PearlTheme } from './pearlTheme';

describe('RadioLine Component', () => {
  it('renders correctly with label and is not disabled', () => {
    const label = "Test Radio";
    const value = "testValue";
    render(
      <PearlTheme>
        <RadioLine label={label} disabled={false} value={value} />
      </PearlTheme>
    );
    const radio = screen.getByLabelText(label);

    expect(radio).toBeInTheDocument();
    expect(radio).toBeEnabled();
  });

  it('is disabled when disabled prop is true', () => {
    const label = "Disabled Radio";
    const value = "disabledValue";
    render(
      <PearlTheme>
        <RadioLine label={label} disabled={true} value={value} />
      </PearlTheme>
    );
    const radio = screen.getByLabelText(label);

    expect(radio).toBeDisabled();
  });

  it('applies style correctly', () => {
    const label = "Styled Radio";
    const value = "styledValue";
    render(
      <PearlTheme>
        <RadioLine label={label} disabled={false} value={value} />
      </PearlTheme>
    );
    const formControlLabel = screen.getByText(label).closest('label');

    expect(formControlLabel).toHaveStyle({
      'background-color': '#F5F7FA',
      'padding': '8px',
      'margin': '0',
      'gap': '24px',
      'position': 'relative'
    });
  });
});
