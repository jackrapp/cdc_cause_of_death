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

init();

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
    // run this to see what is in the data
    // also to make sure the data loads
    console.log(data);
    
    // convert data to numerical values
    data.forEach(function(row) {
      row.year = +row.year;
      row.aadr = +row.aadr;
    });

    // call chart function
    buildChart(data);
  }); // end of .done(function(data))
}; // end of updateLinechart

// Build chart with d3
function buildChart(data) {
  // Checking to see if svg exists and removing it on resize
  var svgArea = d3.select("body").select("svg");
  
  if (!svgArea.empty()) {
    svgArea.remove();
  };
  
  // Chart set-up
  // SVG size based on size of column ratio of 16:9 width:height
  var svgWidth = document.getElementById('lineChart').clientWidth;
  var svgHeight =  svgWidth / 1.8;
  
  // Chart margins
  var chartMargin = {
    top: 30,
    right: 30,
    bottom: 90,
    left: 70
  };
  
  // Combine chart margins and SVG size
  var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;
  var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
  
  // Define SVG element
  var svg = d3.select('#lineChart')
    .append('svg')
    .attr('height', svgHeight)
    .attr('width', svgWidth)
    .attr('class','chartArea');
    
  // Add chart group within SVG and shift to fit the margins
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

  // set scale based on max/min values
  // create x scale
  var xLinearScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.year))
    .range([0, chartWidth]);

  // Create y scale
  // Try d3 extent first - if weird change to d3 max value
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.aadr)])
    .range([chartHeight, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Add x axis to chart
  chartGroup.append('g')
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);

  // Add y axis to chart
  chartGroup.append('g').call(leftAxis);

  // Represent data using circle elements
  // append initial circles
  chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.year))
    .attr("cy", d => yLinearScale(d.aadr))
    .attr("r", 10)
    .attr("fill", "blue")
    .attr("opacity", ".6");

} // end of buildChart

//Build code to color circle by cause of death

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