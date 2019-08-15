//http://bl.ocks.org/mstanaland/6100713
var wmargin = {top: 10, right: 0, bottom: 10, left: 20},
    wwidth = 710 - wmargin.left - wmargin.right,
    wheight = 180 - wmargin.top - wmargin.bottom;

var wsvg = d3.select("body").append("svg")
    .attr("width", wwidth + wmargin.left + wmargin.right)
    .attr("height", wheight + wmargin.top + wmargin.bottom)
  .append("g")
    .attr("transform", "translate(" + wmargin.left + "," + wmargin.top + ")");

function drawHPHCShares(data) {

  var series = d3.stack()
    .keys(["shareHP", "shareHC"])
    (data);

  var x = d3.scaleBand()
    .domain(data.map(function(d) { return d.w; }))
    .rangeRound([wmargin.left, wwidth - wmargin.right])
    .padding(0.1);

  var y = d3.scaleLinear()
    .domain([d3.min(series, stackMin), d3.max(series, stackMax)])
    .rangeRound([wheight - wmargin.bottom, wmargin.top]);

  var z = d3.scaleOrdinal(d3.schemeCategory10);

  wsvg.append("g")
    .selectAll("g")
    .data(series)
    .enter().append("g")
      .attr("class",  function(d) {
        if (d.key == "shareHP"){ return "styleHPArea"; }
        else {return "styleHCArea"; }
      })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("width", x.bandwidth)
      .attr("x", function(d) { return x(d.data.w); })
    .attr("y", function(d) { return y(d[1]); })
    .attr("height", function(d) { return y(d[0]) - y(d[1]); })

  wsvg.append("g")
    .attr("transform", "translate(0," + y(0) + ")")
    .call(d3.axisBottom(x));

  wsvg.append("g")
    .attr("transform", "translate(" + wmargin.left + ",0)")
    .call(d3.axisLeft(y));
}

function stackMin(serie) {
  return d3.min(serie, function(d) { return d[0]; });
}

function stackMax(serie) {
  return d3.max(serie, function(d) { return d[1]; });
}

d3.json("getHPHCSharesByWeek.php")
    .then( function(data) {
       drawHPHCShares(data);
    });

