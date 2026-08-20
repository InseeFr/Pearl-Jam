import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TrackingPage } from './TrackingPage';

// Mock data hook
const mockSurveyUnits = [
  { id: '1', campaign: 'campaign2023' },
  { id: '2', campaign: 'campaign2024' },
];
vi.mock('../utils/hooks/database', () => ({
  useSurveyUnits: () => mockSurveyUnits,
}));

// Mock i18n
vi.mock('i18n', () => ({
  default: {
    goToMyTracking: 'My tracking',
    trackingSelect: 'Select campaign',
    trackingSearchField: 'Search',
    trackingToggleAria: 'toggle',
    allSurveys: 'All surveys',
    unitsTrackingBySurvey: 'By survey',
  },
}));

// Mock child views so we test Component's own logic in isolation
vi.mock('./StatsTracking', () => ({
  StatsTracking: () => <div data-testid="stats-tracking" />,
}));
vi.mock('./TableTracking', () => ({
  TableTracking: ({ campaign, searchText }: { campaign: string; searchText: string }) => (
    <div data-testid="table-tracking">
      {campaign}:{searchText}
    </div>
  ),
}));

describe('Tracking Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the stats view by default', () => {
    render(<TrackingPage />);
    expect(screen.getByTestId('stats-tracking')).toBeTruthy();
    expect(screen.queryByTestId('table-tracking')).toBeNull();
  });

  it('switches to the table view when the "By survey" tab is clicked', () => {
    render(<TrackingPage />);
    fireEvent.click(screen.getByText('By survey'));
    expect(screen.getByTestId('table-tracking')).toBeTruthy();
    expect(screen.queryByTestId('stats-tracking')).toBeNull();
  });

  it('shows campaign select and search field only in table view', () => {
    render(<TrackingPage />);
    expect(screen.queryByLabelText('Search')).toBeNull();

    fireEvent.click(screen.getByText('By survey'));
    expect(screen.queryByLabelText('Search')).not.toBeNull();
  });

  it('updates search text and passes it to TableTracking', () => {
    render(<TrackingPage />);
    fireEvent.click(screen.getByText('By survey'));

    const input = screen.getByLabelText('Search');
    fireEvent.change(input, { target: { value: 'unit42' } });

    expect(screen.getByTestId('table-tracking').textContent).toContain('unit42');
  });

  it('restores the campaign from localStorage on mount', () => {
    localStorage.setItem('selectedCampaign', 'campaign2023');
    render(<TrackingPage />);
    fireEvent.click(screen.getByText('By survey'));

    expect(screen.getByTestId('table-tracking').textContent).toContain('campaign2023');
  });

  it('resets the campaign when the reset icon button is clicked', () => {
    localStorage.setItem('selectedCampaign', 'campaign2023');
    render(<TrackingPage />);
    fireEvent.click(screen.getByText('By survey'));

    fireEvent.click(screen.getByLabelText('reset'));
    expect(screen.getByTestId('table-tracking').textContent).toContain(':');
    expect(localStorage.getItem('selectedCampaign')).toBe('');
  });
});
