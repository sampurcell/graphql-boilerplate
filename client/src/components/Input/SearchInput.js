import React, { Component } from 'react';

import InputBase from '@material-ui/core/InputBase';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    color: 'inherit',
    width: '100%',
  },
  input: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200,
      },
    },
  },
});

class SearchInput extends Component {
  render = () => {
    const {
      classes,
      children,
      placeholder,
      type,
      onChange,
      value
    } = this.props;

    return (
      <div>
        <InputBase
          placeholder={placeholder || 'Search…'}
          type={type || 'text'}
          value={value}
          onChange={onChange}
          classes={{
            root: classes.root,
            input: classes.input,
          }}
        >
          {children}
        </InputBase>
      </div>
    );
  }
}

export default withStyles(styles)(SearchInput);
