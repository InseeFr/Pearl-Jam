import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PearlTheme } from './pearlTheme';
import { SearchField } from './SearchField';
import D from '../i18n/build-dictionary';
import jest from 'jest-mock';


describe('SearchField Component', () => {
  const renderWithTheme = (component) => {
    return render(<PearlTheme>{component}</PearlTheme>);
  };

  it('renders correctly with provided placeholder and initial value', () => {
    const handleChange = jest.fn();
    renderWithTheme(<SearchField onChange={handleChange} value="Test" />);

    const input = screen.getByPlaceholderText(D.placeholderSearchHome);
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('Test');
  });

  it('calls onChange when the input changes', () => {
    const handleChange = jest.fn();
    renderWithTheme(<SearchField onChange={handleChange} value="" />);

    const input = screen.getByPlaceholderText(D.placeholderSearchHome);
    fireEvent.change(input, { target: { value: 'New search' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith('New search');
  });

  it('displays the SearchIcon as an adornment', () => {
    renderWithTheme(<SearchField onChange={() => {}} value="" />);
    const icon = screen.getByTestId('SearchIcon');
    expect(icon).toBeInTheDocument();
  });
});
