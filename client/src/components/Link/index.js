import React from 'react';

/**
 * PropTypes for validation of component props.
 */
import PropTypes, { element } from 'prop-types';

/**
 * Link styles and helper props to create an HOC.
 */
import { withStyles } from '@material-ui/styles';
import Link from '@material-ui/core/Link';

/**
 * Allow for dynamic class names in the prop
 *
 * Usage:
 * classNames(classes.root, myClassNames);
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
 * Styles for the link component
 * Update text color to something inline with material-ui best practices (theme?)
 */
const styles = {
  root: {
    color: styledBy('color', {
      defaultColor: '#333'
    }),
    fontSize: '1rem',
    margin: 0,
    padding: 0,
  }
};

const StyledLinkRaw = props => {
  const { classes, className, color, text, ...rest } = props;

  /**
   * Note the classNames() usage to combine two levels of inheritance and styling flexibility.
   */
  return (
    <Link
      className={classNames(classes.root, className)}
      target={rest.target || '__blank'}
      rel={rest.rel || 'noopener noreferrer'}
      {...rest}
    >
      {text}
    </Link>
  );
};

/**
 * Declare PropTypes - what can each prop's value be? Is it required?
 * @todo - Add the rest of them. Confirm they are correct.
 */
StyledLinkRaw.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  color: PropTypes.func,
  text: PropTypes.node,
};

/**
 * Use the withStyles() API from Material-UI and pass the component you just created
 * with the styles you just defined.
 */
const StyledLink = withStyles(styles)(StyledLinkRaw);

/**
 * The rest of the props will be rendered when your Link component is imported and rendered.
 */
export default StyledLink;
