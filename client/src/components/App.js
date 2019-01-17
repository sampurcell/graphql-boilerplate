import axios from 'axios';
import React, { Component } from 'react';

import Organization from './Organization';

// Update this url and headers depending on what backend API you are hitting.
const axiosGraphQL = axios.create({
  baseURL: 'https://api.github.com/graphql',
  headers: {
    Authorization: `bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
  },
});

const addFavoriteToRepository = repositoryId => {
  return axiosGraphQL.post('', {
    query: ADD_FAVORITE,
    variables: { repositoryId },
  });
};

const ADD_FAVORITE = `
  mutation ($repositoryId: ID!) {
    addStar(input: { starrableId: $repositoryId }) {
      starrable {
        viewerHasStarred
      }
    }
  }
`;

const removeFavoriteFromRepository = repositoryId => {
  return axiosGraphQL.post('', {
    query: REMOVE_FAVORITE,
    variables: { repositoryId },
  });
};

const REMOVE_FAVORITE = `
  mutation ($repositoryId: ID!) {
    removeStar(input: { starrableId: $repositoryId }) {
      starrable {
        viewerHasStarred
      }
    }
  }
`;

const GET_ISSUES_FOR_REPOSITORY = `
  query (
    $organization: String!,
    $repository: String!,
    $cursor: String,
  ) {
    organization(login: $organization) {
      name
      url
      repository(name: $repository) {
        id
        name
        url
        stargazers {
          totalCount
        }
        viewerHasStarred
        issues(
          first: 5,
          after: $cursor,
          states: [OPEN]
        ) {
          edges {
            node {
              id
              title
              url
              reactions(last: 3) {
                edges {
                  node {
                    id
                    content
                  }
                }
              }
            }
          }
          totalCount
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    }
  }
`;

const getIssuesForRepository = (path, cursor) => {
  const [organization, repository] = path.split('/');

  return axiosGraphQL.post('', {
    query: GET_ISSUES_FOR_REPOSITORY,
    variables: { organization, repository, cursor },
  });
};

const resolveIssuesQuery = (queryResult, cursor) => state => {
  const { data, errors } = queryResult.data;

  if (!cursor) {
    return {
      organization: data.organization,
      errors,
    };
  }

  // Renaming edges as old and new issues.
  // Note the old issues come from state,
  // And new Issues come from the data returned from GraphQL query.
  // @todo Figure out what this is doing. returning state, but not sure what the edges is.
  // Seems to be a relay thing
  const { edges: oldIssues} = state.organization.repository.issues;
  const { edges: newIssues } = data.organization.repository.issues;
  const updatedIssues = [...oldIssues, ...newIssues];

  return {
    organization: {
      ...data.organization,
      repository: {
        ...data.organization.repository,
        issues: {
          ...data.organization.repository.issues,
          edges: updatedIssues,
        },
      },
    },
    errors,
  };
};

// This is heavily duplicated code. Should figure out how to make it a little more dynamic.
const resolveAddFavoriteMutation = mutationResult =>
  state => {
    const { viewerHasStarred } = mutationResult.data.data.addStar.starrable;
    const { totalCount } = state.organization.repository.stargazers;

    return {
      ...state,
      organization: {
        ...state.organization,
        repository: {
          ...state.organization.repository,
          viewerHasStarred,
          stargazers: {
            totalCount: totalCount + 1,
          }
        }
      },
    };
  };

  const resolveRemoveFavoriteMutation = mutationResult =>
    state => {
      const { viewerHasStarred } = mutationResult.data.data.removeStar.starrable;
      const { totalCount } = state.organization.repository.stargazers;

      return {
        ...state,
        organization: {
          ...state.organization,
          repository: {
            ...state.organization.repository,
            viewerHasStarred,
            stargazers: {
              totalCount: totalCount - 1,
            }
          }
        },
      };
    }

// Static constant that doesn't change.
const title = 'React GraphQL GitHub Client';

class App extends Component {
  // Set initial state for the App component.
  state = {
    path: 'the-road-to-learn-react/the-road-to-learn-react',
    organization: null,
    errors: null,
  };

  // Fetch the initial data for the app.
  componentDidMount() {
    this.onFetch(this.state.path);
  }

  onChange = event => {
    this.setState({ path: event.target.value });
  }

  onSubmit = event => {
    // Fetch the data when given path is submitted.
    this.onFetch(this.state.path);
    event.preventDefault();
  };

  onFetch = (path, cursor) => {
    getIssuesForRepository(path, cursor)
      .then(result =>
        this.setState(
          resolveIssuesQuery(
            result,
            cursor
          )
        ),
      );
  };

  onFetchMoreItems = () => {
    const { endCursor } = this.state.organization.repository.issues.pageInfo;

    this.onFetch(this.state.path, endCursor);
  };

  onFavorite = (repositoryId, viewerHasStarred) => {
    if (viewerHasStarred) {
      removeFavoriteFromRepository(repositoryId)
        .then(mutationResult =>
          this.setState(resolveRemoveFavoriteMutation(mutationResult))
        );
    } else {
      addFavoriteToRepository(repositoryId)
      .then(mutationResult =>
        this.setState(resolveAddFavoriteMutation(mutationResult))
      );
    }
  };

  render() {
    const { path, organization, errors } = this.state;

    return (
      <div>
        <h1>{title}</h1>

        <form onSubmit={this.onSubmit}>
          <label
            htmlFor="url">
            Show open issues for https://github.com/
          </label>
          <input
            id="url"
            type="text"
            value={path}
            onChange={this.onChange}
            style={{ width: '300px' }}
          />
          <button type="submit">Search</button>
        </form>

        <hr />
        {organization ? (
          <Organization
            organization={organization}
            errors={errors}
            onFetchMoreItems={this.onFetchMoreItems}
            onFavorite={this.onFavorite}
          />
        ) : (
          <p>Loading...</p>
        )}
      </div>
    );
  }
}

export default App;
