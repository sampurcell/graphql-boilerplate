/**
 * You will need React for JSX syntax.
 * You will need Component named export
 * if you are creating a React component by extending a class.
 */
import React, { Component } from 'react';

/**
 * Import the two named exports you will need to handler routing in React.
 * Router is a react component that we will wrap the whole App component with,
 * including Apollo's <Query> component, which gets data for the header.
 *
 * @todo - Refactor the Footer so that in can render on every page including the Loading and ErrorMessage.
 * Have it not display user info until we get that from the query.
 */
import { BrowserRouter as Router, Route } from 'react-router-dom';

/**
 * Use this package to define your GraphQL query.
 */
import gql from 'graphql-tag';

/**
 * Import query from React Apollo for writing GraphQL queries in React.
 */
import { Query } from 'react-apollo';

/**
 * Import helper components
 */
import Loading from '../Loading';
import Error from '../Error';

/**
 * Import all routes from the routes.js file
 */
import * as routes from '../../constants/routes';

/**
 * Import application React components
 */
import Navigation from '../Navigation';
import Organization from '../Organization';
import Profile from '../Profile';

/**
 * Define your GraphQL query for this view.
 */
// const GET_HEADER_INFO = gql`
//   {
//     viewer {
//       login
//       name
//     }
//   }
// `;

/**
 * Base Component for your application
 *
 * Contains:
 * header and footer
 * react-router-dom <Router> component
 */
class App extends Component {
  state = {
    organizationName: 'soulcycle',
  };

  onOrganizationSearch = value => {
    this.setState({ organizationName: value });
  };

  render = () => {
    const { organizationName } = this.state;

    /**
     * We wrap our Query component in the Router. We need it for all the requests,
     * so leave query wrapped around other JSX and React components.
     *
     * The navigation component won't need any data from the fetch, so it can go outside Query.
     * @todo - Refactor so Navigation can use the viewer info.
     * @todo - Refactor so Organization prop organization is dynamic.
     */
    return (
      <Router>
        <div className="app-container">
          <Navigation
            organizationName={organizationName}
            onOrganizationSearch={this.onOrganizationSearch}
          />
          <div className="main-container">
            <Route
              exact
              path={routes.ORGANIZATION}
              component={() => (
                <div className="organization-container">
                  <Organization
                    organizationName={organizationName}
                  />
                </div>
              )}
            />
            <Route
              exact
              path={routes.PROFILE}
              component={() => (
                <div className="profile-container">
                  <Profile />
                </div>
              )}
            />
            <div className="footer-container">
              <div className="app-info">
                <span className="app-info__name">App Name</span>
                <span className="app-info__short-description">App Short Description</span>
              </div>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
