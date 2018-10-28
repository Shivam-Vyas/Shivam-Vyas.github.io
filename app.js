function showTooltip(tooltip, d) {
  tooltip
    .style("opacity", 1)
    .style("left", d3.event.x - tooltip.node().offsetWidth / 2 + "px")
    .style("top", d3.event.y + 25 + "px").html(`
    <p>Country : ${d.country}</p>
    <p>CO2 : ${d.co2 === 0 ? "Unknown" : d.co2.toLocaleString()}</p>
    <p>Methane : ${d.methane === 0 ? "Unknown" : d.methane}</p>
    <p>Population : ${d.pop === 0 ? "Unknown" : d.pop}</p>
    <p>GDP : ${d.gdp === 0 ? "Unknown" : d.gdp.toLocaleString()}</p>
    
    `);
}
function hideTooltip(tooltip) {
  tooltip.style("opacity", "0");
}
function updateGraph(
  data,
  year,
  svg,
  xscale,
  yscale,
  rscale,
  colorscale,
  xAxis,
  yAxis,
  tooltip
) {
  var filterData = data.filter(d => d.year === year);
  xscale.domain(d3.extent(filterData, d => d.co2));
  yscale.domain(d3.extent(filterData, d => d.methane));
  var update = svg.selectAll("circle").data(filterData);
  update
    .exit()
    .transition()
    .duration(2000)
    .attr("r", 0)

    .remove();

  update
    .enter()
    .append("circle")
    .attr("cx", d => xscale(d.co2))
    .attr("cy", d => yscale(d.methane))
    .on("mousemove", d => {
      showTooltip(tooltip, d);
    })
    .on("mouseout", d => {
      hideTooltip(tooltip);
    })
    .on("touchstart", d => {
      showTooltip(tooltip, d);
    })
    .on("touchend", d => {
      hideTooltip(tooltip);
    })
    .merge(update)
    .transition()
    .duration(500)
    .attr("cx", d => xscale(d.co2))
    .attr("cy", d => yscale(d.methane))
    .attr("r", d => rscale(d.pop))
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .attr("fill", d => colorscale(d.gdp));

  d3.select(".xaxis").call(xAxis);
  d3.select(".yaxis").call(yAxis);
}

function start(arg) {
  var data = arg.filter(val => {
    return val.co2 != 0 && val.methane != 0 && val.country !== "World";
  });
  //var data = arg.slice();

  console.log(data);

  var minYear = d3.min(data, d => d.year);
  var maxYear = d3.max(data, d => d.year);
  var width = 800;
  var height = 500;
  var padding = 70;

  var xscale = d3
    .scaleLinear()
    .domain(d3.extent(data, d => d.co2))
    .range([padding, width - padding]);
  var yscale = d3
    .scaleLinear()
    .domain(d3.extent(data, d => d.methane))
    .range([height - padding, padding]);
  var rscale = d3
    .scaleLinear()
    .domain(d3.extent(data, d => d.pop))
    .range([2, 50]);
  var colorscale = d3
    .scaleLinear()
    .domain(d3.extent(data, d => d.gdp))
    .range(["red", "green"]);

  var xAxis = d3
    .axisBottom(xscale)
    .tickSize(-height + 2 * padding)
    .tickSizeOuter(0);

  var yAxis = d3
    .axisLeft(yscale)
    .tickSize(-width + 2 * padding)
    .tickSizeOuter(0);

  var tootltip = d3
    .select("body")
    .append("div")
    .classed("tooltip", true);

  var svg = d3
    .select("svg")
    .attr("width", width)
    .attr("height", height);

  svg
    .append("g")
    .classed("xaxis", true)
    .attr("transform", `translate(0,${height - padding})`)
    .call(xAxis);

  svg
    .append("g")
    .classed("yaxis", true)
    .attr("transform", `translate(${padding},0)`)
    .call(yAxis);

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height - padding)
    .attr("dy", "1.5em")
    .text("CO2");

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", padding)
    .attr("dy", "-3.5em")
    .text("Methane");

  d3.select("input")
    .property("min", minYear)
    .property("max", maxYear)
    .property("value", minYear)
    .on("input", function() {
      d3.select("#inval").text(d3.event.target.value);
      updateGraph(
        data,
        +d3.event.target.value,
        svg,
        xscale,
        yscale,
        rscale,
        colorscale,
        xAxis,
        yAxis,
        tootltip
      );
    });
  updateGraph(
    data,
    minYear,
    svg,
    xscale,
    yscale,
    rscale,
    colorscale,
    xAxis,
    yAxis,
    tootltip
  );
}

var years = [
  "1960",
  "1961",
  "1962",
  "1963",
  "1964",
  "1965",
  "1966",
  "1967",
  "1968",
  "1969",
  "1970",
  "1971",
  "1972",
  "1973",
  "1974",
  "1975",
  "1976",
  "1977",
  "1978",
  "1979",
  "1980",
  "1981",
  "1982",
  "1983",
  "1984",
  "1985",
  "1986",
  "1987",
  "1988",
  "1989",
  "1990",
  "1991",
  "1992",
  "1993",
  "1994",
  "1995",
  "1996",
  "1997",
  "1998",
  "1999",
  "2000",
  "2001",
  "2002",
  "2003",
  "2004",
  "2005",
  "2006",
  "2007",
  "2008",
  "2009",
  "2010",
  "2011",
  "2012",
  "2013",
  "2014",
  "2015",
  "2016",
  "2017"
];
function formatter(row) {
  return years.reduce((acc, next) => {
    acc.push({
      country: row["Country Name"],
      year: +next,
      val: +row[next]
    });
    return acc;
  }, []);
}
function merge(data) {
  var newarr = [];
  for (let i = 0; i < data.length; i++) {
    var arr = data[i];
    for (let j = 0; j < arr.length; j++) {
      newarr.push(arr[j]);
    }
  }
  return newarr;
}
function combine(co2Data, methaneData, populationData, gdpData) {
  var newarr = [];
  for (let i = 0; i < co2Data.length; i++) {
    newarr.push({
      country: co2Data[i].country,
      year: co2Data[i].year,
      co2: co2Data[i].val,
      methane: methaneData[i].val,
      pop: populationData[i].val,
      gdp: gdpData[i].val
    });
  }
  return newarr;
}
d3.queue()
  .defer(d3.csv, "./CO2_DATA.csv", formatter)
  .defer(d3.csv, "Methane.csv", formatter)
  .defer(d3.csv, "Population.csv", formatter)
  .defer(d3.csv, "./GDP.csv", formatter)
  .awaitAll(function(error, data) {
    if (error) throw error;

    var co2Data = merge(data[0]);
    var methaneData = merge(data[1]);
    var populationData = merge(data[2]);
    var gdpData = merge(data[3]);
    start(combine(co2Data, methaneData, populationData, gdpData));
  });
