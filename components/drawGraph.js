import * as d3 from 'd3';
//import bargraphStyles from '../styles/bargraph.css';

let w = 700;
let h = 300;
let sideMargin = 40;
let topBottomMargin = 30;
let barPadding = 1;


export default function drawGraph(myGraphData){
	const margin = {top: 20, right: 20, bottom: 30, left: 40},
                              width = w - margin.left - margin.right,
                              height = h - margin.top - margin.bottom;

	console.log(myGraphData);                              

	let mySvgCanvas = d3
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

    const yMax = d3.max(myGraphData, function(d) { return d.total; });
    y.domain([0, 1]).nice();//.domain([0, yMax]).nice();    

    const keys1 = myGraphData[0].layers.map(d=>d.name);
    color1.domain(keys1);
    const keys2 = myGraphData[1].layers.map(d=>d.name);
    color2.domain(keys2);        
            
    let xaxis = mySvgCanvas.append("g")
        .attr("class", "bargraphStyles axis x")
        .attr("transform", "translate(0," + height + ")") 
        .transition().duration(250)                       
        .call(d3.axisBottom(x));
           
    let yaxis = mySvgCanvas.append("g")
        .attr("class", "bargraphStyles axis y")                                          
       	.call(d3.axisLeft(y).ticks(10, "%"))
        .transition().duration(250);

    const dataLayers1 = d3.stack().keys(keys1)([myGraphData[0]]) 
    dataLayers1.forEach((d,i)=>{
        d[0].push(i);       
        d[0].data.subCategoryIdx = i;        
    })       
      
    let graphG1 = mySvgCanvas.selectAll("g.graphG-income")
        .data(dataLayers1)
        .enter().append("g").attr("class", "graphG-income")                  
        .attr("fill", function(d) { return color1(d.key); });
            
    let graphRect_income = graphG1.selectAll("rect")
            .data(function(d) { return d; }, function(d){return d.data.name})
                .enter().append("rect")//.attr("class", "graphRect")
                    .attr("x", function(d) { return x(d.data.name); })                                                                        
                    .attr("width", x.bandwidth())
                    .attr("y", height);

	graphRect_income                    
            .transition().duration(250)
                .attr("height", function(d) { 
                    const myHeight = y(d[0]/d.data.total) - y(d[1]/d.data.total);                        	
                    return myHeight; })
                .attr("y", function(d) {                         	
                    return y(d[1]/d.data.total); 
                });

    graphRect_income.exit().remove();

    const offsetFromMousePointer = 300;

    graphRect_income
    	.on("mouseover", function(e,d,i) {             
            tooltip.style("display", null); 
        })
    	.on("mouseout", function() { tooltip.style("display", "none"); })
    	.on("mousemove", function(e,d, i) {   
            console.log(e); 		
    		const {offsetX, offsetY, pageX, pageY, x, y, screenX, screenY, clientX, clientY, movementX, movementY, layerX, layerY} = e;      		
            console.log(screenX, ', ', screenY);
      		
            const myX = pageX - document.getElementById("canvas").getBoundingClientRect().x - 80;			      		
            const myY = pageY - document.getElementById("canvas").getBoundingClientRect().x - 230;

      		tooltip.attr("transform", "translate(" + myX + "," + myY + ")");
      					
      		processTooltip(d);
    	});

	const dataLayers2 = d3.stack().keys(keys2)([myGraphData[1]]) 
	dataLayers2.forEach((d,i)=>{
        d[0].push(i);       
        d[0].data.subCategoryIdx = i;        
    })                       
    let graphG2 = mySvgCanvas.selectAll("g.graphG-expense")
        .data(dataLayers2)
        .enter().append("g").attr("class", "graphG-expense")                  
        .attr("fill", function(d) { return color2(d.key); });

    let graphRect_expense = graphG2.selectAll("rect")
            .data(function(d) { return d; }, function(d){return d.data.name})
                .enter().append("rect")//.attr("class", "graphRect")
                    .attr("x", function(d) { return x(d.data.name); })                                                                        
                    .attr("width", x.bandwidth())
                    .attr("y", height);

    graphRect_expense.transition().duration(250)
            .attr("height", function(d) { return y(d[0]/d.data.total) - y(d[1]/d.data.total); })
            .attr("y", function(d) { return y(d[1]/d.data.total); });

	graphRect_expense.exit().remove();

    graphRect_expense
    	.on("mouseover", function() { tooltip.style("display", null); })
    	.on("mouseout", function() { tooltip.style("display", "none"); })
    	.on("mousemove", function(e,d) {      		
      		const {offsetX, offsetY, pageX, pageY, x, y, screenX, screenY, clientX, clientY, movementX, movementY, layerX, layerY} = e;             
            const myX = pageX - document.getElementById("canvas").getBoundingClientRect().x - 300;                       
            const myY = pageY - document.getElementById("canvas").getBoundingClientRect().x - 280;
      		tooltip.attr("transform", "translate(" + myX + "," + myY + ")");
            processTooltip(d);      					      		
    }); 

    function processTooltip(d){       
        const {name, value} = d.data.layers[d[2]];  
        const percentage = value/d.data.total;        

        tooltip.select("text.subCategoryName").text(name);
        tooltip.select("text.subCategoryValue").text('Rp. ' + d3.format(",d")(value) + ' (' + d3.format(",.1%")(percentage) + ')');
        tooltip.select("text.categoryName").text('Total ' + d.data.name);
        tooltip.select("text.categoryValue").text('Rp ' + d3.format(",d")(d.data.total));
    }

	d3.selectAll("input.graphBy").on("change", handleFormClick);
	
	function handleFormClick() {
		if (this.value === "bypercent") {
			transitionPercent();
		} else {
			transitionCount();
		}
	}
	
	// transition to 'percent' presentation
	function transitionPercent() {		
		y.domain([0, 1]).nice();
		
		var categoriesIncome = mySvgCanvas.selectAll("g.graphG-income");
		categoriesIncome.selectAll("rect")
			.transition().duration(250)
			.attr("y", function(d) { 				
				return y(d[1]/d.data.total);
			})
			.attr("height", function(d) { 				
				return y(d[0]/d.data.total) - y(d[1]/d.data.total); 
			});

		var categoriesExpense = mySvgCanvas.selectAll("g.graphG-expense");
		categoriesExpense.selectAll("rect")
			.transition().duration(250)
			.attr("y", function(d) { return y(d[1]/d.data.total); })
			.attr("height", function(d) { return y(d[0]/d.data.total) - y(d[1]/d.data.total); });		
				
		mySvgCanvas.selectAll("g.bargraphStyles.axis.y").transition().duration(250)
					.call(d3.axisLeft(y).ticks(10, "%"));
	}
	
	// transition to 'count' presentation
	function transitionCount() {
		// set the yscale domain
		y.domain([0, d3.max(myGraphData, function(d) { return d.total; })]).nice();

		// create the transition
		var transone = mySvgCanvas.transition()
			.duration(250);
		
		var categoriesIncome = mySvgCanvas.selectAll("g.graphG-income");
		categoriesIncome.selectAll("rect")
			.transition().duration(250)
			.attr("y", function(d) { 				
				return y(d[1]);
			})
			.attr("height", function(d) { 				
				return y(d[0]) - y(d[1]); 
			});

		var categoriesExpense = mySvgCanvas.selectAll("g.graphG-expense");
		categoriesExpense.selectAll("rect")
			.transition().duration(250)
			.attr("y", function(d) { return y(d[1]); })
			.attr("height", function(d) { return y(d[0]) - y(d[1]); });

		// change the y-axis
		// set the y axis tick format
		
		mySvgCanvas.selectAll("g.bargraphStyles.axis.y")
			.transition().duration(250)
			.call(d3.axisLeft(y).ticks(null, "s"));
	} 

	var tooltip = mySvgCanvas.append("g")
    	.attr("class", "tooltip")
    	.style("display", "none")
        .style("pointer-events", "none");
      
  	tooltip.append("rect")
        .attr("x", -40)
    	.attr("width", 150)
    	.attr("height", 100)
    	.attr("fill", "white")
    	.style("opacity", 0.5)
        .style("pointer-events", "none");

  	tooltip.append("text")
        .attr("class", "subCategoryName")
    	.attr("x", 30)
    	.attr("dy", "1.2em")
    	.style("text-anchor", "middle")
    	.attr("font-size", "12px")
    	.attr("font-weight", "bold");

    tooltip.append("text")
        .attr("class", "subCategoryValue")
        .attr("x", 25)
        .attr("y", 20)
        .attr("dy", "1.2em")
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("font-weight", "bold");

    tooltip.append("text")
        .attr("class", "categoryName")
        .attr("x", 30)
        .attr("y", 40)
        .attr("dy", "1.2em")
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("font-weight", "bold");                                            			

    tooltip.append("text")
        .attr("class", "categoryValue")
        .attr("x", 30)
        .attr("y", 60)
        .attr("dy", "1.2em")
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("font-weight", "bold");
}