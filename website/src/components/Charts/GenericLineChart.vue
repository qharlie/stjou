<template>
  <div class="chart-container" :id="id+'_top'" style="position: relative; height:100%;">
    <canvas :id="overlayId" style="position:absolute;pointer-events:none;"></canvas>

    <canvas :id="id"></canvas>
    <!--    <button  class="btn btn-beige float-right" @click="setPeriodFromData">Set Period</button>-->
    <button v-if="undo_stack.length != 0" class="btn btn-simple btn-reset  float-right" @click="resetData">
      Reset
    </button>&nbsp;&nbsp; &nbsp;
    <button v-if="undo_stack.length != 0"  style="margin-right:5px;" class=" btn btn-simple  float-right" @click="setDateRange">Commit</button>

  </div>


</template>

<script>
import {Chart} from 'chart.js';
import {extractPeriodSlice, toCurrency} from "@/DataTransformer";
import config from "@/config";
import {clearDataOffsetIndex, ensureDataOffsetIndex} from "@/util";
// import {pnlChartOptions} from "@/components/Charts/config";

export default {
  emits: ['refresh'],
  name: 'generic-line-chart',
  props: {
    extraOptions: Object,
    chartData: Object,
    id: String,
    updateColumn: String,
    overlayId: String,
    onClick: Function,
  },
  data() {
    return {
      ctx: null,
      chart: null,
      undo_stack: [],
      df: this.$store.state.df,
      period_df: this.$store.state.period_df,
      closers: this.$store.state.closers,
      preventClick: false
    };
  },
  methods: {
    setPeriodFromData() {
      const data = this.chart.config.data.datasets[0].data;

      const labels = this.chart.config.data.labels;
      const start = labels[0];
      const end = labels[labels.length - 1];

      console.log('start', start);
      console.log('end', end);
      this.$store.commit('setStartDate', start);
      this.$store.commit('setEndDate', end);


      this.period_df = extractPeriodSlice(this.df, start, end);
      this.$store.commit('setPeriodDF', this.period_df);
    },
    setDateRange() {
      const data = this.chart.config.data.datasets[0].data;

      const labels = this.chart.config.data.labels;
      const start = labels[0];
      const end = labels[labels.length - 1];
      //
      console.log('start', start);
      console.log('end', end);
      this.$parent.$parent.onRefreshRange({start, end});

      clearDataOffsetIndex(this.id);
      // this.undo_stack = [];
    },

    resetData() {
      if (this.undo_stack.length) {
        const data = this.undo_stack[0];
        const labels = this.undo_stack[1];
        this.chart.config.data.datasets[0].data = data;
        this.chart.config.data.labels = labels;
        this.chart.update();
        clearDataOffsetIndex(this.id);
        this.undo_stack = [];

        const start = labels[0];
        const end = labels[labels.length - 1];
        console.log('start', start);
        console.log('end', end);
        this.$parent.$parent.onRefreshRange({start, end});
      } else {
        console.log("Nothing to undo");
      }
    }
  },
  mounted() {

    let options = {
      type: 'line',

      options: {
        onClick: (...args) => {
          if (!this.preventClick) {
            this.onClick(...args);
          }
        },

        animation: {
          duration: 500,
          easing: 'active',
          delay: 60,
        },

        pointHitRadius: 30,
        pointHoverRadius: 4,
        tension: .1,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            mode: 'nearest',
            intersect: false,
            callbacks: {
              beforeBody: (t, d) => {
                const table = t[0];
                let dataIndex = table.dataIndex;

                // console.log(window.chart_dataIndexOffset);
                const id = table.dataset.id;
                const pnl = table.dataset.data[ensureDataOffsetIndex(id) + dataIndex];

                const data = window[id].data;
                const tooltip = window[id + '_tooltip'];
                const row = data[ensureDataOffsetIndex(id) + dataIndex];
                let label = row[tooltip];
                if (_.isArray(label)) {
                  label = [...new Set(label)].join(', ');
                }
                if (row) {
                  const plus = row.pnl > 0 ? '+' : '';
                  return `${plus}${toCurrency(row.pnl)} : ${label}`;
                } else {
                  console.log(`No row for index: ${dataIndex} , dataoffset: ${ensureDataOffsetIndex(id)}, ${table.dataset.data.length}`);
                  return '';
                }
              },
              labelColor: function (context, d) {
                let row = null;


                const id = context.dataset.id;
                const data = window[id].data;
                const index = ensureDataOffsetIndex(id) + context.dataIndex;
                row = data[index];

                if (row && row.pnl > 0) {
                  return {
                    borderColor: config.colors.black,
                    backgroundColor: config.colors.green,
                    borderWidth: 2,
                    borderRadius: 2,
                  };
                } else {

                  return {
                    borderColor: config.colors.black,
                    backgroundColor: config.colors.red,

                    borderWidth: 2,
                    borderRadius: 2,
                  };
                }
              },
              labelTextColor: function (context) {
                return '#EFEFEF';
              }

            }
          },
        },
        responsive: true,
        scales: {
          x: {
            grid: {display: false},
            ticks: {
              display: true //this will remove only the label
            }
          },
          y: {
            grid: {display: false}
          }
        },

      }
    }
    let canvas = document.getElementById(this.id);
    let ctx = canvas.getContext('2d');
    let chart = new Chart(ctx, options);
    this.chart = chart;
    let overlay = document.getElementById(this.overlayId);
    let startIndex = 0;
    overlay.width = canvas.width;
    overlay.height = canvas.height;
    let selectionContext = overlay.getContext('2d');
    let selectionRect = {
      w: 0,
      startX: 0,
      startY: 0
    };
    let drag = false;
    canvas.addEventListener('pointerdown', evt => {
      window.chartPreventClick = true;
      const points = chart.getElementsAtEventForMode(evt, 'index', {
        intersect: false
      });
      startIndex = points[0].index;
      const rect = canvas.getBoundingClientRect();
      selectionRect.startX = evt.clientX - rect.left;
      selectionRect.startY = chart.chartArea.top;
      drag = true;
      // save points[0]._index for filtering
    });
    canvas.addEventListener('pointermove', evt => {

      const rect = canvas.getBoundingClientRect();
      if (drag) {
        const rect = canvas.getBoundingClientRect();
        selectionRect.w = (evt.clientX - rect.left) - selectionRect.startX;
        selectionContext.globalAlpha = 0.5;
        selectionContext.clearRect(0, 0, canvas.width, canvas.height);
        selectionContext.fillRect(selectionRect.startX,
            selectionRect.startY,
            selectionRect.w,
            chart.chartArea.bottom - chart.chartArea.top);
      } else {
        selectionContext.clearRect(0, 0, canvas.width, canvas.height);
        let x = evt.clientX - rect.left;
        if (x > chart.chartArea.left) {
          selectionContext.fillRect(x,
              chart.chartArea.top,
              1,
              chart.chartArea.bottom - chart.chartArea.top);
        }
      }
    });
    canvas.addEventListener('pointerup', evt => {
      setTimeout(() => {
        window.chartPreventClick = false;
      }, 100);

      const points = chart.getElementsAtEventForMode(evt, 'index', {
        intersect: false
      });
      drag = false;
      const endIndex = points[0].index;

      if (startIndex === endIndex) {
        return;
      }


      ensureDataOffsetIndex(this.id, startIndex);

      this.undo_stack.push(this.chart.config.data.datasets[0].data);
      this.undo_stack.push(this.chart.config.data.labels);
      const data = this.chart.config.data.datasets[0].data.slice(startIndex, endIndex);
      this.chart.config.data.datasets[0].data = data;
      this.chart.config.data.labels = this.chart.config.data.labels.slice(startIndex, endIndex);
      this.chart.config.data.datasets[0].pointBackgroundColor = [];
      this.chart.config.data.datasets[0].pointHoverBackgroundColor = [];

      this.chart.config.data.datasets[0].pointBackgroundColor = data.map(row => row > 0 ? config.colors.green : config.colors.red);


      // this.chart.config.data.datasets[0].pointBorderColor =  data.map(row => row > 0 ? config.colors.green : config.colors.red),
      this.chart.config.data.datasets[0].pointHoverBackgroundColor = data.map(row => row > 0 ? config.colors.green : config.colors.red);

      console.log('data');
      console.dir(this.chart);
      // Doesnt seem to work
      // this.chart.config.data.datasets[0].data = data;
      // this.chart.config.data.labels = labels;
      this.chart.update();

      console.log('implement filter between ' + startIndex + ' and ' + endIndex);
    });

    this.$watch(
        'chartData',
        (newVal, oldVal) => {
            if ( newVal) {
                this.chart.data = newVal;
                this.chart.update();
            }
        },
        {immediate: true}
    );
  }
};
</script>
