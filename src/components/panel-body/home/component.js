import React, { useState } from 'react';

import LateralMenu from '../lateralMenu';
import Navigation from 'components/common/navigation/component';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import UEPage from 'components/panel-body/UEpage';
import UESPage from 'components/panel-body/UESpage';
import { version } from '../../../../package.json';

const Home = ({ location, match }) => {
  const [textSearch, setTextSearch] = useState('');
  const [openDrawer, setOpenDrawer] = useState(false);

  return (
    <div>
      <Navigation
        location={location}
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
    </div>
  );
};

export default Home;
Home.propTypes = {
  match: PropTypes.shape({ url: PropTypes.string.isRequired }).isRequired,
  location: PropTypes.shape({}).isRequired,
};
