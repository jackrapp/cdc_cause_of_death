// Code to pull data from cdc dataset:
    // NCHS - Leading Causes of Death: United States
    
// Function called on page load
// Build intital chart and dropdown menu
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  
  // Use the list of state names to populate the select options
  stateArray.forEach((state) => {
    selector.append("option")
            .text(state)
            .property("value", state);
          });
    
  // Build first chart using Minnesota
  updateLinechart('Minnesota');
}

function optionChanged(newState) {
  // Fetch new data each time a new state is selected
  updateLinechart(newState);
};

// Function to call API with selected state value
function updateLinechart(chosenState) {
  $.ajax({
    url: "https://data.cdc.gov/resource/bi63-dtpu.json",
    type: "GET",
    data: {
      "$limit" : 5000,
      "$$app_token" : appToken,
      "state" : chosenState,
    }
  }).done(function(data) {
    alert("Retrieved " + data.length + ' ' + chosenState + " records from the dataset!");
    console.log(data);
  });
};

init();

// Call function to make graph for default state
  // buildLineGraph('Minnesota');

// // Simply use the column’s field name as your parameter 
//     // and the content you want to filter for as its value.
//     // state=<state>
//     var allCountryNames = data.state,
//         allYear = unpack(rows, 'year'),
//         allGdp = unpack(rows, 'gdpPercap'),
//         listofCountries = [],
//         currentCountry,
//         currentGdp = [],
//         currentYear = [];
//     for (var i = 0; i < allCountryNames.length; i++ ){
//       if (listofCountries.indexOf(allCountryNames[i]) === -1 ){
//           listofCountries.push(allCountryNames[i]);
//       }
//   }
    

//     function setBubblePlot(chosenCountry) {
//         getCountryData(chosenCountry);

// // Pull in code for one state - MN default
// function buildLineGraph(chosenState) {

//   for (var i = 0 ; i < allCountryNames.length ; i++){
//     if ( allCountryNames[i] === chosenCountry ) {
//         currentGdp.push(allGdp[i]);
//         currentYear.push(allYear[i]);

//   var trace1 = {
//     x: [1, 2, 3, 4],
//     y: [10, 15, 13, 17],
//     type: 'scatter',
//     name:
//   };
  
//   var trace2 = {
//     x: [1, 2, 3, 4],
//     y: [16, 5, 11, 9],
//     type: 'scatter'
//     name:
//   };
  
//   var data = [trace1, trace2];
  
//   Plotly.newPlot('lineChart', data);
// }
    // Chart that displays the number of deaths over time, each type a different color

    // Drop-down menu to choose state and update graph

// Code to change chart size on screen change