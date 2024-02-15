<template>
  <div>

    <card>
      <div class="col-12" style="width: 100%;">
        <div v-if="is_sample_data" class="alert alert-primary">
          You are currently using Sample Data which won't have any grouped trades.
        </div>

        <div v-if="!period_df && df" class="">No trades in the range, use the date fields below to select a date range.
        </div>


      </div>
      <div class="row">

        <div
            class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap">


          <div class="" style="padding-top: 5px;">


            <vc-date-picker
                v-model="range"
                mode="date"
                :masks="masks"
                is-range>
              <template v-slot="{ inputValue, inputEvents, isDragging }">
                <div class="">
                  <!--            <p class="flex">-->
                  <input
                      class="flex-grow pl-8 pr-2 py-1 bg-gray-100 border rounded w-full"
                      :class="isDragging ? 'text-gray-600' : 'text-gray-900'"
                      :value="inputValue.start"
                      @input="$emit('input', $event.target.value)"
                      v-on="inputEvents.start"/>
                  &nbsp; to &nbsp;

                  <input
                      class="flex-grow pl-8 pr-2 py-1 bg-gray-100 border rounded w-full"
                      :class="isDragging ? 'text-gray-600' : 'text-gray-900'"
                      :value="inputValue.end"
                      v-on="inputEvents.end"
                  />
                  <!--                &nbsp;&nbsp;&nbsp; <span>{{format_date(range.start)}} to {{format_date(range.end)}}</span>-->
                  &nbsp;
                  <div class="btn-group">
                    <button
                        @click="setRangePreset(5)"
                        type="button"
                        class="btn btn-grey btn-round btn-outline"
                        :class="{'active': range_preset===5}"
                    >
                      5 days
                    </button>
                    <button
                        type="button"
                        @click="setRangePreset(15)"
                        class="btn btn-grey btn-round btn-outline"
                        :class="{'active': range_preset===15}">
                      15
                    </button>
                    <button
                        type="button"
                        @click="setRangePreset(30)"
                        class="btn btn-grey btn-round btn-outline"
                        :class="{'active': range_preset===30}">
                      30
                    </button>
                    <button
                        type="button"
                        @click="setRangePreset(60)"
                        class="btn btn-grey btn-round btn-outline"
                        :class="{'active': range_preset===60}"

                    >
                      60
                    </button>
                    <button
                        type="button"
                        @click="setRangePreset(90)"
                        class="btn btn-grey btn-round btn-outline"
                        :class="{'active': range_preset===90}"

                    >
                      90
                    </button>
                    <button
                        type="button"
                        @click="setRangePreset(365)"
                        class="btn btn-grey btn-round btn-outline"
                        :class="{'active': range_preset===365}"
                    >
                      365
                    </button>
                    <button
                        type="button"
                        @click="setRangePreset(-1)"
                        class="btn btn-grey btn-round btn-outline"
                        :class="{'active': range_preset===-1}"

                    >
                      YTD
                    </button>
                  </div>
                </div>

              </template>
            </vc-date-picker>
          </div>

        </div>
        <div class="row">
          <div class="col-sm-12" style="margin-left: 15px;">

            <base-button style="font-size: .8em;padding: 10px;" round type="info" class="animation-on-hover"
                         @click="toggleExpanded(true)">Expand All
            </base-button>&nbsp;
            <base-button style="font-size: .8em;padding: 10px;" round type="info" class="animation-on-hover"
                         @click="toggleExpanded(false)">Collapse All
            </base-button>

          </div>
        </div>

        <div class="col-sm-12">

          <el-table
              :data="table"
              style="width: 100%; margin-bottom: 20px"
              row-key="id"
              ref="elTable"
              border
              default-expand-all
          >
            <!--            <th width="10%">Ticker</th>-->
            <!--            <th width="10%"> Side</th>-->
            <!--            <th width="10%">Instrument</th>-->
            <!--            <th width="10%">Time</th>-->

            <!--            <th width="5%">Short/Long</th>-->
            <!--            <th width="10%">Qty</th>-->
            <!--            <th width="10%">Buy Price</th>-->
            <!--            <th width="10%">Sell Price</th>-->
            <!--            <th width="15%">Net PNL</th>-->
            <!--            <th width="15%"> % Change</th>-->
            <!--            <th width="5%">Fees</th>-->
            <!--            <el-table-column prop="name" label="Symbol" sortable/>-->
            <!--            <el-table-column prop="price" label="Price" sortable/>-->
            <el-table-column prop="symbol" label="Ticker"

            >
<!--                :filter-method="filterSymbol"-->
<!--                :filters="symbolFilters()"-->
<!--                filter-placement="bottom-end"-->
              <div slot-scope="{ row }">
                <span :class="row.pnl > 0 ? 'stj-green-text' : 'stj-red-text'" style="font-size: 1.2em;cursor: pointer">
                  <span :class="isClosingTrade(row) ? '' : 'stj-white-text'">
                    {{ extractTicker(row.symbol) }}
                  </span>
                </span>
              </div>
            </el-table-column>
            <el-table-column prop="trade_count" label="# Trades" />
            <el-table-column prop="quantity" label="Qty" >
              <div slot-scope="{ row }">
                <span>{{ row.quantity }}</span>
              </div>
            </el-table-column>
            <el-table-column prop="side" label="Side"
                             :filter-method="filterSide"
                             :filters="sideFilters()"
                             filter-placement="bottom-end"
            >
              <div slot-scope="{ row }">
                <span :class="row.side == 'SELL' ? 'badge badge-danger' : 'badge badge-info'">{{ row.side }}</span>
              </div>
            </el-table-column>
            <el-table-column prop="pnl" label="PNL" >
              <div slot-scope="{ row }">
              <span class="" v-if="isClosingTrade(row)" :class="row.pnl > 0 ? 'stj-green-text' : 'stj-red-text'"
                    style="border-radius: 4px;font-size: 1.2em;margin: 3px;">
                {{ toCurrency(row.pnl) }}
              </span>

              </div>
            </el-table-column>
            <el-table-column prop="win_pct" label="Win %" />
            <el-table-column prop="avg_trade" label="Avg"  showOverflowTooltip>
              <div slot-scope="{ row }">
              <span style="font-weight: bold;">
                {{ row.avg_trade }}
              </span>
              </div>
            </el-table-column>
            <el-table-column prop="avg_win" label="Avg Win"  showOverflowTooltip>
              <div slot-scope="{ row }">
              <span style="">
                {{ row.avg_win }}
              </span>

              </div>
            </el-table-column>
            <el-table-column prop="avg_loss" label="Avg Loss" />

            <el-table-column prop="buy_date" label="Open" />
            <el-table-column prop="sell_date" label="Close" />



          </el-table>

        </div>
          <div class="row">

              <div class="col-lg-12" v-if="table.length == 0" style="color: white;font-size: 1.5em;">
                  &nbsp;&nbsp;It appears you do not have any trades that can be grouped.  Grouped trades show sells of the same security.
              </div>
          </div>
      </div>
      <!--      <div class="row">-->
      <!--        &lt;!&ndash; Stats Cards &ndash;&gt;-->
      <!--        <div class="col-lg-3 col-md-6" v-for="card in statsCards" :key="card.title">-->
      <!--          <stats-card-->
      <!--              :title="card.title"-->
      <!--              :sub-title="card.subTitle"-->
      <!--              :type="card.type"-->
      <!--              :icon="card.icon"-->
      <!--          >-->
      <!--            <div slot="footer" v-html="card.footer"></div>-->
      <!--          </stats-card>-->
      <!--        </div>-->

      <!--        &lt;!&ndash; More Stats Cards &ndash;&gt;-->
      <!--        <div class="col-lg-3 col-md-6" v-for="card in moreStatsCards" :key="card.title">-->
      <!--          <stats-card-->
      <!--              :title="card.title"-->
      <!--              :sub-title="card.subTitle"-->
      <!--              :type="card.type"-->
      <!--              :icon="card.icon"-->
      <!--          >-->
      <!--            <div slot="footer" v-html="card.footer"></div>-->
      <!--          </stats-card>-->
      <!--        </div>-->
      <!--        &lt;!&ndash; PIE CHART &ndash;&gt;-->
      <!--        <div class="col-lg-4">-->
      <!--          <card class="card-chart card-chart-pie">-->
      <!--            <h5 slot="header" class="card-category">Win to Loss</h5>-->

      <!--            <div class="row">-->
      <!--              <div class="col-6">-->
      <!--                <div class="chart-area">-->
      <!--                  <pie-chart-->
      <!--                      :chart-data="pieChart1.chartData"-->
      <!--                      :extra-options="pieChart1.extraOptions"-->
      <!--                      :height="200"-->
      <!--                  >-->
      <!--                  </pie-chart>-->
      <!--                </div>-->
      <!--              </div>-->

      <!--              <div class="col-6">-->
      <!--                <h4 class="card-title">-->
      <!--                  <i class="tim-icons  icon-trophy text-success "></i>42 to 30-->
      <!--                </h4>-->
      <!--                <p class="category">A total of 72 trades</p>-->
      <!--              </div>-->
      <!--            </div>-->
      <!--          </card>-->
      <!--        </div>-->

      <!--        &lt;!&ndash;        BAR CHART&ndash;&gt;-->
      <!--        <div class="col-lg-4">-->
      <!--          <card class="card-chart" no-footer-line>-->
      <!--            <template slot="header">-->
      <!--              <h5 class="card-category">Max Drawdown</h5>-->
      <!--              <h3 class="card-title">-->
      <!--                <i class="tim-icons fa-dollar-sign text-warning "></i> 25% - $13,300 of $51,000-->
      <!--              </h3>-->
      <!--            </template>-->
      <!--            <div class="chart-area">-->
      <!--              <bar-chart-->
      <!--                  :chart-data="barChart2.chartData"-->
      <!--                  :extra-options="barChart2.extraOptions"-->
      <!--                  :height="200"-->
      <!--              >-->
      <!--              </bar-chart>-->
      <!--            </div>-->
      <!--          </card>-->
      <!--        </div>-->

      <!--        &lt;!&ndash;LINE CHART&ndash;&gt;-->
      <!--        <div class="col-lg-4">-->
      <!--          <card class="card-chart" no-footer-line>-->
      <!--            <template slot="header">-->
      <!--              <h5 class="card-category">PNL Over Time</h5>-->
      <!--              <h3 class="card-title">-->
      <!--                <i class="tim-icons icon-chart-bar-32 text-primary "></i> + $12,314-->
      <!--              </h3>-->
      <!--            </template>-->
      <!--            <div class="chart-area">-->
      <!--              <line-chart-->
      <!--                  :chart-data="lineChart1.chartData"-->
      <!--                  :gradient-colors="lineChart1.gradientColors"-->
      <!--                  :gradient-stops="lineChart1.gradientStops"-->
      <!--                  :extra-options="lineChart1.extraOptions"-->
      <!--                  :height="200"-->
      <!--              >-->
      <!--              </line-chart>-->
      <!--            </div>-->
      <!--          </card>-->
      <!--        </div>-->
      <!--      </div>-->

    </card>

  </div>
</template>
<script>
import {Option, Select, Table, TableColumn} from 'element-ui';
import {BaseCheckbox, BasePagination, BaseProgress, RouteBreadCrumb} from 'src/components';

import StatsCard from 'src/components/Cards/StatsCard';
import * as chartConfigs from "@/components/Charts/config";
import config from "@/config";
// import BarChart from 'src/components/Charts/BarChart';
// import LineChart from 'src/components/Charts/LineChart';
import {extractPeriodSlice, isClosingTrade, stripYear, toCurrency, toPercent} from "@/DataTransformer";
import swal from "sweetalert2";
import moment from "moment";

function load(row, treeNode, resolve) {
  resolve([
    {
      id: 31,
      date: '2016-05-01',
      name: 'AMD',
      price: 103.21
    },
    {
      id: 32,
      date: '2016-05-01',
      name: 'AMD',
      price: 103.21
    },
  ]);
}


export default {
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    BaseCheckbox,
    RouteBreadCrumb,
    BaseProgress,
    BasePagination,
    StatsCard,
    // PieChart,
    // BarChart,
    // LineChart,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
  },
  data() {
    return {
      is_sample_data: this.$store.state.is_sample_data,

      tableData: [
        {
          id: 1,
          date: '2016-05-02',
          name: 'AMD',
          price: 103.21,
        },
        {
          id: 2,
          date: '2016-05-04',
          name: 'AMD',
          price: 103.21,
        },
        {
          id: 3,
          date: '2016-05-01',
          name: 'AMD',
          price: 103.21,
          children: [
            {
              id: 31,
              date: '2016-05-01',
              name: 'AMD',
              price: 103.21
            },
            {
              id: 32,
              date: '2016-05-01',
              name: 'AMD',
              price: 103.21
            },
          ],
        },
        {
          id: 4,
          date: '2016-05-03',
          name: 'AMD',
          price: 103.21
        },
      ],
      range_preset: '365',
      searchQuery: '',
      range: {
        start: this.$store.state.startDate,
        end: this.$store.state.endDate
      },
      masks: {
        input: 'YYYY-MM-DD',
      },
      lineChart1: {
        chartData: {
          labels: ['JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
          datasets: [
            {
              label: 'Data',
              fill: true,
              borderColor: config.colors.primary,
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              pointBackgroundColor: config.colors.primary,
              pointBorderColor: 'rgba(255,255,255,0)',
              pointHoverBackgroundColor: '#be55ed',
              pointBorderWidth: 20,
              pointHoverRadius: 4,
              pointHoverBorderWidth: 15,
              pointRadius: 4,
              data: [80, 100, 70, 80, 120, 80]
            }
          ]
        },
        extraOptions: chartConfigs.purpleChartOptions,
        gradientColors: config.colors.primaryGradient,
        gradientStops: [1, 0.4, 0]
      },
      lineChart2: {
        chartData: {
          labels: ['JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
          datasets: [
            {
              label: 'Data',
              fill: true,
              borderColor: config.colors.info,
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              pointBackgroundColor: config.colors.info,
              pointBorderColor: 'rgba(255,255,255,0)',
              pointHoverBackgroundColor: '#2380f7',
              pointBorderWidth: 20,
              pointHoverRadius: 4,
              pointHoverBorderWidth: 15,
              pointRadius: 4,
              data: [80, 100, 70, 80, 120, 80]
            }
          ]
        },
        extraOptions: chartConfigs.lineChartOptionsBlue
      },
      barChart1: {
        chartData: {
          labels: ['JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
          datasets: [
            {
              label: 'Data',
              fill: true,
              borderColor: config.colors.danger,
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              data: [80, 100, 70, 80, 120, 80]
            }
          ]
        },
        extraOptions: chartConfigs.barChartOptionsGradient,
        gradientColors: config.colors.purpleGradient,
        gradientStops: [1, 0]
      },
      barChart2: {
        chartData: {
          labels: ['Drawdown'],
          datasets: [

            {
              label: 'Win Total',
              fill: true,
              backgroundColor: config.colors.info,
              hoverBackgroundColor: config.colors.info,
              borderColor: config.colors.info,
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              data: [600]
            },
            {
              label: 'Loss Total',
              fill: true,
              backgroundColor: config.colors.orange,
              hoverBackgroundColor: config.colors.orange,
              borderColor: config.colors.orange,
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              data: [80]
            },
          ]
        },
        extraOptions: chartConfigs.barChartOptionsGradient
      },
      pieChart1: {
        chartData: {
          labels: [1, 2],
          datasets: [
            {
              label: 'Emails',
              pointRadius: 0,
              pointHoverRadius: 0,
              backgroundColor: ['#00c09d', '#a7543d'],
              borderWidth: 0,
              data: [70, 30]
            }
          ]
        },
        extraOptions: chartConfigs.pieChartOptions
      },
      pieChart2: {
        chartData: {
          labels: [1, 2, 3],
          datasets: [
            {
              label: 'Emails',
              pointRadius: 0,
              pointHoverRadius: 0,
              backgroundColor: ['#ff8779', '#2a84e9', '#e2e2e2'],
              borderWidth: 0,
              data: [60, 40, 20]
            }
          ]
        },
        extraOptions: chartConfigs.pieChartOptions
      },
      statsCards: [

        {
          title: 'TSLA',
          subTitle: 'Worst Loser',
          type: 'stj-red',
          icon: 'tim-icons icon-trash-simple',
          footer: '<i class="tim-icons"></i>-$1,200.32'
        },
        {
          title: 'AMZN',
          subTitle: 'Best Winner',
          type: 'stj-green',
          icon: 'tim-icons icon-trophy',
          footer: '<i class="tim-icons"></i>+$5,600.72'
        },
      ],
      moreStatsCards: [
        {
          title: '%42',
          subTitle: 'Win Percentage',
          type: 'teal',
          icon: 'fas fa-percent',
          footer: '<i class="tim-icons icon-up"></i> Win Percentage'
        },
        {
          title: '$43.25',
          subTitle: 'Average per trade',
          type: 'info',
          icon: 'fas fa-dollar-sign',
          footer: 'per trade returns'
        },
        {
          title: '-$21.23',
          subTitle: 'Average loss',
          type: 'stj-red',
          icon: 'tim-icons icon-minimal-down',
          footer: 'per losing trade'
        },
        {
          title: '$57.82',
          subTitle: 'Average gain',
          type: 'stj-green',
          icon: 'tim-icons icon-minimal-up',
          footer: 'per winning trade'
        },
        {
          title: '$18,324',
          subTitle: ' Average Cost Per Trade',
          type: 'teal',
          icon: 'fas fa-question',
          footer: 'cost per trade'
        },
        {
          title: '12',
          subTitle: 'Average # trades per day',
          type: 'info',
          icon: 'fas fa-hashtag',
          footer: '# trades per day'
        },
      ],
      pagination: {
        perPage: 25,
        currentPage: 1,
        perPageOptions: [25, 50, 100, 250, 500, 1000],
        total: 0,
        start: 0,
        end: 0
      },
      df: this.$store.state.df,
      period_df: this.$store.state.period_df,
    };

  },
  watch: {
    range: function (value) {

      // If "pageData" ever changes, then we will console log its new value.
      this.$store.commit('setStartDate', value.start);
      this.$store.commit('setEndDate', value.end);
      console.log(value.start.getTime());
      console.log(value.end.getTime());

      this.period_df = extractPeriodSlice(this.df, value.start, value.end);
      this.$store.commit('setPeriodDF', this.period_df);

    },
    table: function (value) {
      // If "pageData" ever changes, then we will console log its new value.
      // console.log('WATCHING TABLE');
      // console.log(value);
    }
  },
  computed: {
    table() {
      let df = this.period_df;
      let start = this.pagination.currentPage * this.pagination.perPage - this.pagination.perPage;
      let end = this.pagination.currentPage * this.pagination.perPage;
      end = Math.min(end, df.length);
      this.end = end;
      this.start = start;
      let range_str = `${start}:${end}`;
      let df_slice = df.data.slice(start, end);
      // let df_slice = df.iloc({rows: [range_str]})
      // console.log(range_str)
      // window.df_slice = df_slice;

      const closers = df.filter(row => isClosingTrade(row));
      const grouped_closers = closers.groupBy('symbol');
      const ret = [];
      Object.keys(grouped_closers).forEach(key => {
        const item_df = grouped_closers[key];
        let i = 0;
        if ( item_df.length > 1 ) {
            ret.push({
                'id': `${key}_${i++}`,
                'symbol': key,
                'trade_count': item_df.length,
                'side': 'SELL',
                'pnl': item_df.sum('pnl'),
                'quantity': item_df.sum('quantity'),
                expanded: false,
                'win_pct': toPercent(item_df.filter(row => row.pnl > 0).length / item_df.length),
                'avg_win': toCurrency(item_df.filter(row => row.pnl > 0).mean('pnl')),
                'avg_trade': toCurrency(item_df.mean('pnl')),
                'avg_loss': toCurrency(item_df.filter(row => row.pnl < 0).mean('pnl')),
                'avg_cost': toCurrency(item_df.mean('cost')),
                'sell_date': `${stripYear(item_df.sort('sell_date').data[0]['sell_date'])} - ${stripYear(item_df.sort('sell_date', 'desc').data[0]['sell_date'])}`,
                'buy_date': `${stripYear(item_df.sort('buy_date').data[0]['buy_date'])} - ${stripYear(item_df.sort('buy_date', 'desc').data[0]['buy_date'])}`,

                'avg_trades_per_day': toCurrency(item_df.length / item_df.unique('date').length),
                'children': item_df.data,
                // 'hasChildren': true,

            });
        }
      });

      if (ret) {
        return ret;
      } else return [];
    }
  },
  methods: {


    toggleExpanded(expand) {

      const self = this;
      const table = self.$refs.elTable;

      table.data.forEach(row => {
        console.log(expand ? 'EXPANDING' : 'COLLAPSING', row.id);
        table.store.toggleTreeExpansion(row, expand);
      });


    },
    setRangePreset: function (range) {
      // this.range_preset = range;

      if (range === -1) {
        const endDate = new Date();
        const startDate = new Date(endDate.getFullYear(), 0, 1);
        console.log('startDate is ', startDate);
        this.range = {
          start: startDate,
          end: endDate
        }

      } else {
        const startDate = new Date(moment().subtract(range, "days").format("YYYY-MM-DD"));
        const endDate = new Date();
        this.range = {
          start: startDate,
          end: endDate
        }
      }
      console.log('range is ', range);
    },
    isClosingTrade,
    rowClick: function (row) {
      swal.fire({
        title: `${row.symbol} - ${row.date}`,
        buttonsStyling: false,
        customClass: {
          confirmButton: 'btn btn-dark'
        },
        confirmButtonText: 'Close',
        width: '80%',
        height: '100%',
        html: `<div style="width: 100%;height: 100%;overflow: hidden;" id="tradingview_06a10"></div>`

      });
      setTimeout(() => {
        new TradingView.widget(
            {
              "autosize": false,
              "symbol": `${row.symbol}`,
              "interval": "D",
              "timezone": "Etc/UTC",
              "theme": "dark",
              "style": "8",
              "locale": "en",
              "toolbar_bg": "#f1f3f6",
              "enable_publishing": false,
              "allow_symbol_change": true,
              "details": false,
              "show_popup_button": true,
              // "popup_width": "800",
              // "popup_height": "600",
              "container_id": "tradingview_06a10"
            }
        );

      }, 100);

    },
    symbolFilters: function () {
      const uniq = [...new Set(this.period_df.data.map(item => this.extractTicker(item.symbol)))]
      return uniq.map((item) => {
        return {text: item, value: item}
      }).sort((a, b) => a.text.localeCompare(b.text))
    },
    ensurePaginationSize: function (val = 2000) {
      if (this.pagination.perPage !== val) {
        this.pagination.perPage = val;
      }
    },
    filterSymbol: function (value, row) {
      this.ensurePaginationSize();
      // console.log(row);
      return row.symbol === value;
      // this.$store.commit('setPeriodDF', this.period_df);
    },
    sideFilters: function () {
      const uniq = [...new Set(this.period_df.data.map(item => item.side))]
      return uniq.map((item) => {
        return {text: item, value: item}
      }).sort((a, b) => a.text.localeCompare(b.text))
    },
    filterSide: function (value, row) {
      this.ensurePaginationSize();
      return row.side === value;
      // this.$store.commit('setPeriodDF', this.period_df);
    },
    directionFilters: function () {
      const uniq = [...new Set(this.period_df.data.map(item => item.short_or_long))]
      return uniq.map((item) => {
        return {text: item, value: item}
      }).sort((a, b) => a.text.localeCompare(b.text))
    },
    filterDirection: function (value, row) {
      this.ensurePaginationSize();
      return row.short_or_long === value;
      // this.$store.commit('setPeriodDF', this.period_df);
    },

    stockOrOptionFilters: function () {
      const uniq = [...new Set(this.period_df.data.map(item => item.stock_or_option))]
      return uniq.map((item) => {
        return {text: item, value: item}
      }).sort((a, b) => a.text.localeCompare(b.text))
    },
    filterStockOrOption: function (value, row) {
      this.ensurePaginationSize();
      return row.stock_or_option === value;
      // this.$store.commit('setPeriodDF', this.period_df);
    },

    openFilters: function () {
      const uniq = [...new Set(this.period_df.data.map(item => item.buy_date))]
      return uniq.map((item) => {
        return {text: item, value: item}
      }).sort((a, b) => a && a.text && a.text.localeCompare ? a.text.localeCompare(b.text) : -1)
    },
    filterOpen: function (value, row) {
      return row.buy_date === value;
      // this.$store.commit('setPeriodDF', this.period_df);
    },

    closeFilters: function () {
      const uniq = [...new Set(this.period_df.data.map(item => item.sell_date))]
      return uniq.map((item) => {
        return {text: item, value: item}
      }).sort((a, b) => a && a.text && a.text.localeCompare ? a.text.localeCompare(b.text) : -1)
    },
    filterClose: function (value, row) {
      return row.sell_date === value;
      // this.$store.commit('setPeriodDF', this.period_df);
    },
    reset: function () {
      const df = this.$store.state.df;
      this.ensurePaginationSize(25);

      const startDate = this.$store.state.startDate;
      const endDate = this.$store.state.endDate;
      const period_df = df.slice('timestamp', startDate, endDate);
      this.$store.commit('setPeriodDF', period_df);
      this.$store.commit('setLastUpdated', new Date());
      this.period_df = period_df;
      this.pagination.total = this.period_df.length;

      this.$refs.tableRef.clearFilter();
    },
    sortChange: function (...args) {
      const df = this.period_df;

      const column = args[0].prop;
      const order = args[0].order;

      // console.log('here');
      // console.log(column);
      // console.log(args);
      // Special case here to handle 0s for null
      if (column == 'sell_date') {
        // const sorted_df = df.query('sell_date', CDF.neq, 0).sort(column, order || 'ascending');
        this.period_df = sorted_df;
        this.pagination.total = this.period_df.length;
        window.period_df = this.period_df;
      } else if (column == 'quantity') {
        const sorted_df = df.sort(column, order || 'ascending', x => parseInt(x));
        this.period_df = sorted_df;
        this.pagination.total = this.period_df.length;
        window.period_df = this.period_df;
      } else if (column == 'amount') {
        const sorted_df = df.sort(column, order || 'ascending', x => parseFloat(x));
        this.period_df = sorted_df;
        this.pagination.total = this.period_df.length;
        window.period_df = this.period_df;
      } else {
        const sorted_df = df.sort(column, order || 'ascending');
        this.period_df = sorted_df;
        this.pagination.total = this.period_df.length;
        window.period_df = this.period_df;
      }
    },
    showBuys: function () {
      this.reset();
      this.period_df = this.period_df.filter(row => row.side === 'BUY');
      this.pagination.total = this.period_df.length;
    },

    showSells: function () {
      this.reset();
      this.period_df = this.period_df.filter(row => isClosingTrade(row));
      this.pagination.total = this.period_df.length;
    },
    extractTicker: function (ticker) {
      return ticker.split(' ')[0];
    },
    toCurrency: toCurrency,
    toPercent: toPercent

  },
  mounted: function () {
    // console.log('hered');

    const self = this;
    window.table = self.$refs.elTable;

    setTimeout(() => {

      document.querySelectorAll('.el-table__expand-icon--expanded').forEach(row => row.classList.remove('el-table__expand-icon--expanded'));
      document.querySelectorAll('.expanded').forEach(row => row.classList.remove('expanded'));
      self.$refs.elTable.data.forEach(row => row.expanded = false);
      Object.keys(self.$refs.elTable._self.store.states.treeData).forEach(key => self.$refs.elTable._self.store.states.treeData[key].expanded = false);


    }, 1000);

  },
  // updated() {
  //   setTimeout( () => {
  //     console.log('here');
  //     document.querySelectorAll('.el-table__row--level-1').forEach(row => row.style = 'display: none;');
  //   },1000);
  //
  //
  // },
  created() {
    if (this.period_df) {
      this.pagination.total = this.period_df.length;
    }

  }
}
;
</script>
<style lang="scss">
.checkbox-cell {
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination-select,
.search-input {
  width: 200px;
}

.swal2-icon-content {
  font-size: inherit !important;
}

//
//.charty {
//  opacity:    0.5;
//  background: #000;
//  width:      100%;
//  height:     100%;
//  //z-index:    10;
//  top:        0;
//  left:       0;
//  position:   fixed;
//
//}
</style>
