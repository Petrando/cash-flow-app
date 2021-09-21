import React, {useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import { Grid } from '@material-ui/core/';
import {getWalletGraphData} from '../../api/transactionApi';
import drawPies from '../../components/charts/drawPies';
import LoadingBackdrop from '../../components/globals/LoadingBackdrop';
import TimeFilter from '../globals/filterComponents/TimeFilter';

let componentLoaded = false;

const WalletGraph = ({changeSelectedCategory, filter, dispatchFilter}):JSX.Element => {
      const router = useRouter();

      const [myGraphData, setMyGraphData] = useState([]);
      const [isLoading, setIsLoading] = useState<boolean>(false);
      
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
            <Grid item xs={6} id="income">
            </Grid>
            <Grid item xs={6} id="expense">
            </Grid>
          </Grid>
        </>
      )
}

export default WalletGraph;