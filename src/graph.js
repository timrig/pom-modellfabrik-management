var width = 50;
var height = 50;
var margin = 5;
var radius = Math.min(width, height) / 2 - margin;

function updateChart(x, y, chartID) {
  var svg = d3.select("#" + chartID).select("svg");

  if (svg.empty()) {
    svg = d3.select("#" + chartID)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
  }

  var data = {};

  if (chartID === "ausschussAntChart") {
    data = { "Ist": y, "Ausschuss": x };
  } else if (chartID === "erfuellungChart") {
    data = { "Ist": y, "Soll": x-y };
  } else if (chartID === "krankChart") {
    data = { "Personal": x-y, "Krankheit": y };
  }

  var color = d3.scaleOrdinal()
    .domain(Object.keys(data))
    .range(["green", "red"]);

  var pie = d3.pie()
    .value(function(d) { return d.value; });
  var data_ready = pie(d3.entries(data));

  var arcs = svg.selectAll('path')
    .data(data_ready);

  arcs.enter().append('path')
    .merge(arcs)
    .attr('d', d3.arc()
      .innerRadius(0)
      .outerRadius(radius)
    )
    .attr('fill', function(d) { return (color(d.data.key)); })
    .attr("stroke", "white") // Äußerer Rand in Weiß
    .style("stroke-width", "2px")
    .style("opacity", 0.7);

  arcs.exit().remove();
}
