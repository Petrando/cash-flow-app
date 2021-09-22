import React, {useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import { Grid } from '@material-ui/core/';
import {getWalletGraphData} from '../../api/transactionApi';
import drawPies from '../../components/charts/drawPies';
import LoadingBackdrop, {LoadingDiv} from '../../components/globals/LoadingBackdrop';
import TimeFilter from '../globals/filterComponents/TimeFilter';
import {useCommonStyles} from "../../styles/material-ui.styles";

let componentLoaded = false;

const WalletGraph = ({changeSelectedCategory, filter, dispatchFilter}):JSX.Element => {
      const classes = useCommonStyles();
      const router = useRouter();

      const [myGraphData, setMyGraphData] = useState([]);
      const [isLoading, setIsLoading] = useState<boolean>(true);
      
      useEffect(()=>{
        componentLoaded = true;
        return ()=>{
          componentLoaded = false;
        }
      }, [])

      useEffect(()=>{             
            const {_id } = router.query;             
            if(typeof _id !== 'undefined' && componentLoaded){                
                  setIsLoading(true);
                  getWalletGraphData(_id, filter)
                    .then(data=>{
                      if(typeof data==='undefined'){
                        setIsLoading(false);
                        return;
                      }                              
                      if(data.error){
                        console.log(data.error)
                      }else{                                    
                        const {categoryGraphData} = data;                                                                    
                        setMyGraphData(categoryGraphData);                                    
                        drawPies(categoryGraphData[0], "income", changeSelectedCategory);
                        drawPies(categoryGraphData[1], "expense", changeSelectedCategory);
                      }
                        setIsLoading(false);
                    });
            }     
                    
      }, [filter]);      
      
      return ( 
        <>
          {isLoading && <LoadingBackdrop isLoading={isLoading} />} 
          <TimeFilter 
            transactionFilter={filter} 
            dispatchFilter={dispatchFilter} 
          />         
          <Grid container>
            <Grid item xs={6} id="income" className={classes.flexRowCenter}>
              
            </Grid>
            <Grid item xs={6} id="expense" className={classes.flexRowCenter}>
              
            </Grid>
          </Grid>
        </>
      )
}

/*
{
                isLoading && <LoadingDiv />
              }
*/              
export default WalletGraph;