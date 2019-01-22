/**
 * Import React and PropTypes as we do.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * @todo - Style this with MaterialUI
 * Handles links to external sources or to another component within the React app
 */
import { Link } from 'react-router-dom';

/**
 * Import the classnames package for some support joining classnames.
 */
import classNames from 'classnames';

/**
 * Css-in-js helper for React and MaterialUI
 * Let's you add dynamic classes and split the CSS up by component,
 * co-locating styles and components.
 */
import { withStyles } from '@material-ui/core/styles';

/**
 * The rest of the MaterialUI components we'll need for the site header.
 */
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

/**
 * Import routes here as well so Navigation component can display the links.
 */
import * as routes from '../../constants/routes';

/**
 * Create some default styles
 * The 'root' style is provided by material-ui. It allows you to add styles to the root element.
 * You can add a bunch of other style objects as well.
 */
const styles = {
 root: {
   flexGrow: 1,
 },
 grow: {
   flexGrow: 1,
 },
 menuButton: {
   marginLeft: -12,
   marginRight: 20,
 },
};

/**
 * Our navigation component.
 * Its a dumb component for now.
 *
 * @todo - Refactor this in some way so it has access to the viewer data that is returned.
 */
class Navigation extends Component {
  /**
   * Internal state for class. We don't need a constructor because of new ES syntax.
   * isLoggedIn is always false until we access the viewer object.
   */
  state = {
    isLoggedIn: true,
    anchorEl: null,
  };

  /**
   * Handle the menu state by updating what the anchor element is.
   */
  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  /**
   * Handle the menu being closed.
   */
  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes } = this.props;
    const { isLoggedIn, anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <header className={classNames(classes.root, "navigation-container")}>
        <AppBar position="static">
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              Sam Purcell
            </Typography>
            {isLoggedIn ? (
              <div>
                <IconButton
                  aria-owns={open ? 'menu-appbar' : undefined}
                  aria-haspopup="true"
                  onClick={this.handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={this.handleClose}
                >
                  {/* @todo - Update Link somehow to use the MenuItem component prop */}
                  <MenuItem onClick={this.handleClose}><Link to={routes.PROFILE}>Profile</Link></MenuItem>
                  <MenuItem onClick={this.handleClose}><Link to={routes.ORGANIZATION}>Organization</Link></MenuItem>
                </Menu>
              </div>
            ) : (
              <div>
                <span>Log in</span>/<span>Sign up</span>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </header>
    );
  }
}

/**
 * PropTypes for Navigation component.
 */
Navigation.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Navigation);
