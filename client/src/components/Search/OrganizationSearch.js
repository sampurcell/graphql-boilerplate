import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import SearchInput from '../Input';



const styles = theme => ({
  root: {
    //  Styles for Search Component as whole go here.
    display: 'inherit',
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class OrganizationSearch extends Component {
  state = {
    value: this.props.organizationName,
  };

  onChange = e => {
    this.setState({
      value: e.target.value
    });
  };

  onSubmit = e => {
    this.props.onOrganizationSearch(this.state.value);
    e.preventDefault();
  };

  render = () => {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
        <form
          onSubmit={this.onSubmit}
        >
          <div className={classes.grow} />
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon
                type="submit"
                label="Submit"
                />
            </div>
            <SearchInput onChange={this.onChange} value={value} />
          </div>
        </form>
      </div>
    );
  }
}

OrganizationSearch.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OrganizationSearch);
