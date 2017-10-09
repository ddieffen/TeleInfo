<html>
  <head>
    <title>Consommation</title>
    <style>
    /* The switch - the box around the slider */
    .switch {
      position: relative;
      display: inline-block;
      width: 60px;
      height: 34px;
    }

    /* Hide default HTML checkbox */
    .switch input {display:none;}

    /* The slider */
    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      -webkit-transition: .4s;
      transition: .4s;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 26px;
      width: 26px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      -webkit-transition: .4s;
      transition: .4s;
    }

    input:checked + .slider {
      background-color: #2196F3;
    }

    input:focus + .slider {
      box-shadow: 0 0 1px #2196F3;
  }

    input:checked + .slider:before {
      -webkit-transform: translateX(26px);
      -ms-transform: translateX(26px);
      transform: translateX(26px);
    }

    /* Rounded sliders */
    .slider.round {
      border-radius: 34px;
    }

    .slider.round:before {
      border-radius: 50%;
    }
    </style>
    <script src="http://code.jquery.com/jquery-1.10.1.min.js"></script>
  </head>
  <body>
    <table>
    <TR>
      <TD style="vertical-align:middle">
      <!-- Rounded switch -->
      <label class="switch">
        <input type="checkbox" class="checkItSalon" <?php include('heat-salon-checked.php') ?> >
        <span class="slider round"></span>
      </label>
      </TD>
      <TD style="vertical-align:middle">
        Chauffage Salon
      </TD>
      <TD>
        06h00-06h30 & 18h30-22h00
      </TD>
    </TR>
     <TR>
      <TD style="vertical-align:middle">
      <!-- Rounded switch -->
      <label class="switch">
        <input type="checkbox" class="checkItChambres" <?php include('heat-chambres-checked.php') ?> >
        <span class="slider round"></span>
      </label>
      </TD>
      <TD style="vertical-align:middle">
        Chauffage Chambres
      </TD>
      <TD>
        22h30-6h30
      </TD>
    </TR>
    <TR>
      <TD style="vertical-align:middle">
      <!-- Rounded switch -->
      <label class="switch">
        <input type="checkbox" class="checkItAutres" <?php include('heat-autres-checked.php') ?> >
        <span class="slider round"></span>
      </label>
      </TD>
      <TD style="vertical-align:middle">
        Chauffage Autres
      </TD>
      <TD>
        ____-9h00
      </TD>
    </TR>
    </table>
    <script type="text/javascript">
    $('.checkItSalon').bind('click', function() {
      if($(this).is(":checked")) {
          // checkbox is checked
          $.ajax({
            type: "POST",
            url: 'heat-salon-on.php',
            success: function(data) {

            },
            error: function() {

            },
            complete: function() {
              //alert('chauffage allumé fini');
            }
          });
      } else {
          // checkbox is not checked
          $.ajax({
            type: "POST",
            url: 'heat-salon-off.php',
            success: function(data) {
              //alert('chauffage salond éteind');
            },
            error: function() {
              //alert('erreur extinction chauffage salond');
            },
            complete: function() {
              //alert('chauffage éteind fini');
            }
          });
      }
    });

    $('.checkItAutres').bind('click', function() {
      if($(this).is(":checked")) {
          // checkbox is checked
          $.ajax({
            type: "POST",
            url: 'heat-autres-on.php',
            success: function(data) {
              //alert('chauffage autres allumé');
            },
            error: function() {
              //alert('erreur allumage chauffage autres');
            },
            complete: function() {
              //alert('chauffage allumé fini');
            }
          });
      } else {
          // checkbox is not checked
          $.ajax({
            type: "POST",
            url: 'heat-autres-off.php',
            success: function(data) {
              //alert('chauffage autres éteind');
            },
            error: function() {
              //alert('erreur extinction chauffage autres');
            },
            complete: function() {
              //alert('chauffage éteind fini');
            }
          });
      }
    });

    $('.checkItChambres').bind('click', function() {
      if($(this).is(":checked")) {
          // checkbox is checked
          $.ajax({
            type: "POST",
            url: 'heat-chambres-on.php',
            success: function(data) {
              //alert('chauffage allumé');
            },
            error: function() {
              //alert('erreur allumage chauffage chambres');
            },
            complete: function() {
              //alert('chauffage allumé fini');
            }
          });
      } else {
          // checkbox is not checked
          $.ajax({
            type: "POST",
            url: 'heat-chambres-off.php',
            success: function(data) {
              //alert('chauffage éteind');
            },
            error: function() {
              //alert('erreur extinction chauffage chambres');
            },
            complete: function() {
              //alert('chauffage éteind fini');
            }
          });
      }
    });

    </script>
    <?php
      include('teleinfo_graph.php')
    ?>
  </body>
</html>
