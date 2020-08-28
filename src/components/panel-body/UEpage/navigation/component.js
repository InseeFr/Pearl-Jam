import React from 'react';
import { NavLink } from 'react-router-dom';
import D from 'i18n';

const Navigation = ({ match }) => {
  return (
    <>
      <nav className="nav-bar-ue">
        <NavLink activeClassName="active" className="item" exact to={`${match.url}/details`}>
          {D.goToContactDetailsPage}
        </NavLink>
        <span
          // activeClassName="active"
          disabled="disabled"
          className="item"
          // exact
          to={`${match.url}/spotting`}
        >
          {D.goToSpottingPage}
        </span>
        <span
          // activeClassName="active"
          disabled="disabled"
          className="item"
          // exact
          to={`${match.url}/mails`}
        >
          {D.goToMailsPage}
        </span>
        <NavLink activeClassName="active" className="item" exact to={`${match.url}/contacts`}>
          {D.goToContactPage}
        </NavLink>
        <NavLink activeClassName="active" className="item" exact to={`${match.url}/comments`}>
          {D.goToCommentsPage}
        </NavLink>
      </nav>
    </>
  );
};

export default Navigation;
