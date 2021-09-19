import { useEffect, useState } from 'react';
import { Button, IconButton, TextField, Divider, Dialog, DialogTitle,
        DialogContent, DialogActions, Container, Paper, Typography, makeStyles } from '@material-ui/core';
import { Check, Clear, Edit, Delete, Refresh, ExpandLess, ExpandMore, Add}  from '@material-ui/icons/';
import { addSubCategory, editSubCategory, deleteSubCategory, getTransactionCount } from "../../api/categoryApi";
import SubCategory from './SubCategory';
import NewSubCategory from "./NewSubCategory";
import DeleteSubCategoryDialog from './DeleteSubCategory';
import { LoadingDiv } from "../../components/globals/LoadingBackdrop"
import { categoryI } from '../../types';
import { useCategoryStyles } from "../../styles/material-ui.styles";

const useStyles = makeStyles((theme) => ({  
    addSubCategory:{
        padding:"5px"
    }
  }));

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
					<NewSubCategory submitAdd={submitAddAndRefresh} cancelAdd={()=>setAddingNewSub(false)} />:
					<Paper className={classes.addSubCategory}>
						<Button color="primary" variant="contained" size="small" startIcon={<Add />}
							onClick={()=>setAddingNewSub(true)}
						>
							Sub Category
						</Button>
					</Paper>
				}				
				{
					subCategories.length > 0 &&
					subCategories.map((sub, i)=><SubCategory key={sub._id} subCategoryData={sub} 
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

export default Category;