import { boxplot } from "./boxplot/tool";
import { bubbleChart } from "./bubble-chart/tool";
import { histogram } from "./histogram/tool";
import { pcp } from "./pcp/tool";
import { scatterplot } from "./scatterplot/tool";

export function registerTools() {
  return {
    boxplot,
    bubbleChart,
    histogram,
    pcp,
    scatterplot,
  };
}
