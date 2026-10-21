import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PersonsForm } from './PersonsForm';
import D from '../../i18n/build-dictionary';
import { surveyUnitIDBService } from '../../utils/indexeddb/services/surveyUnit-idb-service';
import { LocalSurveyUnit, SurveyUnitPerson } from 'types/pearl';

// --- persistence ---
vi.mock('../../utils/indexeddb/services/surveyUnit-idb-service', () => ({
  surveyUnitIDBService: { addOrUpdate: vi.fn() },
}));

// --- FieldRow: fields are not under test here, form keeps its default values ---
vi.mock('ui/FieldRow', () => ({
  FieldRow: () => null,
}));

const person: SurveyUnitPerson = {
  id: 1,
  title: 'MISTER',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@doe.fr',
  birthdate: 0,
  favoriteEmail: false,
  privileged: true,
  phoneNumbers: [],
};

const baseSurveyUnit = {
  id: 'su-1',
  persons: [person],
  hasBeenUpdated: false,
} as any as LocalSurveyUnit

describe('PersonsForm', () => {
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('persists the persons and flags the survey unit as updated on submit', async () => {
    render(
      <PersonsForm
        surveyUnit={baseSurveyUnit}
        persons={[person]}
        personToModifyIndex={0}
        onClose={onClose}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: D.saveButton }));

    await waitFor(() => {
      expect(surveyUnitIDBService.addOrUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'su-1',
          persons: [person],
          hasBeenUpdated: true,
        })
      );
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes without persisting when cancel is clicked', () => {
    render(
      <PersonsForm
        surveyUnit={baseSurveyUnit}
        persons={[person]}
        personToModifyIndex={0}
        onClose={onClose}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: D.cancelButton }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(surveyUnitIDBService.addOrUpdate).not.toHaveBeenCalled();
  });
});
