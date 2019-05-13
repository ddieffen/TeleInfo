<html>
  <head>
    <meta http-equiv="refresh" content="120" />
    <title>Consommation</title>
    <style>
    .stylePowerHP {
      fill: none;
      stroke: red;
      stroke-width: 1px;
    }
    .stylePowerHC {
      fill: none;
      stroke: steelblue;
      stroke-width: 1px;
    }
    .styleHPArea {
      stroke: red;
      stroke-width: 1px;
      fill: red;
      fill-opacity: 0.5;
    }
    .styleHCArea {
      stroke : steelblue;
      stroke-width: 1px;
      fill: steelblue;
      fill-opacity: 0.5;
    }
    .styleTemp {
      fill: none;
      stroke: black;
      stroke-width: 2px;
    }
    .styleSun {
      fill: none;
      stroke: yellow;
      stroke-width: 2px;
    }
    .styleSunArea {
      fill: yellow;
      fill-opacity: 0.6;
    }
    .axisSteelBlue text{
      fill: steelblue;
    }
    .axisCoral text{
      fill: black;
    }
   </style>
  </head>
  <body>
    <script src="d3.v5.min.js"></script>
    <script src="powerChart.js"></script>
    <br>
    <script src="hphcAnalysis.js"></script>
    <br>
    <?php include "getAnnualCost.php" ?>
  </body>
</html>
