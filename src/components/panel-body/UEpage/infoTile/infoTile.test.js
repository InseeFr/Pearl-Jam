import { MemoryRouter, Route } from 'react-router';

import InfoTile from './infoTile';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { render } from '@testing-library/react';

jest.mock('indexedbb/services/surveyUnit-idb-service', () => {
  const originalModule = jest.requireActual('indexedbb/services/surveyUnit-idb-service');
  const suIdbService = originalModule.default;
  suIdbService.getById = async () => {
    return Promise.resolve({
      persons: [{ firstName: 'FirstName', lastName: 'LastName', privileged: true }],
      campaign: 'Mocked campaign',
      sampleIdentifiers: { ssech: '1' },
    });
  };
  originalModule.default = suIdbService;
  return {
    __esModule: true,
    ...originalModule,
  };
});

const SuIdbService = require('indexedbb/services/surveyUnit-idb-service');

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
  const result = customRender(<InfoTile refresh={true} />);
  await act(async () => {
    await wait();
  });
  expect(result.baseElement).toMatchSnapshot();

  const { getById } = SuIdbService.default;
  // check if mock is done
  await expect(getById(5)).resolves.toStrictEqual({
    persons: [{ firstName: 'FirstName', lastName: 'LastName', privileged: true }],
    campaign: 'Mocked campaign',
    sampleIdentifiers: { ssech: '1' },
  });
});
