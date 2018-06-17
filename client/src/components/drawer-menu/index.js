import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Drawer, Button, List, Divider } from '@material-ui/core';
import {Delete, Add as AddIcon} from '@material-ui/icons';


const styles = theme => ({
  list: {
    margin: '0.5rem 1rem',
    width: 200,
  },
  button: {
    marginTop: '1rem',
  }
});

class TemporaryDrawer extends React.Component {
  state = {}

  render() {
    const { classes, closeDrawer, open } = this.props;
    return (
      <div>
        <Drawer open={open} onClose={closeDrawer}>
          <div
            tabIndex={0}
            role="button"
            onClick={closeDrawer}
            onKeyDown={closeDrawer}
          >
          <div className={classes.list}>
            <Button disabled={this.props.offlineMode} variant="flat" className={classes.button} onClick={this.props.handleClickOpenCreateAccount}>
              <AddIcon /> {this.props.offlineMode ? 'Offline Mode':'New Account'}
            </Button>
            <Divider />
            <Button disabled={this.props.offlineMode} variant="flat" className={classes.button} onClick={this.props.handleClickOpenDeleteAccount}>
              <Delete /> {this.props.offlineMode ? 'Offline Mode':'Delete Account'}
            </Button>
            <Divider />
            <List>Menu Item 3</List>
            <Divider />
            <List>Menu Item 4</List>
            <Divider />
            <List>Menu Item 5</List>
            <Divider />
          </div>
          </div>
        </Drawer>
      </div>
    );
  }
}

TemporaryDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TemporaryDrawer);