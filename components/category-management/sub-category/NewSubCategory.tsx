import { useState } from "react";
import {Paper, TextField, IconButton, Divider} from '@material-ui/core';
import { Check, Clear } from "@material-ui/icons";
import useStyles from "./styles";

interface newSubCategoryI {
    submitAdd:(arg0:string)=>void;
    cancelAdd:()=>void;
}

const NewSubCategory = ({submitAdd, cancelAdd}:newSubCategoryI):JSX.Element => {
    const classes = useStyles();
    
    const [newSubCategory, setNewSubLabel] = useState<string>('');
    
    return (
        <Paper component="form" className={classes.root}>            		
            <TextField
                autoFocus	              
                margin="dense"          		
                label="New Sub Category"
                type="text"  
                value={newSubCategory}        
                onChange={(e)=>setNewSubLabel(e.target.value)}
                fullWidth          		
            />
            <IconButton type="submit" 
                color='primary' 
                className={classes.iconButton} 
                aria-label="ok"
                onClick={(e)=>{
                    e.preventDefault();
                    submitAdd(newSubCategory)
                }}
                disabled={newSubCategory===""}
            >
                <Check />
            </IconButton>
            <Divider className={classes.divider} orientation="vertical" />
            <IconButton 
                color="secondary" 
                className={classes.iconButton} 
                aria-label="cancel"
                onClick={cancelAdd}
            >
                <Clear />
            </IconButton>
        </Paper>
    )
}

export default NewSubCategory;