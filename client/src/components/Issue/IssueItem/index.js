import React from 'react';

/**
 * The following sets up all the styles
 */
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

/**
 * Import classNames utility to help with dynamic classNames.
 */
import classNames from 'classnames';


/**
 * Look more into how styledBy works.
 */
const styles = theme => ({
  root: {
		padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }
});

import Link from '../../Link';

const IssueItem = ({
	children,
	classes,
	className,
	textAlign = 'center',
	...issue }) => (
  <div className="IssueItem">
    <Grid item xs={3}>
      {/* placeholder to add a show/hide comment button later */}
      <Paper className={classNames(classes.root, className)}>
        <div className="IssueItem-content">
          <h3>
            <Link href={issue.url}>{issue.title}</Link>
          </h3>
          <div dangerouslySetInnerHTML={{ __html: issue.bodyHTML }} />

          {/* placeholder to render a list of comments later */}
        </div>
      </Paper>
    </Grid>
  </div>
);

export default withStyles(styles)(IssueItem);
