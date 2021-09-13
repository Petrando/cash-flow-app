import { Paper, Typography, IconButton, Divider} from '@material-ui/core';
import { Edit, Delete }  from '@material-ui/icons/';
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