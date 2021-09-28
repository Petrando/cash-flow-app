import {  useState } from 'react';
import { Container, Button, Paper } from '@material-ui/core';
import { ExpandLess, ExpandMore, Add}  from '@material-ui/icons/';
import { addSubCategory, editSubCategory, deleteSubCategory } from "../../api/categoryApi";
import fetchJson from "../../lib/fetchJson";
import SubCategory from './SubCategory';
import NewSubCategory from './NewSubCategory';
import DeleteSubCategoryDialog from './DeleteSubCategory';
import { categoryI, newSubCategorySubmitI, editSubCategorySubmitI } from '../../types';
import { useCategoryStyles } from "../../styles/material-ui.styles";

const Category = ({categoryData:{_id, name, subCategories}, refresh}:
                  {
                    categoryData:categoryI, 
                    refresh:()=>void
                  }) => {
const classes = useCategoryStyles();

const [isOpen, setIsOpen] = useState<boolean>(true);
const [isAddingNewSub, setAddingNewSub] = useState<boolean>(false);
const [idSubEdited, setSubEdited] = useState<string>('');
const [idSubToDelete, setIdSubToDelete] = useState<string>('');

const submitAddAndRefresh = async (newSubCategory:newSubCategorySubmitI) => {    
      try {
          const addResult = await fetchJson("/api/categories/add-subcategory", {
            method: "POST",            
            headers: {
              Accept: 'application/json',
              "Content-Type": "application/json"
            },
            body: JSON.stringify({categoryId:_id, subCategory:newSubCategory})
          });
                    
          if(addResult.acknowledged && addResult.modifiedCount === 1){
            setAddingNewSub(false)
            refresh();
          }else{
            console.log(addResult)
          }
          
      } catch (error) {
          console.error("An unexpected error happened:", error);
      }
}

const submitEditAndRefresh = async (sub_id:string, editedSubCategory:editSubCategorySubmitI) => {		
      try {
          const editResult = await fetchJson("/api/categories/edit-subcategory", {
            method: "POST",            
            headers: {
              Accept: 'application/json',
              "Content-Type": "application/json"
            },
            body: JSON.stringify({categoryId:_id, subCategoryId:sub_id, subCategory:editedSubCategory.newName})
          });          
          console.log(editResult);  
          if(editResult.acknowledged && editResult.modifiedCount === 1){
            setSubEdited("")
            refresh();
          }else{
            console.log(editResult)
          }                
      } catch (error) {
          console.error("An unexpected error happened:", error);
          //dispatch({type:"TOGGLE_LOADING"});
      }      
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
        <Button 
            color="primary" 
            variant="contained" 
            fullWidth 
            endIcon={isOpen?<ExpandLess />:<ExpandMore />}
            onClick={()=>setIsOpen(!isOpen)}
        >
            {name}
        </Button>			
        {
            isOpen && 
            <>
            {
                isAddingNewSub?
                <NewSubCategory 
                        submitAdd={submitAddAndRefresh} 
                        cancelAdd={()=>{setAddingNewSub(false)}} />
                :
                <Paper className={classes.addSubCategory}>
                    <Button 
                        color="primary" 
                        variant="contained" 
                        size="small" 
                        startIcon={<Add />}
                        onClick={()=>setAddingNewSub(true)}
                    >
                        Sub Category
                    </Button>
                </Paper>
            }				
            {
                subCategories.length > 0 &&
                subCategories.map((sub, i)=><SubCategory 
                                                key={sub._id} 
                                                subCategoryData={sub} 
                                                startEdit={()=>{setSubEdited(sub._id)}}
                                                cancelEdit={()=>{setSubEdited('')}}
                                                submitEdit={submitEditAndRefresh}
                                                idSubEdited={idSubEdited}
                                                startDelete={()=>{setIdSubToDelete(sub._id)}}													
                                            />
                                 )
            }
            {
                idSubToDelete!=='' &&
                <DeleteSubCategoryDialog 
                               cancelDelete={()=>{setIdSubToDelete('')}} 
                               deleteSub={()=>{submitDeleteAndRefresh()}} 
                               categoryId={_id}
                               categoryName={name}
                               subToDelete={subCategories.filter(d => d._id===idSubToDelete)[0]}
                />
            }
            </>
        }
    </Container>
)}    

export default Category;

