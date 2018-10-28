var width  = 700;
var height = 500;
var firstClick = false;
function showTooltip(d){
    var scrollPos = window.scrollY || window.scrollTop || document.getElementsByTagName("html")[0].scrollTop;


    var tooltip = d3.select(".tooltip")
    tooltip
    .style("left",d3.event.x - tooltip.node().offsetWidth/2+'px')
    .style("top",d3.event.y+10+scrollPos+'px')
    .style("opacity",1)
    .html(()=>{
       return(`<p>Country : ${d.country}</p>
          <p>Percentage : ${d.percentage}%</p>
          `) })
}
function hideTooltip(){
    d3.select('.tooltip')
        .style("opacity",0);
}

function formatter(row,i,headers){
   var arr = [];
   var invalidRows = [
    "Arab World", 
    "Central Europe and the Baltics",
    "Caribbean small states",
    "East Asia & Pacific (excluding high income)",
    "Early-demographic dividend",
    "East Asia & Pacific",
    "Europe & Central Asia (excluding high income)",
    "Europe & Central Asia",
    "Euro area",
    "European Union",
    "Fragile and conflict affected situations",
    "High income",
    "Heavily indebted poor countries (HIPC)",
    "IBRD only",
    "IDA & IBRD total",
    "IDA total",
    "IDA blend",
    "IDA only",
    "Not classified",
    "Latin America & Caribbean (excluding high income)",
    "Latin America & Caribbean",
    "Least developed countries: UN classification",
    "Low income",
    "Lower middle income",
    "Low & middle income",
    "Late-demographic dividend",
    "Middle East & North Africa",
    "Middle income",
    "Middle East & North Africa (excluding high income)",
    "North America",
    "OECD members",
    "Other small states",
    "Pre-demographic dividend",
    "Pacific island small states",
    "Post-demographic dividend",
    "Sub-Saharan Africa (excluding high income)",
    "Sub-Saharan Africa",
    "Small states",
    "East Asia & Pacific (IDA & IBRD countries)",
    "Europe & Central Asia (IDA & IBRD countries)",
    "Latin America & the Caribbean (IDA & IBRD countries)",
    "Middle East & North Africa (IDA & IBRD countries)",
    "South Asia (IDA & IBRD)",
    "Sub-Saharan Africa (IDA & IBRD countries)",
    "Upper middle income",
    "World"
  ];

   var years = headers.slice(4);
   if(invalidRows.includes(row["Country Name"]))return;
   for(let i =0;i<years.length-1;i++){
        arr.push({
            year : +years[i],
            country :row["Country Name"],
            co2 : +row[years[i]],
            code :row["Country Code"]
        })
   }
    return arr;
}
function combineData(data){
    var arr = [];
    for(let i= 0;i<data.length;i++){
        for(let j =0;j<data[i].length;j++){
            arr.push({
                year : data[i][j].year,
                country :data[i][j].country,
                co2 : data[i][j].co2,
                code : data[i][j].code
            })
        }
    }
    return arr;
}
function totalCo2(data){
    var arr = {};
    for(let i=0;i<data.length;i++){
        if(data[i].year in arr){
            arr[data[i].year] += data[i].co2; 
        }
        else{
            arr[data[i].year] = data[i].co2; 
        }
    }
    return arr;
}
function percentageData(data,flag){
    
var yearsData = totalCo2(data);
 var arr = [];
 
 for(let i=0;i<data.length;i++){
 if(data[i].co2 === 0 && arguments.length === 1)continue;
 if(data[i].co2 === 0){
    let percentage = "Not Available";
     arr.push({
        year : data[i].year,
        country :data[i].country,
        co2 :  "Not Available",
        percentage :  "Not Available",
        code :data[i].code

     })  
     continue;
    }
    let percentage = (data[i].co2*100)/yearsData[data[i].year]
     arr.push({
        year : data[i].year,
        country :data[i].country,
        co2 : data[i].co2,
        percentage : percentage.toFixed(3),
        code :data[i].code

     })   
    }
    return arr;   
}

function makePieChart(olddata,data,year){
    var width = 500;
    var height = 250;
    var svg = d3.select('.piesvg')
    .attr("width",width)
    .attr("height",height)
 
    svg.append('g')
    .classed('pieChart',true)
    .attr("transform",`translate(${width/2},${height/2})`)            

var pieDatabyYear = data.filter(d=>d.year === year);

var colorScale = d3.scaleLinear()
    .domain(d3.extent(pieDatabyYear,d=>+d.percentage))
    .range(["green","red"])

var pie = d3.pie()
    .value(d=>+d.percentage)
    (pieDatabyYear);

var arc = d3.arc()
    .outerRadius(width/4)
    .innerRadius(width/8);

    var pieChart =   d3.select('.pieChart')
                        .selectAll('.arc')
                        .data(pie,d=>d.data.country)
    pieChart
    .exit()
    .remove()
    
    pieChart
    .enter()
    .append('path')
    .classed('arc',true)
    .merge(pieChart)
    .attr("d",arc)
    .attr("fill",d=>colorScale(+d.data.percentage))
    .on('mousemove touchmove', function(d){showTooltip(d.data)})
    .on('mouseout touchend', hideTooltip)
    .attr("stroke","white")
    .attr("stroke-width",0.1)
    .on('click',(d)=>{
        makeHistGraph(olddata,d.data.country)
    })
}
function getScaleData(data){
    
    var year = 1960;
    var yearArr = [year];
    var co2Arr = [];
    var co2 = 0;
    var i;
    for(i=0;i<data.length;i++){
        if(data[i].year%5 === 0 && data[i].year != 1960){
            yearArr.push(data[i].year)
            co2Arr.push(co2);
            co2 = 0;
        }
        co2 += data[i].co2;
    
    }
    if((i-1) % 5 != 0){
        yearArr.push(data[i-1].year)
        co2Arr.push(co2);
    
    }
    return [yearArr,co2Arr];
}
function getHistData(sData){
    var arr = [];
    var year = sData[0];
    for(let i=0;i<sData[1].length;i++){
    if(i==0){
        arr.push({
            x0 : year[i],
            x1 : year[i+1],
            len : sData[1][i]
        })
    }    
    else{
        arr.push({
            x0 : arr[i-1].x1,
            x1 : year[i+1],
            len : sData[1][i]
        })
        
    }
        
    }
    return arr;
}
var yscale;
var xscale;

function makeHistGraph(ddata,country){
    var height = 250;
    var width = 500;
console.log(ddata);

    var data = ddata.filter(d=>d.country === country && d.co2 != 0)
    var padding = 60;
    var barpadding = 1;
    var barwidth = width/(data.length);
    var scaleData = getScaleData(data);
    var histData  = getHistData(scaleData);
    console.log(d3.extent(scaleData[1].map(d=>d/10000)));
    scaleData[0].push(2015);
    
    var svg = d3.select('.histsvg')
                .attr("width",width)
                .attr("height",height)
if(!firstClick){
    xscale = d3.scaleLinear()
    .domain(d3.extent(scaleData[0]))
    .range([padding,width-padding])


yscale = d3.scaleLinear()
    .domain(d3.extent(scaleData[1].map(d=>d/10000)))
    .range([height-padding,padding])

var xAxis = d3.axisBottom(xscale)
        .ticks(12)
        .tickFormat(d=>d);
        
var yAxis = d3.axisLeft(yscale);
        
svg
.append('g')
.classed('xAxis',true)
.attr("transform",`translate(0,${height-padding})`)
.call(xAxis)

svg
.append('g')
.classed("yAxis",true)
.attr("transform",`translate(${padding},0)`)
.call(yAxis)

svg.append('text')
.attr("transform",`translate(${width/2},${height-padding})`)
.attr("dy","1.8em")
.text("Year")

svg
.append('text')
.attr("transform","rotate(-90)")
.attr("x",-height/1.4)
.attr("y",padding)
.attr("dy","-2.4em")
.text("Co2 emmission(x10000)")

 svg.append('text')
.classed('histTitle',true)   
.attr("transform",`translate(${width/2.5},${padding})`)
.attr("dy","-1.8em")
.text(`Country : ${country}`)

firstClick = true;
}
else{
xscale.domain(d3.extent(scaleData[0]))
yscale.domain(d3.extent(scaleData[1].map(d=>d/10000)))

var xAxis = d3.axisBottom(xscale)
        .ticks(12)
        .tickFormat(d=>d);
        
var yAxis = d3.axisLeft(yscale);
    
svg
.select('.xAxis')
.call(xAxis)

svg
.select(".yAxis")
.call(yAxis)

svg
.select('.histTitle')
.text(`Country : ${country}`)
}
       var barChart = svg
            .selectAll('rect')
            .data(histData)

    barChart
    .exit()
    .remove()
    
    barChart
    .enter()
    .append('rect')
    .merge(barChart)
    .attr("x",(d)=>xscale(d.x0))
    .attr("y",(d)=>yscale(d.len/10000))
    .attr("width",d=>xscale(d.x1)-xscale(d.x0))
    .attr("height",d=>height-yscale(d.len/10000)-padding)
    .attr("fill","orange")

}
function countryformatter(row){
    return{
        country :row.country,
        code:row.countryCode,
        population :row.population
    }
}
function setMapColor(geodata){
    var colorScale = d3.scaleLinear()
                        .domain(d3.extent(geodata,d=>d.properties.percentage==="Not Available"
                                        ?0:+d.properties.percentage))
                        .range(["green","red"]);
    console.log(d3.extent(geodata,d=>d.properties.percentage==="Not Available"
    ?0:+d.properties.percentage));
    
    var svg = d3.select('.mapsvg')
                .selectAll('path')
                .attr("fill",d=>d.properties.percentage === "Not Available"
                                    ?"#ccc":colorScale(d.properties.percentage))

}
function createMap(mapdata,fdata,year){
    var data = percentageData(fdata,true).filter(val=>val.year === year)
    
    var geoData = mapdata.features;
    for(let i=0;i<geoData.length;i++){
        let temp = data.filter(d=>d.code === geoData[i].id);
     
    if(temp.length>0)    
         geoData[i].properties = temp[0]; 
     }

     var projection = d3.geoMercator()
     .scale(100)
     .translate([width/2,height/1.4]);

    var path = d3.geoPath()
                  .projection(projection)
     var svg = d3.select('.mapsvg')
                  .attr("width",width)
                  .attr("height",height)

    svg
    .selectAll('path')
    .data(geoData,d=>d.properties.country)
    .enter()
    .append('path')
    .classed('country',true)
    .attr("d",path)
    .on("mousemove touchmove",d=>showTooltip(d.properties))
    .on("mouseout touchend",hideTooltip)
    .on("click",d=>{
        makeHistGraph(fdata,d.properties.country)
    })
   
    setMapColor(geoData)
}
function updateMap(fdata,year){
    var geoData = d3.select('.mapsvg').selectAll('path').data();
    var data = percentageData(fdata,true).filter(val=>val.year === year);

    
    console.log(data);
    
    for(let i=0;i<geoData.length;i++){
        let temp = data.filter(d=>d.code === geoData[i].id);
     
    if(temp.length>0)    
         geoData[i].properties = temp[0]; 
     }

     setMapColor(geoData);
   
     d3.select('.mapsvg')
    .selectAll('path')
    .on("click",d=>{
        makeHistGraph(fdata,d.properties.country)
    })
   
}
d3.queue()
.defer(d3.json,'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
.defer(d3.csv,'./country_data.csv',countryformatter)
.defer(d3.csv,'./CO2_DATA.csv',formatter)
.await(function(error,mapdata,countryData,data){
    
    data = combineData(data);
    
    var pieData = percentageData(data);
    
    var minYear = d3.min(pieData,d=>d.year);
    var maxYear = d3.max(pieData,d=>d.year);
    createMap(mapdata,data,minYear);
   

    var dispYear = d3.select('.dispYear');
    d3.select('input')
        .property("value",minYear)
        .property("min",minYear)
        .property("max",maxYear)
        .on("input",()=>{
            dispYear.text("Year : "+d3.event.target.value)
        makePieChart(data,pieData,+d3.event.target.value)
        updateMap(data,+d3.event.target.value)    
        })          
        
        dispYear.text("Year : "+minYear)         
        makePieChart(data,pieData,minYear)
})