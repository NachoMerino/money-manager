import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {InputLabel, FormControl, Select } from '@material-ui/core';

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
});

class SelectYearMonth extends React.Component {
  state = {
    selectedYear: '',
    selectedMonth:'',
    years:[],
    months:[]
  }

  shouldComponentUpdate(nextProps, nextState){
    if(nextProps.movements === null){
      return false
    } else {
      return true
    }
  }

  static getDerivedStateFromProps(props, state){
    if(props.movements === null){
      return null
    } else {
      const years = Object.keys(props.movements).reverse();
      //Not working
      const months = years.map(year => Object.keys(props.movements[year]))
      // but love it!
      return { movements:props.movements, years, months }
    }
  }

  handleChange = name => event => {
    this.setState({ selectedMonth:'',[name]: event.target.value});
    if(name === 'selectedMonth'){
      this.props.displaySelectedYear({
        year:this.state.selectedYear,
        month:event.target.value
      })
    }
  }

  render() {
    const { classes } = this.props;
    let selectedMonth = [];
    if(this.state.selectedYear.length > 1){
      selectedMonth = Object.keys(this.state.movements[this.state.selectedYear])
    }
    return (
      <div className={classes.root}>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="selectYear">Year</InputLabel>
          <Select
            native
            value={this.state.selectedYear}
            onChange={this.handleChange('selectedYear')}
            inputProps={{
              id: 'selectYear',
            }}
          >
          <option value="" />
          {this.state.years.map(year => <option key={year} value={year}>{year}</option>)}
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="selectMonth">Month</InputLabel>
          <Select
            native
            value={this.state.selectedMonth}
            onChange={this.handleChange('selectedMonth')}
            inputProps={{
              id: 'selectMonth',
            }}
          >
          <option value="" />
          {selectedMonth.map(month => <option key={month} value={month}>{month}</option>)}
          </Select>
        </FormControl>
      </div>
    );
  }
}

SelectYearMonth.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SelectYearMonth);