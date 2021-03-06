//set the margins of the canevas
var marginb = {top: 30, right: 20, bottom: 30, left:50},
    widthb = 150 - marginb.left - marginb.right,
    heightb = 210 - marginb.top - marginb.bottom;

//set the ranges
var xb = d3.scaleBand().range([0, widthb]).padding(0.1);
var yb = d3.scaleLinear().range([heightb, 0]);

//add the svg element
var svgb = d3.select("body").append("svg")
    .attr("width", widthb + marginb.left + marginb.right)
    .attr("height", heightb + marginb.top + marginb.bottom)
  .append("g")
    .attr("transform",
        "translate(" + marginb.left + "," + marginb.top + ")");

d3.json("getHPHCShare.php")
  .then(function(data){
    data.forEach(function(d){
      d.Label = d.label;
      d.Value = d.value*100;
    });

    //scale the range of the data
    xb.domain(data.map(function(d) { return d.Label; }));
    yb.domain([40, d3.max(data, function(d) { return d.Value; })]);

    //add the x axis
    svgb.append("g")
      .attr("transform", "translate(0," + heightb + ")")
      .call(d3.axisBottom(xb));

    //add the y axis
    svgb.append("g")
      .call(d3.axisLeft(yb));

    // Add bar chart
    svgb.selectAll("bar")
      .data(data)
    .enter().append("rect")
      .attr("class", function(d) {
        if (d.Label == "HP"){ return "styleHPArea"; }
        else {return "styleHCArea"; }
      })
      .attr("x", function(d) { return xb(d.Label); })
      .attr("width", xb.bandwidth())
      .attr("y", function(d) { return yb(d.Value); })
      .attr("height", function(d) { return heightb - yb(d.Value); });
});
