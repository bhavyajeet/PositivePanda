
 // set the dimensions and margins of the graph
 var margin = {top: 10, right: 30, bottom: 30, left: 40},
     width = 600 - margin.left - margin.right,
     height = 700 - margin.top - margin.bottom;
 
 // append the svg object to the body of the page
 var svg = d3.select("#my_dataviz")
   .append("svg")
     .attr("width", width + margin.left + margin.right)
     .attr("height", height + margin.top + margin.bottom)
   .append("g")
     .attr("transform",
           "translate(" + margin.left + "," + margin.top + ")");
 
 // get the data
 d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/1_OneNum.csv", function(data) {
 
   // X axis: scale and draw:
   var x = d3.scaleLinear()
       .domain([0, 1000])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
       .range([0, width]);
   svg.append("g")
       .attr("transform", "translate(0," + height + ")")
       .call(d3.axisBottom(x));
 
   // set the parameters for the histogram
   var histogram = d3.histogram()
       .value(function(d) { return d.price; })   // I need to give the vector of value
       .domain(x.domain())  // then the domain of the graphic
       .thresholds(x.ticks(70)); // then the numbers of bins
 
   // And apply this function to data to get the bins
   var bins = histogram(data);
 
   // Y axis: scale and draw:
   var y = d3.scaleLinear()
       .range([height, 0]);
       y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
   svg.append("g")
       .call(d3.axisLeft(y));
 
   // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
   // Its opacity is set to 0: we don't see it by default.
   var tooltip = d3.select("#my_dataviz")
     .append("div")
     .style("opacity", 0)
     .attr("class", "tooltip")
     .style("background-color", "black")
     .style("color", "white")
     .style("border-radius", "5px")
     .style("padding", "10px")
 
   // A function that change this tooltip when the user hover a point.
   // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
   var showTooltip = function(d) {
     tooltip
       .transition()
       .duration(100)
       .style("opacity", 1)
     tooltip
       .html("Range: " + d.x0 + " - " + d.x1)
       .style("left", (d3.mouse(this)[0]+20) + "px")
       .style("top", (d3.mouse(this)[1]) + "px")
   }
   var moveTooltip = function(d) {
     tooltip
     .style("left", (d3.mouse(this)[0]+20) + "px")
     .style("top", (d3.mouse(this)[1]) + "px")
   }
   // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
   var hideTooltip = function(d) {
     tooltip
       .transition()
       .duration(100)
       .style("opacity", 0)
   }
 
   // append the bar rectangles to the svg element
   svg.selectAll("rect")
       .data(bins)
       .enter()
       .append("rect")
         .attr("x", 1)
         .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
         .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
         .attr("height", function(d) { return height - y(d.length); })
         .style("fill", "#69b3a2")
         // Show tooltip on hover
         .on("mouseover", showTooltip )
         .on("mousemove", moveTooltip )
         .on("mouseleave", hideTooltip )
 
 });
 // set the dimensions and margins of the graph
 var Piewidth = 450
     Pieheight = 450
     Piemargin = 40
 // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
 var radius = Math.min(Piewidth, Pieheight) / 2 - Piemargin
 // append the svg object to the div called 'my_dataviz'
 var Piesvg = d3.select("#my_datavizPie")
 .append("svg")
     .attr("width", Piewidth)
     .attr("height", Pieheight)
 .append("g")
     .attr("transform", "translate(" + Piewidth / 2 + "," + Pieheight / 2 + ")");
 // Create dummy data
//  var Piedata = {a: 9, b: 20, c:30, d:8, e:12}
var Piedata = {Happy: 1, Sad: 0, Unblur: 0};
var today = new Date();
browser.storage.local.get("cl").then(
  (data) => {
    cl = data.cl;
    for(item of cl.i){
      var date = new Date(item.d);
      if(date.getMonth() == today.getMonth()){
        Piedata.Happy += item.c[0];
        Piedata.Sad += item.c[1];
        Piedata.Unblur += item.c[2];
      }
    }
     // set the color scale
    var Piecolor = d3.scaleOrdinal()
    .domain(Piedata)
    .range(['red','yellow','blue'])
    
    // Compute the position of each group on the pie:
    var pie = d3.pie()
    .value(function(d) {return d.value; })
    var data_ready = pie(d3.entries(Piedata))
    // Now I know that group A goes from 0 degrees to x degrees and so on.
    // shape helper to build arcs:
    var arcGenerator = d3.arc()
    .innerRadius(0)
    .outerRadius(radius)
    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    Piesvg
    .selectAll('mySlices')
    .data(data_ready)
    .enter()
    .append('path')
        .attr('d', arcGenerator)
        .attr('fill', function(d){ return(Piecolor(d.data.key)) })
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)
    // Now add the annotation. Use the centroid method to get the best coordinates
    Piesvg
    .selectAll('mySlices')
    .data(data_ready)
    .enter()
    .append('text')
    .text(function(d){ if(d.data.value > 0) return d.data.key})
    .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
    .style("text-anchor", "middle")
    .style("font-size", 17)
  }
)
