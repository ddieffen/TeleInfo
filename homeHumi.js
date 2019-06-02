    var hmargin = {top: 0, right: 30, bottom: 30, left: 50},
    hwidth = 900 - hmargin.left - hmargin.right,
    hheight = 175 - hmargin.top - hmargin.bottom;

    var hparseTime = d3.timeParse("%s");

    var hx = d3.scaleTime().range([0, hwidth]);
    var hy = d3.scaleLinear().range([hheight, 0]);

    var h1Line = d3.line()
      .defined(function(d) {
        return d.h1 !== -1;
      })
      .x(function(d) { return hx(d.Date);})
      .y(function(d) { return hy(d.h1);});
    var h2Line = d3.line()
      .defined(function(d) {
        return d.h2 !== -1;
      })
      .x(function(d) { return hx(d.Date);})
      .y(function(d) { return hy(d.h2);});
    var h3Line = d3.line()
      .defined(function(d) {
        return d.h3 !== -1;
      })
      .x(function(d) { return hx(d.Date);})
      .y(function(d) { return hy(d.h3);});

    var tmargin = {top: 0, right: 30, bottom: 0, left: 50},
    twidth = 900 - tmargin.left - tmargin.right,
    theight = 175 - tmargin.top - tmargin.bottom;

    var tparseTime = d3.timeParse("%s");

    var tx = d3.scaleTime().range([0, twidth]);
    var ty = d3.scaleLinear().range([theight, 0]);

    var t1Line = d3.line()
      .defined(function(d) {
        return d.t1 !== -1;
      })
      .x(function(d) { return tx(d.Date);})
      .y(function(d) { return ty(d.t1);});
    var t2Line = d3.line()
      .defined(function(d) {
        return d.t2 !== -1;
      })
      .x(function(d) { return tx(d.Date);})
      .y(function(d) { return ty(d.t2);});
    var t3Line = d3.line()
      .defined(function(d) {
        return d.t3 !== -1;
      })
      .x(function(d) { return tx(d.Date);})
      .y(function(d) { return ty(d.t3);});
    var tempLine2 = d3.line()
      .defined(function(d) {
        return d.tmp !== -1;
      })
      .x(function(d) { return tx(d.Date);})
      .y(function(d) { return ty(d.Temp);});

     var humLine2 = d3.line()
      .defined(function(d) {
        return d.tmp !== -1;
      })
      .x(function(d) { return hx(d.Date);})
      .y(function(d) { return hy(d.Hum);});

    var tsvg = d3.select("body").append("svg")
      .attr("width", twidth + tmargin.left + tmargin.right)
      .attr("height", theight + tmargin.top + tmargin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + tmargin.left + "," + tmargin.top + ")");

    var hsvg = d3.select("body").append("svg")
      .attr("width", hwidth + hmargin.left + hmargin.right)
      .attr("height", hheight + hmargin.top + hmargin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + hmargin.left + "," + hmargin.top + ")");
    var hhmin = 1000
    var hhmax = 0
    function drawHum(hdata) {
      //format the data
      hdata.forEach(function(d) {
        d.Date = parseTime(d.t);
      });

      //scale the range of the data
      hx.domain(d3.extent(hdata, function(d) { return d.Date;}));

      hy.domain([hhmin, hhmax+5]);

      //add the valueline path
      hsvg.append("path")
        .data([hdata])
        .attr("class", "styleH1")
        .attr("d", h1Line);
      //add the valueline path
      hsvg.append("path")
        .data([hdata])
        .attr("class", "styleH2")
        .attr("d", h2Line);
      //add the valueline path
      hsvg.append("path")
        .data([hdata])
        .attr("class", "styleH3")
        .attr("d", h3Line);

      //add the X axis
      hsvg.append("g")
        .call(d3.axisBottom(hx));

      //add the Y axis
      hsvg.append("g")
        .attr("class", "axisCoral")
        .call(d3.axisLeft(hy));

      //add the Y1 axis
      hsvg.append("g")
        .attr("class", "axisCoral")
        .attr("transform", "translate( " + hwidth + ", 0)")
        .call(d3.axisRight(hy));
    }

    var tminTimestamp = 0;
    var tmaxTimestamp = 0;
    var ttmin = 1000;
    var ttmax = -1000;
    function drawTemp(tdata) {
       //find min and max in order to align the different datasets
      tminTimestamp = d3.min(tdata, function(d) { return d.t})
      tmaxTimestamp = d3.max(tdata, function(d) { return d.t})

      //format the data
      tdata.forEach(function(d) {
        d.Date = tparseTime(d.t);
      });

      //scale the range of the data
      tx.domain(d3.extent(tdata, function(d) { return d.Date;}));
      var ttmax = d3.max(tdata, function(d) { return d.t1});
      ttmax = d3.max([ttmax,  d3.max(tdata, function(d) { return d.t2})])
      ttmax = d3.max([ttmax,  d3.max(tdata, function(d) { return d.t3})])

      ty.domain([ttmin, ttmax]);

      //add the valueline path
      tsvg.append("path")
        .data([tdata])
        .attr("class", "styleT1")
        .attr("d", t1Line);
      //add the valueline path
      tsvg.append("path")
        .data([tdata])
        .attr("class", "styleT2")
        .attr("d", t2Line);
      //add the valueline path
      tsvg.append("path")
        .data([tdata])
        .attr("class", "styleT3")
        .attr("d", t3Line);

      //add the X axis
      tsvg.append("g")
        .attr("transform", "translate(0," + theight + ")")
        .call(d3.axisBottom(tx));

      //add the Y axis
      tsvg.append("g")
        .attr("class", "axisCoral")
        .call(d3.axisLeft(ty));

      //add the Y1 axis
      tsvg.append("g")
        .attr("class", "axisCoral")
        .attr("transform", "translate( " + twidth + ", 0)")
        .call(d3.axisRight(ty));
    }

    function drawTemperature2(data) {
      //add min and max timestamp data
      var firstObj = {};
      firstObj["t"] = tminTimestamp;
      firstObj["tmp"] = -1;
      firstObj["sun"] = -1;
      firstObj["hum"] = -1;
      data.push(firstObj);
      var lastObj = {};
      lastObj["t"] = tmaxTimestamp;
      lastObj["tmp"] = -1;
      lastObj["sun"] = -1;
      lastObj["hum"] = -1;
      data.push(lastObj);

      //sorting the data
      data.sort(function(a,b){
        return a["t"]-b["t"];
      })

      //format the data
      data.forEach(function(d) {
        d.Date = tparseTime(d.t);
        d.Temp = d.tmp;
        d.Hum = d.hum;
      });
      ty.domain([ttmin, ttmax]);

      //add the valueline path
      tsvg.append("path")
        .data([data])
        .attr("class", "styleTemp")
        .attr("d", tempLine2);

      //add the valueline path
      hsvg.append("path")
        .data([data])
        .attr("class", "styleTemp")
        .attr("d", humLine2);
    }

    d3.json("getHome.php")
      .then( function(hdata) {
          d3.json("getTemperature.php")
            .then( function(data) {
               hdata.forEach(function(d) {
                 if(d.t1 !== -1){
                   ttmin = d3.min([ttmin, d.t1]);
                 }
                 if(d.t2 !== -1){
                   ttmin = d3.min([ttmin, d.t2]);
                 }
                 if(d.t3 !== -1){
                   ttmin = d3.min([ttmin, d.t3]);
                 }
               });
               ttmax = d3.max(hdata, function(d) { return d.t1});
               ttmax = d3.max([ttmax,  d3.max(hdata, function(d) { return d.t2})]);
               ttmax = d3.max([ttmax,  d3.max(hdata, function(d) { return d.t3})]);
               data.forEach(function(d) {
                 if(d.tmp !== -1){
                   ttmin = d3.min([ttmin, d.tmp]);
                   ttmax = d3.max([ttmax, d.tmp]);
                 }
               });

               hdata.forEach(function(d) {
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
               hhmax =  d3.max(hdata, function(d) { return d.h1});
               hhmax = d3.max([hhmax,  d3.max(hdata, function(d) { return d.h2})])
               hhmax = d3.max([hhmax,  d3.max(hdata, function(d) { return d.h3})])
               data.forEach(function(d) {
                 if(d.tmp !== -1){
                   hhmin = d3.min([hhmin, d.hum]);
                   hhmax = d3.max([hhmax, d.hum]);
                 }
               });

               drawTemp(hdata);
               drawHum(hdata);
               drawTemperature2(data);
          });
      });
