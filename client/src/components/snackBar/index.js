import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const styles = theme => ({
  close: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
  },
});

class SnackBar extends React.Component {
  state = {
    open: false,
    dataToSnackBar:''
  }

  static getDerivedStateFromProps(props, state){
    return {open: props.openSnackBar, dataToSnackBar:props.dataToSnackBar}
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.props.closeSnackBar()
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.open}
          autoHideDuration={3000}
          onClose={this.handleClose}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{this.state.dataToSnackBar}</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={this.handleClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </div>
    );
  }
}

SnackBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SnackBar);