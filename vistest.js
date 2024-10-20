import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";


async function drawVis(){
  

const dataset = await d3.csv("./datasets/videogames_wide.csv", d3.autoType);

console.log(dataset);
const width = 640;
const height = 400;

const margin = { top: 40, right: 40, bottom: 40, left: 40 };

const svg = d3
  .select("#visContainer")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .style("border", "1px solid black");



const maxGlobalSales = d3.max(dataset, (d) => d.Global_Sales);

const maxJpSales = d3.max(dataset, (d)=>d.JP_Sales);

// 定义比例尺，适用于 `global_sales` 的值
const xScale = d3
  .scaleLinear()
  .domain([0, maxGlobalSales])
  .range([margin.left, width - margin.right]);

const yScale = d3
  .scaleLinear()
  .domain([0,maxJpSales])
  .range([ height - margin.bottom, margin.top ]);

const colorScale = d3
  .scaleLinear()
  .domain([0,maxGlobalSales])
  .range(["blue","red"]);

// 在可视化中添加圆形
svg
  .selectAll("circle")
  .data(dataset)
  .join("circle")
  .attr("cx",
     (d) => {return xScale(d.Global_Sales);
     })
     .attr("cy",
      (d) => {return yScale(d.JP_Sales);
      })
  .attr("r", 2)
  .attr("fill", (d) => {
    try {
      if (d.Name.toLowerCase().includes("mario")) {
        return "red";
      } else {
        return "grey";
      }
    } catch (error) {
      console.error(error);
    }
  

  });

  // 添加 x 轴
  svg
    .append("g")
    .attr("transform", `translate(0, ${height - margin.bottom})`) // 确保 x 轴在底部边界
    .call(d3.axisBottom(xScale));

  // 添加 y 轴
  svg
    .append("g")
    .attr("transform", `translate(${margin.left}, 0)`) // 确保 y 轴在左侧边界
    .call(d3.axisLeft(yScale));
}

drawVis();

// Ins Wehavethedata 