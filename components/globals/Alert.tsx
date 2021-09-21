import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      '& > * + *': {
        marginTop: theme.spacing(2),
      },
    },
  }),
);

interface showAlertI {
    severity:string;
    label:string;
    handleClose?:()=>void;
}

export default function ShowAlert({severity, label, handleClose}:showAlertI):JSX.Element {
  const classes = useStyles();

  return (
    <div className={classes.root} onClick={()=>{handleClose()}}>
      <Alert severity={ 
                       severity==="error"?"error":
                       severity==="warning"?"warning":
                       severity==="info"?"info":
                       "success"
                       }>
            { label }
      </Alert>
    </div>
  );
}
