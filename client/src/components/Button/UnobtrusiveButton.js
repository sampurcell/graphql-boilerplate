/**
 * Import React and PropTypes to allow for JSX and validation.
 */
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Import material-ui button for styles and function for css-in-js
 */
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

/**
 * Import classNames utility to help with dynamic classNames.
 */
import classNames from 'classnames';

/**
 * Function that returns another function that takes props,
 * and returns a certain property in an array when executed.
 *
 * @param {*} property  - Property you will refer to when using component.
 * @param {*} mapping - Object of all the values associated with property.
 */
const styledBy = (property, mapping) => props => mapping[props[property]];

/**
 * Look more into how styledBy works.
 */
const styles = theme => ({
  root: {
    color: styledBy('color', {
      defaultColor: '#333',
		}),
  }
});

/**
 * Here we have the TextButton component. Its a wrapper around the material-ui button.
 * You pass it an object of props for display and styling,
 * and add them to the Button comonent as well as any additional props.
 */
const UnobtrusiveButton = ({
  children,
  classes,
  className,
  color = 'black',
  type = 'button',
  ...props
}) => {
  return (
    <div>
      <Button
        className={classNames(classes.root, className)}
				type={type}
				variant='outlined'
        {...props}
      >
        {children}
      </Button>
    </div>
  );
};

/**
 * Make sure some classes are passed using styledBy and withStyles call below.
 */
UnobtrusiveButton.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UnobtrusiveButton);
