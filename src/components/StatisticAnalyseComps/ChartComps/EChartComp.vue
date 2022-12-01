<template>
  <section class="mp-statistic-echarts-comp-wrap">
    <header>
      <span class="mp-common-title-wrap">{{title}}</span>
      <div>
        <span class="span-title-blue">设置</span>
        <span class="span-title-blue">导出Excel</span>
      </div>
    </header>
    <main>
      <div ref="echartWrap"></div>
    </main>
  </section>
</template>

<script>
/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core';
// 引入柱状图图表，图表后缀都为 Chart
import {
  BarChart, LineChart, PieChart,
} from 'echarts/charts';
// 引入提示框，标题，直角坐标系组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  ToolboxComponent,
  LegendComponent,
} from 'echarts/components';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import {
  CanvasRenderer,
} from 'echarts/renderers';

export default {
  props: {
    echartType: {
      type: String,
      default: 'bar',
    },
    title: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      labelOption: { // 单项显示标题相关
        // show: this.echartType !== 'line',
        show: this.echartType === 'pie',
        position: this.echartType === 'bar' ? 'insideBottom' : 'outside',
        distance: 15,
        align: 'left',
        verticalAlign: 'middle',
        rotate: this.echartType === 'bar' ? 90 : 0,
        formatter: this.echartType === 'pie' ? '{pieName|{b}}   {bold|{c}}' : '{c}  {name|{a}}',
        fontSize: 16,
        rich: {
          name: { // 上面formatter富文本样式设置，对{a}生效
            // color: 'red',
            // fontSize: 13,
          },
          pieName: {
            fontSize: 14,
          },
          bold: {
            fontWeight: 700,
            fontSize: 14,
          },
        },
      },
      legendOptions: {
        // left: 'right',
        top: 'center',
        right: 20,
        orient: 'vertical',
        formatter: (name) => name,
      },
      emphasis: { // 高亮的样式
        focus: 'series',
        // itemStyle: { // 高亮时文本样式
        //   color: 'blue', // 高亮时点的颜色。
        // },
        label: {
          // show: this.echartType !== 'line',
          show: this.echartType === 'pie',
          // formatter: 'This is a emphasis label.', // 高亮时标签的文字。
        },
      },
      grid: { // 布局与偏移相关
        left: '3%',
        right: '25%',
        bottom: '5%',
        top: '5%',
        containLabel: true,
      },
      toolbox: { // 工具箱
        show: true,
        orient: 'vertical',
        right: '0%',
        top: 'top',
        feature: {
          mark: { show: false },
          dataView: { show: false, readOnly: false },
          magicType: { show: false, type: ['line', 'bar', 'stack', 'tiled', 'pie'] },
          restore: { show: false },
          saveAsImage: { show: true },
        },
      },
      tooltip: { // 悬浮时提示面板
        trigger: this.echartType === 'pie' ? 'item' : 'axis',
        axisPointer: {
          type: this.echartType === 'line' ? 'line' : this.echartType === 'bar' ? 'shadow' : 'shadow', // 折线图应显示line 柱状图显示bar 饼状图显示shadow
        },
        // formatter: '{a} <br/>{b} : {c} ({d}%)',
        formatter: this.getTooltipFormatter,
      },
    };
  },
  computed: {
    xAxis() {
      if (this.echartType === 'pie') return null;
      return [
        {
          type: 'category',
          // axisTick: { show: false }, // 控制x轴分隔的小线头是否显示
          data: ['2012', '2013', '2014', '2015', '2016'],
          boundaryGap: this.echartType !== 'line',
          axisTick: {
            alignWithLabel: true,
          },
        },
      ];
    },
    yAxis() {
      if (this.echartType === 'pie') return null;
      return [
        {
          type: 'value',
        },
      ];
    },
    legend() {
      return {
        // data: ['两个相邻柱状图标的间隔记录两个相邻柱状图', 'Steppe', 'Desert', 'Wetland'],
        ...this.legendOptions,
      };
    },
  },
  methods: {
    // eslint-disable-next-line consistent-return
    getTooltipFormatter(params) {
      if (params.seriesType === 'pie') {
        return `<div class='mp-pie-tooltips-box'>
          <h2>${params.seriesName}</h2>
          <div>
            <span class='item-title'>${params.marker} ${params.data.name}:</span>
            <span class='item-value'>${params.data.value}</span>
            <span>(${params.percent}%)</span>
          </div>
        </div>`;
      }
      if (Array.isArray(params) && params.length > 0) {
        let str = '';
        params.forEach(it => {
          str += `<li>
            <span class='item-title'>${it.marker} ${it.seriesName}</span>
            <span class='item-value'>${it.value}</span>
          </li>`;
        });
        return `<div class='mp-arr-content-tooltips-box'>
          <h2>${params[0].name}</h2>
          <ul>${str}</ul>
        </div>`;
      }
      return '';
    },
    getSeries() {
      if (this.echartType === 'pie') {
        return [
          {
            name: 'Forest', // 柱状图的标题 需要和上面legend中data相对应
            type: this.echartType, // 类型 bar | line | pie
            barGap: 0, // 两个相邻柱状图标的间隔记录
            label: this.labelOption, // 对应柱状图标上面标题样式
            emphasis: this.emphasis,
            // roseType: 'radius',
            // smooth: this.echartType === 'line',
            radius: [60, 200],
            // lineStyle: {
            //   width: 2,
            // },
            labelLine: {
              length: 20,
              length2: 30,
              maxSurfaceAngle: 80,
            },
            // labelLayout(params) {
            //   const isLeft = params.labelRect.x < myChart.getWidth() / 2;
            //   const points = params.labelLinePoints;
            //   // Update the end point.
            //   points[2][0] = isLeft
            //     ? params.labelRect.x
            //     : params.labelRect.x + params.labelRect.width;

            //   return {
            //     labelLinePoints: points,
            //   };
            // },
            data: [
              { value: 40, name: 'rose ---------- 1' },
              { value: 38, name: 'rose ---------- 2' },
              { value: 32, name: 'rose ---------- 3' },
              { value: 30, name: 'rose ---------- 4' },
              { value: 28, name: 'rose ---------- 5' },
              { value: 26, name: 'rose ---------- 6' },
              { value: 22, name: 'rose ---------- 7' },
            ].sort((a, b) => a.value - b.value), // 该标题对应数值，x轴上有几项，此处应有多长
          },
        ];
      }
      return [
        {
          name: '两个相邻柱状图标的间隔记录两个相邻柱状图', // 柱状图的标题 需要和上面legend中data相对应
          type: this.echartType, // 类型 bar | line | pie
          barGap: 0, // 两个相邻柱状图标的间隔记录
          label: this.labelOption, // 对应柱状图标上面标题样式
          emphasis: this.emphasis,
          roseType: 'area',
          barMaxWidth: 40,
          lineStyle: {
            width: 2,
          },
          smooth: this.echartType === 'line', // 平滑
          data: [320, 332, 301, 334, 390], // 该标题对应数值，x轴上有几项，此处应有多长
        },
        {
          name: 'Steppe',
          type: this.echartType,
          label: this.labelOption,
          emphasis: this.emphasis,
          roseType: 'area',
          barMaxWidth: 40,
          lineStyle: {
            width: 2,
          },
          smooth: this.echartType === 'line',
          data: [220, 182, 191, 234, 290],
        },
        {
          name: 'Desert',
          type: this.echartType,
          label: this.labelOption,
          emphasis: this.emphasis,
          roseType: 'area',
          barMaxWidth: 40,
          lineStyle: {
            width: 2,
          },
          smooth: this.echartType === 'line',
          data: [150, 232, 201, 154, 190],
        },
        {
          name: 'Wetland',
          type: this.echartType,
          label: this.labelOption,
          emphasis: this.emphasis,
          roseType: 'area',
          barMaxWidth: 40,
          lineStyle: {
            width: 2,
          },
          smooth: this.echartType === 'line',
          data: [98, 77, 101, 99, 40],
        },
      ];
    },
  },
  mounted() {
    // 注册必须的组件
    echarts.use(
      [TitleComponent, TooltipComponent, GridComponent, BarChart, CanvasRenderer, LineChart, PieChart, ToolboxComponent, LegendComponent],
    );

    // 接下来的使用就跟之前一样，初始化图表，设置配置项
    const myChart = echarts.init(this.$refs.echartWrap);
    myChart.setOption({
      color: ['#428DFA', '#7CCE38', '#29C6CD', '#9EC6FE', '#67EACA', '#8E40DE', '#61a0a8', '#1333A6', '#FFB668', '#FF3C52', '#F2BBBB', '#67EACA', '#67EACA'], // 默认颜色列表
      // title: { // 标题
      //   text: 'ECharts 示例',
      // },
      tooltip: this.tooltip,
      legend: this.legend,
      grid: this.grid,
      toolbox: this.toolbox,
      xAxis: this.xAxis,
      yAxis: this.yAxis,
      series: this.getSeries(),
    });
  },
};
</script>
<style lang='scss'>
.mp-statistic-echarts-comp-wrap {
  width: 100%;
  height: 500px;
  min-width: 1360px;
  background-color: #fff;
  > header {
    font-size: 15px;
    font-weight: bold;
    line-height: 30px;
    height: 60px;
    display: flex;
    flex-direction: column;
    > span {
      color: #444444;
    }
    > div {
      text-align: right;
      padding-right: 25%;
      box-sizing: border-box;
      > span {
        font-weight: 400;
        font-size: 12px;
      }
    }
  }
  > main {
    width: 100%;
    height: 440px;
    > div {
      width: 100%;
      height: 100%;
    }
  }
  & + .mp-statistic-echarts-comp-wrap {
    margin-top: 30px;
  }
  .mp-pie-tooltips-box {
    color: #585858;
    .item-value {
      margin-left: 12px;
      font-weight: 700;
      margin-right: 2px;
    }
  }
  .mp-arr-content-tooltips-box {
    > ul {
      > li {
        display: flex;
        justify-content: space-between;
        .item-title {
          max-width: 256px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .item-value {
          margin-left: 13px;
          font-weight: 700;
        }
      }
    }
  }
}
</style>
