import React from 'react';
import {FormControl, InputLabel, MenuItem, Select, makeStyles} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({  
  formControl: {
    margin: theme.spacing(1),
    width:'100%'
  }
}));

const SelectControl = ({labelId, label, selectId, selectItems, value, onChange, disabled=false}) => {
	const classes = useStyles();

	const selectItem = ({_id, name}) => (
		<MenuItem key={_id} value={_id}>{name}</MenuItem>
	)

	return (
		<FormControl className={classes.formControl} disabled={disabled}>
      <InputLabel id={labelId} disabled={disabled} >{label}</InputLabel>
      <Select
        labelId={labelId}
        id={selectId}  
        value={value} 
        onChange={(e)=>onChange(e.target.value)} 
        disabled={disabled}            			
      >
        {selectItems.map(selectItem)}
      </Select>
    </FormControl>
	)
}	

export default SelectControl;
