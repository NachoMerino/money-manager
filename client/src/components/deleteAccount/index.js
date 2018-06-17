import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Button, Dialog, InputLabel, Typography, FormControl, Select} from '@material-ui/core';
import {AppBar, Toolbar, IconButton, Slide, MenuItem} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
  margin: {
    width:'90%',
    margin: '1rem',
  },
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class deleteAccount extends Component {
  constructor(props){
    super()
    this.state= {
      open: props.openDeleteAccount,
      currentAccount:{},
      accountId:'',
      openSelectAccount: false,
    } 
  }

  handleChange = name => event => {this.setState({[name]: event.target.value})}

  static getDerivedStateFromProps(props, state){
    return {open: props.openDeleteAccount, accounts:props.accounts}
  }

  handleChange = event => {
    this.state.accounts.map(account => {
      if(account._id === event.target.value){
        return(
          this.setState({
            currentAccount: account,
            [event.target.name]: event.target.value
          })
        )
      }
    })  
  }

  render(){
    const { classes } = this.props;
    return(
      <div>
        <Dialog
          fullScreen
          open={this.state.open}
          onClose={()=>{this.props.handleCloseDeleteAccount('noData')}}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton color="inherit" onClick={()=>{this.props.handleCloseDeleteAccount('noData')}} aria-label="Close">
                <CloseIcon />
              </IconButton>
              <Typography variant="title" color="inherit" className={classes.flex}>
                Delete Account
              </Typography>
              <Button disabled={this.state.accountId.length > 1 ? false : true} color="inherit" onClick={()=>{this.props.handleCloseDeleteAccount(this.state.accountId)}}>
                delete
              </Button>
            </Toolbar>
          </AppBar>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="delete-Account">Delete an Account</InputLabel>
            <Select
              value={this.state.accountId}
              onChange={this.handleChange}
              inputProps={{
                name: 'accountId',
                id: 'delete-Account',
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {this.state.accounts.map(account => <MenuItem key={account._id} value={account._id}>{account.name}</MenuItem>)}
            </Select>
          </FormControl>
        </Dialog>
      </div>
      )
  }
}

deleteAccount.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(deleteAccount);
