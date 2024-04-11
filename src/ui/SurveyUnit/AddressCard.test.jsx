import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AddressCard } from './AddressCard';

describe('AddressCard Component', () => {
  const mockSurveyUnit = {
    address: {
      streetName: '123 Main St',
      additionalAddress: 'Apt 4',
      postCode: '12345',
      cityName: 'City',
      locality: 'Locality',
      building: 'Building',
      deliveryPoint: 'Delivery Point',
      floor: 'Floor',
      door: 'Door',
      staircase: 'Staircase',
      elevator: 'Elevator',
      cityPriorityDistrict: 'City Priority District',
    },
  };

  it('should render the address details correctly', () => {
    render(<AddressCard surveyUnit={mockSurveyUnit} />);

    expect(screen.getByText('123 Main St')).toBeInTheDocument();
    expect(screen.getByText('Apt 4')).toBeInTheDocument();
    expect(screen.getByText('12345')).toBeInTheDocument();
    expect(screen.getByText('City')).toBeInTheDocument();
    expect(screen.getByText('Locality')).toBeInTheDocument();
    expect(screen.getByText('Building')).toBeInTheDocument();
    expect(screen.getByText('Delivery Point')).toBeInTheDocument();
    expect(screen.getByText('Floor')).toBeInTheDocument();
    expect(screen.getByText('Door')).toBeInTheDocument();
    expect(screen.getByText('Staircase')).toBeInTheDocument();
    expect(screen.getByText('Elevator')).toBeInTheDocument();
    expect(screen.getByText('City Priority District')).toBeInTheDocument();
  });

  it('should open the address form modal when the edit button is clicked', () => {
    render(<AddressCard surveyUnit={mockSurveyUnit} />);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    expect(screen.getByTestId('address-form')).toBeInTheDocument();
  });
});