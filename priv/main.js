var svg, color, simulation;

window.addEventListener("load", main);

function main() {
  svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

  color = d3.scaleOrdinal(d3.schemeCategory20);

  simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) {
      return d.id;
    }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

  d3.json("output.json", function(error, graph) {
    if (error) throw error;

    var link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(graph.links)
      .enter().append("line")
      .attr("stroke-width", function(d) {
        return Math.sqrt(d.value);
      });

    var node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(graph.nodes)
      .enter().append("g")

    var circles = node.append("circle")
      .attr("r", 5)
      .attr("fill", function(d) {
        let min, max;
        if (d.group >= 5) {
          min = 0.97;
          max = 1.0;
        } else if (d.group == 4) {
          min = 0.9;
          max = 0.85;
        } else if (d.group == 3) {
          min = 0.7;
          max = 0.8;
        } else if (d.group == 2) {
          min = 0.4;
          max = 0.5;
        } else if (d.group == 1) {
          min = 0.0;
          max = 0.2;
        }
        let red = Math.floor(32 + (223 * randRange(min, max)));
        // return color(d.group);
        return `rgb(0, 0, ${red})`;
      })
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    var lables = node.append("text")
      .text(function(d) {
        return d.id;
      })
      .attr('x', 6)
      .attr('y', 3);

    node.append("title")
      .text(function(d) {
        return d.id;
      });

    simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

    simulation.force("link")
      .links(graph.links);

    function ticked() {
      link
        .attr("x1", function(d) {
          return d.source.x;
        })
        .attr("y1", function(d) {
          return d.source.y;
        })
        .attr("x2", function(d) {
          return d.target.x;
        })
        .attr("y2", function(d) {
          return d.target.y;
        });

      node
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
        })
    }
  });
}

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

function randRange(min, max) {
  return min + Math.random() * (max - min);
}
