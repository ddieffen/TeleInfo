    var margin = {top: 20, right: 30, bottom: 30, left: 50},
    width = 900 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

    var parseTime = d3.timeParse("%s");

    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    var powerLineHP = d3.line()
      .defined(function(d) {
        return d.c == "HP";
      })
      .x(function(d) { return x(d.Date);})
      .y(function(d) { return y(d.Power); });
    var HPArea = d3.area()
      .defined(function(d) {
        return d.c == "HP";
      })
      .x(function(d) { return x(d.Date); })
      .y0(height)
      .y1(function(d) { return y(d.Power); });

    var powerLineHC = d3.line()
      .defined(function(d) {
        return d.c == "HC";
      })
      .x(function(d) { return x(d.Date);})
      .y(function(d) { return y(d.Power); });
    var HCArea = d3.area()
      .defined(function(d) {
        return d.c == "HC";
      })
      .x(function(d) { return x(d.Date); })
      .y0(height)
      .y1(function(d) { return y(d.Power); });

    var sunLine = d3.line()
      .defined(function(d) {
        return d.sun !== -1;
      })
      .x(function(d) { return x(d.Date);})
      .y(function(d) { return y(d.Sun);});

    var sunArea = d3.area()
      .defined(function(d) {
        return d.sun !== -1;
      })
      .x(function(d) { return x(d.Date); })
      .y0(height)
      .y1(function(d) { return y(d.Sun); });

    var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")"); 

    var minTimestamp = 0;
    var maxTimestamp = 0;

    function drawPower(data) {
      //find min and max in order to align the different datasets
      minTimestamp = d3.min(data, function(d) { return d.t})
      maxTimestamp = d3.max(data, function(d) { return d.t})

      //format the data
      data.forEach(function(d) {
        d.Date = parseTime(d.t);
        d.Power = d.p;
      });

      //scale the range of the data
      x.domain(d3.extent(data, function(d) { return d.Date;}));
      y.domain([0, d3.max(data, function(d) { return d.Power})]);

      //add the valueline path
      svg.append("path")
        .data([data])
        .attr("class", "stylePowerHC")
        .attr("d", powerLineHC);
      //add the area for sun power
      svg.append("path")
       .data([data])
       .attr("class", "styleHCArea")
       .attr("d", HCArea);
      //add the valueline path
      svg.append("path")
        .data([data])
        .attr("class", "stylePowerHP")
        .attr("d", powerLineHP);
      //add the area for sun power
      svg.append("path")
       .data([data])
       .attr("class", "styleHPArea")
       .attr("d", HPArea);

      //add the X axis
      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      //add the Y axis
      svg.append("g")
        .attr("class", "axisSteelBlue")
        .call(d3.axisLeft(y));
    }

    function drawTemperature(data) {
      //add min and max timestamp data
      var firstObj = {};
      firstObj["t"] = minTimestamp;
      firstObj["tmp"] = -1;
      firstObj["sun"] = -1;
      firstObj["hum"] = -1;
      data.push(firstObj);
      var lastObj = {};
      lastObj["t"] = maxTimestamp;
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
        d.Date = parseTime(d.t);
        d.Sun = d.sun;
      });

      //scale the range of the data
      x.domain(d3.extent(data, function(d) { return d.Date;}));

      //add value line for sun irradiation
      svg.append("path")
        .data([data])
        .attr("class", "styleSun")
        .attr("d", sunLine);

      //add the area for sun power
      svg.append("path")
       .data([data])
       .attr("class", "styleSunArea")
       .attr("d", sunArea);

      //add the X axis
      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    }

    d3.json("getPower.php")
      .then( function(data) {
        drawPower(data);

        d3.json("getTemperature.php")
          .then( function(data) {
            drawTemperature(data);
        });
      });
