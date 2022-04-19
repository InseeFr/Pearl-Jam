import { MemoryRouter, Route } from 'react-router';

import InfoTile from './infoTile';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { render } from '@testing-library/react';

jest.mock('utils/hooks/database', () => ({
  useSurveyUnit: () => ({
    persons: [{ firstName: 'FirstName', lastName: 'LastName', privileged: true }],
    campaign: 'Mocked campaign',
    sampleIdentifiers: { ssech: '1' },
  }),
}));

const dataBaseHooks = require('utils/hooks/database');

const MemoryRouterWithInitialRoutes = ({ children }) => (
  <MemoryRouter initialEntries={['/survey-unit/1']}>
    <Route path="/survey-unit/:id">{children}</Route>
  </MemoryRouter>
);

const customRender = ui => {
  // return render(ui, { wrapper: MemoryRouterWithInitialRoutes });
  return render(ui, { wrapper: MemoryRouterWithInitialRoutes });
};

const wait = async () => new Promise(resolve => setTimeout(resolve, 0));

it('renders correctly', async () => {
  const result = customRender(<InfoTile />);
  await act(async () => {
    await wait();
  });
  expect(result.baseElement).toMatchSnapshot();

  const { useSurveyUnit } = dataBaseHooks;
  // check if mock is done
  await expect(useSurveyUnit(5)).toStrictEqual({
    persons: [{ firstName: 'FirstName', lastName: 'LastName', privileged: true }],
    campaign: 'Mocked campaign',
    sampleIdentifiers: { ssech: '1' },
  });
});
