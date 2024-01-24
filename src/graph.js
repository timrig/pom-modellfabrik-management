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
  } else if (chartID === "erfuellungChart" || chartID === "erfuellungChartV2" || chartID === "erfuellungChartV3") {
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
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 0.7);
  arcs.exit().remove();
}

function updateTimeChart(zeit,zeitMax,id) {
  const width = window.innerWidth;
  const height = 10;
  var svg;
  if(id==1) {
    svg = d3.select("#TimeChart").select("svg");
    if (svg.empty()) {
      svg = d3.select("#TimeChart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
    }
  }
  else if(id==2) {
    svg = d3.select("#TimeChartV2").select("svg");
    if (svg.empty()) {
      svg = d3.select("#TimeChartV2")
        .append("svg")
        .attr("width", (width/2)*0.9)
        .attr("height", height);
    }
  }
  else if(id==3) {
    svg = d3.select("#TimeChartV3").select("svg");
    if (svg.empty()) {
      svg = d3.select("#TimeChartV3")
        .append("svg")
        .attr("width", (width/2)*0.9)
        .attr("height", height);
    }
  }
  if(id==1) svg.attr("width", width);
  else if(id==2 || id==3) svg.attr("width", (width/2)*0.9);
  const progress = (zeit / zeitMax) * 100;
  const bars = svg.selectAll("rect")
    .data([progress, 100 - progress]);
  bars.exit().remove();
  bars.enter()
    .append("rect")
    .merge(bars)
    .attr("x", (d, i) => i === 0 ? 0 : progress + "%")
    .attr("y", 0)
    .attr("width", d => d + "%")
    .attr("height", height)
    .attr("fill", (d, i) => i === 0 ? "green" : "red");
}