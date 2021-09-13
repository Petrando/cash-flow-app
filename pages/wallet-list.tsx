import React, {useState, useEffect} from 'react';
import Head from 'next/head'
import Layout from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { Box, ButtonGroup, Button, CssBaseline, Container, Dialog, DialogTitle, DialogContent, DialogActions, Grid, IconButton, TextField } from "@material-ui/core";
import {Card, CardActionArea, CardContent, CardMedia, CardActions, CircularProgress, Paper, Typography, makeStyles} from "@material-ui/core";
import {PhotoCamera, Edit, Delete, AddAPhoto, TableChart}  from '@material-ui/icons/';
import imageCompression from 'browser-image-compression';
import {getWallets, updateWallet, deleteWallet} from '../api/walletApi';
import {API} from '../config';
import { walletI } from '../types';
import Wallet from '../components/wallets-and-transactions/Wallet';
import AddWalletDialog from '../components/wallets-and-transactions/AddWallet';
import EditWalletDialog from '../components/wallets-and-transactions/EditWallet';
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
            </Grid>
            :
            <p>No Wallets...</p>
          )
        }
      </Container>
      {
        addingWallet &&
        <AddWalletDialog 
          open={addingWallet} 
          cancelAdd={()=>{setAddingWallet(false)}} 
          finishAndRefresh={()=>{setRefresh(true); setAddingWallet(false);}}
        />
      }
      {
        idEdited!=="" &&
        <EditWalletDialog 
          open={idEdited!==""} 
          cancelEdit={() => {setIdEdit("")}}
          finishAndRefresh={()=>{setRefresh(true); setIdEdit("");}}
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