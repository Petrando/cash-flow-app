import React, {useState, useEffect} from 'react';
import Head from 'next/head'
import Layout from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { Box, ButtonGroup, Button, CssBaseline, Container, Dialog, DialogTitle, DialogContent, DialogActions, Grid, IconButton, TextField } from "@material-ui/core";
import {Card, CardActionArea, CardContent, CardMedia, CardActions, CircularProgress, Paper, Typography, makeStyles} from "@material-ui/core";
import {PhotoCamera, Edit, Delete, AddAPhoto, TableChart}  from '@material-ui/icons/';
import imageCompression from 'browser-image-compression';
import {getWallets, createWallet, updateWallet, deleteWallet} from '../api/walletApi';
import {API} from '../config';
import { walletI } from '../types';
import Wallet from '../components/wallets-and-transactions/Wallet';
import LoadedImage from '../components/globals/ImageLoad';
import LoadingBackdrop from '../components/globals/LoadingBackdrop';

export default function WalletList() {

  const [wallets, setWallets] = useState([]);
  const [refreshMe, setRefresh] = useState(true);
  const [addingWallet, setAddingWallet] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [idEdited, setIdEdit] = useState<string>('');
  const [idToDelete, setIdToDelete] = useState<string>('');

  const [error, setError] = useState<string>("");
  
  useEffect(() => {
    if(refreshMe){   
      setIsLoading(true);   
      getWallets()
        .then(data => {
          if(typeof data==='undefined'){                   
            return;          
          }
          if(data.error){                    
            setError(data.error.toString())
          } else {
            setWallets(data);
          }
          setIsLoading(false);
          setRefresh(false);
        })   
    }        
  }, [refreshMe]);

  const deleteAndRefresh = () => {
    //setWallets(wallets.filter(d => d._id!==idToDelete));
    setIdToDelete("");
    setRefresh(true);
  }

  return (       
    <Layout>      
      <Head>
        <title>
          Wallets
        </title>
      </Head>
      {
        isLoading &&
        <LoadingBackdrop isLoading={isLoading} />
      }      
      <Box component="div" m={1}>
        <Button variant="contained" color="primary" size="small"
          onClick={()=>setAddingWallet(true)}
        >
          Add Wallet
        </Button>
      </Box>
      <section className={utilStyles.headingMd}>
        <h3 className={utilStyles.headingLg}>My Wallets</h3>        
      </section>
      <Container>                
        {
          !isLoading &&
          (
            wallets.length > 0 ?
            <Grid container spacing={1}>
              {wallets.map((d, i) => <Wallet 
                                        key={d._id}
                                        walletData={d}
                                        setEdit={()=>{setIdEdit(d._id)}}
                                        setDelete={()=>{setIdToDelete(d._id)}}
                                     />
                          )}
            </Grid>:
            <p>No Wallets...</p>
          )
        }
      </Container>
      {
        addingWallet &&
        <AddWalletDialog open={addingWallet} onClose={()=>setAddingWallet(false)} 
          closeAndRefresh={()=>{setRefresh(true); setAddingWallet(false);}}
        />
      }
      {
        idEdited!=="" &&
        <EditWalletDialog open={idEdited!==""} onClose={() => setIdEdit("")}
          closeAndRefresh={()=>{setRefresh(true); setIdEdit("");}}
          walletToEdit={wallets.filter(d=>d._id===idEdited)[0]}
        />
      }
      {
        idToDelete!=="" &&
        <DeleteWalletDialog open={idToDelete!==""} onClose={() => setIdToDelete("")}
          closeAndRefresh={deleteAndRefresh}
          walletToDelete={wallets.filter(d=>d._id===idToDelete)[0]}
        />
      }
    </Layout>       
  )
}

function AddWalletDialog({ onClose, open, closeAndRefresh }) {    
  const [walletName, setWalletName] = useState<string>('');
  const [walletError, setWalletError] = useState<string>('');
  const [balance, setBalance] = useState<number>(0);
  const [imgFile, setImgFile] = useState(null);  
  const [imgError, setImgError] = useState<string>('');
  const [picData, setPicData] = useState({
    displayPic:null, compressedProductPic:null, compressedDisplayPic:null, editedProductPic:null
  });   
  const [isSubmittingData, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");

  const {displayPic} = picData;

  useEffect(()=>{    
  }, []);

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
    formData.set("balance", balance);
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
          setSubmitError(data.error);
          setIsSubmitting(false);
        } else {
          console.log(data);
          setIsSubmitting(false);
          closeAndRefresh();
        }
      })   
  }

  return (
    <Dialog fullWidth={true} maxWidth={'sm'}
      onClose={()=>!isSubmittingData && onClose()} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">
        {!isSubmittingData?'Add New Wallet':'Submitting...'}
      </DialogTitle>
      <DialogContent>
        {!isSubmittingData &&
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
            onFocus={()=>setWalletError("")}
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
          <Grid item xs={12} md={6}>
            <Button 
              variant="contained"
              component="label"
              color="primary"
              variant="contained"
              style={{display:'flex', flexDirection:'column'}}
            >
              Wallet Icon
              <PhotoCamera />
              <input
                type="file"
                hidden
                onChange={(evt)=>{  
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
                onBlur={()=>{
                  if(imgFile===null){
                    setImgError("Wallet Icon is required.")
                  }
                }}
              />
            </Button >
          </Grid>
          <Grid item xs={12} md={6} >
            {
              displayPic!==null &&
              <Card>
                <CardActionArea>
                  <CardMedia 
                    style={{width:'100%', height:'140px'}}         
                    image={displayPic}
                    title="Wallet Icon"
                  />
                </CardActionArea>
              </Card>
            }
            {
              imgError!=="" &&
              <Typography variant="body2" color="error" gutterBottom>
                {imgError}
              </Typography>
            }
          </Grid>
        </Grid>
        </>
        }
        {isSubmittingData && 
          <p style={{textAlign:'center'}}>
            <CircularProgress />
          </p>
        }       
      </DialogContent>
      <DialogActions>
        <Button onClick={submitData} color="primary"
          disabled={isSubmittingData}
        >
          Submit
        </Button>
        <Button onClick={()=>!isSubmittingData && onClose()} color="secondary"
          disabled={isSubmittingData}
        >
          Cancel
        </Button>        
      </DialogActions>
    </Dialog>
  );
}

function EditWalletDialog({ onClose, open, closeAndRefresh, walletToEdit }) { 
  const [editDirty, setEditDirty] = useState<boolean>(false);

  const [walletName, setWalletName] = useState<string>('');
  const [walletError, setWalletError] = useState<string>('');
  const [balance, setBalance] = useState<number>(0);
  const [newImg, setNewImg] = useState(null);    
  const [picData, setPicData] = useState({
    displayPic:null, compressedProductPic:null, compressedDisplayPic:null, editedProductPic:null
  });   
  const [isSubmittingData, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");

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
    setEditDirty(false);
  }

  const submitData = (e) => {
    e.preventDefault();
    
    if(!editDirty){
      onClose();
    }

    if(walletError!==""){
      return;
    }

    const formData = new FormData();
    formData.set("name", walletName);
    formData.set("balance", balance);
    if(newImg!==null){
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
          closeAndRefresh();
        }
      })   
  }

  return (
    <Dialog fullWidth={true} maxWidth={'sm'}
      onClose={()=>!isSubmittingData && onClose()} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">
        {!isSubmittingData?"Edit Wallet":"Submitting edit...."}
      </DialogTitle>
      <DialogContent>
        {!isSubmittingData &&
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
              !editDirty && setEditDirty(true);           
            }}
            onFocus={()=>setWalletError("")}
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
              !editDirty && setEditDirty(true);
            }}
            fullWidth
            disabled
          />
          <Container disableGutters={true} maxWidth="lg">
            <Typography variant="h5">
              Wallet Icon
            </Typography>
            <LoadedImage source={`${API}/wallet/photo/${walletToEdit._id}`} imgStyle={{width:'auto', height:'120px'}} />
          </Container>
          <Grid container>            
            <Grid item xs={12} >
              <Button 
                variant="contained"
                component="label"
                color="primary"
                variant="contained"
                style={{display:'flex', flexDirection:'column'}}
              >
                New Icon
                <PhotoCamera />
                <input
                  type="file"
                  hidden
                  onChange={(evt)=>{  
                    if(typeof evt.target.files[0] === 'undefined'){
                      return;
                    }                                     
                    const imageFile = evt.target.files[0];
                    setNewImg(imageFile);                                  
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
                    !editDirty && setEditDirty(true);
                  }}               
                />
              </Button >
            </Grid>
            <Grid item xs={12} md={6} 
              style={{display:'flex', alignItems:'center', justifyContent:'center'}}
            >
            {
              displayPic!==null &&
              <Paper style={{width:'100%', height:'auto', display:'flex', alignItems:'center', justifyContent:'center', padding:'5px 5px'}}>          
                <img
                  style={{width:'auto', height:'120px'}}
                    src={displayPic}                    
                />
              </Paper>
            }
            </Grid>
          </Grid>
          </>
        }    
        {
          isSubmittingData &&
          <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
            <CircularProgress />
          </div>
        }    
      </DialogContent>
      <DialogActions>
        <Button onClick={submitData} color="primary"
          disabled={isSubmittingData}
        >
          Submit
        </Button>
        <Button onClick={initializeEditData} color="primary"
          disabled={isSubmittingData?true:!editDirty}
        >
          Reset
        </Button>
        <Button onClick={()=>!isSubmittingData && onClose()} color="secondary"
          disabled={isSubmittingData}
        >
          Cancel
        </Button>        
      </DialogActions>
    </Dialog>
  );
}

function DeleteWalletDialog({ onClose, open, closeAndRefresh, walletToDelete:{_id, name, balance} }) {      
  const [isSubmittingData, setIsSubmitting] = useState<boolean>(false);
  useEffect(()=>{        
  }, []);
//key={Date.now()}
  const submitData = (e) => {
    e.preventDefault();     
    deleteWallet(_id)
      .then(data => {        
        closeAndRefresh();
      })
  }

  return (
    <Dialog fullWidth={true} maxWidth={'sm'}
      onClose={()=>!isSubmittingData && onClose()} aria-labelledby="simple-dialog-title" open={open}>
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
        <Button onClick={submitData} color="primary"          
        >
          Delete
        </Button>
        <Button onClick={()=>!isSubmittingData && onClose()} color="secondary"
          disabled={isSubmittingData}
        >
          Cancel
        </Button>        
      </DialogActions>
    </Dialog>
  );
}
/*
export const getStaticProps: GetStaticProps = async () => {
  const allWallets = getWallets();
  console.log(allWallets);
  return {
    props: {
      
    }
  }
}*/

/*
<ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
        */