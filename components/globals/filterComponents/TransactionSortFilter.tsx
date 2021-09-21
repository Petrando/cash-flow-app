import React, {useState, useEffect} from 'react';
import { Button, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core/';
import TimeFilter from './TimeFilter';
import {transactionSortFilterComponentI, categoryAndSubI} from "../../../types";
import { useTransactionStyles } from '../../../styles/material-ui.styles';

const sortBy=[
  'Date', 'Amount'
]

export default function TransactionSortFilter({
                                    categories, 
                                    sort, 
                                    dispatchSort, 
                                    filter, 
                                    dispatchFilter
                                  }:transactionSortFilterComponentI):JSX.Element {
  const classes = useTransactionStyles();  

  const handleChangeSort = (event) => {
    dispatchSort({type:'TOGGLE_SORT'});
  }

  const checkFilterChanged = () =>{    
    const {category, subCategory, dateFilter} = filter;   
    if(category==='0' && subCategory==='0' && dateFilter.hasOwnProperty('Month') && dateFilter.month==='All'){
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
      <CategoryAndSubFilter 
        categories={categories} 
        transactionFilter={filter} 
        dispatchFilter={dispatchFilter} 
      />      
      <TimeFilter 
        transactionFilter={filter} 
        dispatchFilter={dispatchFilter} 
      />
      <FormControl className={classes.formControl}>
        <Button 
          variant="contained" 
          size="small" 
          color="secondary"          
          onClick={()=>dispatchFilter({type:'RESET_FILTER'})}
        >
          Reset
        </Button>
      </FormControl>
    </div>
  );
}

interface subCategoryMockupI {
  _id?:string;
  name:string;
  category?:string;
}

const CategoryAndSubFilter = (props:categoryAndSubI):JSX.Element => {
  const classes = useTransactionStyles();

  const [categories, setCategories] = useState<any[]>([]);
  //const [activeCategory, setCategory] = useState<string>(props.transactionFilter.category);
  const [subCategories, setSubCategories] = useState<subCategoryMockupI[]>([]);
  //const [activeSubCategory, setSubCategory] = useState<string>(props.transactionFilter.subCategory);

  useEffect(()=>{    
    if(props.categories.length > 0){
      initializeStates();
    }
  }, [props.transactionFilter]);

  const initializeStates = () => {
    const initCategories = [{_id:'0', name:'All'}].concat(props.categories.map(d => {return {_id:d._id, name:d.name};}));
    const {category} = props.transactionFilter;
    let initSubCategories:subCategoryMockupI[] = [{_id:'0', name:'All', category:''}];
    if(category!=="0"){      
      const selectedCategory = props.categories.filter(d=>d._id===category);
      if(selectedCategory.length > 0){
        initSubCategories = initSubCategories.concat(selectedCategory[0].subCategories);
      }
    }else{
      initSubCategories = initSubCategories                                                     
        .concat(props.categories[0].subCategories.map(d => {return {_id:d._id, name:d.name, category:'Income'}}))
        .concat(props.categories[1].subCategories.map(d => {return {_id:d._id, name:d.name, category:'Expense'}}));    
    }    

    setCategories(initCategories);
    setSubCategories(initSubCategories);                                                     
  }      

  const selectItem = ({_id, name}, i) => (
    <MenuItem key={_id} value={_id}>{name}</MenuItem>
  ) 

  const changeCategory = (e) => {
    const currentCategory = props.transactionFilter.category;
    const newCategory = e.target.value;

    const firstSubCategory:subCategoryMockupI = {_id:'0', name:'All'};

    if(newCategory==='0'){
      initializeStates();
    }
    else if(newCategory===props.categories[0]._id && currentCategory!==newCategory)//Income
    {
      setSubCategories([firstSubCategory].concat(props.categories[0].subCategories));

    }
    else if(newCategory===props.categories[1]._id && currentCategory!==newCategory)//Expense
    {
      setSubCategories([firstSubCategory].concat(props.categories[1].subCategories));      
    }

    //setCategory(newCategory);
    //setSubCategory('0');    
    props.dispatchFilter({type:'SET_CATEGORY', category:newCategory});    
  }

  const changeSubCategory = (e) => {
    const newSubCategory = e.target.value;

    const firstSubCategory:subCategoryMockupI = {_id:'0', name:'All'};
    
    if(props.transactionFilter.category==='0' && newSubCategory!=='0'){
      const selectedSubCategory = subCategories.filter(d=>d._id===newSubCategory)[0];

      const newCategory = selectedSubCategory.category;

      const newActiveCategory = props.categories[newCategory==='Income'?0:1];
      setSubCategories([firstSubCategory].concat(newActiveCategory.subCategories));
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

