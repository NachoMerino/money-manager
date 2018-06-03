import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Table, TableBody, TableCell, TableFooter, TablePagination, TableRow} from '@material-ui/core';
import {Paper, IconButton} from '@material-ui/core';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5,
  },
})

class displayMovements extends React.Component {
  handleFirstPageButtonClick = event => {
    this.props.onChangePage(event, 0);
  }

  handleBackButtonClick = event => {
    this.props.onChangePage(event, this.props.page - 1);
  }

  handleNextButtonClick = event => {
    this.props.onChangePage(event, this.props.page + 1);
  }

  handleLastPageButtonClick = event => {
    this.props.onChangePage(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1),
    )
  }

  render() {
    const { classes, count, page, rowsPerPage, theme } = this.props;

    return (
      <div className={classes.root}>
        <IconButton
          onClick={this.handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="First Page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label="Previous Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Next Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Last Page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </div>
    );
  }
}

displayMovements.propTypes = {
  classes: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired,
};

const displayMovementsWrapped = withStyles(actionsStyles, { withTheme: true })(
  displayMovements,
);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit,
  },
  table: {
    width: '100%',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  infoRowLeft:{
    fontWeight: 'bold',
    textAlign: 'left'
  },
  infoRowRight:{
    fontWeight: 'bold',
    textAlign: 'right'
  }
});

class CustomDisplayMovements extends React.Component {
  state = {
    data: [],
    page: 0,
    rowsPerPage: 5,
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  }

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
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
      return{data:props.movements}
    }
  }

  render() {
    const { classes } = this.props;
    const { data, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            <TableBody>
              <TableRow className={classes.infoRow}>
                <TableCell className={classes.infoRowLeft}>Description</TableCell>
                <TableCell className={classes.infoRowRight}>Amount</TableCell>
                <TableCell className={classes.infoRowRight}>Date</TableCell>
                <TableCell className={classes.infoRowRight}>Categorie</TableCell>
              </TableRow>
              {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((n, i) => {
                return (
                  <TableRow key={i}>
                    <TableCell component="th" scope="row">
                      {n.description}
                    </TableCell>
                    <TableCell numeric>{n.amount} €</TableCell>
                    <TableCell numeric>{n.date}</TableCell>
                    <TableCell numeric>{n.categorie}</TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 48 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter >
              <TableRow>
                <TablePagination
                  className={classes.table}
                  colSpan={3}
                  count={data.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  ActionsComponent={displayMovementsWrapped}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </Paper>
    );
  }
}

CustomDisplayMovements.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CustomDisplayMovements);