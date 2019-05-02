import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import IssueItem from '../IssueItem';
import Loading from '../../Loading';
import ErrorMessage from '../../Error';
import { UnobtrusiveButton } from '../../Button';

/**
 * Import styles from material-ui
 */
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';


const GET_ISSUES_OF_REPOSITORY = gql`
  query($repositoryOwner: String!, $repositoryName: String!) {
    repository(name: $repositoryName, owner: $repositoryOwner) {
      issues(first: 5) {
        edges {
          node {
            id
            number
            state
            title
            url
            bodyHTML
          }
        }
      }
    }
  }
`;

const ISSUE_STATES = {
  NONE: 'NONE',
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
};

const TRANSITION_LABELS = {
  [ISSUE_STATES.NONE]: 'Show Open Issues',
  [ISSUE_STATES.OPEN]: 'Show Closed Issues',
  [ISSUE_STATES.CLOSED]: 'Hide Issues',
};

const TRANSITION_STATE = {
  [ISSUE_STATES.NONE]: ISSUE_STATES.OPEN,
  [ISSUE_STATES.OPEN]: ISSUE_STATES.CLOSED,
  [ISSUE_STATES.CLOSED]: ISSUE_STATES.NONE,
};

const isShow = issueState => issueState !== ISSUE_STATES.NONE;

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
});

class Issues extends React.Component {
  state = {
    issueState: ISSUE_STATES.NONE,
  };

  onChangeIssueState = nextIssueState => {
    this.setState({ issueState: nextIssueState });
  };

  render() {
    const { issueState } = this.state;
    const { repositoryOwner, repositoryName, classes } = this.props;

    return (
      <div className="Issues">
        <UnobtrusiveButton
          onClick={() =>
            this.onChangeIssueState(TRANSITION_STATE[issueState])
          }
        >
          {TRANSITION_LABELS[issueState]}
        </UnobtrusiveButton>

        {isShow(issueState) && (
          <Query
            query={GET_ISSUES_OF_REPOSITORY}
            variables={{
              repositoryOwner,
              repositoryName,
            }}
          >
            {({ data, loading, error }) => {
              if (error) {
                return <ErrorMessage error={error} />;
              }

              const { repository } = data;

              if (loading && !repository) {
                return <Loading />;
              }

              const filteredRepository = {
                issues: {
                  edges: repository.issues.edges.filter(
                    issue => issue.node.state === issueState,
                  ),
                },
              };

              if (!filteredRepository.issues.edges.length) {
                return <div className="IssueList">No issues ...</div>;
              }

              return <IssueList issues={filteredRepository.issues} classes={classes} />;
            }}
          </Query>
        )}
      </div>
    );
  }
}

const IssueList = ({ classes, issues }) => (

	<div className="{classes.root} IssueList">
		<Grid container spacing={24}>
    {issues.edges.map(({ node }) => (
      <IssueItem key={node.id} issue={node} />
		))}
		</Grid>
  </div>
);

export default withStyles(styles)(Issues);
