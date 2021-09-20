import {useState} from 'react';
import Link from "next/link";
import {         
        Button, 
        Card,
        CardActionArea,
        CardActions,
        CardHeader,
        CardMedia,
        CircularProgress, 
        Dialog, 
        DialogTitle, 
        DialogContent, 
        DialogActions, 
        Grid, 
        Typography 
      } from '@material-ui/core';
import {Block, DeleteForever, List} from '@material-ui/icons';
import * as d3 from 'd3';
import { API } from "../../config";
import { deleteWallet } from "../../api/walletApi";
import { deleteWalletI } from "../../types";

function DeleteWalletDialog({ 
                                cancelDelete, 
                                open, 
                                deleteAndRefresh, 
                                walletToDelete:{_id, name, balance}
                            }:deleteWalletI):JSX.Element {      
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
                Delete this wallet?
                {isSubmittingData && <CircularProgress />}
            </DialogTitle>
            <DialogContent>        
                <Grid container>          
                    <Grid item xs={12} >                          
                        <Card>
                            <CardActionArea>
                                <CardHeader 
                                    title={name}
                                    subheader={`Rp. ${d3.format(",")(balance)}`}
                                />
                                <CardMedia 
                                    component="img"
                                    height="194"
                                    src={`${API}/wallet/photo/${_id}`}
                                />         
                            </CardActionArea>
                            <CardActions >                                          
                                <Link href={{ pathname: `/transactions`, query: { _id, name, balance } }} >
                                <a>
                                    <Button 
                                        color="primary" 
                                        variant="outlined"
                                        startIcon={<List />}                                        
                                    >        
                                        See Transactions
                                    </Button>
                                </a>
                                </Link> 
                            </CardActions>
                        </Card>         
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={submitData} 
                    color="primary"
                    variant="contained"
                    startIcon={<DeleteForever />}
                >
                    Delete
                </Button>
                <Button 
                    onClick={()=>!isSubmittingData && cancelDelete()} 
                    color="secondary"
                    variant="contained"
                    disabled={isSubmittingData}
                    startIcon={<Block />}
                >
                    Cancel
                </Button>        
            </DialogActions>
        </Dialog>
    );
  }

  export default DeleteWalletDialog;