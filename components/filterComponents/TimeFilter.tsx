import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';

import FilterDateRange from './FilterDateRange';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 140,
  },  
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const TimeFilter = (props) => {
  const classes = useStyles();  
  const months = ["All", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "Date range"];

  const [age, setAge] = useState('');  

  useEffect(()=>{        
    //props.dispatchFilter({type:'RESET_FILTER'});
  }, []);

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const monthItem = (d, i) => (
    <MenuItem key={i} value={d}>{d}</MenuItem>
  )

  const handleChangeMonth = (e) => {        
    const newMonth = e.target.value;
    if(newMonth!=='Date range'){
      props.dispatchFilter({type:'SET_MONTH', month:newMonth});
    }    
  }

  const handleDispatchDateRange = (startDate, endDate) => {
    props.dispatchFilter({type:'SET_DATE_RANGE', startDate, endDate});
  }  

  const monthSelectText = () => {
    const {dateFilter} = props.transactionFilter;
    const {month, startDate, endDate} = dateFilter;
    if(month!=='Date range'){
      return ''
    }else{
      return startDate===endDate?`Single day : ${startDate}`:`${startDate} to ${endDate}`;
    }
  }

  return (
    <>
      <FormControl className={classes.formControl}>
        <InputLabel shrink id="demo-simple-select-placeholder-label-label">
          Select Month
        </InputLabel>
        <Select
          labelId="demo-simple-select-placeholder-label-label"
          id="demo-simple-select-placeholder-label"
          value={props.transactionFilter.dateFilter.month}
          onChange={handleChangeMonth}
          displayEmpty
          className={classes.selectEmpty}          
        >
          {months.map(monthItem)}         
        </Select>        
        {
          props.transactionFilter.dateFilter.month === 'Date range' &&
          <Typography variant='caption' gutterBottom>
            {monthSelectText()}
          </Typography>
        }
      </FormControl>
      <FormControl className={classes.formControl}> 
        <FilterDateRange transactionFilter={props.transactionFilter} dispatchDateRange={handleDispatchDateRange} />     
      </FormControl>      
    </>
  )
}

export default TimeFilter;