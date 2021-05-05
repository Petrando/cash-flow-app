import * as d3 from 'd3';

let w = 350;
let h = 300;
let sideMargin = 10;
let topBottomMargin = 10;
let barPadding = 1;

const margin = {top: 0, right: 10, bottom: 10, left: 10},
                              width = w - margin.left - margin.right,
                              height = h - margin.top - margin.bottom;

const radius = Math.min(width, height) / 2                              

export default function drawPies(myGraphData, containerId, changeSelectedCategory){
    let mySvgCanvas = d3.select("#" +  containerId)
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
                    .attr("transform", "translate(" + width/2 + "," + height/2 + ")");                                                      

    //console.log(myGraphData);    

    const colorExpense = d3.scaleOrdinal(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
    const colorIncome =  d3.scaleOrdinal(["blue", "yellow", "pink", "orange", "lightsteelblue", "red", "grey"]);

    var pie = d3.pie()
        .sort(null)
        .value(function(d) { return d.value; });

    var path = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius - 70);

    var labelValue = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius - 10);     

    var arc = mySvgCanvas.selectAll(".arc")
        .data(pie(myGraphData.layers.filter(function(d){return d.value>  0})))
            .enter().append("g")
            .attr("class", "arc");

    const arcPath = arc.append("path")
        .attr("d", path)
        .attr("fill", function(d) { return containerId==="income"?colorIncome(d.data.value):colorExpense(d.data.value); })
        .style("cursor", "pointer");

    const arcText = arc.append("text")
        .attr("class", "valueText")
        .attr("transform", 
            function(d) { 
                //console.log(d);
                //return "translate(" + labelValue.centroid(d) + ")"; 
                var midAngle = d.endAngle < Math.PI ? d.startAngle/2 + d.endAngle/2 : d.startAngle/2  + d.endAngle/2 + Math.PI ;
                return "translate(" + labelValue.centroid(d)[0] + "," + labelValue.centroid(d)[1] + ") rotate(-90) rotate(" + (midAngle * 180/Math.PI) + ")"; 
            }
        )
        .attr("dy", ".35em")
        .attr('text-anchor','middle')
        .text(function(d) { 
            const {data:{name, value}} = d
            //return `Rp. ${d3.format(",d")(value)}`; 
            return name;
        })
        .attr("font-size", "10px")
        .style("pointer-events", "none");    

    arcPath
        .on("mouseover", function(e,d){            
            const {data} = d;            
            const {_id} = data;            
            arcText.filter(function(arcD){return arcD.data._id===_id})
                .transition().duration(250)
                .style("font-weight", "bold");

            arcPath.filter(function(pathD){return pathD.data._id !== _id})                
                .transition().duration(250)
                .style("opacity", 0.5);

            tooltip.transition().duration(250).style("opacity", 1);
            processTooltip(d);
        })
        .on("mousemove", function(d){

        })
        .on("mouseout", function(e, d){
            const {data} = d;
            const {_id} = data;
            arcText.filter(function(arcD){return arcD.data._id===_id})
                .transition().duration(250)
                .style("font-weight", "normal");

            arcPath.filter(function(pathD){return pathD.data._id !== _id})     
                .transition().duration(250)           
                .style("opacity", 1);                            

            tooltip.transition().duration(250).style("opacity", 0);
        })
        .on("click", function(e, d){
            const {data:{_id}} = d;
            changeSelectedCategory(myGraphData._id, _id);
        });

    function processTooltip(d){       
        const {data:{name, value}} = d;  
        const percentage = value/myGraphData.total;        

        tooltip.select("text.subCategoryName").text(name);
        tooltip.select("text.subCategoryValue").text('Rp. ' + d3.format(",d")(value) + ' (' + d3.format(",.1%")(percentage) + ')');
        tooltip.select("text.categoryName").text('Total ' + containerId);
        tooltip.select("text.categoryValue").text('Rp ' + d3.format(",d")(myGraphData.total));
    }        

    const tooltip = createTooltip(mySvgCanvas);                
}

function createTooltip(mySvgCanvas){
    var tooltip = mySvgCanvas.append("g")
        .attr("class", "tooltip")
        //.style("display", "none")
        .style("opacity", 0)
        .style("pointer-events", "none")
        .attr("transform", "translate(-" + width/10 + ",-" + height/8 + ")");
      
    /*tooltip.append("rect")
        .attr("x", -40)
        .attr("width", 150)
        .attr("height", 100)
        .attr("fill", "white")
        .style("opacity", 0.5)
        .style("pointer-events", "none");*/

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

    return tooltip;        
}