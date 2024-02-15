<template>
  <div class="chart-container" :id="id+'_top'" style="position: relative; height:100%;">
    <canvas :id="id"></canvas>
  </div>

</template>

<script>
import {Chart} from 'chart.js';
import {pnlChartOptions} from "@/components/Charts/config";
import config from "@/config";

export default {
  name: 'generic-bar-chart',
  props: {
    extraOptions: Object,
    chartData: Object,
    id: String,
    onClick: Function,
    height: Number,
  },
  data() {
    return {
      ctx: null,
      chart: null,
      df: this.$store.state.df,
      period_df: this.$store.state.period_df,
      closers: this.$store.state.closers,
    };
  },
  methods: {

  },
  mounted() {

    const ctx = document.getElementById(this.id);
    const extraOptions = {
      type: 'bar',
      data: this.chartData,
      height: this.height,
      options: {
        onClick: this.onClick,
        maintainAspectRatio: false,

        animation: {
          duration: 1000,
          easing: 'easeOutBack',
          delay: 100,


        },
        ...this.extraOptions

      },

    };
    // console.log(this.extraOptions);
    // console.log('alloptions');
    // console.log(extraOptions);
    this.chart = new Chart(ctx, extraOptions);

    this.$watch(
        'chartData',
        (newVal, oldVal) => {
          // console.log('here in chartData watcher')
          this.chart.data = newVal;
          this.chart.update();
        },
        { immediate: true }
    );
  }
};
</script>
