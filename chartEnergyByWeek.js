//http://bl.ocks.org/mstanaland/6100713
var wNRGmargin = {top: 20, right: 25, bottom: 30, left: 25},
    wNRGwidth = 900 - wNRGmargin.left - wNRGmargin.right,
    wNRGrightAxis = wNRGwidth - wNRGmargin.left;
    wNRGheight = 350 - wNRGmargin.top - wNRGmargin.bottom;

var wNRGsvg = d3.select("body").append("svg")
    .attr("width", wNRGwidth + wNRGmargin.left + wNRGmargin.right)
    .attr("height", wNRGheight + wNRGmargin.top + wNRGmargin.bottom)
  .append("g")
    .attr("transform", "translate(" + wNRGmargin.left + "," + wNRGmargin.top + ")");

function drawWeeklyAverages(data) {

  var series = d3.stack()
    .keys(["wHP", "wHC"])
    (data);

  var x = d3.scaleBand()
    .domain(data.map(function(d) { return d.w; }))
    .rangeRound([wNRGmargin.left, wNRGwidth - wNRGmargin.right])
    .padding(0.1);

  var y = d3.scaleLinear()
    .domain([d3.min(series, stackMin), d3.max(series, stackMax)])
    .rangeRound([wNRGheight - wNRGmargin.bottom, wNRGmargin.top]);

  wNRGsvg.append("g")
    .selectAll("g")
    .data(series)
    .enter().append("g")
      .attr("class",  function(d) {
        if (d.key == "wHP"){ return "styleHPArea"; }
        else {return "styleHCArea"; }
      })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("width", x.bandwidth)
      .attr("x", function(d) { return x(d.data.w); })
    .attr("y", function(d) { return y(d[1]); })
    .attr("height", function(d) { return y(d[0]) - y(d[1]); })

  //add the X axis
  wNRGsvg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + y(0) + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)");

  //Add the Y axis
  wNRGsvg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + wNRGmargin.left + ",0)")
    .call(d3.axisLeft(y));

  var ty = d3.scaleLinear().range([wNRGheight-wNRGmargin.bottom, wNRGmargin.top]);
  var tMin = d3.min(data, function(d) { return d.wThome; });
  tMin = d3.min([tMin, d3.min(data, function (d) {return d.wText; })])
  var tMax = d3.max(data, function(d) { return d.wThome; });
  tMax = d3.max([tMax, d3.max(data, function (d) {return d.wText; })])
  ty.domain([tMin, tMax])

  var wtHomeLine = d3.line()
      .defined(function(d) {
        return d.wThome !== -1;
      })
      .x(function(d) { return x(d.w);})
      .y(function(d) { return ty(d.wThome);});

 var wtExtLine = d3.line()
      .defined(function(d) {
        return d.wThome !== -1;
      })
      .x(function(d) { return x(d.w);})
      .y(function(d) { return ty(d.wText);});

  var bw = x.bandwidth();

  wNRGsvg.append("path")
        .data([data])
        .attr("transform", "translate(" + bw/2 + ",0)")
        .attr("class", "styleT1")
        .attr("d", wtHomeLine);

  wNRGsvg.append("path")
        .data([data])
        .attr("transform", "translate(" + bw/2 + ",0)")
        .attr("class", "styleTemp")
        .attr("d", wtExtLine);

  wNRGsvg.append("g")
    .attr("transform", "translate(" + wNRGrightAxis + ",0)")
    .call(d3.axisRight(y));

  var sy = d3.scaleLinear().range([wNRGheight-wNRGmargin.bottom, wNRGmargin.top]);
  var sMax = d3.max(data, function(d) { return d.wSunkWh; });
  sy.domain([0, sMax])

  //Add Sun bar chart
  wNRGsvg.selectAll("bar")
    .data(data)
  .enter().append("rect")
    .attr("class", "styleSunArea")
    .attr("x", function(d) { return x(d.w)+bw/3; })
    .attr("width", bw/3)
    .attr("y", function(d) { return sy(d.wSunkWh); })
    .attr("height", function(d) { return wNRGheight - sy(d.wSunkWh) - wNRGmargin.bottom; });

  var py = d3.scaleLinear().range([wNRGheight-wNRGmargin.bottom, wNRGmargin.top]);
  var pMax = d3.max(data, function(d) { return d.wPlui; });
  py.domain([0, pMax])

  //Add Sun bar chart
  wNRGsvg.selectAll("bar")
    .data(data)
  .enter().append("rect")
    .attr("class", "stylePluiArea")
    .attr("x", function(d) { return x(d.w)+(2*bw/3); })
    .attr("width", bw/3)
    .attr("y", function(d) { return py(d.wPlui); })
    .attr("height", function(d) { return wNRGheight - py(d.wPlui) - wNRGmargin.bottom; });


}

function stackMin(serie) {
  return d3.min(serie, function(d) { return d[0]; });
}

function stackMax(serie) {
  return d3.max(serie, function(d) { return d[1]; });
}

d3.json("getWeeklyData.php")
    .then( function(data) {
       drawWeeklyAverages(data);
    });

