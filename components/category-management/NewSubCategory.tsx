import { useEffect, useState } from 'react';
import { Button, IconButton, TextField, Divider, Dialog, DialogTitle,
        DialogContent, DialogActions, Container, Paper, Typography, makeStyles } from '@material-ui/core';
import { Check, Clear, Edit, Delete, Refresh, ExpandLess, ExpandMore, Add}  from '@material-ui/icons/';
import { addSubCategory, editSubCategory, deleteSubCategory, getTransactionCount } from "../../api/categoryApi";
import { LoadingDiv } from "../../components/globals/LoadingBackdrop"
import { categoryI } from '../../types';
import { useCategoryStyles } from "../../styles/material-ui.styles";

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

export default NewSubCategory;