import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import _ from "https:cdn.jsdelivr.net/npm/lodash@4.17.21/+esm";

async function drawVis(){
  const dataset = await d3.csv("./datasets/videogames_wide.csv", d3.autoType);

  console.log(dataset);
  const width = 640;
  const height = 400;

  const margin = { top: 40, right: 40, bottom: 40, left: 100 };

  const svg = d3
    .select("#visContainer")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("border", "1px solid black");

  const df = _(dataset)
    .groupBy("Genre")
    .map((objs, key) => ({
      Genre: key,
      Global_Sales: _.sumBy(objs, "Global_Sales")
    }))
    .value();
  console.log(df);

  const SalesExtent = d3.extent(df, (d) => d["Global_Sales"]);
  const Genres = df.map((d) => d["Genre"]);

  const yScale = d3
    .scaleBand()
    .domain(Genres)
    .range([margin.top, height - margin.bottom])
    .padding(0.1);


    const xScale = d3
    .scaleLinear()
    .domain([0, SalesExtent[1]])
    .range([margin.left, width - margin.right]);

  // 创建颜色比例尺，为每个 Genre 分配不同的颜色
  const colorScale = d3.scaleOrdinal()
    .domain(Genres)
    .range(d3.schemeCategory10); // 使用 D3 提供的颜色方案

  svg
    .selectAll("rect")
    .data(df)
    .join("rect")
    .attr("y", (d) => {
      return yScale(d["Genre"]);
    })
    .attr("x", margin.left)
    .attr("height", yScale.bandwidth())
    .attr("width", (d) => {
      return xScale(d["Global_Sales"]) - margin.left;
    })
    //.attr("fill", (d) => colorScale(d["Genre"])); // 为每个条形分配不同的颜色

    // 添加 x 轴
  svg
  .append("g")
  .attr("transform", `translate(0, ${height - margin.bottom})`)
  .call(d3.axisBottom(xScale));

// 添加 y 轴
svg
  .append("g")
  .attr("transform", `translate(${margin.left}, 0)`)
  .call(d3.axisLeft(yScale));
}

drawVis();