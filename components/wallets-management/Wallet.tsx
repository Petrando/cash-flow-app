
import Link from 'next/link';
import { Grid, ButtonGroup, Button, IconButton, Card, CardActionArea, CardContent, CardActions, 
         Typography, makeStyles } from '@material-ui/core';
import { TableChart, Edit, Delete } from '@material-ui/icons';
import ImageLoad from '../globals/ImageLoad';
import { API } from "../../config";
import { walletI } from '../../types';

const useStyles=makeStyles({  
    walletButton: {
      fontSize:'10px'
    }
})

interface walletDisplayI {
    walletData:walletI;
    setEdit:()=>void;
    setDelete:()=>void;
}

const Wallet = ({walletData, setEdit, setDelete}:walletDisplayI):JSX.Element => {
    const classes = useStyles();
    const {_id, name, icon, balance} = walletData;

    return (
      <Grid item md={4} sm={6} xs={12} key={_id}>
        <Card>
          <CardActionArea>
            <ImageLoad key={Date.now()}
              source={`${API}/wallet/photo/${_id}`} imgStyle={{width:'auto', height:'80px'}} />
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                {name}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {balance}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions >                                          
            <Link href={{ pathname: `/transactions`, query: { _id, name, balance } }} >
            <a>
            <Button 
                color="primary" 
                variant="contained"
                startIcon={<TableChart />}
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