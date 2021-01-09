    var minTimestamp = 0;
    var maxTimestamp = 0;
    var minTemperature = 100;
    var maxTemperature = -100;
    var minHygrometry = 1000
    var maxHygrometry = 0

    var parseTime = d3.timeParse("%s");

    var tmargin = {top: 0, right: 50, bottom: 0, left: 50},
    twidth = 900 - tmargin.left - tmargin.right,
    theight = 175 - tmargin.top - tmargin.bottom;

    var tx = d3.scaleTime().range([0, twidth]);
    var ty = d3.scaleLinear().range([theight, 0]);

    var tsvg = d3.select("body").append("svg")
      .attr("width", twidth + tmargin.left + tmargin.right)
      .attr("height", theight + tmargin.top + tmargin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + tmargin.left + "," + tmargin.top + ")");

    var hmargin = {top: 0, right: 50, bottom: 0, left: 50},
    hwidth = 900 - hmargin.left - hmargin.right,
    hheight = 205 - hmargin.top - hmargin.bottom;

    var hx = d3.scaleTime().range([0, hwidth]);
    var hy = d3.scaleLinear().range([hheight, 0]);
    var py = d3.scaleLinear().range([hheight, 0]);

    var pm25x = d3.scaleTime().range([0, hwidth]);
    var pm25y = d3.scaleLinear().range([hheight, 0]);

    var pm25svg = d3.select("body").append("svg")
      .attr("width", hwidth + hmargin.left + hmargin.right)
      .attr("height", hheight + hmargin.top + hmargin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + hmargin.left + "," + hmargin.top + ")");

    var hsvg = d3.select("body").append("svg")
      .attr("width", hwidth + hmargin.left + hmargin.right)
      .attr("height", hheight + hmargin.top + hmargin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + hmargin.left + "," + hmargin.top + ")");

    function drawPM25(homeData) {
      //format the data
      homeData.forEach(function(d) {
        d.Date = parseTime(d.t);
      });

      maxPM = d3.max(homeData, function(d) { return d.pm25})

      //scale the range of the data
      pm25x.domain(d3.extent(homeData, function(d) { return d.Date;}));
      pm25y.domain([0, maxPM]);

      //add the valueline path
      pm25svg.selectAll("dot")
        .data(homeData)
        .enter().append("circle")
        .attr("class", "styleTemp")
        .attr("r", 0.3)
        .attr("cx", function(d){ return pm25x(d.Date); })
        .attr("cy", function(d){ return pm25y(d.pm25); });

      //add the X axis
      pm25svg.append("g")
        .call(d3.axisBottom(pm25x));

      //add the Y axis
      pm25svg.append("g")
        .attr("class", "axisCoral")
        .call(d3.axisLeft(pm25y));

      //add the Y1 axis
      pm25svg.append("g")
        .attr("class", "axisCoral")
        .attr("transform", "translate( " + hwidth + ", 0)")
        .call(d3.axisRight(pm25y));
    }

    function drawHum(hdata) {
      //format the data
      hdata.forEach(function(d) {
        d.Date = parseTime(d.t);
      });

      //scale the range of the data
      hx.domain(d3.extent(hdata, function(d) { return d.Date;}));
      hy.domain([minHygrometry, maxHygrometry+5]);

      //add the valueline path
      hsvg.selectAll("dot")
        .data(hdata)
        .enter().append("circle")
        .attr("class", "styleH1")
        .attr("r", 0.3)
        .attr("cx", function(d){ return tx(d.Date); })
        .attr("cy", function(d){ return hy(d.h1); });
      //add the valueline path
      hsvg.selectAll("dot")
        .data(hdata)
        .enter().append("circle")
        .attr("class", "styleH2")
        .attr("r", 0.3)
        .attr("cx", function(d) {return tx(d.Date); })
        .attr("cy", function(d) {return hy(d.h2); });
      //add the valueline path
      hsvg.selectAll("dot")
        .data(hdata)
        .enter().append("circle")
        .attr("class", "styleH3")
        .attr("r", 0.3)
        .attr("cx", function(d) {return tx(d.Date); })
        .attr("cy", function(d) {return hy(d.h3); });
      //add the valueline path
      hsvg.selectAll("dot")
        .data(hdata)
        .enter().append("circle")
        .attr("class", "styleH4")
        .attr("r", 0.3)
        .attr("cx", function(d) {return tx(d.Date); })
        .attr("cy", function(d) {return hy(d.h4); });
      //add the valueline path
      hsvg.selectAll("dot")
        .data(hdata)
        .enter().append("circle")
        .attr("class", "styleH5")
        .attr("r", 0.3)
        .attr("cx", function(d) {return tx(d.Date); })
        .attr("cy", function(d) {return hy(d.h5); });

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

    function drawTemp(tdata) {
       //find min and max in order to align the different datasets
      minTimestamp = d3.min(tdata, function(d) { return d.t})
      maxTimestamp = d3.max(tdata, function(d) { return d.t})

      //format the data
      tdata.forEach(function(d) {
        d.Date = parseTime(d.t);
      });

      //scale the range of the data
      tx.domain(d3.extent(tdata, function(d) { return d.Date;}));
      ty.domain([minTemperature, maxTemperature]);

      //add the valueline path
      tsvg.selectAll("dot")
        .data(tdata)
        .enter().append("circle")
        .attr("class", "styleT1")
        .attr("r", 0.3)
        .attr("cx", function(d) {return tx(d.Date); })
        .attr("cy", function(d) {return ty(d.t1); });
      //add the valueline path
      tsvg.selectAll("dot")
        .data(tdata)
        .enter().append("circle")
        .attr("class", "styleT2")
        .attr("r", 0.3)
        .attr("cx", function(d) {return tx(d.Date); })
        .attr("cy", function(d) {return ty(d.t2); });
      //add the valueline path
      tsvg.selectAll("dot")
        .data(tdata)
        .enter().append("circle")
        .attr("class", "styleT3")
        .attr("r", 0.3)
        .attr("cx", function(d) {return tx(d.Date); })
        .attr("cy", function(d) {return ty(d.t3); });
       //add the valueline path
      tsvg.selectAll("dot")
        .data(tdata)
        .enter().append("circle")
        .attr("class", "styleT4")
        .attr("r", 0.3)
        .attr("cx", function(d) {return tx(d.Date); })
        .attr("cy", function(d) {return ty(d.t4); });
      //add the valueline path
      tsvg.selectAll("dot")
        .data(tdata)
        .enter().append("circle")
        .attr("class", "styleT5")
        .attr("r", 0.3)
        .attr("cx", function(d) {return tx(d.Date); })
        .attr("cy", function(d) {return ty(d.t5); });

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

    function drawWeather(data) {
      //add min and max timestamp data
      var firstObj = {};
      firstObj["t"] = minTimestamp;
      firstObj["tmp"] = -100;
      firstObj["sun"] = -100;
      firstObj["hum"] = -100;
      firstObj["plui"] = -100;
      data.push(firstObj);
      var lastObj = {};
      lastObj["t"] = maxTimestamp;
      lastObj["tmp"] = -100;
      lastObj["sun"] = -100;
      lastObj["hum"] = -100;
      lastObj["plui"] = -100;
      data.push(lastObj);

      //sorting the data
      data.sort(function(a,b){
        return a["t"]-b["t"];
      })

      //format the data
      data.forEach(function(d) {
        d.Date = parseTime(d.t);
      });
      ty.domain([minTemperature, maxTemperature]);
      var maxPluie = 1;
      var maxPluieData = d3.max(data, function(d) { return d.plui});
      maxPluie = d3.max([maxPluie, maxPluieData]);

      py.domain([0, maxPluie]);

      //create the temperature line
      var tempLine2 = d3.line()
        .defined(function(d) {
          return d.tmp !== -100;
        })
        .x(function(d) { return tx(d.Date);})
        .y(function(d) { return ty(d.tmp);});

      //add the valueline path
      tsvg.append("path")
        .data([data])
        .attr("class", "styleTemp")
        .attr("d", tempLine2);

      //create the humidity line
      var humLine2 = d3.line()
        .defined(function(d) {
          return d.hum !== -100;
        })
        .x(function(d) { return hx(d.Date);})
        .y(function(d) { return hy(d.hum);});

      //add the valueline path
      hsvg.append("path")
        .data([data])
        .attr("class", "styleTemp")
        .attr("d", humLine2);

      //create the pluie line
      var pluiLine = d3.line()
        .defined(function(d) {
          return d.plui !== -100;
        })
        .x(function(d) { return hx(d.Date);})
        .y(function(d) { return py(d.plui);});

      //add the valueline path
      hsvg.append("path")
        .data([data])
        .attr("class", "stylePlui")
        .attr("d", pluiLine);

      //create the pluie area
      var pluiArea = d3.area()
        .defined(function(d){
          return d.plui !== -100;
        })
        .x(function(d) { return hx(d.Date);})
        .y0(hheight)
        .y1(function(d) { return py(d.plui);});

      //add the area under the plui path
      hsvg.append("path")
        .data([data])
        .attr("class", "stylePluiArea")
        .attr("d", pluiArea);
    }

    d3.json("getHome.php")
      .then( function(homeData) {
          d3.json("getWeather.php")
            .then( function(weatherData) {
               homeData.forEach(function(d) {
                 if(d.t1 !== -1){
                   minTemperature = d3.min([minTemperature, d.t1]);
                 }
                 if(d.t2 !== -1){
                   minTemperature = d3.min([minTemperature, d.t2]);
                 }
                 if(d.t3 !== -1){
                   minTemperature = d3.min([minTemperature, d.t3]);
                 }
               });
               maxTemperature = d3.max(homeData, function(d) { return d.t1});
               maxTemperature = d3.max([maxTemperature,  d3.max(homeData, function(d) { return d.t2})]);
               maxTemperature = d3.max([maxTemperature,  d3.max(homeData, function(d) { return d.t3})]);
               maxTemperature = d3.max([maxTemperature,  d3.max(homeData, function(d) { return d.t4})]);
               maxTemperature = d3.max([maxTemperature,  d3.max(homeData, function(d) { return d.t5})]);

               weatherData.forEach(function(d) {
                 if(d.tmp !== -1){
                   minTemperature = d3.min([minTemperature, d.tmp]);
                   maxTemperature = d3.max([maxTemperature, d.tmp]);
                 }
               });

               homeData.forEach(function(d) {
                 if(d.h1 !== -1){
                   minHygrometry = d3.min([minHygrometry, d.h1]);
                 }
                 if(d.h2 !== -1){
                   minHygrometry = d3.min([minHygrometry, d.h2]);
                 }
                 if(d.h3 !== -1){
                   minHygrometry = d3.min([minHygrometry, d.h3]);
                 }
               });
               maxHygrometry = d3.max(homeData, function(d) { return d.h1});
               maxHygrometry = d3.max([maxHygrometry,  d3.max(homeData, function(d) { return d.h2})])
               maxHygrometry = d3.max([maxHygrometry,  d3.max(homeData, function(d) { return d.h3})])
               weatherData.forEach(function(d) {
                 if(d.tmp !== -1){
                   minHygrometry = d3.min([minHygrometry, d.hum]);
                   maxHygrometry = d3.max([maxHygrometry, d.hum]);
                 }
               });

               drawTemp(homeData);
               drawHum(homeData);
               drawPM25(homeData);
               drawWeather(weatherData);
          });
      });
