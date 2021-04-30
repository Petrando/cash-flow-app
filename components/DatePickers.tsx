import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
  }),
);

export default function DatePickers({id, label, myDate, changeDate}) {
  const classes = useStyles();

  const handleChange = (e) => {
    changeDate(label.toLowerCase(), e.target.value);    
  }

  return (
    <form className={classes.container} noValidate>
      <TextField
        id={id}
        label={label}
        type="date"        
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        value={myDate}
        onChange={handleChange}
      />
    </form>
  );
}

//Different change handler from above....
export function DatePickersB({id, label, myDate, changeDate}) {
  const classes = useStyles();  

  return (
    <form className={classes.container} noValidate>
      <TextField
        id={id}
        label={label}
        type="date"        
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        value={myDate}
        onChange={changeDate}
      />
    </form>
  );
}
