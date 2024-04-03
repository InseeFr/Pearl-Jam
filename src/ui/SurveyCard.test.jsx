import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { SurveyCard } from './SurveyCard';

const testTheme = createTheme({
  palette: {
    textPrimary: {
      main: '#000000',
    },
    grey: {
      100: '#f5f5f5',
      600: '#757575',
    },
    separator: {
      main: '#CCCCCC',
    },
  },
});

const mockSurveyUnit = {
  id: '123',
  address: { l6: '123 Main Street' },
  campaign: 'Test Campaign',
  priority: false,
  persons: [{ firstName: 'John', lastName: 'Doe' }],
  sampleIdentifiers: { ssech: 'SSECH123', nograp: 'NOGRAP123' },
};

describe('SurveyCard Component', () => {
  it('renders without errors', () => {
    render(
      <ThemeProvider theme={testTheme}>
        <SurveyCard surveyUnit={mockSurveyUnit} />
      </ThemeProvider>
    );
    expect(screen.getByText(/test campaign/i)).toBeInTheDocument();
  });

  it('displays the privileged person name', () => {
    render(
      <ThemeProvider theme={testTheme}>
        <SurveyCard surveyUnit={mockSurveyUnit} />
      </ThemeProvider>
    );
    expect(screen.getByText(/doe john/i)).toBeInTheDocument();
  });

  it('handles priority correctly', () => {
    const { rerender } = render(
      <ThemeProvider theme={testTheme}>
        <SurveyCard surveyUnit={mockSurveyUnit} />
      </ThemeProvider>
    );
    expect(screen.queryByText(/prioritaire/i)).not.toBeInTheDocument();
    const surveyUnitWithPriority = { ...mockSurveyUnit, priority: true };
    rerender(
      <ThemeProvider theme={testTheme}>
        <SurveyCard surveyUnit={surveyUnitWithPriority} />
      </ThemeProvider>
    );
    expect(screen.getByText(/prioritaire/i)).toBeInTheDocument();
  });
  
  it('does not show lock icon when locked is false', () => {
    render(
      <ThemeProvider theme={testTheme}>
        <SurveyCard surveyUnit={mockSurveyUnit} locked={false} />
      </ThemeProvider>
    );
    const lockIcon = screen.queryByTestId('lockIcon');
    expect(lockIcon).not.toBeInTheDocument();
  });
  });
