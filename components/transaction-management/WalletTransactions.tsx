import React, {useState, useEffect, useReducer} from 'react';
import { useRouter } from 'next/router'
import Layout from '../layout'
import utilStyles from '../styles/utils.module.css'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { GetStaticProps } from 'next'
import { Backdrop, Box, Button, CssBaseline, Container, Dialog, DialogTitle, DialogContent, DialogActions, Grid, IconButton, TextField } from "@material-ui/core";
import {Card, CardActionArea, CardContent, CardMedia, CardActions, CircularProgress, Divider, InputBase, Paper, Typography, makeStyles} from "@material-ui/core";
import {FormControl, FormLabel, InputLabel, Select, MenuItem} from "@material-ui/core";
import {PhotoCamera, Edit, Delete, AddAPhoto, Refresh, TableChart, ExpandLess, ExpandMore, Add, Check, Clear}  from '@material-ui/icons/';

import {API} from '../../config';
import {getCategories} from '../../api/categoryApi';
import {getTransactionsByWallet, getFirstPageTransaction_and_category, updateTransaction, deleteTransaction} from '../../api/transactionApi';
import Date from '../globals/date';
import LoadingBackdrop, {LoadingDiv} from '../../components/globals/LoadingBackdrop';
import SortFilter from '../filterComponents/TransactionSortFilter';
//import FilterSortDrawer from './FilterSortDrawer';
import TablePaging from '../TablePaging';
import SelectControl from '../globals/SelectControl';
import TransactionTable, {TransactionToDeleteTable} from '../TransactionTable';
import { transactionSort, transactionSortReducer } from './StoreNReducer';
import AddTransactionDialog from './AddTransaction';
import EditTransactionDialog from './EditTransaction';
import useStyles from './styles';

const itemPerPage = 5;

const WalletTransactions = ({filter, dispatchFilter}) => {
	const router = useRouter()
	const transactionClasses = useStyles();

	const [categories, setCategories] = useState<any[]>([]);
	const [transactions, setTransactions] = useState<any[]>([]);
	const [firstLoaded, setFirstLoaded] = useState<boolean>(false);

	const [refreshMe, setRefresh] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isAddTransaction, setIsAdd] = useState<boolean>(false);
	const [idToEdit, setIdEdit] = useState<string>('');
	const [idToDelete, setIdDelete] = useState<string>('');

	const [walletBalance, setWalletBalance] = useState<number>(0);
	const [walletId, setWalletId] = useState<string>('');
	const [walletName, setWalletName] = useState<string>('');

	const [connectionError, setConnectionError] = useState<boolean>(false);
	const [paginationData, setPaginationData] = useState<{
															transactionCount:number, 
															currentPage:number, 
															maxPage:number
														}>
														({
														  	transactionCount:0, 
															currentPage:0,
															maxPage:0, 															
														});  

	const {transactionCount, currentPage, maxPage} = paginationData;

  const [sort, dispatchSort] = useReducer(transactionSortReducer, transactionSort);      

	useEffect(()=>{
		const {_id, name, balance} = router.query;
    	if(typeof _id !== 'undefined'){
      		setWalletId(_id.toString());
      		setWalletName(name.toString());			
      		setWalletBalance(parseInt(balance.toString()));      
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

	const submitAddAndRefresh = (balance:string, isExpense:boolean) => {
		if(currentPage!==0){
			setPaginationData({
							currentPage:0, 
							transactionCount:transactionCount + 1, 
							maxPage:Math.ceil(transactionCount + 1/itemPerPage)
						});
		}else{
			setPaginationData({...paginationData, transactionCount:transactionCount + 1});			
		}
		setWalletBalance(isExpense?walletBalance - parseInt(balance)
								   :
								   walletBalance + parseInt(balance));
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
      				<div className={transactionClasses.rowDiv}>

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

export default WalletTransactions;