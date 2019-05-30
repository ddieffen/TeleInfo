    var hmargin = {top: 20, right: 20, bottom: 30, left: 50},
    hwidth = 750 - hmargin.left - hmargin.right,
    hheight = 250 - hmargin.top - hmargin.bottom;

    var hparseTime = d3.timeParse("%s");

    var hx = d3.scaleTime().range([0, hwidth]);
    var hy = d3.scaleLinear().range([hheight, 0]);
    var hy1 = d3.scaleLinear().range([hheight, 0]);

    var t1Line = d3.line()
      .defined(function(d) {
        return d.t1 !== -1;
      })
      .x(function(d) { return hx(d.Date);})
      .y(function(d) { return hy(d.t1);});
    var t2Line = d3.line()
      .defined(function(d) {
        return d.t2 !== -1;
      })
      .x(function(d) { return hx(d.Date);})
      .y(function(d) { return hy(d.t2);});
    var t3Line = d3.line()
      .defined(function(d) {
        return d.t3 !== -1;
      })
      .x(function(d) { return hx(d.Date);})
      .y(function(d) { return hy(d.t3);});
    var h1Line = d3.line()
      .defined(function(d) {
        return d.h1 !== -1;
      })
      .x(function(d) { return hx(d.Date);})
      .y(function(d) { return hy1(d.h1);});
    var h2Line = d3.line()
      .defined(function(d) {
        return d.h2 !== -1;
      })
      .x(function(d) { return hx(d.Date);})
      .y(function(d) { return hy1(d.h2);});
    var h3Line = d3.line()
      .defined(function(d) {
        return d.h3 !== -1;
      })
      .x(function(d) { return hx(d.Date);})
      .y(function(d) { return hy1(d.h3);});

    var hsvg = d3.select("body").append("svg")
      .attr("width", hwidth + hmargin.left + hmargin.right)
      .attr("height", hheight + hmargin.top + hmargin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + hmargin.left + "," + hmargin.top + ")"); 

    function drawTemp(hdata) {
      htmin = 1000;
      //format the data
      hdata.forEach(function(d) {
        d.Date = hparseTime(d.t);
        if(d.t1 !== -1){
          htmin = d3.min([htmin, d.t1]);
        }
        if(d.t2 !== -1){
          htmin = d3.min([htmin, d.t2]);
        }
        if(d.t3 !== -1){
          htmin = d3.min([htmin, d.t3]);
        }
      });

      //scale the range of the data
      hx.domain(d3.extent(hdata, function(d) { return d.Date;}));
      var htmax = d3.max(hdata, function(d) { return d.t1});
      htmax = d3.max([htmax,  d3.max(hdata, function(d) { return d.t2})])
      htmax = d3.max([htmax,  d3.max(hdata, function(d) { return d.t3})]) 

      hy.domain([htmin, htmax]);

      //add the valueline path
      hsvg.append("path")
        .data([hdata])
        .attr("class", "styleT1")
        .attr("d", t1Line);
      //add the valueline path
      hsvg.append("path")
        .data([hdata])
        .attr("class", "styleT2")
        .attr("d", t2Line);
      //add the valueline path
      hsvg.append("path")
        .data([hdata])
        .attr("class", "styleT3")
        .attr("d", t3Line);

      //add the X axis
      hsvg.append("g")
        .attr("transform", "translate(0," + hheight + ")")
        .call(d3.axisBottom(hx));

      //add the Y axis
      hsvg.append("g")
        .attr("class", "axisSteelBlue")
        .call(d3.axisLeft(hy));
    }

    function drawHum(hdata) {
      //format the data
      var hhmin = 1000;
      hdata.forEach(function(d) {
        d.Date = parseTime(d.t);
        if(d.h1 !== -1){
          hhmin = d3.min([hhmin, d.h1]);
        }
        if(d.h2 !== -1){
          hhmin = d3.min([hhmin, d.h2]);
        }
        if(d.h3 !== -1){
          hhmin = d3.min([hhmin, d.h3]);
        }
      });

      //scale the range of the data
      hx.domain(d3.extent(hdata, function(d) { return d.Date;}));
      var hhmax =  d3.max(hdata, function(d) { return d.h1});
      hhmax = d3.max([hhmax,  d3.max(hdata, function(d) { return d.h2})])
      hhmax = d3.max([hhmax,  d3.max(hdata, function(d) { return d.h3})])
      hy1.domain([hhmin, hhmax]);

      //add the valueline path
      hsvg.append("path")
        .data([hdata])
        .style("stroke-dasharray", ("3, 3"))
        .attr("class", "styleH1")
        .attr("d", h1Line);
      //add the valueline path
      hsvg.append("path")
        .data([hdata])
        .style("stroke-dasharray", ("3, 3"))
        .attr("class", "styleH2")
        .attr("d", h2Line);
      //add the valueline path
      hsvg.append("path")
        .data([hdata])
        .style("stroke-dasharray", ("3, 3"))
        .attr("class", "styleH3")
        .attr("d", h3Line);

      //add the X axis
      hsvg.append("g")
        .attr("transform", "translate(0," + hheight + ")")
        .call(d3.axisBottom(hx));

      //add the Y1 axis
      hsvg.append("g")
        .attr("class", "axisCoral")
        .attr("transform", "translate( " + hwidth + ", 0)")
        .call(d3.axisRight(hy1));
    }

    d3.json("getHome.php")
      .then( function(hdata) {
        drawTemp(hdata);
        drawHum(hdata);
      });
