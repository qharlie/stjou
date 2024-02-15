<template>
  <div class="chart-container" :id="id+'_top'" style="position: relative; height:100%;">
    <canvas :id="id"></canvas>
  </div>

</template>

<script>
import {Chart} from 'chart.js';


export default {
  name: 'generic-pie-chart',
  props: {
    extraOptions: Object,
    chartData: Object,
    id: String,
    onClick: Function
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
    const options = {
      type: 'pie',
      data: this.chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: false,
          tooltip: true,
        },
        animation: {
          duration: 500,
          easing: 'active',
          delay: 60,
        },
        elements: {
          arc: {
            backgroundColor: ['#00D6B4', '#fc8665'],
            hoverBackgroundColor: ['rgba(0,214,180,0.85)', 'rgba(252,134,101,0.83)']
          }
        }
      }
    };
    // console.log(this.extraOptions);
    // console.log('alloptions');
    // console.log(extraOptions);
    console.log('here in mounted');
    this.chart = new Chart(ctx, options);

    // this.$watch(
    //     'chartData',
    //     (newVal, oldVal) => {
    //       console.log('here in chartData watcher')
    //       console.dir(newVal);
    //       this.chart.data = newVal;
    //       this.chart.update();
    //     },
    //     {immediate: true}
    // );
  },
  watch: {
    chartData: function (newVal, oldVal) {
      console.log('new: %s, old: %s', newVal, oldVal);
      console.log('here in chartData watcher')
      console.dir(newVal);
      this.chart.data = newVal;
      this.chart.update();
    },
  }
};
</script>
