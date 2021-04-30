import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormGroup from '@material-ui/core/FormGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import FilterDateRange from './FilterDateRange';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 140,
  },
  formGroupControl:{
    display:'flex', flexDirection:'row',
    minWidth:240,
    maxWidth:300,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const sortBy=[
  'Date', 'Amount'
]

export default function SortFilter({categories, sort, dispatchSort, filter, dispatchFilter}) {
  const classes = useStyles();  

  const handleChangeSort = (event) => {
    dispatchSort({type:'TOGGLE_SORT'});
  }

  const checkFilterChanged = () =>{    
    const {category, subCategory, dateFilter} = filter;
    console.log('checkFilterChanged');
    console.log(filter);
    if(category==='0' && subCategory==='0' && dateFilter.hasOwnProperty('Month') && dateFilter.Month==='All'){
      console.log('filter intact');
      return false;
    }
    return true;
  }

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel id="sort-label">Sort By</InputLabel>
        <Select
          labelId="sort-label"
          id="sort-select"
          value={sort.sortBy}
          onChange={handleChangeSort}
        >
          <MenuItem value={"Amount"}>Amount</MenuItem>
          <MenuItem value={"Date"}>Date</MenuItem>          
        </Select>
      </FormControl>      
      <CategoryAndSubFilter categories={categories} transactionFilter={filter} dispatchFilter={dispatchFilter} />      
      <TimeFilter transactionFilter={filter} dispatchFilter={dispatchFilter} />
      <FormControl className={classes.formControl}>
        <Button variant="contained" size="small" color="secondary"          
          onClick={()=>dispatchFilter({type:'RESET_FILTER'})}
        >
          Reset
        </Button>
      </FormControl>
    </div>
  );
}

const CategoryAndSubFilter = (props) => {
  const classes = useStyles();

  const [categories, setCategories] = useState<any[]>([]);
  //const [activeCategory, setCategory] = useState<string>(props.transactionFilter.category);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  //const [activeSubCategory, setSubCategory] = useState<string>(props.transactionFilter.subCategory);

  useEffect(()=>{    
    if(props.categories.length > 0){
      initializeStates();
    }
  }, []);

  const initializeStates = () => {
    const initCategories = [{_id:'0', name:'All'}].concat(props.categories.map(d => {return {_id:d._id, name:d.name};}));
    const initSubCategories = [{_id:'0', name:'All', category:''}]                                                      
                                                     .concat(props.categories[0].subCategories.map(d => {return {_id:d._id, name:d.name, category:'Income'}}))
                                                     .concat(props.categories[1].subCategories.map(d => {return {_id:d._id, name:d.name, category:'Expense'}}));    

    setCategories(initCategories);
    setSubCategories(initSubCategories);                                                     
  }      

  const selectItem = ({_id, name}, i) => (
    <MenuItem key={_id} value={_id}>{name}</MenuItem>
  ) 

  const changeCategory = (e) => {
    const currentCategory = props.transactionFilter.category;
    const newCategory = e.target.value;
    if(newCategory==='0'){
      initializeStates();
    }
    else if(newCategory===props.categories[0]._id && currentCategory!==newCategory)//Income
    {
      setSubCategories([{_id:'0', name:'All'}].concat(props.categories[0].subCategories));

    }
    else if(newCategory===props.categories[1]._id && currentCategory!==newCategory)//Expense
    {
      setSubCategories([{_id:'0', name:'All'}].concat(props.categories[1].subCategories));      
    }

    //setCategory(newCategory);
    //setSubCategory('0');    
    props.dispatchFilter({type:'SET_CATEGORY', category:newCategory});    
  }

  const changeSubCategory = (e) => {
    const newSubCategory = e.target.value;
    
    if(props.transactionFilter.category==='0' && newSubCategory!=='0'){
      const selectedSubCategory = subCategories.filter(d=>d._id===newSubCategory)[0];

      const newCategory = selectedSubCategory.category;

      const newActiveCategory = props.categories[newCategory==='Income'?0:1];
      setSubCategories([{_id:'0', name:'All'}].concat(newActiveCategory.subCategories));
      //setCategory(newActiveCategory._id);        
      props.dispatchFilter({type:'SET_CATEGORY_SUBCATEGORY', category:newActiveCategory._id, subCategory:e.target.value});
    }else{
      props.dispatchFilter({type:'SET_SUBCATEGORY', subCategory:e.target.value});
    }
    //setSubCategory(newSubCategory);        
  }

  return (
    <>
    <FormControl className={classes.formControl}>
      <InputLabel id="category-label">Category</InputLabel>
        <Select
          labelId="category-label"
          id="category-select"
          value={props.transactionFilter.category}          
          onChange={changeCategory}
        >
          {
            categories.length > 0 &&
            categories.map(selectItem)
          }    
        </Select>        
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel id="sub-category-label">Sub Category</InputLabel>
        <Select
          labelId="sub-category-label"
          id="sub-category-select"   
          value={props.transactionFilter.subCategory} 
          onChange={changeSubCategory}                            
        >
          {
            subCategories.length > 0 &&
            subCategories.map(selectItem)
          }
        </Select>        
      </FormControl>
      </>
  )
}

//const initialFilter = {category:'0', subCategory:'0', dateFilter:{month:'All'}}
const TimeFilter = (props) => {
  const classes = useStyles();  
  const months = ["All", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "Date range"];

  const [age, setAge] = React.useState('');
  //const [selectedMonth, setMonth] = useState<string>("All");

  useEffect(()=>{        
    props.dispatchFilter({type:'RESET_FILTER'});
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
