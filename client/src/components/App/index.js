/**
 * You will need React for JSX syntax.
 * You will need Component named export
 * if you are creating a React component by extending a class.
 */
import React, { Component } from 'react';

/**
 * You will need axios for API requests.
 */
// import axios from 'axios';

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
 * Import application React components
 */
// import Organization from '../Organization';
import Profile from '../Profile';
import Header from '../Header';

/**
 * Define your GraphQL query for this view.
 */
const GET_HEADER_INFO = gql`
  {
    viewer {
      login
      name
    }
  }
`;

/**
 * Static constant that doesn't change.
 */
// const title = 'React GraphQL GitHub Client';

/**
 * Base Component for your application
 *
 * Contains:
 * header and footer
 */
class App extends Component {
  render() {
    return (
      <Query query={GET_HEADER_INFO}>
        {({ data, loading, error }) => {
          if (error) {
            return <ErrorMessage error={error} />;
          }

          const { viewer } = data;

          if (loading || !viewer) {
            return <Loading />;
          }

          return (
            <div className="app-container">
              <Header viewer={viewer} />
              <Profile />
              <div className="footer-container">
                <div className="app-info">
                  <span className="app-info__name">App Name</span>
                  <span className="app-info__short-description">App Short Description</span>
                </div>
              </div>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default App;
