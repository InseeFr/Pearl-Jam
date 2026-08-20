import { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SurveyUnitRow } from './SurveyUnitRow';
import {
  getprivilegedPerson,
  getSuTodoState,
  isSelectable,
  getSortedContactAttempts,
  getCommentByType,
  formatLastMailInfo,
  getLastSubmittedCommunication,
} from 'utils/functions';

vi.mock('utils/functions', () => ({
  getprivilegedPerson: vi.fn(),
  getSuTodoState: vi.fn(),
  isSelectable: vi.fn(),
  getSortedContactAttempts: vi.fn(),
  getCommentByType: vi.fn(),
  formatLastMailInfo: vi.fn(),
  getLastSubmittedCommunication: vi.fn(),
}));

vi.mock('utils/functions/contacts/ContactAttempt', () => ({
  findContactAttemptLabelByValue: (v: string) => `status-${v}`,
  findMediumLabelByValue: (v: string) => `medium-${v}`,
}));

vi.mock('utils/functions/contacts/ContactOutcome', () => ({
  findContactOutcomeLabelByValue: (v: string) => `outcome-${v}`,
}));

vi.mock('utils/functions/date', () => ({
  formatDate: (d: string) => `date-${d}`,
}));

vi.mock('utils/hooks/useToggle', () => ({
  useToggle: (initial: boolean) => {
    const [state, setState] = useState(initial);
    return [state, () => setState(s => !s)];
  },
}));

vi.mock('ui/StatusChip', () => ({
  StatusChip: ({ status }: { status: string }) => <div data-testid="status-chip">{status}</div>,
}));

vi.mock('ui/PaperIconButton', () => ({
  PaperIconButton: ({ onClick, children }: any) => (
    <button data-testid="add-comment-button" onClick={onClick}>
      {children}
    </button>
  ),
}));

vi.mock('ui/SurveyUnit/CommentDialog', () => ({
  CommentDialog: ({ open }: { open: boolean }) =>
    open ? <div data-testid="comment-dialog-open" /> : null,
}));

const baseSurveyUnit = { id: 'su1' } as any;

function renderRow(surveyUnit = baseSurveyUnit) {
  return render(
    <MemoryRouter>
      <table>
        <tbody>
          <SurveyUnitRow surveyUnit={surveyUnit} />
        </tbody>
      </table>
    </MemoryRouter>
  );
}

describe('SurveyUnitRow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (getprivilegedPerson as any).mockReturnValue({ firstName: 'John', lastName: 'doe' });
    (getSuTodoState as any).mockReturnValue('TODO');
    (isSelectable as any).mockReturnValue(true);
    (getSortedContactAttempts as any).mockReturnValue([]);
    (getCommentByType as any).mockReturnValue(undefined);
    (formatLastMailInfo as any).mockReturnValue('mail-info');
    (getLastSubmittedCommunication as any).mockReturnValue(undefined);
  });

  it('renders a link with the survey unit id when selectable', () => {
    renderRow();
    const link = screen.getByRole('link', { name: '#su1' });
    expect(link.getAttribute('href')).toBe('/survey-unit/su1/details');
  });

  it('renders plain text (no link) when not selectable', () => {
    (isSelectable as any).mockReturnValue(false);
    renderRow();
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.getByText('#su1')).toBeTruthy();
  });

  it('uses displayName over id when available', () => {
    renderRow({ ...baseSurveyUnit, displayName: 'DISPLAY1' });
    expect(screen.getByText('#DISPLAY1')).toBeTruthy();
  });

  it('renders the privileged person name with uppercase last name', () => {
    renderRow();
    expect(screen.getByText('DOE John')).toBeTruthy();
  });

  it('renders the status chip with the computed state', () => {
    renderRow();
    expect(screen.getByTestId('status-chip').textContent).toBe('TODO');
  });

  it('renders formatted last mail info', () => {
    renderRow();
    expect(screen.getByText('mail-info')).toBeTruthy();
  });

  it('renders nothing for contact attempt column when there is none', () => {
    renderRow();
    expect(screen.queryByText(/^status-/)).toBeNull();
  });

  it('renders contact outcome details when present', () => {
    renderRow({
      ...baseSurveyUnit,
      contactOutcome: { type: 'REFUSAL', date: '2024-02-02' },
    });
    expect(screen.getByText('outcome-REFUSAL')).toBeTruthy();
    expect(screen.getByText('date-2024-02-02')).toBeTruthy();
  });

  it('shows the add-comment button and opens the dialog on click when no comment exists', () => {
    renderRow();
    expect(screen.queryByTestId('comment-dialog-open')).toBeNull();
    fireEvent.click(screen.getByTestId('add-comment-button'));
    expect(screen.getByTestId('comment-dialog-open')).toBeTruthy();
  });

  it('shows the comment text and opens the dialog on click when a comment exists', () => {
    (getCommentByType as any).mockReturnValue('Some comment');
    renderRow();
    expect(screen.queryByTestId('add-comment-button')).toBeNull();
    fireEvent.click(screen.getByText('Some comment'));
    expect(screen.getByTestId('comment-dialog-open')).toBeTruthy();
  });
});
