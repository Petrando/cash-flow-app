import {useState} from 'react';
import { Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Typography } from '@material-ui/core';
import {deleteWallet} from "../../api/walletApi";
import {walletI} from "../../types";

interface deleteWalletI {
    open:boolean;
    cancelDelete:()=>void;
    deleteAndRefresh:()=>void;
    walletToDelete:walletI;
}

function DeleteWalletDialog({ cancelDelete, open, deleteAndRefresh, walletToDelete:{_id, name, balance} }:deleteWalletI):JSX.Element {      
    const [isSubmittingData, setIsSubmitting] = useState<boolean>(false);
    
    const submitData = (e) => {
        e.preventDefault();     
        deleteWallet(_id)
            .then(data => {        
                deleteAndRefresh();
            })
    }
  
    return (
        <Dialog 
            fullWidth={true} 
            maxWidth={'sm'}
            onClose={()=>!isSubmittingData && cancelDelete()} 
            aria-labelledby="simple-dialog-title" 
            open={open}
        >
            <DialogTitle id="simple-dialog-title">
                You sure want to delete this wallet?
                {isSubmittingData && <CircularProgress />}
            </DialogTitle>
            <DialogContent>        
                <Grid container>          
                    <Grid item xs={12} >                          
                        <Typography variant="h5" gutterBottom>
                            {name}
                        </Typography>            
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={submitData} 
                    color="primary"
                >
                    Delete
                </Button>
                <Button 
                    onClick={()=>!isSubmittingData && cancelDelete()} 
                    color="secondary"
                    disabled={isSubmittingData}
                >
                    Cancel
                </Button>        
            </DialogActions>
        </Dialog>
    );
  }

  export default DeleteWalletDialog;