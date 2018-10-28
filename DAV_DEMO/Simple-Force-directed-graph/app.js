function dragStart(d){
  d.fx = d.x;
  d.fy = d.y;  
}
function dragging(d){
    simulation.alpha(1).restart();
    d.fx = d3.event.x;
    d.fy = d3.event.y;    
}
function dragEnd(d){
    d.fx=null;
    d.fy = null;
    
}
var width = 800;
var height = 500;

var svg = d3.select('svg')
            .attr("width",width)
            .attr("height",height)

var nodes =[
    {color:"red",size:4},
    {color:"green",size:6},
    {color:"blue",size:3},
    {color:"orange",size:5},
    {color:"yellow",size:2},
    

]
var links =[
    {source:"red",target:"orange"},
    {source:"green",target:"yellow"},
    {source:"red",target:"blue"},
    {source:"yellow",target:"blue"},
    {source:"orange",target:"blue"},
    
]

svg
.selectAll('line')
.data(links)
.enter()
.append('line')
.attr('stroke',"black")
.attr('stroke-width',1)

svg
.selectAll("circle")
.data(nodes)
.enter()
.append("circle")
.attr("r",d=>d.size*10)
.attr("fill",d=>d.color)
.call(d3.drag()
        .on('start',dragStart)
        .on('drag',dragging)
        .on('end',dragEnd)
    )

var simulation = d3.forceSimulation(nodes)
                    
simulation
.force("center",d3.forceCenter(width/2,height/2))
.force("repulsive",d3.forceManyBody().strength(-100))
.force("links",d3.forceLink(links)
                    .id(d=>d.color)
                    .distance(d=>(d.source.size + d.target.size+1)*30)
                    )
.on('tick',()=>{
     
    svg
    .selectAll('line')
    .attr("x1",d=>d.source.x)
    .attr("y1",d=>d.source.y)
    .attr("x2",d=>d.target.x)
    .attr("y2",d=>d.target.y)

    svg
    .selectAll("circle")
    .attr("cx",d=>d.x)
    .attr("cy",d=>d.y)

})
