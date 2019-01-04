// https://github.com/d3/d3/blob/master/CHANGES.md

// Set svg size
let svgWidth = 960;
let svgHeight = 600;

let margin = {
  top: 60,
  right: 60,
  bottom: 80,
  left: 60
};

let chartWidth = svgWidth - margin.left - margin.right;
let chartHeight = svgHeight - margin.top - margin.bottom;

// Create svg tag
let svg = d3.select("#scatter")
			.append("svg")
			.attr("width", svgWidth)
			.attr("height", svgHeight);

// Create g tag
let chartGroup = svg.append("g")
			.attr("transform", `translate(${margin.left}, ${margin.top})`);

// Load data from csv file using d3.csv
d3.csv("data/data.csv").then(function(health_data) {
	health_data.forEach(function(data) {
		data.poverty = +data.poverty;
		data.obesity = +data.obesity;
	});

	// Set the scale for x axis using LinearScale
	let xLinearScale = d3.scaleLinear()
			.domain([8, d3.max(health_data, d => d.poverty+2)])
			.range([0, chartWidth]);
	let bottomAxis = d3.axisBottom(xLinearScale);

	// Set the scale for y axis using LinearScale
	let yLinearScale = d3.scaleLinear()
			.domain([20, d3.max(health_data, d => d.obesity+2)])
			.range([chartHeight, 0]);
  let leftAxis = d3.axisLeft(yLinearScale);

	chartGroup.append("g")
		.attr("transform", `translate(0, ${chartHeight})`)
		.call(bottomAxis);

	chartGroup.append("g")
		.call(leftAxis);

	// Binding data
	let circleGroup = chartGroup.selectAll("circle")
			.data(health_data)
			.enter();

	// Create a circle for each data point
	let circleGroupNode = circleGroup.append("circle")
			.attr("cx", d => xLinearScale(d.poverty))
			.attr("cy", d => yLinearScale(d.obesity))
			.attr("r", "12")
			.attr("fill", "blue")
			.attr("opacity", "0.5");

	// Add a state abbr to each circle
	circleGroup.append("text")
			.attr("x", d => xLinearScale(d.poverty-0.14))
			.attr("y", d => yLinearScale(d.obesity-0.14))
			.attr('dx', 1)
			.text( function (d) { return d.abbr; })
			.attr("font-size", "10px")
			.style("fill", "white");

	// Add label for Y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", -svgHeight/2)
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Obesity Rate (%)");

  // Add label for x axis
  chartGroup.append("text")
    .attr("transform", `translate(${svgWidth/2 - 100}, 500)`)
    .attr("class", "axisText")
    .text("In Poverty (%)");

  // Define Tooltip
	let toolTip = d3.tip()
			.attr("class", "tooltip")
			.offset([80, -60])
			.attr("style", "outline: thin solid blue;")
			.html(function(d) {
				 return (`${d.state}<br>Poverty: ${d.poverty}%<br>Obesity: ${d.obesity}%`);
			});

	chartGroup.call(toolTip);

	// Show tooltip for each data point on mouse over or click
	circleGroupNode
	.on("click", function(data) {
    toolTip.show(data, this);
  })
	.on("mouseover", function(data) {
    toolTip.show(data, this);
  })
  .on("mouseout", function(data, index) {
        toolTip.hide(data);
  });
});
