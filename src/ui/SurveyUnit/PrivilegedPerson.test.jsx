import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PrivilegedPerson } from './PrivilegedPerson';

describe('PrivilegedPerson Component', () => {
  const surveyUnit = {
    id: 1,
    lastName: 'Doe',
    firstName: 'John'
  };

  it('renders the person name correctly', () => {
    render(<PrivilegedPerson surveyUnit={surveyUnit} />);
    const personName = screen.getByTestId('personName');
    expect(personName).toBeInTheDocument();
  });

  it('renders the survey unit ID correctly', () => {
    render(<PrivilegedPerson surveyUnit={surveyUnit} />);
    const surveyUnitId = screen.getByText('#1');
    expect(surveyUnitId).toBeInTheDocument();
  });
});