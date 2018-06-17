import React, { Component } from 'react';
import './App.css';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {InputLabel, MenuItem, FormControl, Select, Button } from '@material-ui/core';
import {crudAPI} from './helpers'
import CreateNewAccount from './components/createNewAccount';
import DeleteAccount from './components/deleteAccount';
import DisplayMovements from './components/displayMovements';
import SelectYearMonth from './components/displayMovements/select-year-month';
import SnackBar from './components/snackBar';
import AddAmount from './components/addAmount';
import Drawer from './components/drawer-menu';

import moment from 'moment'
import 'moment/locale/en-gb'  // without this line it didn't work
moment.locale('en-gb');

const styles = theme => ({
  formControl: {
    margin: '0 1rem',
    minWidth: 140,
  },
  close: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
  }
});

class App extends Component {
  state = {
    offlineMode: false,
    accounts:[],
    currentAccount:{},
    currentAccountId: '',
    openSelectAccount: false,
    openCreateAccount: false,
    openDeleteAccount: false,
    openSnackBar: false,
    openDrawer:false,
    dataToSnackBar:'',
    year: moment().format('YYYY'),
    month: moment().format('MM')
  }

  activateOfflineMode = () => {
    this.setState({offlineMode: true})
  }

  componentDidMount() {
    const accounts = JSON.parse(localStorage.getItem('accounts'))
    if(accounts){
      crudAPI('PUT','/offlineupdate',accounts)
        .then(res => console.log(res))
        .then(this.reRenderApp())
        .catch(err => this.reRenderApp())

    } else {
      this.reRenderApp()
    }
  }

  reRenderApp = accountId => {
    crudAPI('GET','/accounts')
    .then(res => {
      res.map( res => delete res.__v)
      this.setState({accounts: res, offlineMode:false},this.findAccount(res, accountId))
      localStorage.setItem('accounts', JSON.stringify(res));
    })
    .catch(err => {
      const accounts = JSON.parse(localStorage.getItem('accounts'))
      console.log('accounts in reRenderApp', accounts)
      if(accounts){
        this.setState({accounts, offlineMode:true},this.findAccount(accounts, accountId))
      } else {
        this.openSnackBar('No database Founded, check your network conection')
      }
    });
  }

  findAccount = (accounts, accountId) => {
    console.log('findAccount')
    if(this.state.offlineMode){
      window.onbeforeunload = function() {
        return false;
    }
    }
    let route = accounts
    const accountsLS = JSON.parse(localStorage.getItem('accounts'))
    this.state.offlineMode ? route = accountsLS : route
      console.log('accounts in findAccount', accountsLS)

    route.map(account => {
      if(account._id === accountId){
        return(
          this.setState({
            currentAccount: account,
            currentAccountId: accountId
          })
        )
      }
    })  
  }

  openDrawer = () => {
    this.setState({openDrawer:true})
  }

  closeDrawer = () => {
    this.setState({openDrawer:false})
  }

  openSnackBar = dataToSnackBar => {
    this.setState({openSnackBar:true, dataToSnackBar})
  }
  closeSnackBar = () => {
    this.setState({openSnackBar:false, dataToSnackBar:''})
  }

  handleClickOpenDeleteAccount = () => {
    this.setState({ openDeleteAccount: true });
  }

  handleCloseDeleteAccount = dataToSend => {
    if(dataToSend !== 'noData'){
      crudAPI('Delete',`/deleteaccount/${dataToSend}`)
        .then(res => this.openSnackBar(res.message))
        .then(this.componentDidMount())
        .catch(err => console.log(err));
    }
    this.setState({ openDeleteAccount: false });
  }

  handleClickOpenCreateAccount = () => {
    this.setState({ openCreateAccount: true });
  }

  handleCloseCreateAccount = dataToSend => {
    if(dataToSend !== 'noData'){
      crudAPI('POST','/newaccount',dataToSend)
        .then(res => this.openSnackBar(res.message))
        .then(this.componentDidMount())
        .catch(err => console.log(err));
    }
    this.setState({ openCreateAccount: false });
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

  handleCloseSelectAccount = () => {
    this.setState({ openSelectAccount: false });
  }

  handleOpenSelectAccount = () => {
    this.setState({ openSelectAccount: true });
  }

  displaySelectedYear = date => {
    this.setState({
      year: date.year,
      month: date.month
    })
  }

  render() {
    const { classes } = this.props;
    const { currentAccount } = this.state
    let whatToShow;
    if (currentAccount.name !== undefined){
      whatToShow = (
      <React.Fragment>
      <AddAmount
        offlineMode={this.state.offlineMode}
        activateOfflineMode={this.activateOfflineMode }
        balance={this.state.currentAccount.balance}
        accountId={this.state.currentAccount._id}
        openSnackBar={this.openSnackBar}
        reRenderApp={this.reRenderApp}
      />
      <SelectYearMonth displaySelectedYear={this.displaySelectedYear} movements={this.state.currentAccount.movements || null}/>
      <DisplayMovements year={this.state.year} month={this.state.month} movements={this.state.currentAccount.movements || null}/>
      </React.Fragment>
     )
    }
    return (
      <div className="App">
        <div className={classes.menu}>
        <Button variant="raised" className={classes.button} onClick={this.openDrawer}>Menu</Button>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="controlled-open-select">Select Account</InputLabel>
          <Select
            fullWidth
            open={this.state.open}
            onClose={this.handleCloseSelectAccount}
            onOpen={this.handleOpenSelectAccount}
            value={this.state.currentAccountId}
            onChange={this.handleChange}
            inputProps={{
              name: 'currentAccountId',
              id: 'controlled-open-select',
            }}
          >
            {this.state.accounts.map(account => <MenuItem key={account._id} value={account._id}>{account.name}</MenuItem>)}
          </Select>
        </FormControl>
      </div>
        <DeleteAccount 
          openDeleteAccount={this.state.openDeleteAccount}
          handleCloseDeleteAccount={this.handleCloseDeleteAccount}
          accounts={this.state.accounts}
        />
        <CreateNewAccount
          openCreateAccount={this.state.openCreateAccount}
          handleCloseCreateAccount={this.handleCloseCreateAccount}
          />
        {whatToShow}
        <Drawer
          offlineMode={this.state.offlineMode}
          open={this.state.openDrawer}
          closeDrawer={this.closeDrawer}
          handleClickOpenCreateAccount={this.handleClickOpenCreateAccount}
          handleClickOpenDeleteAccount={this.handleClickOpenDeleteAccount}
        />
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