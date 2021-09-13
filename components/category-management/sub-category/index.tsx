
import {useState, useEffect} from 'react';
import { Paper, Typography, IconButton, Divider, makeStyles} from '@material-ui/core';
import {PhotoCamera, Edit, Delete, AddAPhoto, Refresh, TableChart, ExpandLess, ExpandMore, Add, Check, Clear}  from '@material-ui/icons/';
import EditSubCategory from './EditSubCategory';
import {subCategoryI} from "../../../types";
import useStyles from "./styles"

interface subCategoryComponentI {
    subData:subCategoryI;
    startEdit:()=>void;
    submitEdit:(arg0:string, arg1:string)=>void;
    cancelEdit:()=>void;
    idSubEdited:string;
    startDelete:(arg0:string)=>void;
}
    
const SubCategory = ({subData:{_id, name}, startEdit, submitEdit, cancelEdit, idSubEdited, startDelete}:subCategoryComponentI):JSX.Element => {
    const classes = useStyles();
    const iAmEdited = _id === idSubEdited;			
    
    return (
    <Paper component="form" className={classes.root}> 
    {
        iAmEdited?
        <EditSubCategory 
            subData={{_id, name}} 
            submitEdit={submitEdit} 
            cancelEdit={cancelEdit} 
        />
        :
        <>
            <Typography variant={"body2"} className={classes.fullwidthText}>			
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
                onClick={()=>{startDelete(_id)}}      			
            >
                <Delete />
            </IconButton>
      </>
    } 			
    </Paper>
)}

export default SubCategory;
    



    
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