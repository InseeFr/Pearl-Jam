import { Palette, ThemeProvider, createTheme } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import { describe, it } from 'vitest';
import { ToDoEnumValues } from '../utils/enum/SUToDoEnum';
import { StatusChip } from './StatusChip';

describe('StatusChip', () => {
  it('renders correctly with the given status', () => {
    const theme = createTheme({
      palette: {
        primary: {
          main: '#123456',
        },
      } as Palette,
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

    screen.getByText('Completed');
  });
});
