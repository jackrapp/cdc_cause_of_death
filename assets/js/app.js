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

    var newData = data.filter(function(d) {
      return d._113_cause_name != 'All Causes'
    });
    
    // convert data to numerical values
    newData.forEach(function(row) {
      row.aadr = +row.aadr;
    });

    // call chart function
    buildChart(newData);
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
  // create primary x scale
  var xYearScale = d3.scaleBand()
    .domain(data.map(function(d) {
      return d.year
    }))
    .rangeRound([0, chartWidth])
    .padding(0.1);

  // create secondary x scale
  var xCauseScale = d3.scaleBand()
    .domain(data.map(function(d) {
      return d.cause_name
    }))
    .rangeRound([0, xYearScale.bandwidth()])
    .padding(0.05);

  // Create y scale
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.aadr)])
    .range([chartHeight, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xYearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Add x axis to chart
  chartGroup.append('g')
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);

  // Add y axis to chart
  chartGroup.append('g').call(leftAxis);

  // Color filter
  var colorFilter = d3.scaleOrdinal()
     .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])

  // Add rectangles for causes of death by year
  chartGroup.append('g')
    .selectAll("g")
    .data(data)
    .join("g")
      .attr("transform", d => `translate(${xYearScale(d.year)},0)`)
    .selectAll("rect")
    .data(data)
    .join("rect")
      .attr("x", d => xCauseScale(d.cause_name))
      .attr("y", d => yLinearScale(d.aadr))
      .attr("width", xCauseScale.bandwidth())
      .attr("height", d => yLinearScale(0) - yLinearScale(d.aadr))
      .attr("fill", d => colorFilter(d.aadr));

} // end of buildChart

//Build code to color circle by cause of death

// Ignore data entry for all deaths __113 cause name "All Causes"