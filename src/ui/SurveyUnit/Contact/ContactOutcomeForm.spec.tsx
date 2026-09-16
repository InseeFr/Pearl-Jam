// src/ui/SurveyUnit/Contact/ContactOutcomeForm.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useController } from 'react-hook-form';
import { ContactOutcomeForm } from './ContactOutcomeForm';
import { addNewState, persistSurveyUnit } from 'utils/functions';
import { surveyUnitStateEnum } from 'utils/enum/SUStateEnum';

// --- i18n ---
vi.mock('i18n', () => ({
  default: {
    contactOutcome: 'Contact outcome',
    totalNumberOfContactAttempts: 'Number of attempts',
    cancelButton: 'Cancel',
    saveButton: 'Save',
  },
}));

// --- state enum (kept minimal, matches usage in component) ---
vi.mock('utils/enum/SUStateEnum', () => ({
  surveyUnitStateEnum: {
    WAITING_FOR_TRANSMISSION: { type: 'WAITING_FOR_TRANSMISSION' },
    APPOINTMENT_MADE: { type: 'APPOINTMENT_MADE' },
  },
}));

// --- persistence helpers ---
vi.mock('utils/functions', () => ({
  addNewState: vi.fn(() => ['mocked-state']),
  persistSurveyUnit: vi.fn(),
}));

// --- contact outcome config ---
vi.mock('utils/functions/contacts/ContactOutcome', () => {
  const contactOutcomes = {
    INTERVIEW_ACCEPTED: { value: 'INTERVIEW_ACCEPTED', label: 'Interview accepted' },
    NOT_APPLICABLE: { value: 'NOT_APPLICABLE', label: 'Not applicable' },
    REFUSAL: { value: 'REFUSAL', label: 'Refusal' },
  };
  return {
    contactOutcomes,
    getContactOutcomeByConfiguration: vi.fn(() => contactOutcomes),
  };
});

// --- FieldRow: real react-hook-form wiring, simplified markup ---
vi.mock('ui/FieldRow', () => ({
  FieldRow: ({ control, name, options, type, label }: any) => {
    const { field } = useController({ control, name });

    if (type === 'radiostack') {
      return (
        <div>
          {options.map((o: any) => (
            <label key={o.value}>
              <input
                type="radio"
                name={name}
                value={o.value}
                checked={field.value === o.value}
                onChange={() => field.onChange(o.value)}
              />
              {o.label}
            </label>
          ))}
        </div>
      );
    }

    return (
      <input
        aria-label={label ?? name}
        type="number"
        value={field.value ?? 0}
        onChange={e => field.onChange(Number(e.target.value))}
      />
    );
  },
}));

const baseSurveyUnit: any = {
  id: 'su-1',
  states: [],
  contactOutcomeConfiguration: {},
  contactOutcome: undefined,
};

describe('ContactOutcomeForm', () => {
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the title, outcome options and actions', () => {
    render(<ContactOutcomeForm surveyUnit={baseSurveyUnit} onClose={onClose} />);

    expect(screen.getByText('Contact outcome')).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Interview accepted' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Not applicable' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Refusal' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('disables save when no outcome type is selected', () => {
    render(<ContactOutcomeForm surveyUnit={baseSurveyUnit} onClose={onClose} />);

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
  });

  it('keeps save disabled for a normal type with an invalid attempt count', () => {
    render(<ContactOutcomeForm surveyUnit={baseSurveyUnit} onClose={onClose} />);

    fireEvent.click(screen.getByRole('radio', { name: 'Refusal' }));

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
  });

  it('enables save for NOT_APPLICABLE even with a zero attempt count', () => {
    render(<ContactOutcomeForm surveyUnit={baseSurveyUnit} onClose={onClose} />);

    fireEvent.click(screen.getByRole('radio', { name: 'Not applicable' }));

    expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();
  });

  it('enables save for a normal type once the attempt count is positive', () => {
    render(<ContactOutcomeForm surveyUnit={baseSurveyUnit} onClose={onClose} />);

    fireEvent.click(screen.getByRole('radio', { name: 'Refusal' }));
    fireEvent.change(screen.getByLabelText('Number of attempts'), { target: { value: '2' } });

    expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();
  });

  it('closes without persisting when cancel is clicked', () => {
    render(<ContactOutcomeForm surveyUnit={baseSurveyUnit} onClose={onClose} />);

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(persistSurveyUnit).not.toHaveBeenCalled();
  });

  it('persists the survey unit and moves to WAITING_FOR_TRANSMISSION by default', async () => {
    render(<ContactOutcomeForm surveyUnit={baseSurveyUnit} onClose={onClose} />);

    fireEvent.click(screen.getByRole('radio', { name: 'Refusal' }));
    fireEvent.change(screen.getByLabelText('Number of attempts'), { target: { value: '3' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(addNewState).toHaveBeenCalledWith(
        baseSurveyUnit,
        surveyUnitStateEnum.WAITING_FOR_TRANSMISSION.type
      );
    });

    expect(persistSurveyUnit).toHaveBeenCalledWith(
      expect.objectContaining({
        states: ['mocked-state'],
        hasBeenUpdated: true,
        contactOutcome: expect.objectContaining({
          type: 'REFUSAL',
          totalNumberOfContactAttempts: 3,
        }),
      })
    );
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('moves to APPOINTMENT_MADE when the outcome is INTERVIEW_ACCEPTED', async () => {
    render(<ContactOutcomeForm surveyUnit={baseSurveyUnit} onClose={onClose} />);

    fireEvent.click(screen.getByRole('radio', { name: 'Interview accepted' }));
    fireEvent.change(screen.getByLabelText('Number of attempts'), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(addNewState).toHaveBeenCalledWith(
        baseSurveyUnit,
        surveyUnitStateEnum.APPOINTMENT_MADE.type
      );
    });
  });
});
