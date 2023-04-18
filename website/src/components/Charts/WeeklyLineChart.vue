<template>
  <div class="chart-container" :id="id+'_top'" style=" height:100%;">

    <canvas :id="id"></canvas>
    <div class="axis" style="float: top;">
      <div class="tick">
        <span class="day-name">{{chartData.labels && dayStringFromDate(new Date(chartData.labels[0]))}}<br/>{{chartData.labels[0]}}</span> <span class="value value--this">{{ toCurrency(chartData.datasets[0].data[0])}}</span>
      </div>
      <div class="tick">
        <span class="day-name">{{chartData.labels &&dayStringFromDate(new Date(chartData.labels[1]))}}<br/>{{chartData.labels[1]}}</span> <span class="value value--this">{{ toCurrency(chartData.datasets[0].data[1])}}</span>
      </div>
      <div class="tick">
        <span class="day-name">{{chartData.labels &&dayStringFromDate(new Date(chartData.labels[2]))}}<br/>{{chartData.labels[2]}}</span> <span class="value value--this">{{ toCurrency(chartData.datasets[0].data[2])}}</span>
      </div>
      <div class="tick">
        <span class="day-name">{{chartData.labels &&dayStringFromDate(new Date(chartData.labels[3]))}}<br/>{{chartData.labels[3]}}</span> <span class="value value--this">{{ toCurrency(chartData.datasets[0].data[3])}}</span>
      </div>
      <div class="tick">
        <span class="day-name">{{chartData.labels &&dayStringFromDate(new Date(chartData.labels[4]))}}<br/>{{chartData.labels[4]}}</span> <span class="value value--this">{{ toCurrency(chartData.datasets[0].data[4])}}</span>

      </div>

    </div>

    <!-- Custom Axis -->

  </div>
</template>

<script>
import {Chart} from 'chart.js';
import {weeklyChartOptions} from "@/components/Charts/config";
import {isClosingTrade, toCurrency} from "../../DataTransformer";
import {dayStringFromDate} from "../../util";

export default {
  name: 'weekly-line-chart',
  props: {
    extraOptions: Object,
    chartData: Object,
    id: String,
    onClick: Function,
  },
  data() {
    return {
      ctx: null,
      chart: null,
      df: this.$store.state.df,
      period_df: this.$store.state.period_df,
      closers: null,
      closersGrouped: null,
    };
  },
  methods: {dayStringFromDate,toCurrency},
  computed: {
    dashboard() {
      // const closers = this.period_df.filter(row => isClosingTrade(row));
      // this.closers = closers;
      // this.closersGrouped = closers.aggregateBy('date', {
      //   'loss_count': {
      //     'pnl': (data) => {
      //       return -(data.filter(row => row.pnl < 0).length);
      //     }
      //   },
      //   'win_count': {
      //     'pnl': (data) => {
      //       return (data.filter(row => row.pnl > 0).length);
      //     }
      //   },
      //   'win_amount': {
      //     'pnl': (data) => {
      //       const all_rows = data.filter(row => row.pnl > 0).data;
      //       return all_rows.reduce((acc, row) => acc + row.pnl, 0);
      //     }
      //   },
      //   'loss_amount': {
      //     'pnl': (data) => {
      //       const all_rows = data.filter(row => row.pnl < 0).data;
      //       return all_rows.reduce((acc, row) => acc + row.pnl, 0);
      //     }
      //   },
      //   'win_symbols': {
      //     'symbol': (data) => {
      //       return data.filter(row => row.pnl > 0).data.map(row => row.symbol);
      //     }
      //   },
      //   'win_pnl': {
      //     'price': (data) => {
      //       return data.filter(row => row.pnl > 0).data.map(row => row.pnl);
      //     }
      //   },
      //   'loss_symbols': {
      //     'symbol': (data) => {
      //       return data.filter(row => row.pnl < 0).data.map(row => row.symbol);
      //     }
      //   },
      //   'loss_pnl': {
      //     'price': (data) => {
      //       return data.filter(row => row.pnl < 0).data.map(row => row.pnl);
      //     }
      //   },
      // }, true);
      // window.closersGrouped = this.closersGrouped;
      //
      // // const grouped = [ 201];
      // console.log('grouped');
      // console.log(closersGrouped);

      // Ensure there are at least 5 days

      // return {
      //   closersGrouped,
      // };
    },
  },
  mounted() {

    const ctx = document.getElementById(this.id);
    this.chart = new Chart(ctx, {
      type: 'line',
      data: this.chartData,
      options: {
        onClick: this.onClick,
        scales: {
          xAxes: {
            display: false
          },
          yAxes: {
            display: false
          }
        },
        legend: {display: false},
        animation: {
          duration: 1000,
          easing: 'easeOutBack',
          delay: 100,


        },
        ...weeklyChartOptions,
      }

    });
    //
    this.$watch(
        'chartData',
        (newVal, oldVal) => {
          // console.log('here in chartData watcher')
          this.chart.data = newVal;
          this.chart.update();
        },
        {immediate: true}
    );
  }
};
</script>
