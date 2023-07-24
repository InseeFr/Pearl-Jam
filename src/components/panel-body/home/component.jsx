import React, { useState, useEffect, useMemo, useRef } from 'react';

import LateralMenu from '../lateralMenu';
import Navigation from 'components/common/navigation/component';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import UEPage from 'components/panel-body/UEpage';
import UESPage from 'components/panel-body/UESpage';
import userIdbService from 'utils/indexeddb/services/user-idb-service';
import { UserProvider } from './UserContext';
import { version } from '../../../../package.json';
import { DEFAULT_USER_DATA } from 'utils/constants';

const Home = ({ match }) => {
  const [textSearch, setTextSearch] = useState('');
  const [openDrawer, setOpenDrawer] = useState(false);
  const [user, setUser] = useState(DEFAULT_USER_DATA);

  // prevent double run on strict mode
  const isUser = useRef(false);
  // prevent setting user if unmounted
  let isMounted = true;
  useEffect(async () => {
    if (isUser.current) {
      return;
    }
    const getUser = async () => {
      const idbUsers = await userIdbService.getAll();
      const onlyUser = idbUsers?.[0];
      return onlyUser;
    };
    const myUser = await getUser();
    if (isMounted) {
      setUser(myUser);
    }
    isUser.current = true;
    return () => (isMounted = false);
  }, []);

  const memoUser = useMemo(() => user, [user]);

  return (
    <div>
      <UserProvider value={memoUser}>
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
};
