import { ThemeProvider, createTheme } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import { describe, it } from 'vitest';
import { ToDoEnumValues } from '../utils/enum/SUToDoEnum';
import { StatusChip } from './StatusChip';

describe('StatusChip', () => {
  it.only('renders correctly with the given status', () => {
    const theme = createTheme({
      palette: {
        primary: {
          main: '#123456',
        },
      },
    });

    // Mock status
    const mockStatus = {
      value: 'Completed',
      color: '#00FF00',
    } as ToDoEnumValues;

    render(
      <ThemeProvider theme={theme}>
        <StatusChip status={mockStatus} />
      </ThemeProvider>
    );

    const chipElement = screen.getByText('Completed');
  });
});
