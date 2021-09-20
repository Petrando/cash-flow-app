import { useState, useEffect } from 'react';
import {
            Button, Card, CardActionArea, CardMedia, CircularProgress, Dialog, DialogTitle, 
            DialogContent, DialogActions, Grid, TextField
       } from '@material-ui/core';
import { PhotoCamera } from '@material-ui/icons';       
import imageCompression from 'browser-image-compression';
import { API } from "../../config";
import DialogSlide from '../globals/DialogSlide';
import { updateWallet } from "../../api/walletApi";
import {editWalletI} from "../../types";
import { useWalletStyles } from "../../styles/material-ui.styles";

function EditWalletDialog({ open, cancelEdit, finishAndRefresh, walletToEdit }:editWalletI):JSX.Element {  
    const classes = useWalletStyles();
    

    const [walletName, setWalletName] = useState<string>('');
    const [walletError, setWalletError] = useState<string>('');
    const [balance, setBalance] = useState<number>(0);
    const [newImg, setNewImg] = useState(null);
    const [picData, setPicData] = useState({
      displayPic:null, compressedProductPic:null, compressedDisplayPic:null, editedProductPic:null
    });   
    const [isSubmittingData, setIsSubmitting] = useState<boolean>(false);
    const [submitError, setSubmitError] = useState<string>("");

    const editDirty:boolean = walletName!==walletToEdit.name || balance!==walletToEdit.balance || newImg!==null;
  
    const {displayPic} = picData;

    useEffect(()=>{        
        initializeEditData();
      }, []);
    
    const initializeEditData = () => {       
        setWalletName(walletToEdit.name);
        setBalance(walletToEdit.balance);
        setWalletError('');
        setNewImg(null);
        setPicData({
          displayPic:null, compressedProductPic:null, compressedDisplayPic:null, editedProductPic:null
        });
        setSubmitError("");
    }
  
    const submitData = (e) => {
        e.preventDefault();
        
        if(!editDirty){
            cancelEdit();
        }
    
        if(walletError!==""){
            return;
        }
    
        const formData = new FormData();
        formData.set("name", walletName);
        formData.set("balance", balance.toString());
        if(newImg!==null){
            console.log('icon changed');
            formData.set("icon", newImg);
        }    
    
        setIsSubmitting(true);
        updateWallet(formData, walletToEdit._id)
            .then(data => {
                if(typeof data==='undefined'){
                    setSubmitError("No return type?");
                    setIsSubmitting(false);
                    return;          
                }
                if(data.error){          
                    setSubmitError(data.error);
                    setIsSubmitting(false);
                } else {          
                    setIsSubmitting(false);
                    finishAndRefresh();
                }
            })   
    }
  
    return (
        <Dialog 
            fullWidth={true} 
            maxWidth={'sm'}
            onClose={()=>{!isSubmittingData && cancelEdit()}} 
            aria-labelledby="simple-dialog-title" 
            open={open}
            TransitionComponent={DialogSlide}
        >
            <DialogTitle id="simple-dialog-title">
            {
                !isSubmittingData?'Edit Wallet':'Submitting...'
            }
            </DialogTitle>
            <DialogContent>
            {
                !isSubmittingData &&
                <>
                <TextField
                    autoFocus
                    error={walletError?true:false}
                    helperText={walletError}
                    margin="dense"
                    id="name"
                    label="Wallet Name"
                    type="text"
                    value={walletName}
                    onChange={(e)=>{
                        setWalletName(e.target.value);            
                    }}
                    onFocus={()=>{setWalletError("")}}
                    onBlur={()=>{
                        if(walletName===""){
                            setWalletError("Wallet name is required.")
                        }
                    }}
                    fullWidth
                    disabled={isSubmittingData}
                />
                <TextField          
                    margin="dense"
                    id="name"
                    label="Balance"
                    type="number"
                    value={balance}
                    onChange={(e)=>{
                        const {value} = e.target;
                        const newValue = parseInt(value);
                        const newBalance = (isNaN(newValue) || newValue < 0)?0:newValue;
                        setBalance(newBalance);
                    }}
                    fullWidth
                    disabled={isSubmittingData}
                />
                <Grid container>
                    <Grid item xs={12} className={classes.walletImageContainer}>
                        <Card className={classes.walletImage}>
                            <CardActionArea>
                                <CardMedia 
                                    style={{width:'100%', height:'194px'}}         
                                    image={displayPic==null?`${API}/wallet/photo/${walletToEdit._id}`:displayPic}
                                    title="Wallet Icon"
                                />
                            </CardActionArea>
                        </Card>
                        <Button 
                            variant="contained"
                            component="label"
                            color="primary"                                    
                            endIcon={<PhotoCamera />}
                        >
                            Wallet Icon                            
                            <input
                                type="file"
                                hidden
                                onChange={(evt)=>{  
                                    if(typeof evt.target.files[0] === 'undefined'){
                                        return;
                                    }                                     
                                    const imageFile = evt.target.files[0];
                                    setNewImg(imageFile);
                                    //setImgFile(imageFile);
                                    //setImgError("");
                                    console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
                                    console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);
                                    /*let reader = new FileReader();
  
                                    reader.onload = function(e) {
                                    setPicData({...picData, displayPic:e.target.result});
                                    }
  
                                    reader.readAsDataURL(evt.target.files[0]);*/
              
                                    const options = { 
                                        maxSizeMB: 0.5,          // (default: Number.POSITIVE_INFINITY)
                                        maxWidthOrHeight: 200,   // compressedFile will scale down by ratio to a point that width or height is smaller than maxWidthOrHeight (default: undefined)
                                        useWebWorker:true,      // optional, use multi-thread web worker, fallback to run in main-thread (default: true)
                                        /*maxIteration: number,       // optional, max number of iteration to compress the image (default: 10)
                                        exifOrientation: number,    // optional, see https://stackoverflow.com/a/32490603/10395024
                                        onProgress: Function,       // optional, a function takes one progress argument (percentage from 0 to 100) 
                                        fileType: string*/            // optional, fileType override
                                    }
                                    imageCompression(imageFile, options)
                                        .then(function (compressedFile) {
                                            console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
                                            console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
   
                                            //setCompressedProductPic(compressedFile); // write your own logic
                                            //setCompressedDisplayPic(URL.createObjectURL(compressedFile))
                                            setPicData({...picData, 
                                                displayPic:URL.createObjectURL(evt.target.files[0]),
                                                compressedProductPic:URL.createObjectURL(compressedFile),
                                                compressedDisplayPic:URL.createObjectURL(compressedFile)
                                            })
                                        })
                                        .catch(function (error) {
                                            console.log(error.message);
                                        });
                                        //setDisplayPic(URL.createObjectURL(evt.target.files[0]));
                                        //setPicData({...picData, displayPic:URL.createObjectURL(evt.target.files[0])})
                                }}                                
                            />
                        </Button >
                    </Grid>                    
                </Grid>
                </>
            }
            {
                isSubmittingData && 
                <p style={{textAlign:'center'}}>
                    <CircularProgress />
                </p>
            }       
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={submitData} 
                    color="primary"
                    disabled={isSubmittingData}
                >
                    Submit
                </Button>
                <Button 
                    onClick={initializeEditData} 
                    color="primary"
                    disabled={isSubmittingData || !editDirty}
                >
                    Reset
                </Button>
                <Button 
                    onClick={()=>!isSubmittingData && cancelEdit()} 
                    color="secondary"
                    disabled={isSubmittingData}
                >
                    Cancel
                </Button>        
            </DialogActions>
        </Dialog>
    );
  }

  export default EditWalletDialog;