import React, { useState } from 'react';

import LateralMenu from '../lateralMenu';
import Navigation from 'components/common/navigation/component';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import UEPage from 'components/panel-body/UEpage';
import UESPage from 'components/panel-body/UESpage';
import { UserProvider } from './UserContext';
import { version } from '../../../../package.json';

const Home = ({ match }) => {
  const [textSearch, setTextSearch] = useState('');
  const [openDrawer, setOpenDrawer] = useState(false);
  // TODO : use indexedDB user info retrieved with synchronization
  const user = {
    civility: 'MISS',
    firstName: 'Int',
    lastName: 'Erviewer',
    email: 'int.erviewer@mai.il',
    phoneNumber: '0123456789',
  };

  return (
    <div>
      <UserProvider value={user}>
        <Navigation
          textSearch={textSearch}
          setTextSearch={setTextSearch}
          setOpenDrawer={setOpenDrawer}
        />
        <LateralMenu openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} version={version} />

        <Route path="/survey-unit/:id" render={routeProps => <UEPage {...routeProps} />} />
        <Route
          exact
          path={`${match.url}`}
          render={routeProps => <UESPage {...routeProps} textSearch={textSearch} />}
        />
      </UserProvider>
    </div>
  );
};

export default Home;
Home.propTypes = {
  match: PropTypes.shape({ url: PropTypes.string.isRequired }).isRequired,
  location: PropTypes.shape({}).isRequired,
};
