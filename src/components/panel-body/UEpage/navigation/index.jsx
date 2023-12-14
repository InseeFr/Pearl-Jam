import React from 'react';
import Navigation from './component';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export default props => {
  let location = useLocation();
  let navigate = useNavigate();
  let params = useParams();
  return <Navigation {...props} router={{ location, navigate, params }} />;
};
