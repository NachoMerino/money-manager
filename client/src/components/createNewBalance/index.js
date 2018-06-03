import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Button, Dialog, InputLabel, Typography, FormControl, Input} from '@material-ui/core';
import {AppBar, Toolbar, IconButton, InputAdornment, Slide, TextField} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import moment from 'moment'
import 'moment/locale/en-gb'  // without this line it didn't work
moment.locale('en-gb');

const styles = {
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
};

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class createNewBalance extends Component {
  constructor(props){
    super()
    this.state= {
      open: props.openCreateBalance,
      name: '',
      balance: '',
      movements:[]
    } 
  }

  handleChange = name => event => {this.setState({[name]: event.target.value})}

  static getDerivedStateFromProps(props, state){
    return {open: props.openCreateBalance}
  }

  render(){
    let disabled = true
    this.state.balance.length > 0 && this.state.name.length > 0 ? (disabled = false) : (disabled = true)
    const { classes } = this.props;
    return(
      <div>
        <Dialog
          fullScreen
          open={this.state.open}
          onClose={()=>{this.props.handleCloseCreateBalance('noData')}}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton color="inherit" onClick={()=>{this.props.handleCloseCreateBalance('noData')}} aria-label="Close">
                <CloseIcon />
              </IconButton>
              <Typography variant="title" color="inherit" className={classes.flex}>
                New Balance
              </Typography>
              <Button disabled={disabled} color="inherit" onClick={()=>{this.props.handleCloseCreateBalance(this.state)}}>
                save
              </Button>
            </Toolbar>
          </AppBar>
          <TextField
            fullWidth
            onChange={this.handleChange('name')}
            type='text'
            id="with-placeholder"
            label="Balance Name"
            placeholder="Set current Balance Name"
            className={classes.margin}
            margin="normal"
          />
          <FormControl fullWidth className={classes.margin}>
            <InputLabel htmlFor="adornment-balance">Current Balance</InputLabel>
            <Input
              id="adornment-balance"
              type='number'
              value={this.state.balance}
              onChange={this.handleChange('balance')}
              startAdornment={<InputAdornment position="start">€</InputAdornment>}
            />
          </FormControl>
        </Dialog>
      </div>
      )
  }
}

createNewBalance.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(createNewBalance);
