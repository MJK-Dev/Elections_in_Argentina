
//Declare Global Variables--------------------------------------------------------------------------------------------------------------

var selectedProvince = "";
var finalQuorum =[["",0]]

//Round float value with passed precision when calling it (function)---------------------------------------------------------------------------------------------

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

// Helper Function-----------------------------------------------------------------------------------------------------------------

function trial(){

}


//Show Each Province Results (function)------------------------------------------------------------------------------------------------------------

function showProvince(selectedProvince){
    if ($('.input-senate-house').hasClass("show-house")) {
        var found = provincesResults.find(function(foundProvince) {
              return foundProvince[0] == selectedProvince;
            });
    } else {
        var found = provincesSenateResults.find(function(foundProvince) {
              return foundProvince[0] == selectedProvince;
            });
    }

    $('body').append('<div class="province-results-div">'
        + '<h1>Sin selección</h1>'
        +'<button class="buttonSeatsDetailed" onclick="calculateDetailedSeatsDistribution()">¿Cómo se asignan?</button>'
        + '<a class="close-cross" onclick="closeProvinceDiv()">✘</a>'
        + '<hr class="province-results-div-hr">'
        + '<div id="" class="party-results-div-top-title-party"><h3 class="subs-style">Partido</h3></div>'
        + '<div id="" class="party-results-div-top-title-allegiance"><h3 class="subs-style">Alianza</h3></div>'
        + '<div id="" class="party-results-div-top-title-percentage"><h3 class="subs-style">%</h3></div>'
        + '<div id="" class="party-results-div-top-title-seats"><h3 class="subs-style">Bancas</h3></div>'
        + '<div id="" class="party-results-div-top-title-spacing-div"></div>'
        + '</div>'
    )

    $(".province-results-div h1").text(selectedProvince);
    var percentageTotal = 0;
    var seatsTotal = 0;
    for(i=0; i < found[1].length ; i++){
        var partyName = found[1][i][0];
        var partyAllegiance = found[1][i][1];
        var partyPercentage = found[1][i][2];
        var partySeats = found[1][i][3];
        percentageTotal = percentageTotal + found[1][i][2];
        seatsTotal = seatsTotal + found[1][i][3];
        $('.province-results-div').append("<div id='' class='party-results-div'>"
        + "<div id='' class='party-results-div-name'><h3>"+partyName+"</h3></div>"
        + "<div id='' class='party-results-div-allegiance'><h3>"+partyAllegiance+"</h3></div>"
        +"<div id='' class='party-results-div-percentage'> <input type='number' value='"+ partyPercentage +"' step='1'></div>"
        +"<div id='' class='party-results-div-seats'><h3>"+partySeats+"</h3></div>"
        +"</div>");
    }

    $('.province-results-div').append("<div id='' class='province-results-sum-div'>"
    +"<div id='' class='party-results-div-bottom-title'><h3>Total</h3></div>"
    +"<div id='' class='party-results-sum-alert-div'><h3></h3></div>"
    +"<div id='' class='party-results-div-total-percentage'><input class='province-total-in-div' type='number' value='"+ percentageTotal +"'step='.01'></div>"
    +"<div id='' class='party-results-div-total-seats'><h3>"+seatsTotal+"</h3></div>"
    +" </div>");

  requestAnimationFrame(() =>
      setTimeout(() => {
      $(".province-results-div").toggleClass("show-party-results-div");
      })
  );

}

//Close Province Results Div--------------------------------------------------------------------------------------------

function closeProvinceDiv(){
    $(".province-results-div").remove();
}

function closeDetailedSeatDistributionDiv(){
    $(".detailed-seat-distribution-div").remove();
}

//Open Each Province Results when clicking on each province map------------------------------------------------------------------------------------------------------------

$( "body" ).on('click', ".svg-size2 g", function() {
    if ($(".province-results-div").hasClass("show-party-results-div")){
    closeProvinceDiv();
    }
    selectedProvince = (this.id).replaceAll("_", " ");
     if (selectedProvince === "Islas Malvinas"){
    selectedProvince = "Tierra Del Fuego";
    }
    showProvince(selectedProvince);

})

//Open Each Province Results when clicking on each province line on table---------------------------------------------------------------------------------------------


$( "body" ).on('click', ".province-full-results-div", function() {
    if ($(".province-results-div").hasClass("show-party-results-div")){
    closeProvinceDiv();
    }
    selectedProvince = ((this.id).replaceAll("_", " ")).slice(0,-6);
    showProvince(selectedProvince);

})


//Detect if clicking outside Province Results Div and close it---------------------------------------------------------------------------------------------

$(document).mouseup(function(e)
{
    var container = $(".province-results-div");
    // if the target of the click isn't the container nor a descendant of the container
    if($(".detailed-seat-distribution-div").hasClass("show-party-results-div")){

    } else {

    if($(".province-results-div").hasClass("show-party-results-div")){
    if (!container.is(e.target) && container.has(e.target).length === 0)
    {
        closeProvinceDiv();
    }
    }
    }
});

$(document).mouseup(function(e)
{
    var container = $(".detailed-seat-distribution-div");
    // if the target of the click isn't the container nor a descendant of the container
    if($(".detailed-seat-distribution-div").hasClass("show-party-results-div")){
    if (!container.is(e.target) && container.has(e.target).length === 0)
    {
        closeDetailedSeatDistributionDiv();
    }
    }
});


//Calculate Seats distribution (D'Hondt for House, 2/1 for Senate) (function)---------------------------------------------------------------------------------------------


window.calculateDistribution = function(seats,results){
        //House distribution (D'Hondt)-------------------------------------------------------------------
        if ($('.input-senate-house').hasClass("show-house")) {

        for (a=0; a < seats ; a++){
            var reminder = 0;

            var votes = 0;
            for (i=0; i < results[1].length ; i++){
                votes = parseFloat(results[1][i][2] /(results[1][i][3]+1));
                if (votes > reminder){
                    reminder = votes;
                    var seat_won_by = results[1].indexOf(results[1][i])
                }
            }
            results[1][seat_won_by][3] += 1
          }
        //Senate distribution (2/1)------------------------------------------------------------------------------
        } else{
        var first = results[1][0];
        var second = results[1][1];
        for (i=0; i < results[1].length ; i++){
                if (results[1][i][2] > first[2]){
                if (results[1][i][0] === second[0]){
                   second = first;
                   }
                   first = results[1][i]
               }
            }
        var firstFound = results[1].find(function(foundParty) {
          return foundParty[0] == first[0];
        });
        firstFound[3]=2;
        for (i=0; i < results[1].length ; i++){
                if (results[1][i][0] != first[0]){
                    if (results[1][i][2] > second[2]){
                   second = results[1][i]
                }
                }
            }
        var secondFound = results[1].find(function(foundParty) {
          return foundParty[0] == second[0];
        });
        secondFound[3]=1;
        }
       return results;
}

function displayDetailedSeatsDistribution(seatsDistributionDetailed, seats){
     $('body').append('<div class="detailed-seat-distribution-div"></div>');
     var numberSeatsTitle = ""

      for (i=0; i < seats ; i++){
      numberSeatsTitle += "<div class='detailed-seat-distribution-div-title-seat-number'><h3>"+(i+1)+"</h3></div>"
      }
     $('.detailed-seat-distribution-div').append('<div class="block-container">'
     +' <div class="detailed-seat-distribution-div-top-left-title">'
     + '<div class="detailed-seat-distribution-div-title-parties"><h3>Partido</h3></div>'
     + '<div class="detailed-seat-distribution-div-title-seats"><h3>Diputado #</h3></div>'
     + '<div class="detailed-seat-distribution-div-arrow"><h3>⮥</h3></div>'
     + '<div class="detailed-seat-distribution-div-arrow-parties"><h3>↴</h3></div>'
     + '</div>'
     + numberSeatsTitle
     + '<div class="detailed-seat-distribution-div-title-totals"><h3>Totales</h3></div>'
     + '</div>');

     for (i=0; i < seatsDistributionDetailed.length ; i++){
         var thisPartyAllocation = ""
         for (a=1; a < seats+1 ; a++){
             if (seatsDistributionDetailed[i][a][3] === false){
                thisPartyAllocation += "<div class='detailed-seat-distribution-div-each-allocation'><h3>"+round(seatsDistributionDetailed[i][a][2],2)+"</h3>"
                                        + "<h5>("+seatsDistributionDetailed[i][a][0]+"/"+ seatsDistributionDetailed[i][a][1] + ")</h5>"
                                        +"</div>"
             } else {
                thisPartyAllocation += "<div class='detailed-seat-distribution-div-each-allocation allocation-winner'><h3>"+round(seatsDistributionDetailed[i][a][2],2)+"</h3>"
                                        + "<h5>("+seatsDistributionDetailed[i][a][0]+"/"+ seatsDistributionDetailed[i][a][1] + ")</h5>"
                                        +"</div>"
             }
         }
         $('.detailed-seat-distribution-div').append('<div class="block-container">'
         +' <div class="detailed-seat-distribution-div-party-name"><h3>'+seatsDistributionDetailed[i][0][0]+'</h3></div>'
         + thisPartyAllocation
         + '<div class="detailed-seat-distribution-div-party-total"><h3>'+seatsDistributionDetailed[i][0][1]+'</h3></div>'
         + '</div>');


     }



 requestAnimationFrame(() =>
      setTimeout(() => {
      $(".detailed-seat-distribution-div").toggleClass("show-party-results-div");
      })
  );
}


window.calculateDetailedSeatsDistribution = function(){

     var seatsDistributionDetailed = []

     var found = provincesResults.find(function(foundProvince) {
              return foundProvince[0] == selectedProvince;
            });
     var thisProvince = JSON.parse(JSON.stringify(found));
     var seats = 0
     for(i=0; i <(thisProvince[1].length) ; i++){
            seats = seats + thisProvince[1][i][3];
            thisProvince[1][i][3] = 0;
            seatsDistributionDetailed.push([[thisProvince[1][i][0],0]]);
     }
     var arrayPosition = 0
     for (a=0; a < seats ; a++){
                var reminder = 0;
                var votes = 0;
                for (i=0; i < thisProvince[1].length ; i++){
                    votes = parseFloat(thisProvince[1][i][2] /(thisProvince[1][i][3]+1));
                    seatsDistributionDetailed[i].push([thisProvince[1][i][2],thisProvince[1][i][3]+1,votes,false]);
                    if (votes > reminder){
                        reminder = votes;
                        var seat_won_by = thisProvince[1].indexOf(thisProvince[1][i])
                    }
                }
                arrayPosition += 1
                thisProvince[1][seat_won_by][3] += 1
                seatsDistributionDetailed[seat_won_by][0][1] +=1
                seatsDistributionDetailed[seat_won_by][arrayPosition][3] = true;
     }

  displayDetailedSeatsDistribution(seatsDistributionDetailed, seats)

}




//Detect changes on Province Results Div Input and update all if sum of votes is equal to 100 (function)------------------------------

$('body').on('change', '.province-results-div input', function(){
    if ($('.input-senate-house').hasClass("show-house")) {
     var found = provincesResults.find(function(foundProvince) {
          return foundProvince[0] == selectedProvince;
        });
    } else {
        var found = provincesSenateResults.find(function(foundProvince) {
              return foundProvince[0] == selectedProvince;
                 });
    }

    var partyPercentages = $('.province-results-div input');
    var percentageTotal = 0;
    for(i=0; i <(partyPercentages.length-1) ; i++){
        var partyPercentage = parseFloat(partyPercentages[i].value);
        percentageTotal = percentageTotal + partyPercentage;
    }
    $(".province-total-in-div").val(percentageTotal);

    if ($(".province-total-in-div").val() > 99.9999 && $(".province-total-in-div").val() < 100.0001 ){
        var seats = 0
        for(i=0; i <(found[1].length) ; i++){
        seats = seats + found[1][i][3];
        found[1][i][2] = parseFloat(partyPercentages[i].value);
        found[1][i][3] = 0;
        }
        found = calculateDistribution(seats,found);
        var partySeats = $('.party-results-div-seats');
        for(i=0; i <(partySeats.length) ; i++){
            $('.party-results-div-seats')[i].innerText =(found[1][i][3]);
        }
        $(".province-total-in-div").removeClass("sum-not-hundred")
        $('.party-results-sum-alert-div h3').text("")
        updateAll()
     } else {
        $(".province-total-in-div").addClass("sum-not-hundred")
        $('.party-results-sum-alert-div h3').text("La suma debe ser 100 ➜")
     }
})

//Color Winner with different colors (2 function)---------------------------------------------------------------------------------------------

function colorProvince(provinceMap, winner){
    var color = "grey";
    if (winner[0] === "JxC"){
        color = "#fedb2c";
    } else if (winner[0] === "Frente de Todos"){
        color = "#1a73e5"
    }  else if (winner[1] === "PJ"){
        color = "#76b2ff"
    } else {
        color = "#626870"
    }

    $("#" + provinceMap).children().css("fill", color);
    if (provinceMap === "Tierra_Del_Fuego"){
       $("#Islas_Malvinas").children().css("fill", color);
    }

};

function colorWinners(){

    if ($('.input-senate-house').hasClass("show-house")) {
              var thisResults = provincesResults;
             } else {
              var thisResults = provincesSenateResults;
            }

    for(i=0; i < thisResults.length ; i++){
        var province = thisResults[i][0]
        var found = thisResults.find(function(foundProvince) {
          return foundProvince[0] == province;
        });
        var thisProvinceResults = found[1]
            var winner = thisProvinceResults[0];
            for(a=0; a < thisProvinceResults.length ; a++){
            if (thisProvinceResults[a][2] > winner[2]){
                winner = thisProvinceResults[a];
            }
            };
        provinceMap = province.replaceAll(" ", "_");
        colorProvince(provinceMap, winner);
    }
}


// Show Provinces on the central table (function)----------------------------------------------------------------------------------------------------

function displayProvincesResults(){
    $('.full-results-dynamic-div').remove();
    $('.full-results-div').append("<div class='full-results-dynamic-div'></div>")

    if ($('.input-senate-house').hasClass("show-house")) {
        var thisResults = provincesResults;
        var party1SeatsNotUpForElection = safeSeats[0][1][0][2];
        var party2SeatsNotUpForElection = safeSeats[0][1][1][2];
        var ownQuorum = 129;
    } else {
     var thisResults = provincesSenateResults;
     var party1SeatsNotUpForElection = safeSeats[1][1][0][2];
     var party2SeatsNotUpForElection = safeSeats[1][1][1][2];
     var ownQuorum=37;
    }

    var sumParty1Seats = 0;
    var sumParty2Seats = 0;
    for(i=0; i < thisResults.length ; i++){
        var province = thisResults[i][0];
        var provinceId =(province+'-table').replaceAll(" ", "_");
        var party1= thisResults[i][1][0];
        var party2= thisResults[i][1][1];
        var party3= thisResults[i][1][2];
        var restParties =[0,0];
        sumParty1Seats += party1[3];
        sumParty2Seats += party2[3];

        for (a=2 ; a < thisResults[i][1].length; a++){
            restParties[0] += thisResults[i][1][a][2];
            restParties[1] += thisResults[i][1][a][3];
                if(thisResults[i][1][a][2] > party3[2]){
                    party3= thisResults[i][1][a]
                }
        }
        restParties[0] -= party3[2];
        restParties[1] -= party3[3];
        var totalSeatsInProvince = party1[3] + party2[3] + party3[3] + restParties[1];

        $('.full-results-dynamic-div').append("<div id='"+provinceId+"' class='province-full-results-div'>"
        +"<div class='province-name-in-table'><h3>"+ province +"</h3></div>"
        +"<div class='party1-result-in-table'><h5>"+ party1[2].toFixed(2) +"</h5></div>"
        +"<div class='party1-seats-in-table'><h5>"+ party1[3] +"</h5></div>"
        +"<div class='party2-result-in-table'><h5>"+ party2[2].toFixed(2) +"</h5></div>"
        +"<div class='party2-seats-in-table'><h5>"+ party2[3] +"</h5></div>"
        +"<div class='party3-result-in-table'><h5>"+ party3[2].toFixed(2) +"</h5></div>"
        +"<div class='party3-seats-in-table'><h5>"+ party3[3] +"</h5></div>"
        +"<div class='restParties-result-in-table'><h5>"+ restParties[0].toFixed(2) +"</h5></div>"
        +"<div class='restParties-seats-in-table'><h5>"+ restParties[1] +"</h5></div>"
        + "<div class='total-seats-in-table'><h5>"+ totalSeatsInProvince +"</h5></div>"
        +"</div>");


        if (party1[2] === party2[2] & party1[2] === party3[2]){

        } else if (party1[2] > party2[2] & party1[2] > party3[2]){
            $('#'+provinceId +' .party1-result-in-table').addClass("party1-win party-winner-results-highlight");
            $('#'+provinceId +' .party1-seats-in-table').addClass("party1-win party-winner-seats-highlight");
        } else if (party2[2] > party3[2]){
            $('#'+provinceId +' .party2-result-in-table').addClass("party2-win party-winner-results-highlight");
            $('#'+provinceId +' .party2-seats-in-table').addClass("party2-win party-winner-seats-highlight");
        } else {
            $('#'+provinceId +' .party3-result-in-table').addClass("party3-win party-winner-results-highlight");
            $('#'+provinceId +' .party3-seats-in-table').addClass("party3-win party-winner-seats-highlight");
        }

    }

    var party1Total = sumParty1Seats + party1SeatsNotUpForElection;
    var party2Total = sumParty2Seats + party2SeatsNotUpForElection;
    $('.full-results-dynamic-div').append("<div class='full-results-totals-div'></div>");
    $('.full-results-totals-div').append("<div class='full-results-bottom-titles full-results-seats-won-title'><h5>Ganadas</h5></div>"
    +"<div class='full-results-bottom-titles full-results-seats-not-up-for-election-title'><h5>No renuevan</h5></div>"
    +"<div class='full-results-bottom-titles full-results-seats-total-title'><h5>Total</h5></div>"
    +"<div class='full-results-bottom-results full-results-party1-seats-won'><h4>"+sumParty1Seats+"</h4></div>"
    +"<div class='full-results-bottom-results full-results-party1-seats-not-up-for-election'><h4>"+party1SeatsNotUpForElection+"</h4></div>"
    +"<div class='full-results-bottom-results full-results-party1-seats-total'><h4>"+party1Total+"</h4></div>"
    +"<div class='full-results-bottom-results full-results-party2-seats-won'><h4>"+sumParty2Seats+"</h4></div>"
    +"<div class='full-results-bottom-results full-results-party2-seats-not-up-for-election'><h4>"+party2SeatsNotUpForElection+"</h4></div>"
    +"<div class='full-results-bottom-results full-results-party2-seats-total'><h4>"+party2Total+"</h4></div>"
    +"<div class='full-results-bottom-info-div'><h3></h3></div>"
    )
    if (sumParty1Seats > sumParty2Seats){
      $('.full-results-party1-seats-won').addClass("full-results-party1-seats-winner");
    } else if(sumParty1Seats < sumParty2Seats){
        $('.full-results-party2-seats-won').addClass("full-results-party2-seats-winner");
    }

    if (party1Total >= ownQuorum){
    $('.full-results-bottom-info-div h3').text("JxC tendría quorum propio")
    } else if (party2Total >= ownQuorum) {
    $('.full-results-bottom-info-div h3').text("FdT tendría quorum propio")
    } else {
    $('.full-results-bottom-info-div h3').text("Nadie con quorum propio")
    }

    if (party1Total > party2Total){
      $('.full-results-party1-seats-total').addClass("full-results-party1-seats-winner");
    } else if(party1Total < party2Total){
        $('.full-results-party2-seats-total').addClass("full-results-party2-seats-winner");
    }

}


// Calculate National Results and Display Table (function)----------------------------------------------------------------------------------------------------

function calculateNationalResults(){
    $('.temporary-national-results-div').remove();

    if ($('.input-senate-house').hasClass("show-house")) {
          var thisResults = nationalResults;
          var thisProvincesResults = provincesResults;
         } else {
          var thisResults = nationalResultsSenate;
          var thisProvincesResults = provincesSenateResults;
        }

    for(i=0; i < thisResults.length ; i++){
      thisResults[i][2] = 0;
    }
    for(i=0; i < thisResults.length ; i++){
      thisResults[i][3]=0;
      for(a=0; a < thisProvincesResults.length ; a++){
        for(b=0; b < thisProvincesResults[a][1].length ; b++){
            if (thisProvincesResults[a][1][b][0] === thisResults[i][1] ){
                thisResults[i][2] += thisProvincesResults[a][1][b][3];
                thisResults[i][3] += thisProvincesResults[a][1][b][2]*thisProvincesResults[a][2];

            }
        }
      }
    }
    $('.national-results-div').append("<div id='temporary-national-results-div' class='temporary-national-results-div'></div>");
    if ($('.input-parties-allegiances').hasClass("show-parties")) {
        for(i=0; i < thisResults.length ; i++){
              var partyName = thisResults[i][1];
              var partyAllegiance = thisResults[i][0];
              var partySeats = thisResults[i][2];
              var partyPercentage = round(thisResults[i][3],2);
              var thisId = "national_" + partyName.replaceAll(" ", "_");
              $('.temporary-national-results-div').append("<div class='party-national-results-div'>"
              +"<div class='party-name-in-national-results'><h3>"+partyName+"</h3></div>"
              +"<div class='allegiance-name-in-national-results'> <select id='"+thisId+"' name='allegiance' class='select-allegiance'>"
              +" <option value='"+safeSeats[2][1][0][1]+"'>"+safeSeats[2][1][0][1]+"</option>"
              +" <option value='"+safeSeats[2][1][1][1]+"'>"+safeSeats[2][1][1][1]+"</option>"
              +" <option value='"+safeSeats[2][1][2][1]+"'>"+safeSeats[2][1][2][1]+"</option>"
              +" <option value='"+safeSeats[2][1][3][1]+"'>"+safeSeats[2][1][3][1]+"</option>"
              +" <option value='"+safeSeats[2][1][4][1]+"'>"+safeSeats[2][1][4][1]+"</option>"
              +" <option value='"+safeSeats[2][1][5][1]+"'>"+safeSeats[2][1][5][1]+"</option>"
              +"</select></div>"
              +"<div class='party-percentage-in-national-results'><h3 class='party-national-div-seats'>"+partyPercentage+"</h3></div>"
              + "<div class='party-seats-in-national-results'><h3 class='party-national-div-seats'>"+partySeats+"</h3></div>"
              +"</div>");
              $('#'+thisId).val(partyAllegiance);
        }
   } else {
      calculateQuorum();
      for(i=0; i < finalQuorum.length ; i++){
           if ($('.input-senate-house').hasClass("show-house")) {
                var thisPercentage = round(finalQuorum[i][3],2);
                var additionalClass = "";
           } else{
                var thisPercentage = "N/D";
                var additionalClass = "info-not-relevant";
           }

          $('.temporary-national-results-div').append("<div class='allegiance-national-results-div'>"
              +"<div class='party-name-in-national-results'><h3>"+finalQuorum[i][0]+"</h3></div>"
              +"<div class='party-percentage-in-national-results'><h3 class='party-national-div-seats "+additionalClass+"'>"+thisPercentage+"</h3></div>"
              + "<div class='party-seats-in-national-results'><h3 class='party-national-div-seats'>"+finalQuorum[i][1]+"</h3></div>"
              +"</div>");
      }
   }
}

// Change Allegiance on National Results (select)---------------------------------------------------------------------------------------

$('body').on('change','.select-allegiance', function () {
  //ways to retrieve selected option and text outside handler
  var thisParty = (this.id).replaceAll("_", " ").slice( 8,).trim();
  var newAllegiance = $(this).find('option').filter(':selected').text();
  if ($('.input-senate-house').hasClass("show-house")) {
          var thisProvincesResults = provincesResults;
          var thisNationalResults = nationalResults;
         } else {
          var thisProvincesResults = provincesSenateResults;
          var thisNationalResults = nationalResultsSenate;
        }
  var foundNational = thisNationalResults.find(function(foundNationalParty) {
      return foundNationalParty[1] == thisParty;
    });
  foundNational[0] = newAllegiance;
  for(i=0; i < thisProvincesResults.length ; i++){
      var found = thisProvincesResults[i][1].find(function(foundParty) {
          return foundParty[0] == thisParty;
      });

      if (found != null){
        found[1] = newAllegiance
      }
  }
updateAll();
});


// Change House or Senate Display (function)---------------------------------------------------------------------------------------


$( "body" ).on('click', ".input-senate-house", function() {

    if ($(this).hasClass("show-senate")){
        $(this).removeClass("show-senate");
        $(this).addClass("show-house");
        $('.no-senate-election').removeClass("disabled-provinces")
        $('.no-senate-election path').removeClass("disabled-provinces-color")
        $('.switch-house-div').addClass('selected-switch-div');
        $('.switch-senate-div').removeClass('selected-switch-div');
        $('.switch-house-div h3').addClass('selected-switch');
        $('.switch-senate-div h3').removeClass('selected-switch');
    } else {
        $(this).removeClass("show-house");
        $(this).toggleClass("show-senate")
        $('.no-senate-election').addClass("disabled-provinces")
        $('.no-senate-election path').addClass("disabled-provinces-color")
        $('.switch-house-div').removeClass('selected-switch-div');
        $('.switch-senate-div').addClass('selected-switch-div');
        $('.switch-house-div h3').removeClass('selected-switch');
        $('.switch-senate-div h3').addClass('selected-switch');
    }
    updateAll()
});


// Change Parties or Allegiances Display on National Results (function)---------------------------------------------------------------------------------------

$( "body" ).on('click', ".input-parties-allegiances", function() {

    if ($(this).hasClass("show-allegiances")){
        $(this).removeClass("show-allegiances");
        $(this).addClass("show-parties");
        $('.switch-parties-div').addClass('selected-switch-parties-allegiances-div');
        $('.switch-allegiances-div').removeClass('selected-switch-parties-allegiances-div');
        $('.switch-parties-div h3').addClass('selected-switch-parties-allegiances');
        $('.switch-allegiances-div h3').removeClass('selected-switch-parties-allegiances');
    } else {
        $(this).removeClass("show-parties");
        $(this).toggleClass("show-allegiances")
        $('.switch-parties-div').removeClass('selected-switch-parties-allegiances-div');
        $('.switch-allegiances-div').addClass('selected-switch-parties-allegiances-div');
        $('.switch-parties-div h3').removeClass('selected-switch-parties-allegiances');
        $('.switch-allegiances-div h3').addClass('selected-switch-parties-allegiances');
    }
    calculateNationalResults();
});


// Calculate Final Quorum with Allegiances and Safe Seats - Dynamically depending on House or Senate selection (function)--------------------------

function calculateQuorum(){
    finalQuorum =[["",0,0,0]]
    if ($('.input-senate-house').hasClass("show-house")) {
              var thisNationalResults = nationalResults;
              var thisSafeSeats = safeSeats[0][1];
              var minAllegianceQuorum = 129;
             } else {
              var thisNationalResults = nationalResultsSenate;
              var thisSafeSeats = safeSeats[1][1];
              var minAllegianceQuorum = 37;
            }

    for(i=0; i < safeSeats[2][1].length ; i++){
        var uniqueAllegiance = [safeSeats[2][1][i][1],0,0,0]
        finalQuorum.push(uniqueAllegiance);
    }
  // Replacing the snippet below with the one above, since I want to get the pre-defined allegiances, but
  // the snippet below could be good for other processes where I want to get only the existing ones.

         //   for(i=0; i < thisNationalResults.length ; i++){
         //       var uniqueAllegiance = [thisNationalResults[i][0],0,0]
         //       var exists = false;
         //       for(a=0; a < finalQuorum.length ; a++){
         //          if (finalQuorum[a][0] === uniqueAllegiance[0]){
         //               exists = true;
         //       }
         //       }
         //       if (!exists){
         //       finalQuorum.push(uniqueAllegiance);
         //       }
         //    }
    finalQuorum = finalQuorum.slice(1);

    for(i=0; i < finalQuorum.length ; i++){
        for(a=0; a < thisNationalResults.length ; a++){
            if(thisNationalResults[a][0] === finalQuorum[i][0]){
                finalQuorum[i][1] += thisNationalResults[a][2];
                finalQuorum[i][3] += thisNationalResults[a][3];
            }
        }
        for(a=0; a < thisSafeSeats.length ; a++){
            if(thisSafeSeats[a][1] === finalQuorum[i][0]){
                finalQuorum[i][2] += thisSafeSeats[a][2]
            }
        }
    }
    var hasQuorum = [false,""]
    for(i=0; i < finalQuorum.length ; i++){
        if ((finalQuorum[i][1]+finalQuorum[i][2]) >= minAllegianceQuorum){
            hasQuorum[0] = true
            hasQuorum[1] = finalQuorum[i][0]
        }
    }
    if (hasQuorum[0] === true){
        if (hasQuorum[1] === "PJ"){
           $('.results-graph-title-div h3').text("El " + hasQuorum[1] + " lograría quorum para tratar leyes ( "+ minAllegianceQuorum +" o más )");
        } else{
           $('.results-graph-title-div h3').text(hasQuorum[1] + " lograría quorum para tratar leyes ( "+ minAllegianceQuorum +" o más )");
           }
    } else{
        $('.results-graph-title-div h3').text("Ningún frente tendría quorum")
    }
}


// Draw Chart (Function and Google Charts loading)-------------------------------------------------------------------------------

google.charts.load("current", {packages:["corechart"]});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {

    $('#results-graph-dynamic-div').remove();
    $('#results-graph').append("<div id='results-graph-dynamic-div' class='results-graph-dynamic-div'></div>")
    var allegiances = [['Allegiance', 'Seats']];
    var allegiancesColors = ['#1a73e5', '#f86666', '#f3b49f', '#7b7b7b','#b6b6b6','#fedb2c'];
    for(i=1; i < finalQuorum.length ; i++){
        allegiances.push([finalQuorum[i][0],finalQuorum[i][1]+finalQuorum[i][2]])
    }
    allegiances.push([finalQuorum[0][0],finalQuorum[0][1]+finalQuorum[0][2]])
    var data = google.visualization.arrayToDataTable(allegiances);

    var options = {
      title: 'My Daily Activities',
      is3D: true,
      pieSliceText: 'value',
      pieHole: 0.4,
      chartArea:{left:20,top:0,width:"100%",height:"100%"},
      height: 280,
      width: 380,
      colors: allegiancesColors,
      tooltip: {textStyle:  {fontName: 'Montserrat',fontSize: 16,bold: false}},
      legend: {position:'middle',alignment: 'center' , textStyle:  {fontName: 'Montserrat',fontSize: 12,bold: false}},
      pieSliceTextStyle: {color: '#190833',fontSize:24,fontName: 'Montserrat', bold: true}
    };

    var chart = new google.visualization.PieChart(document.getElementById('results-graph-dynamic-div'));
    chart.draw(data, options);
}

// Change Allegiance on Safe Seats (select)---------------------------------------------------------------------------------------

$('body').on('change','.safe-seats-select-allegiance', function () {
  //ways to retrieve selected option and text outside handler
  var thisParty = (this.id).replaceAll("_", " ").slice( 10,).trim();
  var newAllegiance = $(this).find('option').filter(':selected').text();
  if ($('.input-senate-house').hasClass("show-house")) {
           var thisSafeSeats = safeSeats[0][1];
         } else {
           var thisSafeSeats = safeSeats[1][1];
        }
  var foundParty = thisSafeSeats.find(function(foundSafeSeatsParty) {
      return foundSafeSeatsParty[0] == thisParty;
    });
  foundParty[1] = newAllegiance;
  updateAll();
});


// Update Safe Seats Allegiances (select)---------------------------------------------------------------------------------------


function updateSafeSeats(){
 if ($('.input-senate-house').hasClass("show-house")) {
       var selectedBranch = "Diputados";
       var thisSafeSeats = safeSeats[0][1];
    } else {
       var selectedBranch = "Senadores";
       var thisSafeSeats = safeSeats[1][1]
    }
    $('body').append('<div class="province-results-div">'
        + '<h1>Sin selección</h1>'
        + '<h3 class="safe-seats-comment">(bancas que no renuevan)</h3>'
        + '<a class="close-cross" onclick="closeProvinceDiv()">✘</a>'
        + '<hr class="province-results-div-hr">'
        + '<div id="" class="party-results-div-top-title-party"><h3 class="subs-style">Partido</h3></div>'
        + '<div id="" class="party-results-div-top-title-allegiance allegiance-change-safe-seats-div"><h3 class="subs-style">Alianza</h3></div>'
        + '<div id="" class="party-results-div-top-title-seats"><h3 class="subs-style">Bancas</h3></div>'
        + '<div id="" class="party-results-div-top-title-spacing-div"></div>'
        + '</div>'
    )

    $(".province-results-div h1").text(selectedBranch);

        for(i=0; i < thisSafeSeats.length ; i++){
          var partyName = thisSafeSeats[i][0];
          var thisId = "safeSeats_" + partyName.replaceAll(" ", "_");
          var partyAllegiance = thisSafeSeats[i][1];
            $('.province-results-div').append("<div id='' class='party-results-div'>"
            + "<div id='' class='party-results-div-name party-change-safe-seats-div'><h3>"+thisSafeSeats[i][0]+"</h3></div>"
            + "<div id='' class='party-results-div-allegiance allegiance-change-safe-seats-div'><select id='"+thisId+"' name='allegiance' class='safe-seats-select-allegiance'>"
            +" <option value='"+safeSeats[2][1][0][1]+"'>"+safeSeats[2][1][0][1]+"</option>"
            +" <option value='"+safeSeats[2][1][1][1]+"'>"+safeSeats[2][1][1][1]+"</option>"
            +" <option value='"+safeSeats[2][1][2][1]+"'>"+safeSeats[2][1][2][1]+"</option>"
            +" <option value='"+safeSeats[2][1][3][1]+"'>"+safeSeats[2][1][3][1]+"</option>"
            +" <option value='"+safeSeats[2][1][4][1]+"'>"+safeSeats[2][1][4][1]+"</option>"
            +" <option value='"+safeSeats[2][1][5][1]+"'>"+safeSeats[2][1][5][1]+"</option>"
            +"</select></div>"
            +"<div id='' class='party-results-div-seats'><h3>"+thisSafeSeats[i][2]+"</h3></div>"
            +"</div>");
          $('#'+thisId).val(partyAllegiance);
        }

      requestAnimationFrame(() =>
          setTimeout(() => {
          $(".province-results-div").toggleClass("show-party-results-div");
          })
      );
}


// Update All - Major Function (function)---------------------------------------------------------------------------------------

function updateAll(){
    calculateNationalResults();
    colorWinners();
    displayProvincesResults();
    calculateQuorum();
    drawChart();
}


// Basic rendered DIVs and Update All triggered on page initially rendered-------------------------------------------------------------------

$('.full-results-div').append("<div class='full-results-title-div'></div>")
$('.full-results-title-div').append("<div class='full-results-title-district'><h5>Distrito</h5></div>"
 +"<div class='full-results-title-party full-results-title-party1 '><h5>JxC</h5></div>"
 +"<div class='full-results-title-percentage full-results-title-party1 '><h5>%</h5></div>"
 +"<div class='full-results-title-seats full-results-title-seats-party1 '><h5>Bancas</h5></div>"
 +"<div class='full-results-title-party full-results-title-party2 '><h5>FdT</h5></div>"
 +"<div class='full-results-title-percentage full-results-title-party2 '><h5>%</h5></div>"
 +"<div class='full-results-title-seats full-results-title-seats-party2 '><h5>Bancas</h5></div>"
 +"<div class='full-results-title-party full-results-title-party3 '><h5>Tercero</h5></div>"
 +"<div class='full-results-title-percentage full-results-title-party3 '><h5>%</h5></div>"
 +"<div class='full-results-title-seats full-results-title-seats-party3 '><h5>Bancas</h5></div>"
 +"<div class='full-results-title-party full-results-title-party4 '><h5>Resto</h5></div>"
 +"<div class='full-results-title-percentage full-results-title-party4 '><h5>%</h5></div>"
 +"<div class='full-results-title-seats full-results-title-seats-party4 '><h5>Bancas</h5></div>"
 +"<div class='full-results-title-total-seats'><h5>Bancas totales</h5></div>"
 )

updateAll()