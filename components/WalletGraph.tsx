import React, {useState, useEffect} from 'react';
import { useRouter } from 'next/router'
import * as d3 from 'd3';
import {getWalletGraphData} from '../api/transactionApi';
import bargraphStyles from '../styles/bargraph.css'

const bargraphData = [
            {title:'datasetTitle', dataset:[
                  {name:'bar 1', layers:[
                        {name:'l1', value:21}, {name:'l2', value:12}, {name:'l3', value:9}, {name:'l4', value:32}
                  ]},
                  {name:'bar 2', layers:[
                        {name:'l1', value:14}, {name:'l2', value:29}, {name:'l3', value:9}, {name:'l4', value:23}
                  ]},
                  {name:'bar 3', layers:[
                        {name:'l1', value:11}, {name:'l2', value:17}, {name:'l3', value:25}, {name:'l4', value:6}
                  ]},
                  {name:'bar 4', layers:[
                        {name:'l1', value:13}, {name:'l2', value:12}, {name:'l3', value:10}, {name:'l4', value:12}
                  ]}
            ]},
            {title:'some dataset', dataset:[
                  {name:'bar 1', layers:[
                        {name:'l1', value:33}, {name:'l2', value:10}, {name:'l3', value:19}
                  ]},
                  {name:'bar 2', layers:[
                        {name:'l1', value:4}, {name:'l2', value:21}, {name:'l3', value:29}
                  ]},
                  {name:'bar 3', layers:[
                        {name:'l1', value:11}, {name:'l2', value:27}, {name:'l3', value:15}
                  ]},
                  {name:'bar 4', layers:[
                        {name:'l1', value:3}, {name:'l2', value:22}, {name:'l3', value:10}
                  ]},
                  {name:'bar 5', layers:[
                        {name:'l1', value:33}, {name:'l2', value:22}, {name:'l3', value:0}
                  ]}
            ]}
      ];

const WalletGraph = (props) => {
      const router = useRouter();

      const [myGraphData, setMyGraphData] = useState([]);
      const [graphParams, setGraphParams] = useState({width:500, height:180, sorted:false,
                                                      mySvgCanvas: null,
                                                      xAxis:null, yAxis: null,
                                                      layers:null, 
                                                      x:null, y:null});

      const {mySvgCanvas} = graphParams;

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
/*
            let myGraphData = [];            
            bargraphData[0].dataset.forEach((d,i)=>{
                  let aDatum = {name:d.name, total:0}
                  d.layers.forEach((l,li)=>{
                        aDatum[l.name] = l.value;
                        aDatum.total+=l.value;
                  })

                  myGraphData.push(aDatum);
            });            
            setMyGraphData(myGraphData);*/

            if(myGraphData.length > 0){
                  if(mySvgCanvas===null){
                       createSvgContainer(myGraphData);                  
                  }else{
                        renderGraphToContainer(myGraphData, mySvgCanvas)
                  }
            }            
      }, [myGraphData]);

      const createSvgContainer = (myGraphData) => {
            // Disposal
            let w = 700;
            let h = 300;
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
    
            let {mySvgCanvas} = graphParams;
            if(mySvgCanvas===null){ setGraphParams({...graphParams, mySvgCanvas:svg});}
            renderGraphToContainer(myGraphData, svg);
      }

      const renderGraphToContainer = (myGraphData, mySvgCanvas) => {
            const margin = {top: 20, right: 20, bottom: 30, left: 40},
                              width = 700 - margin.left - margin.right,
                              height = 300 - margin.top - margin.bottom;

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
            let color = d3.scaleOrdinal().range(colorRange.concat(colorRange1));                                               

            console.log(myGraphData);
            
            x.domain(myGraphData.map(function(d) { return d.name; }));
            y.domain([0, d3.max(myGraphData, function(d) { return d.total; })]).nice();

            const keys1 = myGraphData[0].layers.map(d=>d.name);
            color1.domain(keys1);
            const keys2 = myGraphData[1].layers.map(d=>d.name);
            color2.domain(keys2);
            console.log(keys2)
            color.domain(keys1.concat(keys2));

            mySvgCanvas.selectAll("*").remove();
            
            mySvgCanvas.append("g")
                  .attr("class", "bargraphStyles.axis")
                  .attr("transform", "translate(0," + height + ")") 
                  .transition().duration(250)                       
                  .call(d3.axisBottom(x));

            
            mySvgCanvas.append("g")
                  .attr("class", "bargraphStyles.axis")                                          
                  .call(d3.axisLeft(y).ticks(null, "s"))
                  .transition().duration(250);

            if(mySvgCanvas!==null){
                  drawGraph(keys1, color, [myGraphData[0]], mySvgCanvas, x, y, height, 'income');                  
                  drawGraph(keys2, color, [myGraphData[1]], mySvgCanvas, x, y, height, 'expense');
            }            
            
            /*
            const dataLayers = d3.stack().keys(keys)(myGraphData)            

            let graphG = mySvgCanvas.selectAll("g.graphG")
                  .data(dataLayers)
                  .enter().append("g").attr("class", "graphG")                  
                  .attr("fill", function(d) { return color(d.key); })
                  .selectAll("rect")
                  .data(function(d) { return d; })
                  .enter().append("rect")//.attr("class", "graphRect")
                        .attr("x", function(d) { return x(d.data.name); })                                                                        
                        .attr("width", x.bandwidth())
                        .attr("y", height)
                        .transition().duration(250)
                        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
                        .attr("y", function(d) { return y(d[1]); }); */                 
      }

      const drawGraph = (keys, color, graphData, mySvgCanvas, x, y, height, classname) => {
            if(mySvgCanvas===null){
                  return;
            }
            console.log('keys : ', keys);
            const dataLayers = d3.stack().keys(keys)(graphData)            
            console.log(dataLayers);
            let graphG = mySvgCanvas.selectAll("g.graphG-" + classname)
                  .data(dataLayers)
                  .enter().append("g").attr("class", "graphG-" + classname)                  
                  .attr("fill", function(d) { console.log(d);
                                              console.log(d.key);
                                              console.log(color(d.key));
                                              return color(d.key); })
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

	return (            
		<div id="chart" className="svg-container" />                        
	)
}

export default WalletGraph;