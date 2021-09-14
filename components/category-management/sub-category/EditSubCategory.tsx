import { useState, useEffect } from "react";
import { TextField, IconButton, Divider} from '@material-ui/core';
import { Check, Clear, Refresh } from "@material-ui/icons";
import { subCategoryI } from "../../../types";
import useStyles from "./styles";

interface editSubCategoryI {
    subData:subCategoryI;
    submitEdit:(arg0:string, arg1:string)=>void;
    cancelEdit:()=>void;
}

const EditSubCategory = ({subData:{_id, name}, submitEdit, cancelEdit}:editSubCategoryI):JSX.Element => {
    const classes = useStyles();
    
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
            <IconButton 
                type="submit" 
                color='primary' 
                className={classes.iconButton} 
                aria-label="ok"
                onClick={(e)=>{
                    e.preventDefault(); 
                    if(!editDirty){cancelEdit();}
                    else{submitEdit(_id, newName);}
                }}     					
            >
                <Check />
            </IconButton>
            <Divider className={classes.divider} orientation="vertical" />
            <IconButton 
                color='primary' 
                className={classes.iconButton} 
                aria-label="refresh" 
                disabled={!editDirty}
                onClick={initNewName}
            >
                <Refresh />
            </IconButton>
            <Divider className={classes.divider} orientation="vertical" />
            <IconButton 
                color='secondary' 
                className={classes.iconButton} 
                aria-label="cancel"
                onClick={cancelEdit}
            >
                <Clear />
            </IconButton>
        </>
    )
}

export default EditSubCategory;