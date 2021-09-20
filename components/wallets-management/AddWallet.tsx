import { useState } from 'react';
import {
            Button, Card, CardActionArea, CardMedia, CircularProgress, Dialog, DialogTitle, 
            DialogContent, DialogActions, Grid, TextField, Typography
       } from '@material-ui/core';
import { PhotoCamera } from '@material-ui/icons';       
import imageCompression from 'browser-image-compression';
import DialogSlide from '../globals/DialogSlide';
import { createWallet } from "../../api/walletApi";
import { useWalletStyles } from "../../styles/material-ui.styles";
import { addWalletI} from "../../types";

function AddWalletDialog({ open, cancelAdd, finishAndRefresh }:addWalletI):JSX.Element {    
    const classes = useWalletStyles();
    const [walletName, setWalletName] = useState<string>('');
    const [walletError, setWalletError] = useState<string>('');
    const [balance, setBalance] = useState<number>(0);
    const [imgFile, setImgFile] = useState(null);  
    const [imgError, setImgError] = useState<string>('');
    const [picData, setPicData] = useState({
      displayPic:null, compressedDisplayPic:null
    });   
    const [isSubmittingData, setIsSubmitting] = useState<boolean>(false);
    const [submitError, setSubmitError] = useState<string>("");
  
    const {displayPic} = picData;
  
    const submitData = (e) => {
        e.preventDefault();       
        if(imgFile===null){      
            setImgError("Wallet Icon is required.")
        }
        if(walletError!==""||imgError!==""||imgFile===null){
            return;
        }
  
        const formData = new FormData();
        formData.set("name", walletName);
        formData.set("balance", balance.toString());
        formData.set("icon", imgFile);
  
        setIsSubmitting(true);
        createWallet(formData)
            .then(data => {
                if(typeof data==='undefined'){
                    setSubmitError("No return type?");
                    setIsSubmitting(false);
                    return;          
                }
                if(data.error){          
                    setSubmitError(data.error.toString());
                    setIsSubmitting(false);
                } else {
                    console.log(data);
                    setIsSubmitting(false);
                    finishAndRefresh();
                }
            })   
    }
  
    return (
        <Dialog 
            fullWidth={true} 
            maxWidth={'sm'}
            onClose={()=>{!isSubmittingData && cancelAdd()}} 
            aria-labelledby="add-wallet-dialog" 
            open={open}
            TransitionComponent={DialogSlide}
        >
            <DialogTitle id="add-wallet-dialog">
            {
                !isSubmittingData?'Add New Wallet':'Submitting...'
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
                    {
                        imgError!=="" &&
                        <Grid item xs={12}>
                        <Typography variant="body2" color="error" gutterBottom>
                            {imgError}
                        </Typography>
                        </Grid>
                    }
                    <Grid item xs={12} className={classes.walletImageContainer}>
                        {
                            displayPic!==null &&
                            <Card className={classes.walletImage}>
                                <CardActionArea>
                                    <CardMedia 
                                        style={{width:'100%', height:'194px', objectFit:"fill"}}         
                                        image={displayPic}
                                        title="Wallet Icon"
                                    />
                                </CardActionArea>
                            </Card>
                        }
                        <Button 
                            variant="contained"
                            component="label"
                            color="primary"                                    
                            endIcon={<PhotoCamera />}
                            id="photoButton"          
                            onClick={()=>{setImgError("")}}                  
                        >
                            Wallet Icon                            
                            <input
                                type="file"
                                hidden
                                name="photoInput"
                                onChange={(evt)=>{  
                                    evt.stopPropagation();
                                    evt.preventDefault();
                                    if(typeof evt.target.files[0] === 'undefined'){
                                        return;
                                    }                                     
                                    const imageFile = evt.target.files[0];
                                    setImgFile(imageFile);
                                    setImgError("");
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
                                                compressedDisplayPic:URL.createObjectURL(compressedFile)
                                            })
                                        })
                                        .catch(function (error) {
                                            console.log(error.message);
                                        });
                                        //setDisplayPic(URL.createObjectURL(evt.target.files[0]));
                                        //setPicData({...picData, displayPic:URL.createObjectURL(evt.target.files[0])})
                                }}
                                onBlur={()=>{
                                        if(imgFile===null){
                                        setImgError("Wallet Icon is required.")
                                    }
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
                    onClick={()=>!isSubmittingData && cancelAdd()} 
                    color="secondary"
                    disabled={isSubmittingData}
                >
                    Cancel
                </Button>        
            </DialogActions>
        </Dialog>
    );
  }

  export default AddWalletDialog;