<template>
  <div>
    <!--    Range Selector -->
    <div class="row">
      <div class="col-12" style="width: 100%;">
        <div v-if="is_sample_data" class="alert alert-primary">
          You are currently using Sample Data. Use the Import link (last menu item) on the navbar to the left to add
          your own trades.
          <button @click="reloadData" style="color: black;cursor: pointer;">Click to Resample.</button>&nbsp;
          <button @click="gotoImports" style="color: black;cursor: pointer;">Click to Import.</button>

        </div>

        <div v-if="!period_df && df" class="">No trades in the range, use the date fields below to select a date range.
        </div>


      </div>
      <div class="col-12" style="">
        <form class="shadow-md rounded px-8 pt-6 pb-8" @submit.prevent>
          <div class="mb-4">
            <vc-date-picker v-model="range" mode="date" :masks="masks" is-range>
              <template v-slot="{ inputValue, inputEvents, isDragging }">

                <div class="">
                  <input class="rounded p-1" :class="isDragging ? 'text-gray-600' : 'text-gray-900'"
                         :value="inputValue.start" @input="$emit('input', $event.target.value)"
                         v-on="inputEvents.start"/> &nbsp; to &nbsp;

                  <input class="rounded p-1" :class="isDragging ? 'text-gray-600' : 'text-gray-900'"
                         :value="inputValue.end" v-on="inputEvents.end"/> &nbsp;
                  <div class="btn-group float-right">
                    <button type="button" @click="setRangePreset(-1)" class="btn btn-grey btn-round btn-outline"
                            :class="{'active': range_preset===-1}">
                      YTD
                    </button>
                    <button @click="setRangePreset(5)" type="button" class="btn btn-grey btn-round btn-outline"
                            :class="{'active': range_preset===5}">
                      5d
                    </button>
                    <button @click="setRangePreset(10)" type="button" class="btn btn-grey btn-round btn-outline"
                            :class="{'active': range_preset===10}">
                      10d
                    </button>
                    <button type="button" @click="setRangePreset(30)" class="btn btn-grey btn-round btn-outline"
                            :class="{'active': range_preset===30}">
                      30d
                    </button>
                    <button type="button" @click="setRangePreset(90)" class="btn btn-grey btn-round btn-outline"
                            :class="{'active': range_preset===90}">
                      90d
                    </button>
                    <button type="button" @click="setRangePreset(365)" class="btn btn-grey btn-round btn-outline"
                            :class="{'active': range_preset===365}">
                      365d
                    </button>

                  </div>
                </div>
              </template>
            </vc-date-picker>

          </div>
        </form>


      </div>
      <div v-if="period_df && df" class="col-12 text" style="padding-bottom: 5px;">{{ period_df.length }} rows in the
                                                                                   current period, {{ df.length }} in
                                                                                   all data.
      </div>

    </div>
    <!--    Weekly Line Chart -->

<!--    <div class="row">-->
<!--      <div class="col-12">-->
<!--        <card type="chart">-->
<!--          Performance over the last 5 days.-->
<!--          <div class="chart-area">-->
<!--            <weekly-line-chart :chart-data="chart_line_last_5_grouped.chartData"-->
<!--                               :on-click="onClickChartWinLoss"-->
<!--                               id="id_chart_line_last_5_grouped"/>-->

<!--          </div>-->
<!--        </card>-->
<!--      </div>-->
<!--    </div>-->

    <!--    Daily Line Chart grouped by day -->
    <div class="row">
      <div class="col-12">
        <card type="chart">
          <div class="col-sm-6" :class="isRTL ? 'text-right' : 'text-left'">
            <h5 class="card-category">Daily PNL</h5>
            <h2 class="card-title">Period PNL <span style="font-size: .5em;">per day</span></h2>
          </div>

          <div class="chart-area">

            <generic-line-chart :chart-data="chart_line_PNL_YTD_SLICE.chartData"
                                :chart-options="chart_line_PNL_YTD_SLICE.options" :on-click="onClickChartWinLoss"
                                id="pnl-slice-line-chart" overlay-id="overlay-pnl-slice-line-chart"
                                update-column="pnl_cum" label-column="date"/>

          </div>
        </card>
      </div>
    </div>
    <!--    All Traades Line Chart-->
    <div class="row">
      <div class="col-12">
        <card type="chart">
          <template slot="header">
            <div class="row">
              <div class="col-sm-6" :class="isRTL ? 'text-right' : 'text-left'">
                <h5 class="card-category">Period Trades</h5>
                <h2 class="card-title">Period PNL <span style="font-size: .5em;">per trade</span></h2>
              </div>


              <div class="col-sm-6 d-flex d-sm-block">
                <div class="btn-group btn-group-toggle" :class="isRTL ? 'float-left' : 'float-right'"
                     data-toggle="buttons">
                  <label v-for="(option, index) in lineChartDateButtons" :key="option.name"
                         style="color: white;border-color: #cdcdcd;" class="btn btn-sm btn-simple"
                         :class="{ active: chart_line_periodPNL.activeIndex === index }" :id="index"> <input
                      type="radio" @click="initBigChart(index)" name="options" autocomplete="off"
                      :checked="chart_line_periodPNL.activeIndex === index"/> <span
                      class="d-none d-sm-block">{{ option.name }}</span> <span class="d-block d-sm-none">
                    <i :class="option.icon"></i>
                  </span> </label>
                </div>
              </div>
            </div>
          </template>
          <div class="chart-area" style="padding-top: 0px;margin-top: -30px;">
            <generic-line-chart :chart-data="chart_line_periodPNL.chartData"
                                :chart-options="chart_line_periodPNL.options" :on-click="onClickChartPNL"
                                id="pnl-line-chart" overlay-id="overlay-pnl-line-chart" update-column="pnl_cum"
                                label-column="date"/>
          </div>
        </card>
      </div>
    </div>

    <!--    Range Selector -->
    <div class="row" style="">

      <div class="col-12" style="">
        <form class="shadow-md rounded px-8 pt-6 pb-8" @submit.prevent>
          <div class="mb-4">
            <vc-date-picker v-model="range" mode="date" :masks="masks" is-range>
              <template v-slot="{ inputValue, inputEvents, isDragging }">

                <div class="">
                  <input class="rounded p-1" :class="isDragging ? 'text-gray-600' : 'text-gray-900'"
                         :value="inputValue.start" @input="$emit('input', $event.target.value)"
                         v-on="inputEvents.start"/> &nbsp; to &nbsp;

                  <input class="rounded p-1" :class="isDragging ? 'text-gray-600' : 'text-gray-900'"
                         :value="inputValue.end" v-on="inputEvents.end"/> &nbsp;
                  <div class="btn-group float-right">
                    <button type="button" @click="setRangePreset(-1)" class="btn btn-grey btn-round btn-outline"
                            :class="{'active': range_preset===-1}">
                      YTD
                    </button>
                    <button @click="setRangePreset(5)" type="button" class="btn btn-grey btn-round btn-outline"
                            :class="{'active': range_preset===5}">
                      5d
                    </button>
                    <button @click="setRangePreset(10)" type="button" class="btn btn-grey btn-round btn-outline"
                            :class="{'active': range_preset===10}">
                      10d
                    </button>
                    <button type="button" @click="setRangePreset(30)" class="btn btn-grey btn-round btn-outline"
                            :class="{'active': range_preset===30}">
                      30d
                    </button>
                    <button type="button" @click="setRangePreset(90)" class="btn btn-grey btn-round btn-outline"
                            :class="{'active': range_preset===90}">
                      90d
                    </button>
                    <button type="button" @click="setRangePreset(365)" class="btn btn-grey btn-round btn-outline"
                            :class="{'active': range_preset===365}">
                      365d
                    </button>

                  </div>
                </div>
              </template>
            </vc-date-picker>

          </div>
        </form>


      </div>

    </div>

    <!--    Win Loss Amount Bar Chart-->
    <div class="row">
      <div class="col-12" :class="{ 'text-right': isRTL }">
        <card class="card-chart" no-footer-line>
          <template slot="header">
            <h4 class="card-category" style="font-size: 1.1em;">Wins and losses by $</h4>
            <h3 class="card-title">
              <i class="tim-icons el-icon-plus"></i>{{
                toCurrency(dashboard.winAmount)
                                                    }}/{{ toCurrency(dashboard.lossAmount) }} </h3>
          </template>
          <div class="chart-area">
            <generic-bar-chart :chart-data="chart_bar_win_loss_amount.chartData"
                               :extra-options="chart_bar_win_loss_amount.extraOptions"
                               :on-click="onClickChartWinLoss_bar" :id="chart_bar_win_loss_amount.id">

            </generic-bar-chart>

          </div>
        </card>
      </div>
    </div>

    <!--    Win Loss Count Bar Chart-->

    <div class="row">

      <div class="col-12">
        <card class="card-chart" no-footer-line>
          <template slot="header">
            <h4 class="card-category" style="font-size: 1.1em;">Wins and losses by #</h4>
            <h3 class="card-title">
              <i class="tim-icons el-icon-plus"></i>{{ dashboard.winCount }}/{{ dashboard.lossCount }} </h3>
          </template>
          <div class="chart-area">
            <generic-bar-chart :chart-data="chart_bar_win_loss.chartData"
                               :extra-options="chart_bar_win_loss.extraOptions" :on-click="onClickChartWinLoss_bar"
                               :id="chart_bar_win_loss.id" overlay-id="overlay-chart_bar_win_loss">
              :height="200" >
            </generic-bar-chart>
          </div>
        </card>
      </div>
    </div>

    <!--    3 Win Loss Pie charts -->
    <div class="row">
      <div class="col-lg-4" :class="{ 'text-right': isRTL }">
        <card type="chart">
          <template slot="header">
            <h4 class="card-category">Winning Days vs Losing Days</h4>
            <h3 class="card-title">
              <i style="color: #42B883;" class="tim-icons el-icon-arrow-up"></i> {{
                dashboard.winDays
                                                                                 }}/{{ dashboard.lossDays }} <span
                class="float-right">{{ dashboard.winDays + dashboard.lossDays }}</span>

            </h3>
          </template>
          <div class="chart-area">

            <generic-pie-chart :chart-data="chart_pie_win_loss_days.chartData" :id="chart_pie_win_loss_days.id">

            </generic-pie-chart>

          </div>
        </card>
      </div>

      <div class="col-lg-4" :class="{ 'text-right': isRTL }">
        <card class="card-chart" no-footer-line>
          <template slot="header">
            <h5 class="card-category">Wins and loss $</h5>
            <h3 class="card-title">
              <i class="tim-icons el-icon-plus"></i> {{
                toCurrency(dashboard.winAmount)
                                                     }}/{{ toCurrency(dashboard.lossAmount) }} <span
                class="float-right">{{ toCurrency(dashboard.periodPnl) }}</span>
            </h3>

          </template>
          <div class="chart-area">

            <generic-pie-chart :chart-data="chart_pie_win_loss_amount.chartData" :id="chart_pie_win_loss_amount.id">

            </generic-pie-chart>


          </div>
        </card>
      </div>

      <div class="col-lg-4" :class="{ 'text-right': isRTL }">
        <card class="card-chart" no-footer-line>
          <template slot="header">
            <h5 class="card-category">Wins and loss count</h5>
            <h3 class="card-title">
              <i class="tim-icons el-icon-plus"></i> {{ dashboard.winCount }}/{{ dashboard.lossCount }} <span
                class="float-right">{{ dashboard.winCount + dashboard.lossCount }}</span>
            </h3>
          </template>
          <div class="chart-area">

            <generic-pie-chart :chart-data="chart_pie_win_loss.chartData" :id="chart_pie_win_loss.id">

            </generic-pie-chart>

          </div>
        </card>
      </div>

    </div>
    <!--    Range Selector -->
    <div class="row" style="">

      <div class="col-12" style="">
        <form class="shadow-md rounded px-8 pt-6 pb-8" @submit.prevent>
          <div class="mb-4">
            <vc-date-picker v-model="range" mode="date" :masks="masks" is-range>
              <template v-slot="{ inputValue, inputEvents, isDragging }">

                <div class="">
                  <input class="rounded p-1" :class="isDragging ? 'text-gray-600' : 'text-gray-900'"
                         :value="inputValue.start" @input="$emit('input', $event.target.value)"
                         v-on="inputEvents.start"/> &nbsp; to &nbsp;

                  <input class="rounded p-1" :class="isDragging ? 'text-gray-600' : 'text-gray-900'"
                         :value="inputValue.end" v-on="inputEvents.end"/> &nbsp;
                  <div class="btn-group float-right">
                    <button type="button" @click="setRangePreset(-1)" class="btn btn-grey btn-round btn-outline"
                            :class="{'active': range_preset===-1}">
                      YTD
                    </button>
                    <button @click="setRangePreset(5)" type="button" class="btn btn-grey btn-round btn-outline"
                            :class="{'active': range_preset===5}">
                      5d
                    </button>
                    <button @click="setRangePreset(10)" type="button" class="btn btn-grey btn-round btn-outline"
                            :class="{'active': range_preset===10}">
                      10d
                    </button>
                    <button type="button" @click="setRangePreset(30)" class="btn btn-grey btn-round btn-outline"
                            :class="{'active': range_preset===30}">
                      30d
                    </button>
                    <button type="button" @click="setRangePreset(90)" class="btn btn-grey btn-round btn-outline"
                            :class="{'active': range_preset===90}">
                      90d
                    </button>
                    <button type="button" @click="setRangePreset(365)" class="btn btn-grey btn-round btn-outline"
                            :class="{'active': range_preset===365}">
                      365d
                    </button>

                  </div>
                </div>
              </template>
            </vc-date-picker>

          </div>
        </form>


      </div>

    </div>

    <!--PNL by Days Held -->
    <div class="row">
      <div class="col-12" :class="{ 'text-right': isRTL }">
        <card class="card-chart" no-footer-line>
          <template slot="header">
            <h4 class="card-category" style="font-size: 1.1em;">PNL By Days Held</h4>
            <h3 class="card-title">
              <i class="tim-icons el-icon-date" style="margin-top: -5px;"></i> Best: {{ dashboard.bestDaysHeld }} days,
                                                                               Least: {{ dashboard.worstDaysHeld }}
                                                                               days. </h3>
          </template>
          <div class="chart-area">
            <generic-bar-chart :chart-data="chart_bar_days_held.chartData"
                               :extra-options="chart_bar_days_held.extraOptions" :on-click="onClickChartWinLoss_bar"
                               :id="chart_bar_days_held.id">

            </generic-bar-chart>

          </div>
        </card>
      </div>
    </div>
    <!--PNL by Month -->
    <div class="row">
      <div class="col-12" :class="{ 'text-right': isRTL }">
        <card class="card-chart" no-footer-line>
          <template slot="header">
            <h4 class="card-category" style="font-size: 1.1em;">PNL By Month</h4>
            <h3 class="card-title">
              <i class="tim-icons el-icon-date" style="margin-top: -5px;"></i> Best: {{ dashboard.bestMonth }} , Least:
                                                                               {{ dashboard.worstMonth }} </h3>
          </template>
          <div class="chart-area">
            <generic-bar-chart :chart-data="chart_bar_by_month.chartData"
                               :extra-options="chart_bar_by_month.extraOptions" :on-click="onClickChartWinLoss_bar"
                               :id="chart_bar_by_month.id">

            </generic-bar-chart>

          </div>
        </card>
      </div>
    </div>
    <!--PNL by Day of Week -->
    <div class="row">
      <div class="col-12" :class="{ 'text-right': isRTL }">
        <card class="card-chart" no-footer-line>
          <template slot="header">
            <h4 class="card-category" style="font-size: 1.1em;">PNL By DayOfWeek</h4>
            <h3 class="card-title">
              <i class="tim-icons el-icon-date" style="margin-top: -5px;"></i>
              Best: {{dashboard.bestDayOfWeek}}, Worst: {{ dashboard.worstDayOfWeek}}</h3>
          </template>
          <div class="chart-area">
            <generic-bar-chart :chart-data="chart_bar_by_day_of_week.chartData"
                               :extra-options="chart_bar_by_day_of_week.extraOptions"
                               :on-click="onClickChartWinLoss_bar"
                               :id="chart_bar_by_day_of_week.id">

            </generic-bar-chart>

          </div>
        </card>
      </div>
    </div>

    <!--    TODO Text -->
<!--    <div class="row">-->
<!--      <div class="col-12">-->

<!--        <h2 class="text-center">Charts.js</h2>-->
<!--        <p class="category text-center">-->

<!--          Need Charts for <br/> <br/> [X] Aggregate PNL over time, has negative and positive <br/> [ X] Total PNL over-->
<!--          time, has negative and positive <br/> [ X] Timeframe Avg, PNL <br/> [X] Pie charts for WvL$, WvL#,ShortVLong,-->
<!--          <br/> [O] Profitibality by how long the position was held, $12 for 1 day holds, $24 for two day holds etc-->
<!--          <br/> [X] Bar chart for per month profits [ ] [ ] Volume by Hour <br/> [ ] Volume by Day <br/> [ ] Total-->
<!--          Volume <br/> [ ] # Trades per day <br/> [ ] Total Trades over time , <br/> [ ] Wins and losses over time, has-->
<!--          negative and positive, Both plotted on same chart line chart <br/> [ ] Aggregate Wins and losses over time,-->
<!--          bar chart withpositive and negative <br/> [ ] Aggregate Positions over time, long vs short, two lines <br/> [-->
<!--          ] Total Positions held over time <br/> [ ] Wins vs Losses, one chart <br/> [ ] MFE and MAE charts <br/> [ ]-->
<!--          Heatmap Charts by profitabillity <br/> [ ] Switcher for this page, for hourly, weekly, monthly, and yearly-->
<!--          Cumulative Wins for cost buckets of each stock <br/>-->

<!--          [ ] Tree map of trades and their profits </p>-->

<!--      </div>-->
<!--    </div>-->
  </div>

</template>
<script>


import {
  toCurrency,
  isClosingTrade,
  toDisplayDate,
  extractPeriodSlice,
  csvToDF,
  generateTradingData
} from 'src/DataTransformer'
import swal from "sweetalert2";
import * as chartConfigs from '@/components/Charts/config';
import StatsCard from 'src/components/Cards/StatsCard';
import config from '@/config';
import {Button, MessageBox} from "element-ui";
import moment from 'moment';
import VCalendar from 'v-calendar';
import Vue from 'vue';
import Imports from "@/pages/ImportsPage";
import {createCharts} from "@/DataTransformer";
import _ from 'lodash';
import Jataframe from "@/Jataframe";
import Chart from 'chart.js/auto';
import GenericLineChart from "@/components/Charts/GenericLineChart";
import GenericPieChart from "@/components/Charts/GenericPieChart";
import GenericBarChart from "@/components/Charts/GenericBarChart";
import {ensureDataOffsetIndex, randomString} from "@/util";
import WeeklyLineChart from "@/components/Charts/WeeklyLineChart.vue";
import tinycolor from "tinycolor2";

function _onClickChartWinLoss(evt, activeElements, chart, skipOffset = false) {
  let result = '';

  const points = chart.getElementsAtEventForMode(evt, 'nearest', {intersect: true}, true);
  const id = chart.data.datasets[0].id;
  console.log('in on click id is ', id)
  const offset = ensureDataOffsetIndex(id);

  if (points.length) {
    const index = points[0].index;
    let fullIndex = index;
    if (!skipOffset) {
      fullIndex = offset + index;
    }
    const row = closersGrouped.data[fullIndex];
    row.pnl = row.win_amount + row.loss_amount;

    const arrowClass = row.pnl > 0 ? 'fas fa-thin fa-arrow-up stj-green-text' : 'fas fa-thin fa-arrow-down stj-red-text';
    const arrow = `<i class="${arrowClass}" style="font-size: .8em;"></i>`
    const pnlClass = row.pnl > 0 ? 'stj-green-text' : 'stj-red-text';
    const pnl = `<span class=${pnlClass} style="font-size: 1.2em;">${toCurrency(row.pnl)}</span>`;
    const win_amount = `<span class="stj-green-text" style="font-size: 1.2em;">${toCurrency(row.win_amount)}</span>`;
    const loss_amount = `<span class="stj-red-text" style="font-size: 1.2em;">${toCurrency(row.loss_amount)}</span>`;
    let winning_symbols = '';
    let losing_symbols = '';
    let total_win = 0;
    let total_loss = 0;
    for (let i = 0; i < row.win_symbols.length; i++) {

      winning_symbols += `<tr>
            <td width="200px">Symbol</td>
            <td width="200px"><b class="stj-green-text" style="font-size: 1.2em;">${row.win_symbols[i]}</b></td>
          <td width="200px"> <span style="font-size: 1em;" >${toCurrency(row.win_pnl[i])}</span> </td>
        </tr>`;
      total_win += row.win_pnl[i];
    }
    winning_symbols += `<tr><td width="300px">Total</td><td colspan="2" width="300px" style="font-size: 1.2em;"><i style="font-size: .8em;" class="fas fa-thin fa-arrow-up stj-green-text"></i>  ${toCurrency(total_win)}</td></tr>`


    for (let i = 0; i < row.loss_symbols.length; i++) {

      losing_symbols += `<tr>
            <td width="200px">Symbol</td>
            <td width="200px"><b class="stj-red-text" style="font-size: 1.2em;">${row.loss_symbols[i]}</b></td>
          <td width="200px">  <span style="font-size: 1em;" >${toCurrency(row.loss_pnl[i])}</span> </td>
        </tr>`;
      total_loss += row.loss_pnl[i];

    }
    losing_symbols += `<tr><td width="200px">Total</td><td colspan="2" width="200px" style="font-size: 1.2em;"><i style="font-size: .8em;" class="fas fa-thin fa-arrow-down stj-red-text"></i> ${toCurrency(total_loss)}</td></tr>`


    swal.fire({
      showClass: {
        popup: 'animate__animated animate__zoomIn animate__faster'
      },
      hideClass: {
        popup: 'animate__animated animate__zoomOut'
      },
      title: `${row.group}\n${toCurrency(row.win_amount + row.loss_amount)}`,
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-dark'
      },
      confirmButtonText: 'Close',
      width: '600px',
      html: `<div style="">
<table class="tiny-trade" style="">

  <tbody>
    <tr>
      <td style="font-size: 1.2em;">PNL</td>
      <td style="font-size: 1.2em;">
        ${toCurrency(pnl)}
      </td>
    </tr>
    <tr>
      <td width="250px">Date</td>
      <td width="250px"><b style="color: white;font-weight: bold;">${row.group}</b></td>
    </tr>

    <tr>
      <td width="250px">Win Count</td>
      <td width="250px"><b style="color: white;font-weight: bold;">${row.win_count}</b></td>
    </tr>
    <tr>
      <td>Total Winnings</td>
      <td>
        ${toCurrency(win_amount)}
      </td>
    </tr>
    <tr>
      <td width="250px">Loss Count</td>
      <td width="250px"><b style="color: white;font-weight: bold;">${row.loss_count * -1}</b></td>
    </tr>
    <tr>
      <td>Total Losses</td>
      <td>
        ${toCurrency(loss_amount)}
      </td>
    </tr>

  </tbody>
</table>
<h4 style="color: black;">Winning Trades</h4>
<table class="tiny-trade" style="">
<tbody>
${winning_symbols}
</tbody>
</table>
<h4 style="color: black;">Losing Trades</h4>
<table class="tiny-trade" style="">
<tbody>
${losing_symbols}
</tbody>
</table>

</div>
`

    });
  }
}

export default {
  components: {
    WeeklyLineChart,
    GenericLineChart,
    GenericBarChart,
    StatsCard,
    GenericPieChart,
    VCalendar,
    Imports,
    Button,
    MessageBox
  },


  data() {
    return {

      range_preset: '90',
      is_sample_data: this.$store.state.is_sample_data,
      should_use_sample_data: true,
      df: this.$store.state.df,
      period_df: this.$store.state.period_df,
      closers: null,


      range: {
        start: this.$store.state.startDate,
        end: this.$store.state.endDate
      },

      masks: {
        input: 'YYYY-MM-DD',
      },
      timeframe: moment().format('YYYY-MM-DD'),

      chart_line_periodPNL: {
        id: 'chart_line_periodPNL'
      },
      chart_line_PNL_YTD_SLICE: {
        id: 'chart_line_PNL_YTD_SLICE'
      },
      chart_line_PNL_last_ten: {
        id: 'chart_line_PNL_last_ten'
      },
      chart_line_last_5_grouped: {
        id: 'chart_line_last_5_grouped'
      },
      chart_bar_stacked_cum_win_loss: {
        extraOptions: chartConfigs.greenChartOptions,
      },


      chart_bar_days_held: {
        id: 'barDaysHeld'
      },
      chart_bar_by_month: {
        id: 'barByMonth'
      },
      chart_bar_by_day_of_week: {
        id: 'barByDayOfWeek'

      },
      chart_bar_win_loss: {
        id: 'winLossChart'
      },
      chart_pie_win_loss: {
        id: 'winLossChart_pie'
      },
      chart_pie_win_loss_amount: {
        id: 'winLossAmountChart_pie'
      },
      chart_pie_win_loss_days: {
        id: 'winLossDaysChart_pie'
      },

      chart_bar_win_loss_amount: {
        id: 'winLossAmountChart'
      },
    };

  },
  computed: {
    dashboard() {
      // alert('Look at the GenericLine chart only for whats not working');
      let yearDF = this.df;
      let periodDF = this.period_df;
      let totalPnl = 0;
      if (!periodDF && !yearDF) {
        if (this.should_use_sample_data) {

          const broker = 'ameritrade'
          this.is_sample_data = true;
          const df = generateTradingData(42);
          yearDF = df;
          this.df = df;
          const import_meta = {
            filename: 'sample.csv',
            broker,
            date: new Date().toISOString().slice(0, 10),
            row_count: df.length,
            estimate_missing_values: 'false',
            id: randomString(10)
          };
          const endDate = new Date();
          let startDate = new Date();
          startDate.setMonth(this.$store.state.startDate.getMonth() - 3);


          const import_data = {
            id: import_meta.id,
            data: df.data
          }


          // this.$store.commit('addImport', {meta: import_meta, data: import_data});
          // this.$store.commit('setDF', df);
          this.period_df = extractPeriodSlice(df, startDate, endDate);
          periodDF = this.period_df;
          // this.$store.commit('setPeriodDF', this.period_df);
          this.$store.commit('setIsSampleData', true);
          // this.$store.commit('setLastUpdated', new Date());
          // this.$store.commit('setCurrentDatasetId', import_meta.id)
          // // this.$router.push('dashboard')
          // this.message = 'You imported ' + df.length + ' rows to local storage with ' + this.$store.state.closers.length + ' closes.';
          // this.message_class = 'alert alert-success';

        } else {
          this.message = 'You have no data. Please import a CSV file.';
          this.message_class = 'alert alert-danger';
        }
      }

      if (periodDF) totalPnl = periodDF.sum('pnl');

      let periodPnl = 0;
      if (yearDF) {
        periodPnl = yearDF.sum('pnl');
      }

      let numberOfTrades = 0;
      if (periodDF) numberOfTrades = periodDF.filter(row => isClosingTrade(row)).length;

      let numberOfWins = 0;
      if (periodDF) numberOfWins = periodDF.filter(row => isClosingTrade(row)).filter(row => row.pnl > 0).length;

      let numberOfLosses = 0;
      if (periodDF) numberOfLosses = periodDF.filter(row => isClosingTrade(row)).filter(row => row.pnl < 0).length;


      let averagePerTrade = 0;
      if (periodDF) {
        averagePerTrade = periodDF.filter(row => row.pnl != 0).mean('pnl');
        averagePerTrade = isNaN(averagePerTrade) ? 0 : averagePerTrade;
      }

      let averageLoss = 0;
      if (periodDF) {
        averageLoss = periodDF.filter(row => row.pnl < 0).mean('pnl');
        averageLoss = isNaN(averageLoss) ? 0 : averageLoss;
      }

      let averageDailyPNL = 0;
      if (periodDF) {
        averageDailyPNL = periodDF.filter(row => row.pnl != 0).mean('pnl');
        // averageDailyPNL =
        console.log('averageDailyPNL', averageDailyPNL)
      }

      let averageWin = 0;
      if (periodDF) {
        averageWin = periodDF.filter(row => row.pnl > 0).mean('pnl');
        averageWin = isNaN(averageWin) ? 0 : averageWin;
      }

      let worstLoser = '';
      let minPnl = -Infinity,
          maxPnl = Infinity;
      if (periodDF) {
        minPnl = periodDF.min('pnl');
        maxPnl = periodDF.max('pnl');
        const losers = periodDF.filter(row => row.pnl === minPnl);
        if (losers.length)
          worstLoser = losers.data[0].symbol;
      }

      let worstLoserPnl = 0;
      if (periodDF) {
        let losers = periodDF.filter(row => row.pnl === minPnl);
        if (losers.length) worstLoserPnl = losers.data[0].pnl;
      }

      let bestWinner = '';
      if (periodDF) {
        let losers = periodDF.filter(row => row.pnl === maxPnl);
        if (losers.length) bestWinner = losers.data[0].symbol;
      }

      let bestWinnerPnl = '';
      if (periodDF) {
        let losers = periodDF.filter(row => row.pnl === maxPnl);
        if (losers.length) bestWinnerPnl = losers.data[0].pnl;
      }

      let lastDayDiff = 0,
          lastTen = 0,
          lastTenPNL = 0,
          lastFivePNL = 0,
          cumulativePnl = 0,
          winCount = 0,
          lossCount = 0,
          winAmount = 0,
          lossAmount = 0,
          winDays = 0,
          lossDays = 0,
          lastDayDiffIcon = 0,
          lastDayDiffText = 0,
          bestDaysHeld = 0,
          worstDaysHeld = 0,
          bestMonth = 'Jan',
          worstMonth = 'Feb',
          bestDayOfWeek = 'Mon',
          worstDayOfWeek = 'Tue';

      if (periodDF) {
        const closers = periodDF.filter(row => isClosingTrade(row));
        // closers['days_held'] =
        const days_held = [];
        const sell_month = [];
        const day_of_week = [];
        closers.data.forEach(row => {
          if (row && row.buy_date && row.sell_date) {
            const buy_date = new Date(row.buy_date);
            const sell_date = new Date(row.sell_date);
            const diffTime = Math.abs(buy_date - sell_date);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            days_held.push(diffDays);

          } else {
            days_held.push(-1);
          }

          if (row && row.sell_date) {
            const sell_date = new Date(row.sell_date);
            const monthName = sell_date.toLocaleString('default', {month: 'long'});
            const dayOfWeek = sell_date.toLocaleString('default', {weekday: 'long'});
            sell_month.push(monthName);
            day_of_week.push(dayOfWeek)
          } else {
            sell_month.push(-1);
            day_of_week.push(-1);
          }

        });
        closers['days_held'] = days_held;
        closers['sell_month'] = sell_month;
        closers['day_of_week'] = day_of_week;
        window.closers = closers;
        this.closers = closers;
        const lastTen = closers.slice(-10)
        this.chart_line_periodPNL = this.createLineChart(closers, 'pnl_period_cum', 'date', 'symbol', 'pnl-line-chart');
        this.closersGroupedByDaysHeld = closers.aggregateBy('days_held', {
          'pnl': {
            'pnl': (jf) => {
              return jf.sum('pnl');
            }
          },
          'loss_count': {
            'pnl': (jf) => {
              return -(jf.filter(row => row.pnl < 0).length);
            }
          },
          'win_count': {
            'pnl': (jf) => {
              return (jf.filter(row => row.pnl > 0).length);
            }
          },
          'win_amount': {
            'pnl': (jf) => {
              const all_rows = jf.filter(row => row.pnl > 0).data;
              return all_rows.reduce((acc, row) => acc + row.pnl, 0);
            }
          },
          'loss_amount': {
            'pnl': (jf) => {
              const all_rows = jf.filter(row => row.pnl < 0).data;
              return all_rows.reduce((acc, row) => acc + row.pnl, 0);
            }
          },
          'win_symbols': {
            'symbol': (jf) => {
              return [...new Set(jf.filter(row => row.pnl > 0).data.map(row => row.symbol))]
            }
          },
          'win_pnl': {
            'price': (jf) => {
              return jf.filter(row => row.pnl > 0).data.map(row => row.pnl);
            }
          },
          'loss_symbols': {
            'symbol': (jf) => {
              return [...new Set(jf.filter(row => row.pnl < 0).data.map(row => row.symbol))];
            }
          },
          'symbols': {
            'symbol': (jf) => {
              return [...new Set(jf.data.map(row => row.symbol))]
            }
          },
          'loss_pnl': {
            'price': (jf) => {
              return jf.filter(row => row.pnl < 0).data.map(row => row.pnl);
            }
          },
          'date': {
            'date': (jf) => {
              return jf['date'][0];
            }
          }
        }, true);

        bestDaysHeld = this.closersGroupedByDaysHeld.data.reduce((acc, row) => {
          if (row.pnl > acc.pnl) {
            return row;
          }
          return acc;
        }, {pnl: 0}).group;
        worstDaysHeld = this.closersGroupedByDaysHeld.data.reduce((acc, row) => {
          if (row.pnl < acc.pnl) {
            return row;
          }
          return acc;
        }, {pnl: 0}).group;
        this.closersGroupedByDayOfWeek = closers.aggregateBy('day_of_week', {
          'pnl': {
            'pnl': (jf) => {
              return jf.sum('pnl');
            }
          },
          'loss_count': {
            'pnl': (jf) => {
              return -(jf.filter(row => row.pnl < 0).length);
            }
          },
          'win_count': {
            'pnl': (jf) => {
              return (jf.filter(row => row.pnl > 0).length);
            }
          },
          'win_amount': {
            'pnl': (jf) => {
              const all_rows = jf.filter(row => row.pnl > 0).data;
              return all_rows.reduce((acc, row) => acc + row.pnl, 0);
            }
          },
          'loss_amount': {
            'pnl': (jf) => {
              const all_rows = jf.filter(row => row.pnl < 0).data;
              return all_rows.reduce((acc, row) => acc + row.pnl, 0);
            }
          },
          'win_symbols': {
            'symbol': (jf) => {
              return [...new Set(jf.filter(row => row.pnl > 0).data.map(row => row.symbol))]
            }
          },
          'win_pnl': {
            'price': (jf) => {
              return jf.filter(row => row.pnl > 0).data.map(row => row.pnl);
            }
          },
          'loss_symbols': {
            'symbol': (jf) => {
              return [...new Set(jf.filter(row => row.pnl < 0).data.map(row => row.symbol))];
            }
          },
          'symbols': {
            'symbol': (jf) => {
              return [...new Set(jf.data.map(row => row.symbol))]
            }
          },
          'loss_pnl': {
            'price': (jf) => {
              return jf.filter(row => row.pnl < 0).data.map(row => row.pnl);
            }
          },
          'date': {
            'date': (jf) => {
              return jf['date'][0];
            }
          }
        }, true);

        this.closersGroupedByMonth = closers.aggregateBy('sell_month', {
          'pnl': {
            'pnl': (jf) => {
              return jf.sum('pnl');
            }
          },
          'loss_count': {
            'pnl': (jf) => {
              return -(jf.filter(row => row.pnl < 0).length);
            }
          },
          'win_count': {
            'pnl': (jf) => {
              return (jf.filter(row => row.pnl > 0).length);
            }
          },
          'win_amount': {
            'pnl': (jf) => {
              const all_rows = jf.filter(row => row.pnl > 0).data;
              return all_rows.reduce((acc, row) => acc + row.pnl, 0);
            }
          },
          'loss_amount': {
            'pnl': (jf) => {
              const all_rows = jf.filter(row => row.pnl < 0).data;
              return all_rows.reduce((acc, row) => acc + row.pnl, 0);
            }
          },
          'win_symbols': {
            'symbol': (jf) => {
              return [...new Set(jf.filter(row => row.pnl > 0).data.map(row => row.symbol))]
            }
          },
          'win_pnl': {
            'price': (jf) => {
              return jf.filter(row => row.pnl > 0).data.map(row => row.pnl);
            }
          },
          'loss_symbols': {
            'symbol': (jf) => {
              return [...new Set(jf.filter(row => row.pnl < 0).data.map(row => row.symbol))];
            }
          },
          'symbols': {
            'symbol': (jf) => {
              return [...new Set(jf.data.map(row => row.symbol))]
            }
          },
          'loss_pnl': {
            'price': (jf) => {
              return jf.filter(row => row.pnl < 0).data.map(row => row.pnl);
            }
          },
          'date': {
            'date': (jf) => {
              return jf['date'][0];
            }
          }
        }, true);

        bestMonth = this.closersGroupedByMonth.data.reduce((acc, row) => {
          if (row.pnl > acc.pnl) {
            return row;
          }
          return acc;
        }, {pnl: 0}).group;
        worstMonth = this.closersGroupedByMonth.data.reduce((acc, row) => {
          if (row.pnl < acc.pnl) {
            return row;
          }
          return acc;
        }, {pnl: 0}).group;
        const maxPnl = this.closersGroupedByMonth.max('pnl');
        this.closersGrouped = closers.aggregateBy('date', {
          'pnl': {
            'pnl': (jf) => {
              return jf.sum('pnl');
            }
          },
          'loss_count': {
            'pnl': (jf) => {
              return -(jf.filter(row => row.pnl < 0).length);
            }
          },
          'win_count': {
            'pnl': (jf) => {
              return (jf.filter(row => row.pnl > 0).length);
            }
          },
          'win_amount': {
            'pnl': (jf) => {
              const all_rows = jf.filter(row => row.pnl > 0).data;
              return all_rows.reduce((acc, row) => acc + row.pnl, 0);
            }
          },
          'loss_amount': {
            'pnl': (jf) => {
              const all_rows = jf.filter(row => row.pnl < 0).data;
              return all_rows.reduce((acc, row) => acc + row.pnl, 0);
            }
          },
          'win_symbols': {
            'symbol': (jf) => {
              return [...new Set(jf.filter(row => row.pnl > 0).data.map(row => row.symbol))]
            }
          },
          'win_pnl': {
            'price': (jf) => {
              return jf.filter(row => row.pnl > 0).data.map(row => row.pnl);
            }
          },
          'loss_symbols': {
            'symbol': (jf) => {
              return [...new Set(jf.filter(row => row.pnl < 0).data.map(row => row.symbol))];
            }
          },
          'symbols': {
            'symbol': (jf) => {
              return [...new Set(jf.data.map(row => row.symbol))]
            }
          },
          'loss_pnl': {
            'price': (jf) => {
              return jf.filter(row => row.pnl < 0).data.map(row => row.pnl);
            }
          },
          'date': {
            'date': (jf) => {
              return jf['date'][0];
            }
          }
        }, true);
        const sum = Jataframe.cumulative_sum(this.closersGrouped['pnl']);
        this.closersGrouped['pnl_cum'] = sum;
        window.closersGrouped = this.closersGrouped;
        this.chart_line_PNL_YTD_SLICE = this.createLineChart(closersGrouped, 'pnl_cum', 'date', 'symbols', 'pnl-slice-line-chart');

        lastFivePNL = closersGrouped.slice(-5).sum('pnl');
        let chartDataWL = {
          labels: this.closersGrouped['group'],
          datasets: [
            {
              label: 'Losses',
              fill: true,
              backgroundColor: config.colors.orange,
              hoverBackgroundColor: config.colors.orange,
              borderColor: config.colors.orange,
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              data: this.closersGrouped['loss_count']
            },
            {
              label: 'Wins',
              fill: true,
              backgroundColor: config.colors.teal,
              hoverBackgroundColor: config.colors.teal,
              borderColor: config.colors.teal,
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              data: this.closersGrouped['win_count']
            }
          ]
        };
        let chartDataDaysHeld = {
          labels: this.closersGroupedByDaysHeld['group'],
          datasets: [{
            label: 'PNL',
            fill: true,
            // backgroundColor: 'rgba(212,212,187,0.8)',
            // hoverBackgroundColor: 'rgba(212,212,187,0.9)',
            // borderColor: 'rgba(212,212,187,0.5)',
            backgroundColor: function (row) {
              if (row.raw > 0) {
                return '#35ffa0';
              } else return '#ff6349';
            },
            // hoverBackgroundColor: 'rgba(212,212,187,0.9)',
            // borderColor: 'rgba(212,212,187,0.5)',
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            data: this.closersGroupedByDaysHeld['pnl']
          }]
        };


        let chartDataByDayOfWeek = {
          labels: this.closersGroupedByDayOfWeek['group'],
          datasets: [{
            label: 'PNL',
            fill: true,
            backgroundColor: function (row) {
              const val = row.raw;
              let percent = val / maxPnl;

              if (val < 0) {
                // const color = '#ff8a76';
                // Lighten the color by the percent
                const color = tinycolor('#ff8a76').lighten(50 * percent).toHexString();
                return color;
              } else {
                // const color = '#56eda6';
                // Lighten the color by the percent
                // set the Min percent is 0.5
                percent = Math.min(percent, 0.1);

                const color = tinycolor('#56eda6').darken(100 * percent).toHexString();
                return color;
              }

              // Take the minimum percent of 0.5
              // const minPercent = Math.min(percent, 0.5);
              // console.log('percent', percent);
              // console.log('minPercent', minPercent);
              // return 'rgba(212,212,187,' + minPercent + ')';

            },
            // hoverBackgroundColor: 'rgba(212,212,187,0.9)',
            // borderColor: 'rgba(212,212,187,0.5)',
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            data: this.closersGroupedByDayOfWeek['pnl']
          }]
        };

        let chartDataByMonth = {
          labels: this.closersGroupedByMonth['group'],
          datasets: [{
            label: 'PNL',
            fill: true,
            backgroundColor: function (row) {
              const val = row.raw;
              let percent = val / maxPnl;

              if (val < 0) {
                // const color = '#ff8a76';
                // Lighten the color by the percent
                const color = tinycolor('#ff8a76').lighten(1 * percent).toHexString();
                return color;
              } else {
                // const color = '#56eda6';
                // Lighten the color by the percent
                // set the Min percent is 0.5
                percent = Math.min(percent, 0.1);

                const color = tinycolor('#56eda6').darken(100 * percent).toHexString();
                return color;
              }

              // Take the minimum percent of 0.5
              // const minPercent = Math.min(percent, 0.5);
              // console.log('percent', percent);
              // console.log('minPercent', minPercent);
              // return 'rgba(212,212,187,' + minPercent + ')';

            },
            // hoverBackgroundColor: 'rgba(212,212,187,0.9)',
            // borderColor: 'rgba(212,212,187,0.5)',
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            data: this.closersGroupedByMonth['pnl']
          }]
        };
        let chartDataWLAmount = {
          stack: 'bar',
          labels: this.closersGrouped['group'],
          datasets: [
            {
              label: 'Losses $',
              fill: true,
              backgroundColor: config.colors.orange,
              hoverBackgroundColor: config.colors.orange,
              borderColor: config.colors.orange,
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              data: this.closersGrouped['loss_amount']
            },
            {
              label: 'Wins $',
              fill: true,
              backgroundColor: config.colors.teal,
              hoverBackgroundColor: config.colors.teal,
              borderColor: config.colors.teal,
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              data: this.closersGrouped['win_amount']
            }
          ]
        };

        this.chart_bar_by_month = {
          id: 'by-month-bar-chart',
          chartData: chartDataByMonth,
          extraOptions: {

            responsive: true,
            scales: {
              x: {
                stacked: true,
                grid: {
                  color: config.colors.transparent,
                  zeroLineColor: config.colors.transparent
                },
              },
              y: {
                stacked: true,
                grid: {
                  color: config.colors.transparent,
                  zeroLineColor: config.colors.transparent
                },
              }
            }
          }
        }
        this.chart_bar_by_day_of_week= {
          id: 'by-day-of-week-bar-chart',
          chartData: chartDataByDayOfWeek,
          extraOptions: {

            responsive: true,
            scales: {
              x: {
                stacked: true,
                grid: {
                  color: config.colors.transparent,
                  zeroLineColor: config.colors.transparent
                },
              },
              y: {
                stacked: true,
                grid: {
                  color: config.colors.transparent,
                  zeroLineColor: config.colors.transparent
                },
              }
            }
          }
        }
        console.log('HERE!!!IU!IN!IUN');
        console.log(this.chart_bar_by_day_of_week);
        this.chart_bar_days_held = {
          id: 'days-held-bar-chart',
          chartData: chartDataDaysHeld,
          extraOptions: {

            responsive: true,
            scales: {
              x: {
                stacked: true,
                grid: {
                  color: config.colors.transparent,
                  zeroLineColor: config.colors.transparent
                },
              },
              y: {
                stacked: true,
                grid: {
                  color: config.colors.transparent,
                  zeroLineColor: config.colors.transparent
                },
              }
            }
          }
        }
        this.chart_bar_win_loss = {
          id: 'win-loss-chart',
          chartData: chartDataWL,
          extraOptions: {

            responsive: true,
            scales: {
              x: {
                stacked: true,
                grid: {
                  color: config.colors.transparent,
                  zeroLineColor: config.colors.transparent
                },
              },
              y: {
                stacked: true,
                grid: {
                  color: config.colors.transparent,
                  zeroLineColor: config.colors.transparent
                },
              }
            }
          }
        };

        this.chart_bar_win_loss_amount = {
          id: 'win-loss-amount-chart',
          chartData: chartDataWLAmount,
          extraOptions: {

            responsive: true,
            scales: {
              x: {
                stacked: true,
                grid: {
                  color: config.colors.transparent,
                  zeroLineColor: config.colors.transparent
                },
              },
              y: {
                stacked: true,
                grid: {
                  color: config.colors.transparent,
                  zeroLineColor: config.colors.transparent
                },

              }
            }
          }
        }


        // this.lastTenSlicePNLLineChart.chartData = {
        //   datasets: [{
        //     ...bigChartDatasetOptions,
        //     data: lastTen['pnl']
        //   }],
        //   labels: lastTen['date']
        // };
        // this.chart_line_PNL_last_ten.chartData = this.createChartData(lastTen['pnl'], lastTen['date']);
        this.chart_line_last_5_grouped.chartData = this.createLineChart(this.closersGrouped, 'pnl', 'date', 'symbols', 'id_chart_line_last_5_grouped', 5);
        lastTenPNL = lastTen.sum('pnl');
        cumulativePnl = closers['pnl_cum'].slice(-1)[0];
        winCount = this.closers.filter(row => row.pnl > 0).length;
        lossCount = this.closers.filter(row => row.pnl < 0).length;
        winAmount = this.closers.filter(row => row.pnl > 0).sum('pnl');
        lossAmount = this.closers.filter(row => row.pnl < 0).sum('pnl');

        const _cum_win_loss_data = [];
        const win_lose_data = this.closersGrouped.data;
        for (let i = 0; i < win_lose_data.length; i++) {
          const ttl = win_lose_data[i].win_count + win_lose_data[i].loss_count;
          _cum_win_loss_data.push({'group': win_lose_data[i].group, 'ttl': ttl});
        }
        const cum_win_loss_data = new Jataframe(_cum_win_loss_data);
        const cum_wins = Jataframe.cumulative_sum(cum_win_loss_data['ttl']);

        this.chart_pie_win_loss.chartData = {
          datasets: [{
            data: [winCount, lossCount],
          }],
          labels: [
            'Wins Count', 'Loss Count'
          ]
        }
        this.chart_pie_win_loss_amount.chartData = {
          datasets: [{
            data: [winAmount, lossAmount],
          }],
          labels: [
            'Wins Amount', 'Loss Amount'
          ]
        };

        winDays = closersGrouped.filter(row => row.pnl > 0).length;
        lossDays = closersGrouped.filter(row => row.pnl < 0).length;
        this.chart_pie_win_loss_days.chartData = {
          datasets: [{
            data: [winDays, lossDays],
          }],

          // These labels appear in the legend and in the tooltips when hovering different arcs
          labels: [
            'Wins Amount', 'Loss Amount'
          ]
        };

        let chartDateCumulativeWL = {
          labels: cum_win_loss_data['group'],
          datasets: [
            {
              label: 'Cumulative Wins',
              fill: true,
              borderColor: config.colors.danger,
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              pointBackgroundColor: config.colors.danger,
              pointBorderColor: 'rgba(255,255,255,0)',
              pointHoverBackgroundColor: config.colors.danger,
              pointBorderWidth: 20,
              pointHoverRadius: 4,
              pointHoverBorderWidth: 15,
              pointRadius: 4,
              data: cum_wins
            }
          ]
        };
        this.chart_bar_stacked_cum_win_loss.chartData = chartDateCumulativeWL;
        const lastDayDiff = closers.slice(-1)['pnl_cum'][0] - closers.slice(-2)['pnl_cum'][0];
        lastDayDiffIcon = lastDayDiff > 0 ? 'fa fa-arrow-up' : 'fa fa-arrow-down';
        lastDayDiffText = lastDayDiff > 0 ? 'Up' : 'Down';
      }


      const pnlClass = totalPnl > 0 ? 'tim-icons icon-minimal-up' : 'tim-icons icon-minimal-down';
      const periodPnlClass = periodPnl > 0 ? 'tim-icons icon-minimal-up' : 'tim-icons icon-minimal-down';
      return {
        bestMonth,
        worstMonth,
        winDays,
        lossDays,
        pnlClass,
        averageDailyPNL,
        periodPnlClass,
        worstLoser,
        bestWinner,
        totalTrades: 0,
        numberOfWins,
        numberOfLosses,
        numberOfTrades,
        periodPnl,
        totalPnl,
        totalPnlPercent: 0,
        totalPnlPercentPerTrade: 0,
        averagePerTrade,
        averageLoss,
        averageWin,
        worstLoserPnl,
        bestWinnerPnl,
        lastDayDiff,
        lastTen,
        lastTenPNL,
        winCount,
        lossCount,
        winAmount,
        lossAmount,
        cumulativePnl,
        lastDayDiffIcon,
        lastDayDiffText,
        lastFivePNL,
        bestDaysHeld,
        worstDaysHeld,
        bestDayOfWeek,
        worstDayOfWeek
      }
    },

    enableRTL() {
      return this.$route.query.enableRTL;
    },
    isRTL() {
      return this.$rtl.isRTL;
    },
    lineChartDateButtons() {
      return [];
      // return [{ name: 'Week', index: 0},{name: 'Month',index: 1},{name: 'Year',index: 2}];
    }
  },
  methods: {
    gotoImports() {
      this.$router.push('imports');
    },
    reloadData() {
      if (this.should_use_sample_data) {

        const broker = 'ameritrade'
        this.is_sample_data = true;
        const df = generateTradingData(42);

        this.df = df;
        const import_meta = {
          filename: 'sample.csv',
          broker,
          date: new Date().toISOString().slice(0, 10),
          row_count: df.length,
          estimate_missing_values: 'false',
          id: randomString(10)
        };
        const endDate = new Date();
        let startDate = new Date();
        startDate.setMonth(this.$store.state.startDate.getMonth() - 12);


        // this.$store.commit('addImport', {meta: import_meta, data: import_data});
        // this.$store.commit('setDF', df);
        this.period_df = extractPeriodSlice(df, startDate, endDate);
        // this.$store.commit('setPeriodDF', this.period_df);
        this.$store.commit('setIsSampleData', true);
        // this.$store.commit('setLastUpdated', new Date());
        // this.$store.commit('setCurrentDatasetId', import_meta.id)
        // // this.$router.push('dashboard')
        this.message = 'You imported ' + df.length + ' rows to local storage with ' + this.$store.state.closers.length + ' closes.';
        this.message_class = 'alert alert-success';

      }
    },
    onClickChartWinLoss_bar: (evt, activeElements, chart) => {
      _onClickChartWinLoss(evt, activeElements, chart, true);
    },
    onClickChartWinLoss_pie: (evt, activeElements, chart) => {
      _onClickChartWinLoss(evt, activeElements, chart, true);
    },

    onClickChartWinLoss: (evt, activeElements, chart) => {
      _onClickChartWinLoss(evt, activeElements, chart, false);
    },
    onClickChartPNL: (evt, activeElements, chart) => {
      const points = chart.getElementsAtEventForMode(evt, 'nearest', {intersect: true}, true);

      if (points.length) {
        const id = chart.data.datasets[0].id;
        const offset = ensureDataOffsetIndex(id);


        const index = points[0].index;
        const row = closers.data[offset + index];
        const arrowClass = row.pnl > 0 ? 'fas fa-thin fa-arrow-up stj-green-text' : 'fas fa-thin fa-arrow-down stj-red-text';
        const arrow = `<i class="${arrowClass}" style="font-size: .8em;"></i>`
        const pnlClass = row.pnl > 0 ? 'stj-green-text' : 'stj-red-text';
        const pnl = `<span class=${pnlClass} style="font-size: 1.2em;">${toCurrency(row.pnl)}</span>`;


        let html = `<div style=""><table class="tiny-trade" style="">
          <tbody>
            <tr>
              <td width="250px" >Symbol</td>
              <td width="250px" style="font-size: 1.2em;"><b style="color: white;font-weight: bold;">${row.symbol}</b></td>
            </tr>
        <tr>
              <td width="250px">Qty</td>
              <td width="250px"><b  style="color: white;font-weight: bold;">${row.quantity}</b></td>
            </tr>
            <tr>
              <td width="250px">Entry Date</td>
              <td width="250px"><b  style="color: white;font-weight: bold;">${row.date}</b></td>
            </tr>
            <tr>
              <td width="250px">Entry Price</td>
              <td width="250px"><b  style="color: white;font-weight: bold;">${toCurrency(row.buy_price)}</b></td>
            </tr>
            <tr>
              <td width="250px">Exit Date</td>
              <td width="250px"><b  style="color: white;font-weight: bold;">${row.sell_date}</b></td>
            </tr>
            <tr>
              <td>Exit Price</td>
              <td>
        ${arrow}
        ${toCurrency(row.sell_price)}
        </td>
            </tr>
            <tr>
              <td>PNL</td>
              <td>
        ${pnl}
        </td>
            </tr>
          </tbody>
        </table>
        </div>
        `;
        if (row.buys_for_close && row.buys_for_close.length > 0) {
          html += `<br/><h1 style="color: black;">${row.symbol} Buys</h1>`;
          html += `<table class="tiny-trade" style="" cellspacing="0" cellpadding="0"><tbody>`;
          for (let i = 0; i < row.buys_for_close.length; i++) {
            const subrow = row.buys_for_close[i];
            html += `<tr> <td  width="250px">${subrow.date}</td> <td  width="250px">${toCurrency(subrow.price)}</td></tr>`;
          }
          html += '</tbody></table>'
        }

        // onPNLItemClick
        swal.fire({
          showClass: {
            popup: 'animate__animated animate__zoomIn  animate__faster'
          },
          hideClass: {
            popup: 'animate__animated animate__zoomOut'
          },
          title: `${row.symbol} - ${row.date}`,
          buttonsStyling: false,
          customClass: {
            confirmButton: 'btn btn-dark'
          },
          confirmButtonText: 'Close',
          width: '600px',
          html
        });
      }

    },
    createLineChart(df, data_col, labels_col, tooltip_col, id, maxDataPoints = -1) {
      let data = df[data_col];
      let labels = df[labels_col];
      if (maxDataPoints > 0) {
        // data = data.slice(0, maxDataPoints);
        // labels = labels.slice(0, maxDataPoints);
        // Get the last five elements of the data array
        data = data.slice(-maxDataPoints);
        labels = labels.slice(-maxDataPoints);
      }

      if (data.length < maxDataPoints) {
        const diff = maxDataPoints - data.length;
        for (let i = 0; i < diff; i++) {
          data.unshift(0);
          labels.unshift('n/a');
        }
      }


      let chartData = {
        datasets: [{
          // lineTension: .5,
          borderColor: config.colors.transparent,
          borderWidth: 1,
          borderDash: [],
          gridLines: {
            color: config.colors.transparent,
            zeroLineColor: config.colors.transparent
          },
          borderDashOffset: 0.0,
          pointBackgroundColor: data.map(row => row > 0 ? config.colors.green : config.colors.red),
          pointBorderColor: config.colors.transparent,
          pointHoverBackgroundColor: data.map(row => row > 0 ? config.colors.green : config.colors.red),
          pointBorderWidth: 5,
          pointHoverRadius: 15,
          pointHoverBorderWidth: 15,
          pointRadius: 2,
          legend: false,
          // tooltip: data.map(row => row > 0 ? 'Win' : 'Loss'),
          data,
          id,
          fill: {above: config.colors.green, below: config.colors.red, target: 'origin'},
        }],
        labels
      };

      window[id] = df;
      // window[id+'_data'] = data;
      // window[id+'_labels'] = labels;
      window[id + '_tooltip'] = tooltip_col;
      return { chartData, id };
    },
    setRangePreset: function (range) {
      // this.range_preset = range;

      if (range === -1) {
        const endDate = new Date();
        const startDate = new Date(endDate.getFullYear(), 0, 1);

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

    },
    toDisplayDate,
    toCurrency,


  },


  watch: {
    range: function (range) {
      this.$store.commit('setStartDate', range.start);
      this.$store.commit('setEndDate', range.end);


      this.period_df = extractPeriodSlice(this.df, range.start, range.end);
      this.$store.commit('setPeriodDF', this.period_df);
    }
  },


};
</script>
<style></style>
