import React, {useState, useEffect, useReducer} from 'react';
import { useRouter } from 'next/router'
import * as d3 from 'd3';
import { makeStyles } from '@material-ui/core/styles';
import {FormControl, InputLabel, Select, MenuItem} from '@material-ui/core/';
import {getWalletGraphData} from '../api/transactionApi';
import bargraphStyles from '../styles/bargraph.css'

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


const WalletGraph = (props) => {
      const router = useRouter();
      const classes = useStyles();

      const [myGraphData, setMyGraphData] = useState([]);
      const [graphParams, setGraphParams] = useState({width:500, height:180, sorted:false,
                                                      mySvgCanvas: null,
                                                      xAxis:null, yAxis: null,
                                                      layers:null, 
                                                      x:null, y:null});

      const [graphState, dispatchGraphState] = useReducer(graphReducer, initialGraph);

      const { x, y, width, height} = graphParams;

      useEffect(()=>{    
            const {_id, name, balance} = router.query;             
            if(typeof _id !== 'undefined' && myGraphData.length === 0){
                  getWalletGraphData(_id)
                        .then(data=>{
                              if(typeof data==='undefined'){
                                    return;
                              }
                              if(data.error){
                                    console.log(data.error)
                              }else{
                                    const {categoryGraphData} = data;                                                                    
                                    setMyGraphData(categoryGraphData);
                              }
                        });
            }     
            if(myGraphData.length > 0){
                  if(graphParams.mySvgCanvas===null){
                       createSvgContainer(myGraphData);                  
                  }else{
                        renderGraphToContainer(myGraphData, mySvgCanvas)
                  }
            }            
      }, [myGraphData]);

      useEffect(()=>{            
            if(myGraphData.length > 0){
                  console.log(graphState);
                  const {graphBy} = graphState;
                  if(graphBy==='Value'){
                        renderStacked_ByValue();
                  }else{
                        renderStacked_ByPercentage();
                  }
            }
      }, [graphState]);

      const createSvgContainer = (myGraphData) => {
            // Disposal
            let w = 700;
            let h = 350;
            let sideMargin = 40;
            let topBottomMargin = 30;
            let barPadding = 1;
            let svg = d3
                  .select("#chart")
                  .attr(
                        "style",
                              "padding-bottom: " +
                               Math.ceil((h + 2 * topBottomMargin) * 10 / (w + 2 * sideMargin)) +
                               "%"
                  )
                  .append("svg")
                        .attr("preserveAspectRatio", "xMinYMin meet")
                        .attr(
                              "viewBox",
                              "0 0 "
                              .concat(w + 2 * sideMargin)
                              .concat(" ")
                              .concat(h + 2 * topBottomMargin)
                        )
                        .classed("svg-content", true)
                        .append("g").attr("id", "canvas")
                              .attr("transform", "translate(" + sideMargin + "," + topBottomMargin + ")");   
                
            setGraphParams({...graphParams, mySvgCanvas:svg});
            renderGraphToContainer(myGraphData, svg);
            console.log('contrainer created');
      }

      const renderGraphToContainer = (myGraphData, mySvgCanvas) => {
            const margin = {top: 20, right: 20, bottom: 30, left: 40},
                              width = 700 - margin.left - margin.right,
                              height = 350 - margin.top - margin.bottom;

            let x = d3.scaleBand()
                        .rangeRound([0, width])
                        .paddingInner(0.05)
                        .align(0.1);

            let y = d3.scaleLinear()    
                        .rangeRound([height, 0]);

            const colorRange = ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"];
            const colorRange1 = ["red", "grey", "blue", "yellow", "pink", "orange", "lightsteelblue"];
            let  color1 = d3.scaleOrdinal()
                        .range(colorRange);
            let color2 = d3.scaleOrdinal()
                        .range(colorRange1);                                                                      
            
            x.domain(myGraphData.map(function(d) { return d.name; }));
            y.domain([0, d3.max(myGraphData, function(d) { return d.total; })]).nice();

            const keys1 = myGraphData[0].layers.map(d=>d.name);
            color1.domain(keys1);
            const keys2 = myGraphData[1].layers.map(d=>d.name);
            color2.domain(keys2);

            mySvgCanvas.selectAll("*").remove();
            
            mySvgCanvas.append("g")
                  .attr("class", "bargraphStyles.axis.x")
                  .attr("transform", "translate(0," + height + ")") 
                  .transition().duration(250)                       
                  .call(d3.axisBottom(x));

            
            mySvgCanvas.append("g")
                  .attr("class", "bargraphStyles.axis.y")                                          
                  .call(d3.axisLeft(y).ticks(null, "s"))
                  .transition().duration(250);

            if(mySvgCanvas!==null){
                  drawGraph(keys1, color1, [myGraphData[0]], mySvgCanvas, x, y, height, 'income');                  
                  drawGraph(keys2, color2, [myGraphData[1]], mySvgCanvas, x, y, height, 'expense');
            }    

            setGraphParams({...graphParams, x, y, width, height});
      }

      const drawGraph = (keys, color, graphData, mySvgCanvas, x, y, height, classname) => {
            if(mySvgCanvas===null){
                  return;
            }           
            const dataLayers = d3.stack().keys(keys)(graphData)                        
            let graphG = mySvgCanvas.selectAll("g.graphG-" + classname)
                  .data(dataLayers)
                  .enter().append("g").attr("class", "graphG-" + classname)                  
                  .attr("fill", function(d) { return color(d.key); })
                  .selectAll("rect")
                  .data(function(d) { return d; })
                  .enter().append("rect")//.attr("class", "graphRect")
                        .attr("x", function(d) { return x(d.data.name); })                                                                        
                        .attr("width", x.bandwidth())
                        .attr("y", height)
                        .transition().duration(250)
                        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
                        .attr("y", function(d) { return y(d[1]); })
                        //.on("mouseover", function(d){console.log(d);});
      }

      const renderStacked_ByValue = () => {
            console.log('from renderStacked_ByValue, graphState.graphBy : ', graphState.graphBy);
            console.log('mySvgCanvas : ');
            console.log(mySvgCanvas);
            console.log('x : ', x, ', y :', y, ' width : ', width, ' height : ', height);
            
            y.domain([0, d3.max(myGraphData, function(d) { return d.total; })]).nice();

            const mySvgCanvas = d3.select("#canvas")
            // create the transition
            var transone = mySvgCanvas.transition()
                  .duration(250);

            // transition the bars (step one)
            var categoriesone_income = transone.selectAll(".graphG-income");
            categoriesone_income.selectAll("rect")
                  .attr("y", function(d) { return this.getBBox().y + this.getBBox().height - (y(d[0]) - y(d[1])) })
                  .attr("height", function(d) { return y(d[0]) - y(d[1]); });
                  
            var categoriesone_expense = transone.selectAll(".graphG-expense");
            categoriesone_expense.selectAll("rect")
                  .attr("y", function(d) { return this.getBBox().y + this.getBBox().height - (y(d[0]) - y(d[1])) })
                  .attr("height", function(d) { return y(d[0]) - y(d[1]); });
            // transition the bars (step two)
            var transtwo = transone.transition()
                  .delay(350)
                  .duration(350)
                  //.ease("bounce");
            var categoriestwo = transtwo.selectAll(".graphG");
            categoriestwo.selectAll("rect")
                  .attr("y", function(d) { return yscale(d[1]); });

            // change the y-axis
            // set the y axis tick format
            y.tickFormat(d3.format(".2s"));
            mySvgCanvas.selectAll("g.bargraphStyles.axis.y").call(d3.axisLeft(y).ticks(null, "s"))
                  .transition().duration(250);
                             
      }

      const renderStacked_ByPercentage = () => {
            console.log('from renderStacked_ByPercentage, graphState.graphBy : ', graphState.graphBy);     
            console.log('mySvgCanvas : ');
            console.log(graphParams.mySvgCanvas);
            console.log('x : ', x, ', y :', y, ' width : ', width, ' height : ', height);    

            const mySvgCanvas = d3.select("#canvas");
            console.log('mySvgCanvas by d3.select : ');
            console.log(mySvgCanvas);

            let y = d3.scaleLinear()    
                        .domain([0, 1])
                        .rangeRound([height, 0]);            
            // create the transition
            //var trans = mySvgCanvas.transition().duration(250);
            
            // transition the bars
            var graphG_income = mySvgCanvas.selectAll("g.graphG-income")
                                    .selectAll("rect")
                                    .transition().duration(250)
                                    .attr("y", function(d) { return y(d[1]); })
                                    .attr("height", function(d) { return y(d[0]) - y(d[1]); })
                              .attr("fill", function(d) { return 'pink'; });

            var graphG_income = mySvgCanvas.selectAll("g.graphG-expense")
                                    .selectAll("rect")
                                    .transition().duration(250)
                                    .attr("y", function(d) { return y(d[1]); })
                                    .attr("height", function(d) { return y(d[0]) - y(d[1]); })
            /*                              
            console.log('graphG : ');
            console.log(graphG_income);
            const graphRect_income = graphG_income.selectAll("rect");
            console.log('graphRect : ');
            console.log(graphRect_income)
            graphRect_income
                  .transition().duration(250)
                  .attr("y", function(d) { return y(d[1]); })
                  .attr("height", function(d) { return y(d[0]) - y(d[1]); });

            var graphG_expense = mySvgCanvas.selectAll("g.graphG-expense");            
            const graphRect_expense = graphG_expense.selectAll("rect");            
            graphRect_expense
                  .transition().duration(250)
                  .attr("y", function(d) { return y(d[1]); })
                  .attr("height", function(d) { return y(d[0]) - y(d[1]); });  */                
                  
            // change the y-axis
            // set the y axis tick format
                        
            mySvgCanvas.selectAll("g.bargraphStyles.axis.y").remove();
            y.tickFormat(d3.format(".0%"));
            mySvgCanvas.append("g")
                  .attr("class", "bargraphStyles.axis.y")                                          
                  .call(d3.axisLeft(y).ticks(null, "s"))
                  .transition().duration(250);       
      }

	return ( 
        <> 
            <div>
                  <FormControl className={classes.formControl}>
                        <InputLabel id="sort-label">Bargraph By</InputLabel>
                        <Select
                              labelId="sort-label"
                              id="sort-select"
                              value={graphState.graphBy!=='Percentage'?'Value':'Percentage'}
                              onChange={()=>dispatchGraphState({type:'TOGGLE_GRAPHBY'})}
                        >
                              <MenuItem value={"Value"}>Transaction Value</MenuItem>
                              <MenuItem value={"Percentage"}>Percentage</MenuItem>          
                        </Select>
                  </FormControl>
            </div>          
		<div id="chart" className="svg-container" />                        
        </>
	)
}

export default WalletGraph;