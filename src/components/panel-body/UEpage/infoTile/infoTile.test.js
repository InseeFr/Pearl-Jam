import InfoTile from './infoTile';
import React from 'react';
import { SurveyUnitProvider } from '../UEContext';
import { act } from 'react-dom/test-utils';
import { render } from '@testing-library/react';

jest.mock('utils/hooks/database', () => ({
  useSurveyUnit: () => ({
    id: '1',
    persons: [{ firstName: 'FirstName', lastName: 'LastName', privileged: true }],
    campaign: 'Mocked campaign',
    sampleIdentifiers: { ssech: '1' },
  }),
}));

const dataBaseHooks = require('utils/hooks/database');

const mockSurveyUnit = {
  id: '1',
  persons: [{ firstName: 'FirstName', lastName: 'LastName', privileged: true }],
  campaign: 'Mocked campaign',
  sampleIdentifiers: { ssech: '1' },
};

const wait = async () => new Promise(resolve => setTimeout(resolve, 0));

it('renders correctly', async () => {
  const result = render(
    <SurveyUnitProvider
      value={{
        surveyUnit: mockSurveyUnit,
      }}
    >
      <InfoTile />
    </SurveyUnitProvider>
  );

  await act(async () => {
    await wait();
  });
  expect(result.baseElement).toMatchSnapshot();

  const { useSurveyUnit } = dataBaseHooks;
  // check if mock is done
  await expect(useSurveyUnit(5)).toStrictEqual(mockSurveyUnit);
});
