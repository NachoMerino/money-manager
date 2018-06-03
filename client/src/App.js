import React, { Component } from 'react';
import './App.css';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {InputLabel, MenuItem, FormControl, Select, Button } from '@material-ui/core';
import {crudAPI} from './helpers'
import CreateNewBalance from './components/createNewBalance';
import DisplayMovements from './components/displayMovements';
import SnackBar from './components/snackBar';
import AddAmount from './components/addAmount';

const styles = theme => ({
  button: {
    display: 'block',
    marginTop: theme.spacing.unit,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 140,
  },
  close: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
  },
});

class App extends Component {
  state = {
    balances:[],
    currentBalance:{},
    currentBalanceName: '',
    openSelectBalance: false,
    openCreateBalance: false,
    openSnackBar: false,
    dataToSnackBar:'',
  }

  componentDidMount() {
    crudAPI('GET','/balances')
      .then(res => {
        res.map( res => delete res.__v)
        this.setState({balances: res})
      })
      .catch(err => console.log(err));
  }

  openSnackBar = dataToSnackBar => {
    this.setState({openSnackBar:true, dataToSnackBar})
  }
  closeSnackBar = () => {
    this.setState({openSnackBar:false, dataToSnackBar:''})
  }

  handleClickOpenCreateBalance = () => {
    this.setState({ openCreateBalance: true });
  }

  handleCloseCreateBalance = dataToSend => {
    if(dataToSend !== 'noData'){
      crudAPI('POST','/newbalance',dataToSend)
        .then(res => console.log(res))
        .catch(err => console.log(err));
      this.componentDidMount();
    }
    this.setState({ openCreateBalance: false });
  }

  handleChange = event => {
    this.state.balances.map(balance => {
      if(balance._id === event.target.value){
        return(
          this.setState({
            currentBalance: balance,
            [event.target.name]: event.target.value
          })
        )
      }
    })  
  }

  handleCloseSelectBalance = () => {
    this.setState({ openSelectBalance: false });
  }

  handleOpenSelectBalance = () => {
    this.setState({ openSelectBalance: true });
  }

  render() {
    const { classes } = this.props;
    const { currentBalance } = this.state
    let whatToShow;
    if (currentBalance.name !== undefined){
      whatToShow = (
      <React.Fragment>
      <AddAmount
        balance={this.state.currentBalance.balance}
        balanceId={this.state.currentBalance._id}
        openSnackBar={this.openSnackBar}
      />
      <DisplayMovements movements={this.state.currentBalance.movements || null}/>
      </React.Fragment>
     )
    }
    return (
      <div className="App">
        <form autoComplete="off">
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="controlled-open-select">Select a Balance</InputLabel>
          <Select
            fullWidth
            open={this.state.open}
            onClose={this.handleCloseSelectBalance}
            onOpen={this.handleOpenSelectBalance}
            value={this.state.currentBalanceName}
            onChange={this.handleChange}
            inputProps={{
              name: 'currentBalanceName',
              id: 'controlled-open-select',
            }}
          >
            {this.state.balances.map(balance => <MenuItem key={balance._id} value={balance._id}>{balance.name}</MenuItem>)}
          </Select>
          <Button variant="raised" className={classes.button} onClick={this.handleClickOpenCreateBalance}>New Balance
          </Button>
        </FormControl>
      </form>
        <CreateNewBalance
          openCreateBalance={this.state.openCreateBalance}
          handleCloseCreateBalance={this.handleCloseCreateBalance}
          />
        {whatToShow}
        <SnackBar
          openSnackBar={this.state.openSnackBar}
          dataToSnackBar={this.state.dataToSnackBar}
          closeSnackBar={this.closeSnackBar}
          />
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);