import React, {useState, useEffect} from 'react';
import Head from 'next/head'
import Layout from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import { GetStaticProps } from 'next'
import { Box, Button, CssBaseline, Container, Dialog, DialogTitle, DialogContent, DialogActions, Grid, IconButton, TextField } from "@material-ui/core";
import {Divider, Paper, Typography, makeStyles} from "@material-ui/core";
import {PhotoCamera, Edit, Delete, AddAPhoto, Refresh, TableChart, ExpandLess, ExpandMore, Add, Check, Clear}  from '@material-ui/icons/';

import {API} from '../config';
import {getCategories, addSubCategory, editSubCategory, getTransactionCount, deleteSubCategory} from '../api/categoryApi'
import InitializeCategory from '../components/category-management/InitializeCategory';
import LoadingBackdrop, {LoadingDiv} from '../components/LoadingBackdrop';

const useStyles = makeStyles((theme) => ({  
  addSubCategory:{
  	padding:"5px"
  }
}));

const CategoryManagement = () => {
	const classes = useStyles();	

	const [categories, setCategoryData] = useState([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [refreshMe, setRefresh] = useState<boolean>(true);
	const [error, setError] = useState<string>("");

	useEffect(()=>{
		if(refreshMe){
			setIsLoading(true);
			getCategories()
				.then(data=>{
					if(typeof data==='undefined'){                   
            			return;          
          			}
          			if(data.error){                    
            			setError(data.error.toString())
          			} else {
            			setCategoryData(data);
            			console.log(data);
          			}
          			setIsLoading(false);
          			setRefresh(false);
				})
		}		
	}, [refreshMe]);

	return (
		<Layout>      
      		<Head>
        		<title>
          			Category Management
        		</title>
      		</Head>
      		<Container>				
      			<Typography variant="h4">
      				{!isLoading && categories.length > 0?'Category Management':'To start, please enter initial sub category data.'}
      			</Typography>
				{
        			isLoading &&
        			<LoadingBackdrop isLoading={isLoading} />
      			} 
      			{
      				!isLoading &&
      				categories.length === 0 &&
      				<InitializeCategory refresh={()=>setRefresh(true)} />
      			}
      			{
      				!isLoading &&
      				categories.length > 0 &&
      				categories.map((d,i)=><Category key={d._id} categoryData={d} refresh={()=>setRefresh(true)} />)
      			}
      		</Container>
      	</Layout>
	)
}

const Category = ({categoryData:{_id, name, subCategories}, refresh}) => {
	const classes = useStyles();

	const [isOpen, setIsOpen] = useState<boolean>(true);
	const [isAddingNewSub, setAddingNewSub] = useState<boolean>(false);
	const [idSubEdited, setSubEdited] = useState<string>('');
	const [idSubToDelete, setIdSubToDelete] = useState<string>('');

	const submitAddAndRefresh = (newCategoryData) => {
		addSubCategory(_id, newCategoryData)
			.then(data=>{
				if(typeof data==='undefined'){
					return;
				}
				if(data.error){
					console.log(data.error)
				}else{
					setAddingNewSub(false);
					refresh();
				}
			})		
	}

	const submitEditAndRefresh = (sub_id, editedCategoryData) => {		
		editSubCategory(_id, sub_id, editedCategoryData)
			.then(data=>{
				if(typeof data==='undefined'){
					return;
				}
				if(data.error){
					console.log(data.error)
				}else{
					setSubEdited('');
					refresh();
				}
			})
	}

	const submitDeleteAndRefresh = () => {
		deleteSubCategory(_id, idSubToDelete)
			.then(data => {
				if(typeof data === 'undefined'){
					return;
				}

				if(data.error){
					console.log(data.error)
				}else{
					setIdSubToDelete('');
					refresh();
				}
			})		
	}

	return (
		<Container>
			<Button color="primary" variant="contained" fullWidth endIcon={isOpen?<ExpandLess />:<ExpandMore />}
				onClick={()=>setIsOpen(!isOpen)}
			>
				{name}
			</Button>			
			{
				isOpen && 
				<>
				{
					isAddingNewSub?
					<NewSubCategory submitAddAndRefresh={submitAddAndRefresh} cancelAdd={()=>setAddingNewSub(false)} />:
					<Paper xs={12} className={classes.addSubCategory}>
						<Button color="primary" variant="contained" size="small" startIcon={<Add />}
							onClick={()=>setAddingNewSub(true)}
						>
							Sub Category
						</Button>
					</Paper>
				}				
				{
					subCategories.length > 0 &&
					subCategories.map((sub, i)=><SubCategory key={sub._id} sub={sub} 
													startEdit={()=>setSubEdited(sub._id)}
													cancelEdit={()=>setSubEdited('')}
													submitEdit={submitEditAndRefresh}
													idSubEdited={idSubEdited}
													startDelete={()=>setIdSubToDelete(sub._id)}													
												/>)
				}
				{
					idSubToDelete!=='' &&
					<DeleteSubCategoryDialog cancelDelete={()=>setIdSubToDelete('')} 
											 deleteSub={submitDeleteAndRefresh} 
											 categoryId={_id}
											 categoryName={name}
											 subToDelete={subCategories.filter(d => d._id===idSubToDelete)[0]}/>
				}
				</>
			}
		</Container>
	)
}    

const useStyles_addSubCategory = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  fullWidth_typography : {
  	textAlign:'center', 
  	width: '100%'
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

const NewSubCategory = ({submitAddAndRefresh, cancelAdd}) => {
	const classes = useStyles_addSubCategory();

	const [newCategoryName, setNewCategoryName] = useState<string>('');

	return (
		<Paper component="form" className={classes.root}>            		
      		<TextField
          		autoFocus	              
          		margin="dense"          		
          		label="New Sub Category"
          		type="text"  
          		value={newCategoryName}        
          		onChange={(e)=>setNewCategoryName(e.target.value)}
          		fullWidth          		
        	/>
      		<IconButton type="submit" color='primary' className={classes.iconButton} aria-label="ok"
      			onClick={(e)=>{
      					e.preventDefault();
      					newCategoryName!=='' && submitAddAndRefresh({name:newCategoryName})}}
      		>
        		<Check />
      		</IconButton>
      		<Divider className={classes.divider} orientation="vertical" />
      		<IconButton color="secondary" className={classes.iconButton} aria-label="cancel"
      			onClick={cancelAdd}
      		>
        		<Clear />
      		</IconButton>
    	</Paper>
	)
}

const SubCategory = ({sub:{_id, name}, startEdit, submitEdit, cancelEdit, idSubEdited, startDelete}) => {
	const classes = useStyles_addSubCategory();
	const iAmEdited = _id === idSubEdited;			

	return (
		<Paper component="form" className={classes.root}> 
			{iAmEdited?
				<EditingSubCategory sub={{_id, name}} submitEdit={submitEdit} cancelEdit={cancelEdit} />
				:
				<>
					<Typography variant={"body2"} className={classes.fullWidth_typography}>			
						{name}
					</Typography>
					<IconButton type="submit" color='primary' className={classes.iconButton} aria-label="ok"
						onClick={(e)=>{
									e.preventDefault();
									startEdit()
						}}      			
      				>
        				<Edit />
      				</IconButton>
      				<Divider className={classes.divider} orientation="vertical" />
      				<IconButton color="secondary" className={classes.iconButton} aria-label="cancel"
      					onClick={()=>startDelete(_id)}      			
      				>
        				<Delete />
      				</IconButton>
				</>
			} 			
		</Paper>
	)
}

const EditingSubCategory = ({sub:{_id, name}, submitEdit, cancelEdit}) => {
	const classes = useStyles_addSubCategory();

	const [newName, setNewName] = useState<string>('');
	const [editDirty, setEditDirty] = useState<boolean>(false);

	useEffect(()=>{
		setEditDirty(newName!==name);
	}, [newName]);

	useEffect(()=>{
		initNewName();
	}, []);

	const initNewName = () => {
		setNewName(name);
	}

	return (
		<>
			<TextField
          		autoFocus	              
          		margin="dense"          		
          		label="New Name"
          		type="text" 
          		value={newName}           		
          		onChange={(e)=>setNewName(e.target.value)}
          		fullWidth          		
        	/>
      		<IconButton type="submit" color='primary' className={classes.iconButton} aria-label="ok"
      			onClick={(e)=>{
      					e.preventDefault(); 
      					if(!editDirty){cancelEdit();}
      					else{submitEdit(_id, {newName});}
      			}}     					
      		>
        		<Check />
      		</IconButton>
      		<Divider className={classes.divider} orientation="vertical" />
      		<IconButton color='primary' className={classes.iconButton} aria-label="refresh" disabled={!editDirty}
      			onClick={initNewName}
      		>
        		<Refresh />
      		</IconButton>
      		<Divider className={classes.divider} orientation="vertical" />
      		<IconButton color='secondary' className={classes.iconButton} aria-label="cancel"
      			onClick={cancelEdit}
      		>
        		<Clear />
      		</IconButton>
      	</>
	)
}

function DeleteSubCategoryDialog({cancelDelete, deleteSub, categoryId, categoryName, subToDelete:{_id, name} }) {      
  const [isSubmittingData, setIsSubmitting] = useState<boolean>(false);
  const [isCountingTransaction, setIsCountingTransaction] = useState<boolean>(true);
  const [transactionCount, setTransactionCount] = useState<number>(0);

  useEffect(()=>{  
  	getTransactionCount(categoryId, _id)
  		.then(data=>{
  			if(typeof data === 'undefined'){
  				console.log('No connection!?');
  				setIsCountingTransaction(false);
  				return;
  			}
  			if(data.error){
  				console.log(data.error)
  			}else{
  				const {transactionCount} = data;  				
  				setTransactionCount(transactionCount);
  			}
  			setIsCountingTransaction(false);
  		})
  }, []);
//key={Date.now()}
  const submitData = (e) => {
    e.preventDefault();     
    
  }

  return (
    <Dialog fullWidth={true} maxWidth={'sm'}
      onClose={()=>{}} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">
        {isCountingTransaction?'Counting transactions....':transactionCount===0?'Delete this sub category?':'There are transaction(s)'}        
      </DialogTitle>
      <DialogContent>
      	{
      		isCountingTransaction && <LoadingDiv />
      	}
      	{
      		!isCountingTransaction &&
      		transactionCount === 0 &&
      		<>      	
      			{name} in {categoryName}
      		</>                
      	}
      	{
      		!isCountingTransaction &&
      		transactionCount > 0 &&
      		<>      	
      			{transactionCount} transaction(s) under {name} in {categoryName}. Cannot delete.
      		</>                
      	}       	        
      </DialogContent>
      <DialogActions>
      	{
      		transactionCount === 0 &&
      		<Button onClick={deleteSub} color="primary"  
        		disabled={isCountingTransaction}        
        	>
          		Delete
        	</Button>
      	}        
        <Button onClick={()=>!isSubmittingData && cancelDelete()} color="secondary"
          disabled={isSubmittingData || isCountingTransaction}
        >
          Cancel
        </Button>        
      </DialogActions>
    </Dialog>
  );
}

export default CategoryManagement;