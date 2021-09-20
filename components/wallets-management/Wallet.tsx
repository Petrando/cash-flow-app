
import {useState, useEffect} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
          Grid, 
          ButtonGroup, 
          Button, 
          IconButton, 
          Card, 
          CardHeader,
          CardMedia,
          CardActionArea, 
          CardContent, 
          CardActions, 
          CircularProgress,
          Typography 
      } from '@material-ui/core';
import { List, Edit, Delete } from '@material-ui/icons';
import * as d3 from 'd3';
import ImageLoad from '../globals/ImageLoad';
import { API } from "../../config";
import { walletDisplayI } from '../../types';
import {useWalletStyles} from '../../styles/material-ui.styles';

const Wallet = ({isLoading, walletData, setEdit, setDelete}:walletDisplayI):JSX.Element => {
    const classes = useWalletStyles();
    const [iconSrc, setIconSrc] = useState<string>("");
    const {_id, name, icon, balance} = walletData;
    console.log(icon["data"]);
    const myIconSrc = {data:icon["data"], ["content-Type"]:icon["contentType"]}

    useEffect(()=>{
      setIconSrc(isLoading?"":`${API}/wallet/photo/${_id}`);
    }, [icon]);

    useEffect(()=>{
      console.log(iconSrc)
    }, [iconSrc]);

    return (
      <Grid item md={4} sm={6} xs={12} key={_id}>
        <Card>
          <CardActionArea>
            <CardHeader 
              title={name}
              subheader={`Rp. ${d3.format(",")(balance)}`}
            />
            {
              iconSrc===""?
              <CircularProgress />:
              <CardMedia 
                component="img"
                height="194"
                src={`${API}/wallet/photo/${_id}`}
              />
            }            
          </CardActionArea>
          <CardActions >                                          
            <Link href={{ pathname: `/transactions`, query: { _id, name, balance } }} >
            <a>
            <Button 
                color="primary" 
                variant="contained"
                startIcon={<List />}
                className={classes.walletButton} 
            >        
              Transactions
            </Button>
            </a>
            </Link>                                    
            <ButtonGroup>
              <IconButton color="primary"                
                onClick={()=>{setEdit()}}
                className={classes.walletButton}             
              > 
                <Edit />
              </IconButton>
              <IconButton color="secondary"                 
                onClick={()=>{setDelete()}}
                className={classes.walletButton}
              >
                <Delete />
              </IconButton> 
            </ButtonGroup>      
          </CardActions>
        </Card>
      </Grid>
    )
  }

  export default Wallet;