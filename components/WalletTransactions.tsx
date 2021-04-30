import React, {useState, useEffect, useReducer} from 'react';
import { useRouter } from 'next/router'
import Layout from '../components/layout.tsx'
import utilStyles from '../styles/utils.module.css'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { GetStaticProps } from 'next'
import { Backdrop, Box, Button, CssBaseline, Container, Dialog, DialogTitle, DialogContent, DialogActions, Grid, IconButton, TextField } from "@material-ui/core";
import {Card, CardActionArea, CardContent, CardMedia, CardActions, CircularProgress, Divider, InputBase, Paper, Typography, makeStyles} from "@material-ui/core";
import {FormControl, FormLabel, InputLabel, Select, MenuItem} from "@material-ui/core";
import {PhotoCamera, Edit, Delete, AddAPhoto, Refresh, TableChart, ExpandLess, ExpandMore, Add, Check, Clear}  from '@material-ui/icons/';

import {API} from '../config';
import {getCategories} from '../api/categoryApi';
import {getTransactionsByWallet, getFirstPageTransaction_and_category, addNewTransaction, updateTransaction, deleteTransaction} from '../api/transactionApi';
import getCurrentMonthName from '../api/currentMonthName';
import Date from './date';
import DatePickers, {DatePickersB} from './DatePickers';
import LoadingBackdrop, {LoadingDiv} from './LoadingBackdrop';
import SortFilter from './TransactionSortFilter';
import FilterSortDrawer from './FilterSortDrawer';
import TablePaging from './TablePaging';
import SelectControl from './SelectControl';
import TransactionTable, {TransactionToDeleteTable} from './TransactionTable';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const useStyles_transaction = makeStyles((theme) => ({
  row_div: {
    display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center',
    flexWrap:'wrap'
  },
  pageTitle: {
  	textAlign:'center'
  },
  formControl: {
    margin: theme.spacing(1),
    width:'50%'
  },
  selectContainer: {
  	display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center'
  },
  drawerControl: {  
    marginTop:'15px',
    padding:'5px 5px 5px 15px',
  },
}));

const initialSort = {sortBy:'Amount', sortType:'asc'};

const sortReducer = (state, action) => {    
  switch (action.type) {
    case 'TOGGLE_SORT':
      const newSortBy = state.sortBy==='Date'?'Amount':'Date';
      return {sortBy:newSortBy, sortType:'asc'}      
    case 'TOGGLE_TYPE':
      const newSortType = state.sortType==='asc'?'desc':'asc'; 
      return {...state, sortType:newSortType}       
    default:
      return state;      
  }
};

const initialFilter = {category:'0', subCategory:'0', dateFilter:{month:getCurrentMonthName(), startDate:'', endDate:''}}

const filterReducer = (state, action) => {
  switch (action.type){
    case 'INITIALIZE':
      const {category, subCategory} = action;    
      return {...state, category, subCategory}  
    case 'RESET_FILTER':            
      return {...initialFilter, dateFilter:{month:getCurrentMonthName(), startDate:'', endDate:''}};
    case 'SET_CATEGORY':      
      return {...state, category:action.category, subCategory:'0'}
    case 'SET_SUBCATEGORY':      
      return {...state, subCategory:action.subCategory}
    case 'SET_CATEGORY_SUBCATEGORY':      
      return {...state, category:action.category, subCategory:action.subCategory}
    case 'SET_MONTH':
      const {month} = action;      
      return {...state, dateFilter:{month, startDate:'', endDate:''}};
    case 'SET_DATE_RANGE':
      const {startDate, endDate} = action;
      return {...state, dateFilter:{month:'Date range', startDate, endDate}}
    default:
      return state;
  }
}

const itemPerPage = 5;

const WalletTransactions = () => {
	const router = useRouter()
	const transactionClasses = useStyles_transaction();

	const [categories, setCategories] = useState<any[]>([]);
	const [transactions, setTransactions] = useState<any[]>([]);
	const [firstLoaded, setFirstLoaded] = useState<boolean>(false);

	const [refreshMe, setRefresh] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isAddTransaction, setIsAdd] = useState<boolean>(false);
	const [idToEdit, setIdEdit] = useState<string>('');
	const [idToDelete, setIdDelete] = useState<string>('');

	const [walletBalance, setWalletBalance] = useState<number>(1000000);
	const [walletId, setWalletId] = useState<string>('12345');
	const [walletName, setWalletName] = useState<string>('Test wallet');

	const [connectionError, setConnectionError] = useState<boolean>(false);
	const [paginationData, setPaginationData] = useState<object>({transactionCount:0, maxPage:0, currentPage:0});  

	const {transactionCount, currentPage, maxPage} = paginationData;

  const [sort, dispatchSort] = useReducer(sortReducer, initialSort);  
  const [filter, dispatchFilter] = useReducer(filterReducer, initialFilter);
  
	useEffect(()=>{
		const {_id, name, balance} = router.query;
    if(typeof _id !== 'undefined'){
      setWalletId(_id);
      setWalletName(name);
      setWalletBalance(balance);    
      getFirstPage();
    }		
	}, []);

  const getFirstPage = () => {    
    const {_id, name, balance} = router.query;   
    setIsLoading(true);
    getFirstPageTransaction_and_category(_id, sort, filter)
      .then(data => {
        if(typeof data==='undefined'){
          //setConnectionError?
          setIsLoading(false);
          return;
        }       
        if(data.error){         
        }else{
          const {category, transaction, count} = data;            
          setCategories(category);
          if(typeof category !== 'undefined' && category.length>  0){
            setTransactions(setTransactionsCategoryName(transaction, category));
          }         
          setPaginationData({currentPage:0, transactionCount:count, maxPage:Math.ceil(count/itemPerPage)})
          setFirstLoaded(true);
        }
        setIsLoading(false);
      });
  }

	useEffect(()=>{      
		if(refreshMe && firstLoaded){			      
			getNewPageData();
		}				
	}, [refreshMe]);

	useEffect(()=>{	
		if(firstLoaded)	{
			getNewPageData();	
		}		
	}, [currentPage]);

  useEffect(()=>{   
    if(firstLoaded){
      setPaginationData({...paginationData, currentPage:0});
      getNewPageData(true);
    }    
  }, [sort]);

  useEffect(()=>{   
    if(firstLoaded) {
      getFirstPage();
    }    
  }, [filter]);
	
	const getNewPageData = (resetPage = false) => {
		setIsLoading(true);		
		if(walletId!==''){
			getTransactionsByWallet(walletId, !resetPage?currentPage:0, sort, filter)
				.then(data=>{
					if(typeof data === 'undefined'){
						setIsLoading(false);
            setRefresh(false);
						return;
					}					
					if(data.error){												
					}else{						
						setTransactions(setTransactionsCategoryName(data));						
					}
					setIsLoading(false);
          setRefresh(false);
				})
		}else {			
			setConnectionError(true);
			setRefresh(false);
		}
	}

	const setTransactionsCategoryName = (transactionData, categoryData = categories) => {
		if(typeof transactionData === 'undefined' || categoryData.length === 0){
			return [];
		}		

		transactionData.forEach((t, i)=>{
			const {categoryId, subCategory} = t.category;
			const {subCategoryId} = subCategory;

			const myCategory = categoryData.filter(c=>c._id===categoryId)[0]
			const categoryName = typeof myCategory!=='undefined'?myCategory.name:'';
			const subCategoryName = typeof myCategory!=='undefined'?
                              myCategory.subCategories.filter(s=>s._id===subCategoryId)[0].name:'';

			t.category.name = categoryName;
			t.category.subCategory.name = subCategoryName;
		});

		return transactionData;
	}

	const submitAddAndRefresh = (balance, isExpense) => {
		if(currentPage!==0){
			setPaginationData({
							currentPage:0, 
							transactionCount:transactionCount + 1, 
							maxPage:Math.ceil(transactionCount + 1/itemPerPage)
						});
		}else{
			setPaginationData({...paginationData, transactionCount:transactionCount + 1});			
		}
		setWalletBalance(isExpense?parseInt(walletBalance) - parseInt(balance)
								   :
								   parseInt(walletBalance) + parseInt(balance));
		setIsAdd(false);
		setRefresh(true);
	}	

	const submitEditAndRefresh = (updatedWalletBalance) => {
		setWalletBalance(updatedWalletBalance);
		setRefresh(true);
		setIdEdit('');
	}

	const submitDeleteAndRefresh = (updatedWalletBalance) => {				
		setPaginationData({
			currentPage:0,
			transactionCount:transactionCount-1,
			maxPage:Math.ceil(transactionCount + 1/itemPerPage)	
		})
		setWalletBalance(updatedWalletBalance);
		setIdDelete('');
		setRefresh(true);
	}	

	const handlePageChange = (newPage) => {
		setPaginationData({...paginationData, currentPage:newPage});		
	}

	return(
		<>
      		{
        		isLoading && <LoadingBackdrop isLoading={isLoading} />
      		}       		   			
      			{
      				walletName!=="" &&
      				<div className={transactionClasses.row_div}>

      					<Typography variant="h4" className={transactionClasses.pageTitle}>
      						{walletName}  Rp. {walletBalance}
      					</Typography>
      					<Button variant="contained" color="primary" size="small" startIcon={<Add />}
      						onClick={()=>setIsAdd(true)}
      					>
      						New Transaction
      					</Button>      				
      				</div>
      			}      			
      			{
      				isAddTransaction &&
      				<AddTransactionDialog submitAdd={submitAddAndRefresh} 
      									  cancelAdd={()=>setIsAdd(false)} 
      									  categories={categories} 
      									  walletId={walletId} 
      									  walletBalance={walletBalance} 
      				/>
      			}      
      			{
      				idToEdit!=="" &&
      				<EditTransactionDialog submitEdit={submitEditAndRefresh}
      									   cancelEdit={()=>setIdEdit('')}
      									   categories={categories}
      									   walletId={walletId}
      									   walletBalance={walletBalance}
      									   editedTransaction={transactions.filter(d=>d._id===idToEdit)[0]}
					    />      									   
      			} 			
      			{
      				idToDelete!=='' &&
      				<DeleteTransactionDialog submitDelete={submitDeleteAndRefresh}
      										 editInstead={()=>{
      										 	const newEdit = idToDelete;
      										 	setIdEdit(newEdit);
      										 	setIdDelete('')
      										 }}
      										 cancelDelete={()=>setIdDelete('')}
      										 transactionToDelete={transactions.filter(d=>d._id===idToDelete)[0]}      										 
      										 transactionIsExpense={transactions.filter(d=>d._id===idToDelete)[0].category.categoryId===categories[1]._id}
      										 walletId={walletId} walletBalance={walletBalance}
      				/>
      			}  
            {
              categories.length > 0 &&              
              <SortFilter 
                categories={categories}
                sort={sort} 
                dispatchSort={dispatchSort}
                filter={filter}
                dispatchFilter={dispatchFilter}
              />
            }      			
            {
              firstLoaded &&
              transactions.length === 0 &&              
              <Typography variant="body1" gutterBottom>
                No transaction yet...
              </Typography>
            } 
            {
              transactions.length > 0 &&
              <>                
                <TablePaging 
                       handlePageChange={handlePageChange} 
                       page={currentPage} 
                       count={transactionCount}
                /> 
                <TransactionTable 
                        tableData={transactions} 
                        setIdEdit={setIdEdit}
                        setIdDelete={setIdDelete}
                        sort={sort} 
                        dispatchSort={dispatchSort}
                />
              </>
            }                 		
      	</>
	)
}    			
    			
function AddTransactionDialog({submitAdd, cancelAdd, categories, walletId, walletBalance}) {  
  const transactionClasses = useStyles_transaction();

  const [isSubmittingData, setIsSubmitting] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
  const [balance, setBalance] = useState<number>(0);
  const [description, setDescription] = useState<string>('');
  const [transactionIsExpense, setIsExpense] = useState<boolean>(false);

  useEffect(()=>{  	
  	if(typeof categories[0] !== 'undefined'){
  		setSelectedCategory(categories[0]._id);
  		setSelectedSubCategory(categories[0].subCategories[0]._id);
  	}  	
  }, []);

  const changeCategory = (newCategory) => {
  	setSelectedCategory(newCategory);
  	setSelectedSubCategory(categories.filter(d=>d._id===newCategory)[0].subCategories[0]._id);
  	const isExpense = newCategory===categories[1]._id;//because the second category is for Expense...
  	setIsExpense(isExpense);
  	if(isExpense && (balance > walletBalance)) {
  		setBalance(walletBalance);
  	}
  }

  const submitTransaction = (e) => {
    e.preventDefault();  
    if(balance===0){
    	cancelAdd();
    	return;
    }

    setIsSubmitting(true);
    addNewTransaction(walletId, {balance, description, selectedCategory, selectedSubCategory, transactionIsExpense})
    	.then(data=>{
    		if(typeof data=== 'undefined'){
    			setIsSubmitting(false);
    			return;
    		}
    		if(data.error){
    			console.log(data.error)
    		}else{
    			submitAdd(balance, transactionIsExpense);
    		}
    		//setIsSubmitting(false);
    	})      
  }

  return (
    <Dialog fullWidth={true} maxWidth={'sm'}
      onClose={()=>!isSubmittingData && cancelAdd()} aria-labelledby="add-dialog-title" open={true}>
      <DialogTitle id="add-dialog-title">
       {!isSubmittingData?'New Transaction':'Submitting  new transaction...'}
      </DialogTitle>
      <DialogContent>        
        {!isSubmittingData &&
          <>          
          <div className={transactionClasses.selectContainer}>          
      	  <SelectControl labelId={"category-select-label"} label={"Category"} selectId={"select-category"} 
      	  	selectItems={categories}
      	  	value={selectedCategory}
      	  	onChange={changeCategory}
      	  	disabled={transactionIsExpense && walletBalance===0}
      	  />
      	  <SelectControl labelId={"subcategory-select-label"} label={"Sub Category"} selectId={"select-subcategory"} 
      	  	selectItems={typeof categories.filter(d=>d._id===selectedCategory)[0]!=='undefined'?
      	  				 categories.filter(d=>d._id===selectedCategory)[0].subCategories:
      	  				 []
      	  				}
      	  	value={selectedSubCategory}
      	  	onChange={(newSub)=>setSelectedSubCategory(newSub)}
      	  />      	  
      	  </div>
      	  <TextField
          	autoFocus          	
          	margin="dense"          	
          	label={transactionIsExpense?`Spending amount (max ${walletBalance})`:"Income amount"}
          	type="number"          	
          	fullWidth
          	value={balance}
          	onChange={(e)=>{
              const {value} = e.target;
              const newValue = parseInt(value);
              let newBalance = (isNaN(newValue) || newValue < 0)?0:newValue;
              if(transactionIsExpense && (newBalance > walletBalance)){
              	newBalance = walletBalance;
              } 
              setBalance(newBalance);
            }}
          	disabled={isSubmittingData}
          />
          <TextField          	          
          	margin="dense"          	
          	label="About"
          	type="text"          	
          	multiline
          	rowsMax={4}
          	fullWidth
          	value={description}
          	onChange={(e)=>setDescription(e.target.value)}
          	disabled={isSubmittingData}
          />
      	  </>
        }
        {
        	isSubmittingData && <LoadingDiv />
        }
      </DialogContent>
      <DialogActions>
        <Button onClick={submitTransaction} color="primary"          
          disabled={isSubmittingData}
        >
          Submit
        </Button>
        <Button onClick={()=>!isSubmittingData && cancelAdd()} color="secondary"
          disabled={isSubmittingData}
        >
          Cancel
        </Button>        
      </DialogActions>
    </Dialog>
  );
}

function EditTransactionDialog({submitEdit, cancelEdit, categories, walletId, walletBalance, editedTransaction}) {      
  const transactionClasses = useStyles_transaction();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
  const [balance, setBalance] = useState<number>(0);
  const [limitBalance, setLimitBalance] = useState<number>(0);
  const [description, setDescription] = useState<string>('');
  const [transactionIsExpense, setIsExpense] = useState<boolean>(false);
  const [newDate, setNewDate] = useState<string>('');

  const [editDirty, setEditDirty] = useState<boolean>(false);

  const [isSubmittingData, setIsSubmitting] = useState<boolean>(false);

  useEffect(()=>{    	
  	initializeData();

  	let itIsExpense = categories[0]._id !== editedTransaction.category.categoryId;
  	setIsExpense(itIsExpense);
  	if(!itIsExpense){
  		if(walletBalance >= editedTransaction.amount){
  			setLimitBalance(1);
  		}else{
  			setLimitBalance(editedTransaction.amount - walletBalance)
  		}
  	}else{
  		setLimitBalance((parseInt(editedTransaction.amount) + parseInt(walletBalance)))
  	}
  }, []);

  const initializeData = () => {  	
  	const {amount, category, description, createdAt} = editedTransaction;
  	const {categoryId, subCategory} = category;
  	const {subCategoryId} = subCategory;

  	setSelectedSubCategory(subCategoryId);
  	setSelectedCategory(categoryId);
  	setBalance(amount);
  	setDescription(description);
    setNewDate('');
  		
	setEditDirty(false);
  }

  const submitData = (e) => {
    e.preventDefault(); 
    const adjusted = balanceAdjusting();
    
	doSubmit(adjusted);
  } 

  const doSubmit = (adjusted) => {  	
  	if(!editDirty){
    	cancelEdit();
    }
    
    const balanceChange = balance - editedTransaction.amount;

    const updatedWalletBalance = transactionIsExpense? parseInt(walletBalance) - balanceChange:
    												   parseInt(walletBalance) + balanceChange;

	  const updatedTransaction = {
		  amount:balance,
		  description,
		  category:{categoryId:selectedCategory, subCategory:{subCategoryId:selectedSubCategory}},
		  wallet: walletId
	  }   

    if(newDate!==''){
      updatedTransaction.createdAt = newDate;
    }

	  const transactionId = editedTransaction._id;	

	  setIsSubmitting(true);
	  updateTransaction(walletId, transactionId, updatedWalletBalance, updatedTransaction)
		  .then(data=>{
			  if(typeof data==='undefined'){
				  console.log('Connection error?!');
				  setIsSubmitting(false);
				  return;
			  }

			  if(data.error){
				  console.log(data.error);
			  }else{
				  submitEdit(updatedWalletBalance)
			  }
			  //setIsSubmitting(false);

		});  
  }

  const balanceAdjusting = () => {
  	let adjustedBalance = balance;  	
    if(transactionIsExpense){
        if(adjustedBalance > limitBalance){
            adjustedBalance=limitBalance;
        }
    }else{                
        if(adjustedBalance < limitBalance){
	        adjustedBalance = limitBalance;
    	}
    }    
    
    let adjusted = balance!==adjustedBalance;

    if(adjusted){
    	setBalance(adjustedBalance);
    	setEditDirty(true);   
    	console.log(adjusted);
    }
    return adjusted;  
  }

  return (
    <Dialog fullWidth={true} maxWidth={'sm'}
      onClose={()=>!isSubmittingData && cancelEdit()} aria-labelledby="edit-dialog-title" open={true}>
      <DialogTitle id="edit-dialog-title">
       	{isSubmittingData?'Submitting Edit....':'Edit Transaction'}        
      </DialogTitle>
      <DialogContent>    
      	{!isSubmittingData &&
      	 <>
      	 <div className={transactionClasses.selectContainer}>          
      	  <SelectControl labelId={"category-select-label"} label={"Category"} selectId={"select-category"} 
      	  	selectItems={categories}
      	  	value={selectedCategory}
      	  	onChange={()=>{}}
      	  	disabled={true}
      	  />
      	  <SelectControl labelId={"subcategory-select-label"} label={"Sub Category"} selectId={"select-subcategory"} 
      	  	selectItems={typeof categories.filter(d=>d._id===selectedCategory)[0]!=='undefined'?
      	  				 categories.filter(d=>d._id===selectedCategory)[0].subCategories:
      	  				 []
      	  				}
      	  	value={selectedSubCategory}
      	  	onChange={(newSub)=>{setSelectedSubCategory(newSub);setEditDirty(true);}}
      	  />      	  
      	  </div>
      	 <TextField          	          
          	margin="dense"          	
          	label={transactionIsExpense?`Spending amount (max ${limitBalance})`:`Income amount (minimum ${limitBalance})`}
          	type="number"          	
          	fullWidth
          	value={balance}
          	onChange={(e)=>{
              const {value} = e.target;
              const parsedValue = parseInt(value);
              const formattedValue = (isNaN(parsedValue) || parsedValue < 1)?1:parsedValue;              
              setBalance(formattedValue);
              setEditDirty(true);
            }}
            onBlur={()=>{
            	balanceAdjusting();
            }}
          	disabled={isSubmittingData}
          />
          <TextField          	          
          	margin="dense"          	
          	label="About"
          	type="text"          	
          	multiline
          	rowsMax={4}
          	fullWidth
          	value={description}
          	onChange={(e)=>{setDescription(e.target.value);setEditDirty(true);}}
          	disabled={isSubmittingData}
          />
          <div className={transactionClasses.selectContainer}>
            <Paper>
              <Typography variant="subtitle1">
                Date created : <Date dateString={editedTransaction.createdAt} />
              </Typography>
            </Paper>            
            <FormControl className={transactionClasses.drawerControl} component="fieldset">
              {
                newDate!=='' &&
                <FormLabel component="legend">New date: {newDate}</FormLabel>
              }
              
              <DatePickersB id={"new-date"} label={"New date"} myDate={newDate} 
                           changeDate={(e)=>{ setNewDate(e.target.value);setEditDirty(true);}} />
            </FormControl>                           
          </div>
          </>
      	}            
      	{
      		isSubmittingData && <LoadingDiv />
      	}
      </DialogContent>
      <DialogActions>
        <Button onClick={submitData} color="primary" 
          disabled={isSubmittingData}         
        >
          Submit
        </Button>
        <Button onClick={initializeData} color="primary"
          disabled={!editDirty || isSubmittingData}
        >
          Reset
        </Button>
        <Button onClick={()=>!isSubmittingData && cancelEdit()} color="secondary"
          disabled={isSubmittingData}
        >
          Cancel
        </Button>        
      </DialogActions>
    </Dialog>
  );
}

function DeleteTransactionDialog({submitDelete, editInstead, cancelDelete, 
								  transactionToDelete:{
								  	_id,
								  	amount, description, category:{
								  		name,
								  		subCategory
								  	}
								  },
								  transactionIsExpense,
								  walletId, walletBalance}) {      
  const [isSubmittingData, setIsSubmitting] = useState<boolean>(false);
  const [allowDelete, setAllowDelete] = useState<boolean>(true);

  useEffect(()=>{  	
  	if(name==='Income' && (parseInt(walletBalance) < parseInt(amount))){  		
  		setAllowDelete(false);
  	}
  }, []);

  const submitDeleteData = (e) => {
    e.preventDefault();     

    const updatedWalletBalance = name === 'Expense'?
                parseInt(walletBalance) + parseInt(amount):
                parseInt(walletBalance) - parseInt(amount)
    
    setIsSubmitting(true);
    deleteTransaction(walletId, _id, updatedWalletBalance)
    	.then(data => {
    		if(typeof data === 'undefined'){
    			console.log('Connection error?');
    			setIsSubmitting(false);
    			return;
    		}

    		if(data.error){
    			console.log(data.error)
          setIsSubmitting(false);
    		}else{
    			submitDelete(updatedWalletBalance);
    		}    		
    	});
  }

  return (
    <Dialog fullWidth={true} maxWidth={'sm'}
      onClose={()=>!isSubmittingData && cancelDelete()} aria-labelledby="delete-dialog-title" open={true}>
      <DialogTitle id="delete-dialog-title">
       	{
       		isSubmittingData?
       		'Submitting....':
       		allowDelete?'Delete this transaction?':'Cannot delete transaction (wallet must not negative)'
       	}
      </DialogTitle>
      <DialogContent>  
      	{
      		!isSubmittingData &&
      		<>
      		<Typography variant="subtitle1" gutterBottom>
				{name} - {subCategory.name}          	
			</Typography>
      		<TransactionToDeleteTable
      			walletBalance={walletBalance}
      			amount={amount}
      			transactionIsExpense={name==='Expense'}
      		/>
      		</> 
      	}
      	{
      		isSubmittingData &&
      		<LoadingDiv />
      	}     	   
      </DialogContent>
      <DialogActions>      	
        <Button color="primary" disabled={isSubmittingData}
        	onClick={allowDelete?submitDeleteData:editInstead}
        >
          {allowDelete?'Delete':'Edit instead?'}
        </Button>
        <Button color="secondary" disabled={isSubmittingData}
          onClick={()=>!isSubmittingData && cancelDelete()}
        >
          Cancel
        </Button>        
      </DialogActions>
    </Dialog>
  );
}

function DialogTemplate({submitAdd, cancelAdd}) {      
  const [isSubmittingData, setIsSubmitting] = useState<boolean>(false);
  useEffect(()=>{        
  }, []);

  const submitData = (e) => {
    e.preventDefault();     
    
  }

  return (
    <Dialog fullWidth={true} maxWidth={'sm'}
      onClose={()=>!isSubmittingData && onClose()} aria-labelledby="simple-dialog-title" open={true}>
      <DialogTitle id="simple-dialog-title">
       New Transaction        
      </DialogTitle>
      <DialogContent>        
        Walaaa...!
        
      </DialogContent>
      <DialogActions>
        <Button onClick={submitAdd} color="primary"          
        >
          Submit
        </Button>
        <Button onClick={()=>!isSubmittingData && cancelAdd()} color="secondary"
          disabled={isSubmittingData}
        >
          Cancel
        </Button>        
      </DialogActions>
    </Dialog>
  );
}

export default WalletTransactions;