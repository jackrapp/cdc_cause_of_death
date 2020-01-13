# cdc_cause_of_death

Dashboard using d3 to show the top ten causes of death from 1999-present by state.

## Pulling in data using Socrata API

The CDC made the top ten causes of death in each US state avaiable by a Socrata API at [data.CDC.gov](https://data.cdc.gov/NCHS/NCHS-Leading-Causes-of-Death-United-States/bi63-dtpu). Using jQuery and a d3 selector, data is grabbed from the API using the code below:

```javascript 
$.ajax({
    url: "https://data.cdc.gov/resource/bi63-dtpu.json",
    type: "GET",
    data: {
      "$limit" : 5000,
      "$$app_token" : appToken,
      "state" : chosenState,
    }
```

## Visualizations using d3.js

In progress
