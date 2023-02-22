import * as d3 from 'd3';
import { onMount, createEffect } from "solid-js";

interface BarData {
  name: string,
  value: number,
}

function BarChart(props: {
  width: number,
  height: number,
  data: BarData[],
}) {
  // This will hold a reference to the rendered <div>
  let ref: HTMLDivElement;

  // This will be the function to update the bar chart
  let update: (data: BarData[]) => void;

  onMount(() => {
    const margin = {top: 5, right: 5, bottom: 5, left: 5};
    let width = props.width - margin.left - margin.right;
    let height = props.height - margin.top - margin.bottom;

    // Create the SVG element
    const svg = d3.select(ref)
      .append("svg")
        .attr("width", props.width)
        .attr("height", props.height)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Setup the x domain
    const x = d3.scaleBand()
      .range([0, width])
      .domain(props.data.map(d => d.name))
      .padding(0.2);

    // Setup the y domain
    const y = d3.scaleLinear()
      .range([height, 0]);

    // Create the x-axis
    const xAxis = svg.append("g")
        .attr("class", "x axis")
      .append("line")
        .attr("y1", y(0))
        .attr("y2", y(0))
        .attr("x1", 0)
        .attr("x2", width)
        .attr('stroke', '#000000')
        .attr('strokeWidth', 1)
        .attr('fill', 'none')


    // Define the update function
    update = (data: BarData[]) => {
      // Update the Y axis
      let max = d3.max(data, d => Math.abs(d.value));
      y.domain([-max, max]);

      // Update the X axis
      x.domain(data.map(d => d.name))
      xAxis
        .attr("y1", y(0))
        .attr("y2", y(0));

      // Create the u variable
      var u = svg.selectAll("rect")
        .data(data)

      u
        .join("rect") // Add a new rect for each new elements
          .attr("x", d => x(d.name))
          .attr("y", d => y(Math.max(0, d.value)))
          .attr("width", x.bandwidth())
          .attr("height", (d) => Math.abs(y(d.value) - y(0)))
          .attr("fill", (d) => d.value < 0 ? '#fa4e4e' : '#42c96f')
          .attr('stroke', '#000000')
          .attr('strokeWidth', 1)

      // Labels
      svg.selectAll(".label")
        .data(data)
        .join("text")
          .attr("class", "label")
          .text(d => d.name)
          .attr("x", d => x(d.name) + x.bandwidth()/2)
          .attr("y", y(0) + 15)
          .attr("text-anchor", "middle")
          .attr("font-size", "13px")
          .attr("fill", "black")

      // Values
      svg.selectAll(".value")
        .data(data)
        .join("text")
          .attr("class", "value")
          .attr("x", d => x(d.name) + x.bandwidth()/2)
          .attr("y", d => d.value >= 0 ? y(0) - 5 : y(0) + 15)
          .text(d => d.value.toLocaleString())
          .attr("text-anchor", "middle")
          .attr("font-size", "15px")
          .attr("fill", d => d.value == 0 ? 'black' : "white")
    }
  });

  createEffect(() => {
    if (update) update(props.data);
  });

  return <div class="chart" ref={ref} />
}

export default BarChart;