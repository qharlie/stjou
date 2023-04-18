<template>
  <div>

    <card>
      <!--      <div>-->
      <!--        <div v-if="!period_df && !df" class="alert alert-primary">No dataset, use Import at the bottom of the navar on-->
      <!--          the left to add trades.-->
      <!--        </div>-->
      <!--        <div v-if="!period_df && df" class="alert alert-primary">No trades in the range, use the date fields below to-->
      <!--          select a date range.-->
      <!--        </div>-->
      <!--        <div v-if="period_df && df" class="alert alert-info">{{ period_df.length }} rows in the working-->
      <!--          set, {{ df.length }} in all data.-->
      <!--        </div>-->
      <!--      </div>-->


      <div

          class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap">

        <!-- TradingView Widget BEGIN -->
        <!--                <div class="tradingview-widget-container charty hidden">-->
        <!--                  -->
        <!--                  <div id="tradingview_06a10"></div>-->
        <!--                </div>-->
        <!--          <div class="tradingview-widget-copyright"><a href="https://www.tradingview.com/symbols/NASDAQ-AAPL/" rel="noopener" target="_blank"><span class="blue-text">AAPL stock chart</span></a> by TradingView</div>-->
        <!--          <script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>-->
        <!--          <script type="text/javascript">-->
        <!--            new TradingView.widget(-->
        <!--                {-->
        <!--                  "autosize": true,-->
        <!--                  "symbol": "NASDAQ:AAPL",-->
        <!--                  "interval": "D",-->
        <!--                  "timezone": "Etc/UTC",-->
        <!--                  "theme": "dark",-->
        <!--                  "style": "8",-->
        <!--                  "locale": "en",-->
        <!--                  "toolbar_bg": "#f1f3f6",-->
        <!--                  "enable_publishing": false,-->
        <!--                  "allow_symbol_change": true,-->
        <!--                  "details": true,-->
        <!--                  "show_popup_button": true,-->
        <!--                  "popup_width": "1000",-->
        <!--                  "popup_height": "650",-->
        <!--                  "container_id": "tradingview_06a10"-->
        <!--                }-->
        <!--            );-->
        <!--          </script>-->
        <!--        </div>-->
        <!-- TradingView Widget END -->

        <div class="col-3">
          <p class="card-category" style="position: absolute;top: 15px;color: beige;margin-left:-10px">
            Showing {{ start }} to {{ end }} of {{ pagination.total }} entries </p>
        </div>
        <div class="col-6" style="padding-bottom: 5px;text-align: center;">
          <base-button type="info" class="animation-on-hover" @click="showBuys">Buys</base-button>&nbsp;
          <base-button type="warning" class="animation-on-hover" @click="showSells">Sells</base-button>&nbsp;
          <base-button type="clear" class="animation-on-hover" @click="reset">Reset</base-button>&nbsp;

        </div>
        <div class="col-3" style="padding-bottom: 5px;">

          <base-pagination class="pagination-no-border" v-model="pagination.currentPage" :per-page="pagination.perPage"
                           :total="pagination.total"></base-pagination>
        </div>
      </div>
      <div class="row">
        <!--        <div class="col-12 pull-right" style="padding-bottom: 5px;">-->
        <!--          <base-button type="info" class="animation-on-hover" @click="showBuys">Buys</base-button>&nbsp;-->
        <!--          <base-button type="warning" class="animation-on-hover" @click="showSells">Sells</base-button>&nbsp;-->
        <!--          <base-button type="clear" class="animation-on-hover" @click="reset">Reset</base-button>&nbsp;-->

        <!--        </div>-->
        <div class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap">

          <!--          <base-input>-->
          <!--            <el-input-->
          <!--                type="search"-->
          <!--                class="mb-3 search-input"-->
          <!--                clearable-->
          <!--                prefix-icon="el-icon-search"-->
          <!--                placeholder="Search records"-->
          <!--                v-model="searchQuery"-->
          <!--                aria-controls="datatables"-->
          <!--                style="padding-top: 5px;">-->
          <!--            </el-input>-->
          <!--          </base-input>-->

          <div class="" style="padding-top: 5px;">


            <vc-date-picker v-model="range" mode="date" :masks="masks" is-range>
              <template v-slot="{ inputValue, inputEvents, isDragging }">
                <div class="">
                  <!--            <p class="flex">-->
                  <input class="flex-grow pl-8 pr-2 py-1 bg-gray-100 border rounded w-full"
                         :class="isDragging ? 'text-gray-600' : 'text-gray-900'" :value="inputValue.start"
                         @input="$emit('input', $event.target.value)" v-on="inputEvents.start"/> &nbsp; to &nbsp;

                  <input class="flex-grow pl-8 pr-2 py-1 bg-gray-100 border rounded w-full"
                         :class="isDragging ? 'text-gray-600' : 'text-gray-900'" :value="inputValue.end"
                         v-on="inputEvents.end"/>
                  <!--                &nbsp;&nbsp;&nbsp; <span>{{format_date(range.start)}} to {{format_date(range.end)}}</span>-->
                  &nbsp;
                  <div class="btn-group">
                    <button @click="setRangePreset(5)" type="button" class="btn btn-grey btn-round btn-outline"
                            :class="{'active': range_preset===5}">
                      5 days
                    </button>
                    <button type="button" @click="setRangePreset(15)" class="btn btn-grey btn-round btn-outline"
                            :class="{'active': range_preset===15}"

                    >
                      15
                    </button>
                    <button type="button" @click="setRangePreset(30)" class="btn btn-grey btn-round btn-outline"
                            :class="{'active': range_preset===30}"

                    >
                      30
                    </button>
                    <button type="button" @click="setRangePreset(60)" class="btn btn-grey btn-round btn-outline"
                            :class="{'active': range_preset===60}"

                    >
                      60
                    </button>
                    <button type="button" @click="setRangePreset(90)" class="btn btn-grey btn-round btn-outline"
                            :class="{'active': range_preset===90}"

                    >
                      90
                    </button>
                    <button type="button" @click="setRangePreset(365)" class="btn btn-grey btn-round btn-outline"
                            :class="{'active': range_preset===365}">
                      365
                    </button>
                    <button type="button" @click="setRangePreset(-1)" class="btn btn-grey btn-round btn-outline"
                            :class="{'active': range_preset===-1}"

                    >
                      YTD
                    </button>
                  </div>
                </div>

              </template>
            </vc-date-picker>
          </div>
          <el-select class="select-info mb-3 pagination-select" v-model="pagination.perPage" placeholder="Per page">

            <el-option class="select-info" v-for="item in pagination.perPageOptions" :key="item" :label="item"
                       :value="item"></el-option>
          </el-select>
        </div>
        <div class="col-sm-12">


          <el-table :data="table" ref="tableRef" @sort-change="sortChange" @row-click="rowClick"
                    :default-sort="{ prop: 'buy_date', order: 'descending' }">
            <!--            <el-table-column min-width="50" label="#" align="center">-->
            <!--              <div class="photo" slot-scope="{ row }">-->
            <!--                <img :src="row.img" alt="Table image" />-->
            <!--              </div>-->
            <!--            </el-table-column>-->
            <el-table-column prop="symbol" label="Ticker" sortable :filter-method="filterSymbol"
                             :filters="symbolFilters()" filter-placement="bottom-end">
              <div slot-scope="{ row }">
                <span :class="row.pnl > 0 ? 'stj-green-text' : 'stj-red-text'" style="font-size: 1.2em;cursor: pointer">
                  <span :class="isClosingTrade(row) ? '' : 'stj-white-text'">{{ extractTicker(row.symbol) }}</span>
                </span>
              </div>
            </el-table-column>
            <el-table-column prop="side" label="Side" sortable :filter-method="filterSide" :filters="sideFilters()"
                             filter-placement="bottom-end">
              <div slot-scope="{ row }">
                <span :class="row.side == 'SELL' ? 'badge badge-danger' : 'badge badge-info'">{{ row.side }}</span>
              </div>
            </el-table-column>
            <el-table-column prop="quantity" label="Qty" sortable="true">
              <div slot-scope="{ row }">
                <span>{{ row.quantity }}</span>
              </div>
            </el-table-column>
            <el-table-column prop="buy_price" label="Buy $" sortable="true">
              <div slot-scope="{ row }">
              <span class="" style="font-size: 1.2em">
                {{ toCurrency(row.buy_price) }}
              </span>
              </div>
            </el-table-column>
            <el-table-column prop="sell_price" label="Sell $" sortable="true">
              <div slot-scope="{ row }">
              <span class="" v-if="isClosingTrade(row)" style="font-size: 1.2em">
                <i v-if="row.pnl > 0" class="fas fa-thin fa-arrow-up stj-green-text" style="font-size: .4em;"/>
                <i v-if="row.pnl <= 0" class="fas fa-thin fa-arrow-down stj-red-text" style="font-size: .4em;"/>


                {{ toCurrency(row.sell_price) }} <br/><span
                  v-if="row.effective_sell_price-row.effective_buy_price>0">+</span><span
                  style="font-size: .8em;">{{ toCurrency(row.effective_sell_price - row.effective_buy_price) }}</span>

              </span>
              </div>
            </el-table-column>
            <el-table-column prop="amount" label="Cost" sortable="true">
              <div slot-scope="{ row }">
              <span class="" style="font-size: 1em">
<!--                <i v-if="row.pnl > 0 && row.side=='SELL'" class="fas fa-thin fa-arrow-up stj-green-text"-->
<!--                   style="font-size: .5em;"/>-->
<!--                <i v-if="row.pnl <= 0 && row.side=='SELL'" class="fas fa-thin fa-arrow-down stj-red-text"-->
<!--                   style="font-size: .5em;"/>-->


                {{ toCurrency(row.amount) }}

              </span>
              </div>
            </el-table-column>
            <el-table-column prop="pnl" label="PNL" sortable="true">
              <div slot-scope="{ row }">
              <span class="" v-if="isClosingTrade(row)" :class="row.pnl > 0 ? 'stj-green-text' : 'stj-red-text'"
                    style="border-radius: 4px;font-size: 1.2em;margin: 3px;">
                {{ toCurrency(row.pnl) }}
              </span>

              </div>
            </el-table-column>
            <el-table-column prop="pnl_percent" label="% Chg" sortable>
              <div slot-scope="{ row }">
              <span class="" v-if="isClosingTrade(row)" :class="row.pnl > 0 ? 'stj-green-text' : 'stj-red-text'"
                    style="border-radius: 4px;font-size: 1.2em;margin: 3px;">
                    {{ toPercent(row.pnl_percent) }}
              </span>
                <!--                <span v-if="row.side!='SELL'">N/A</span>-->
              </div>
            </el-table-column>

            <el-table-column prop="buy_date" label="Open" sortable="true" :filter-method="filterOpen"
                             :filters="openFilters()" filter-placement="bottom-end">
              <div slot-scope="{ row }">
                <span style="font-size: .85em;">{{ row.buy_date }}</span>
              </div>
            </el-table-column>
            <el-table-column prop="sell_date" label="Close" sortable="true" :filter-method="filterClose"
                             :filters="closeFilters()" filter-placement="bottom-end">
              <div slot-scope="{ row }">
                <span style="font-size: .85em;">{{ row.sell_date || '' }}</span>
              </div>
            </el-table-column>
            <el-table-column prop="short_or_long" label="Dir" sortable="true" :filter-method="filterDirection"
                             :filters="directionFilters()" filter-placement="bottom-end">
              <div slot-scope="{ row }">
                <span :class="row.short_or_long == 'long' ? 'badge badge-light' : 'badge badge-info'"
                      style="color: black;">{{ row.short_or_long }}</span>
              </div>
            </el-table-column>
            <el-table-column prop="stock_or_option" label="Kind" sortable="true" title="Instrument"
                             :filter-method="filterStockOrOption" :filters="stockOrOptionFilters()"
                             filter-placement="bottom-end">
              <div slot-scope="{ row }">
                <span>{{ row.stock_or_option }}</span>
              </div>
            </el-table-column>


            <!--            <el-table-column-->
            <!--                min-width="150"-->
            <!--                prop="since"-->
            <!--                align="center"-->
            <!--                label="Since"-->
            <!--            >-->
            <!--            </el-table-column>-->
            <!--            <el-table-column-->
            <!--                min-width="150"-->
            <!--                prop="salary"-->
            <!--                align="right"-->
            <!--                label="Salary"-->
            <!--            >-->
            <!--              <div slot-scope="{ row }">-->
            <!--                <span :class="row.className">{{row.salary}}</span>-->
            <!--              </div>-->
            <!--            </el-table-column>-->
            <!--            <el-table-column-->
            <!--                min-width="150"-->
            <!--                header-align="right"-->
            <!--                align="right"-->
            <!--                label="Actions"-->
            <!--            >-->
            <!--              <div-->
            <!--                  slot-scope="{ $index }"-->
            <!--                  class="text-right table-actions"-->
            <!--              >-->
            <!--                <el-tooltip-->
            <!--                    content="Refresh"-->
            <!--                    effect="light"-->
            <!--                    :open-delay="300"-->
            <!--                    placement="top"-->
            <!--                >-->
            <!--                  <base-button-->
            <!--                      :type="$index > 2 ? 'success' : 'neutral'"-->
            <!--                      icon-->
            <!--                      size="sm"-->
            <!--                      class="btn-link"-->
            <!--                  >-->
            <!--                    <i class="tim-icons icon-refresh-01"></i>-->
            <!--                  </base-button>-->
            <!--                </el-tooltip>-->
            <!--                <el-tooltip-->
            <!--                    content="Delete"-->
            <!--                    effect="light"-->
            <!--                    :open-delay="300"-->
            <!--                    placement="top"-->
            <!--                >-->
            <!--                  <base-button-->
            <!--                      :type="$index > 2 ? 'danger' : 'neutral'"-->
            <!--                      icon-->
            <!--                      size="sm"-->
            <!--                      class="btn-link"-->
            <!--                  >-->
            <!--                    <i class="tim-icons icon-simple-remove"></i>-->
            <!--                  </base-button>-->
            <!--                </el-tooltip>-->
            <!--              </div>-->
            <!--            </el-table-column>-->
          </el-table>
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
      <div class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap">
        <div class="">
          <p class="card-category">
            Showing {{ start }} to {{ end }} of {{ pagination.total }} entries </p>
        </div>
        <base-pagination class="pagination-no-border" v-model="pagination.currentPage" :per-page="pagination.perPage"
                         :total="pagination.total"></base-pagination>
      </div>

      <div slot="footer" class="col-12">

        <div v-if="!period_df && !df" class="alert alert-primary">No dataset, use Import at the bottom of the navar on
                                                                  the left to add trades.
        </div>
        <div v-if="!period_df && df" class="alert alert-primary">No trades in the range, use the date fields below to
                                                                 select a date range.
        </div>
        <div v-if="period_df && df" class="alert alert-info">{{ period_df.length }} rows in the current period,
                                                             {{ df.length }} in all data.
        </div>
      </div>
    </card>

  </div>
</template>
<script>
import {Option, Select, Table, TableColumn} from 'element-ui';
import {BaseCheckbox, BasePagination, BaseProgress, RouteBreadCrumb} from 'src/components';
import ShoppingTable from './ExtendedTables/ShoppingTable';
import StatsCard from 'src/components/Cards/StatsCard';

import * as chartConfigs from "@/components/Charts/config";
import config from "@/config";


import {csvToDF, extractPeriodSlice, isClosingTrade, toCurrency, toPercent} from "@/DataTransformer";

import _ from "lodash";
import swal from "sweetalert2";
import moment from "moment";

export default {
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    BaseCheckbox,
    RouteBreadCrumb,
    BaseProgress,
    ShoppingTable,
    BasePagination,
    StatsCard,

    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
  },
  data() {
    return {
      start: 0,
      end: 0,
      range_preset: '90',
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
      this.pagination.total = this.period_df.length;
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
      if (df && df.length) {
        let start = this.pagination.currentPage * this.pagination.perPage - this.pagination.perPage;
        let end = this.pagination.currentPage * this.pagination.perPage;
        end = Math.min(end, df.length);
        this.end = end;
        this.start = start;
        let range_str = `${start}:${end}`;
        let df_slice = df.data.slice(start, end);
        // let df_slice = df.iloc({rows: [range_str]})
        // console.log(range_str)
        window.df_slice = df_slice;
        if (df_slice) {
          return df_slice;
        } else return [];
      }
    }
  },
  methods: {
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
      if (this.period_df) {
        const uniq = [...new Set(this.period_df.data.map(item => this.extractTicker(item.symbol)))]
        return uniq.map((item) => {
          return {text: item, value: item}
        }).sort((a, b) => a.text.localeCompare(b.text))
      }
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
      if (this.period_df) {

        const uniq = [...new Set(this.period_df.data.map(item => item.side))]
        return uniq.map((item) => {
          return {text: item, value: item}
        }).sort((a, b) => a.text.localeCompare(b.text))
      }
    },
    filterSide: function (value, row) {
      this.ensurePaginationSize();
      return row.side === value;
      // this.$store.commit('setPeriodDF', this.period_df);
    },
    directionFilters: function () {
      if (this.period_df) {

        const uniq = [...new Set(this.period_df.data.map(item => item.short_or_long))]
        return uniq.map((item) => {
          return {text: item, value: item}
        }).sort((a, b) => a.text.localeCompare(b.text))
      }
    },
    filterDirection: function (value, row) {
      this.ensurePaginationSize();
      return row.short_or_long === value;
      // this.$store.commit('setPeriodDF', this.period_df);
    },

    stockOrOptionFilters: function () {
      if (this.period_df) {

        const uniq = [...new Set(this.period_df.data.map(item => item.stock_or_option))]
        return uniq.map((item) => {
          return {text: item, value: item}
        }).sort((a, b) => a.text.localeCompare(b.text))
      }
    },
    filterStockOrOption: function (value, row) {
      this.ensurePaginationSize();
      return row.stock_or_option === value;
      // this.$store.commit('setPeriodDF', this.period_df);
    },

    openFilters: function () {
      if (this.period_df) {

        const uniq = [...new Set(this.period_df.data.map(item => item.buy_date))]
        return uniq.map((item) => {
          return {text: item, value: item}
        }).sort((a, b) => a && a.text && a.text.localeCompare ? a.text.localeCompare(b.text) : -1)
      }
    },
    filterOpen: function (value, row) {
      return row.buy_date === value;
      // this.$store.commit('setPeriodDF', this.period_df);
    },

    closeFilters: function () {
      if (this.period_df) {

        const uniq = [...new Set(this.period_df.data.map(item => item.sell_date))]
        return uniq.map((item) => {
          return {text: item, value: item}
        }).sort((a, b) => a && a.text && a.text.localeCompare ? a.text.localeCompare(b.text) : -1)
      }
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

      if (df) {


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
      }
    },
    showBuys: function () {
      if (this.period_df) {

        this.reset();
        this.period_df = this.period_df.filter(row => row.side === 'BUY');
        this.pagination.total = this.period_df.length;
      }
    },

    showSells: function () {
      if (this.period_df) {

        this.reset();
        this.period_df = this.period_df.filter(row => isClosingTrade(row));
        this.pagination.total = this.period_df.length;
      }
    },
    extractTicker: function (ticker) {
      return ticker.split(' ')[0];
    },
    toCurrency: toCurrency,
    toPercent: toPercent

  }
  ,
  created() {
    if (this.period_df) {
      this.pagination.total = this.period_df.length;
    }

  }
  ,

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
