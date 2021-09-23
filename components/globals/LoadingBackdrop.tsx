import React from 'react';
import { Backdrop, CircularProgress, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  divStyle: {
  	display:'flex', alignItems:'center', justifyContent:'center'
  }
}));

const LoadingBackdrop = ({isLoading}:{isLoading:boolean}):JSX.Element => {
	const classes = useStyles();
	
	return(
		<Backdrop className={classes.backdrop} open={isLoading} >
        	<CircularProgress color="inherit" />
    	</Backdrop>
	)	
}

export const LoadingDiv = ():JSX.Element => {
	const classes = useStyles();

	return (
		<div className={classes.divStyle}>
			<CircularProgress />
		</div>
	)
}

export default LoadingBackdrop;