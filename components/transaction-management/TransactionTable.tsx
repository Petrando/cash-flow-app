import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { IconButton} from '@material-ui/core';

import { Edit, Delete}  from '@material-ui/icons/';
import Date from '../globals/date'

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  }
});

export default function TransactionTable({tableData, setIdEdit, setIdDelete, sort, dispatchSort}) {
  const classes = useStyles();  

  return (
    <TableContainer component={Paper}>     
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>
              <TableHeaderWithSort sort={sort} dispatchSort={dispatchSort} mySort={'Amount'} />
            </TableCell>
            <TableCell align="right">Category</TableCell>
            <TableCell align="right">Sub Category</TableCell>
            <TableCell align="right">
              <TableHeaderWithSort sort={sort} dispatchSort={dispatchSort} mySort={'Date'} />
            </TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row) => (
            <TableRow key={row._id}>
              <TableCell component="th" scope="row">
                {row.amount}
              </TableCell>
              <TableCell align="right">
                {
                  typeof row.category !== 'undefined'?
                  row.category.name:''
                }
              </TableCell>
              <TableCell align="right">
                {
                  typeof row.category !== 'undefined'?
                  row.category.subCategory.name:''
                }
              </TableCell>
              <TableCell align="right">
                <Date dateString={row.createdAt} />
              </TableCell>
              <TableCell align="right">
                <IconButton color="primary"
                  onClick={()=>setIdEdit(row._id)}
                >
                  <Edit />
                </IconButton>
                <IconButton color="secondary"
                  onClick={()=>setIdDelete(row._id)}
                >
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const TableHeaderWithSort = ({sort:{sortBy, sortType}, dispatchSort, mySort}) => {
  return (
    <>
      {
        sortBy===mySort?
        <TableSortLabel
          active={true}
          direction={sortType}
          onClick={()=>dispatchSort({type:'TOGGLE_TYPE'})}
        >
          {mySort}
        </TableSortLabel>:
        <>{mySort}</>
      }
    </>    
  )
}

export const TransactionToDeleteTable = ({walletBalance, amount, transactionIsExpense})=>{
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>     
      <Table aria-label="simple table">
        
        <TableBody>
          <TableRow>            
            <TableCell align="center">
              Wallet Balance
            </TableCell>
            <TableCell scope="row" align="right">
              {walletBalance}
            </TableCell>            
          </TableRow>

          <TableRow>
            <TableCell align="center">
              Amount to delete
            </TableCell>
            <TableCell scope="row" align="right">
              {amount}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell align="center">
              Wallet after delete
            </TableCell>
            <TableCell scope="row" align="right">
              {
                transactionIsExpense?
                parseInt(walletBalance) + parseInt(amount):
                parseInt(walletBalance) - parseInt(amount)
              }
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}
