import React, {useState, useEffect} from 'react';
import Head from 'next/head'
import Layout from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { Box, Button, Container, Grid } from "@material-ui/core";
import Wallet from '../components/wallets-and-transactions/Wallet';
import AddWalletDialog from '../components/wallets-and-transactions/AddWallet';
import EditWalletDialog from '../components/wallets-and-transactions/EditWallet';
import DeleteWalletDialog from '../components/wallets-and-transactions/DeleteWallet';
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
        <DeleteWalletDialog 
          open={idToDelete!==""} 
          cancelDelete={() => {setIdToDelete("")}}
          deleteAndRefresh={()=>{deleteAndRefresh()}}
          walletToDelete={wallets.filter(d=>d._id===idToDelete)[0]}
        />
      }
    </Layout>       
  )
}