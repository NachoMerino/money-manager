import React from 'react';
import { crudAPI } from '../../helpers';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Input, InputLabel, InputAdornment, FormControl, TextField, Button, Select} from '@material-ui/core';
import moment from 'moment'
import 'moment/locale/en-gb'  // without this line it didn't work
moment.locale('en-gb');

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    width:'90%',
    margin: theme.spacing.unit,
  },
  withoutLabel: {
    marginTop: theme.spacing.unit * 3,
  },
  textField: {
    flexBasis: 200,
  },
});

class AddAmount extends React.Component {
  state ={
    balance:'',
    amount: '',
    description:'',
    categorie:'Other',
    date:moment().format('L'),
    balanceId:undefined,
  } 

  static getDerivedStateFromProps(props, state){
    return {balanceId: props.balanceId, balance:props.balance}
  }  

  handleChange = name => event => {
    if(name === 'amount'){
      this.setState({[name]: parseFloat(event.target.value)})
    } else if(name === 'date'){
      this.setState({[name]: moment(event.target.value).format('L')})
    } else {
      this.setState({[name]: event.target.value})
    }
  }

  submitAmount = e => {
    e.preventDefault();
    const changingBalance = this.state.balance + this.state.amount
    delete this.state.balance
    const toSubmit = {...this.state, balance:changingBalance.toFixed(2)}
    crudAPI('PUT',`/balance/${this.state.balanceId}`,toSubmit)
      .then(res => {
        if(res.message){
          this.props.openSnackBar(res.message)
        } else {
          this.props.openSnackBar(res.error)
        }
      })
      .catch(err => console.log(err));
  }

render(){
  const { classes } = this.props;
  const {amount, description} = this.state
  let disabled = true
  !amount.length && description.length > 0 ? (disabled = false) : (disabled = true)
  const categories = ['Other','Food','Rent','Insurance','Clothes','Car','Eating Outside']
  return(
    <React.Fragment>
    <form noValidate onSubmit={this.submitAmount}>
    <FormControl fullWidth className={classes.margin}>
      <InputLabel htmlFor="categorie-native-simple">Categorie</InputLabel>
      <Select
        native
        value={this.state.categorie}
        onChange={this.handleChange('categorie')}
        inputProps={{
          id: 'categorie-native-simple',
        }}
      >
      {categories.map(categorie => <option key={categorie} value={categorie}>{categorie}</option>)}
      </Select>
    </FormControl>
    <FormControl fullWidth className={classes.margin}>
      <InputLabel htmlFor="adornment-amount">Amount</InputLabel>
      <Input
        id="adornment-amount"
        type='number'
        value={this.state.amount}
        onChange={this.handleChange('amount')}
        startAdornment={<InputAdornment position="start">€</InputAdornment>}
      />
    </FormControl>
    <TextField
      fullWidth
      onChange={this.handleChange('description')}
      type='text'
      id="with-placeholder"
      label="Description"
      placeholder="short description"
      className={classes.margin}
      margin="normal"
    />
    <TextField
      fullWidth
      onChange={this.handleChange('date')}
      id="date"
      label="Date"
      type="date"
      className={classes.margin}
      InputLabelProps={{
        shrink: true,
      }}
    />
    <Button disabled={disabled} type='submit' variant="raised" className={classes.margin}>
      Submit Amount
    </Button>
    {this.state.balance ? <h1>Balance: {this.state.balance} €</h1> : null}
    </form>
    </React.Fragment>
    )
  }
}

AddAmount.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddAmount);

