import React, {useState, useEffect, useReducer} from 'react';
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles';
import {FormControl, Grid, InputLabel, Select, MenuItem} from '@material-ui/core/';
import {getWalletGraphData} from '../api/transactionApi';
import drawGraph from '../components/drawGraph';
import drawPies from '../components/drawPies';
import LoadingBackdrop from '../components/LoadingBackdrop';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 140,
  }
}));

const initialGraph = {graphBy:'Value'};

const graphReducer = (state, action) => {    
  switch (action.type) {
    case 'TOGGLE_GRAPHBY':
      const newGraphBy = state.graphBy==='Value'?'Percentage':'Value';
      return {...state, graphBy:newGraphBy}      
    case 'TOGGLE_GRAPH_RENDER':
       
      return {...state}       
    default:
      return state;      
  }
};


const WalletGraph = ({changeSelectedCategory}) => {
      const router = useRouter();
      const classes = useStyles();

      const [myGraphData, setMyGraphData] = useState([]);
      const [graphParams, setGraphParams] = useState({width:500, height:180, sorted:false,
                                                      mySvgCanvas: null,
                                                      xAxis:null, yAxis: null,
                                                      layers:null, 
                                                      x:null, y:null});
      const [isLoading, setIsLoading] = useState<boolean>(false);

      const [graphState, dispatchGraphState] = useReducer(graphReducer, initialGraph);

      const { x, y, width, height} = graphParams;

      useEffect(()=>{                
            const {_id, name, balance} = router.query;             
            if(typeof _id !== 'undefined' && myGraphData.length === 0){
                  setIsLoading(true);
                  getWalletGraphData(_id)
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
                    
      }, [myGraphData]);      
      
      return ( 
        <>
          {isLoading && <LoadingBackdrop isLoading={isLoading} />}          
          <Grid container>
            <Grid item xs={6} id="income">
            </Grid>
            <Grid item xs={6} id="expense">
            </Grid>
          </Grid>
        </>
      )
}

/*
<> 
            <div>
                  <FormControl className={classes.formControl}>                        
                        <label><input className="graphBy" type="radio" name="mode" value="bypercent" checked />Percentage</label>
                        <label><input className="graphBy" type="radio" name="mode" value="byvalue" /> Transaction Value</label>
                  </FormControl>
            </div>          
            <div id="chart" className="svg-container" />                        
        </>
*/        

export default WalletGraph;