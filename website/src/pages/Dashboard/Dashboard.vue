<template>
  <div class="row" >
    <div class="col-4">

    </div>

    <div class="col-12" style="width: 100%;">
      <div v-if="is_first_time" class="alert alert-gray" style="color: black;">
StJou runs entirely in <span style="text-decoration: underline;color: black;">in your browser, <b>on your machine.</b></span>  Your data never leaves your computer and is never collected.  <a href="https://github.com/charlie-sanders/stjou" target="_blank" style="color: whitesmoke;text-decoration: underline;">Click here</a> for more information.

         <button @click="setFalseToFirstTime" style="color: black;cursor: pointer;">Click to hide Forever.</button>&nbsp;

<!--        <a href="#" @click="setFalseToFirstTime" style="color: antiquewhite;font-weight: bold;font-size: 1.2em;text-decoration: underline;">Click here to hide this forever.</a>-->
      </div>



    </div>
    <div class="col-12" style="width: 100%;">
      <div v-if="is_sample_data" class="alert alert-primary">
        You are currently using Sample Data. Use the Import link (last menu item) on the navbar to the left to add your
        own trades.
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
                       :value="inputValue.start" @input="$emit('input', $event.target.value)" v-on="inputEvents.start"/>
                &nbsp; to &nbsp;

                <input class="rounded p-1" :class="isDragging ? 'text-gray-600' : 'text-gray-900'"
                       :value="inputValue.end" v-on="inputEvents.end"/> &nbsp;
                <div class="btn-group">
                  <button type="button" @click="setRangePreset(-1)" class="btn btn-grey btn-round btn-outline"
                          :class="{'active': range_preset===-1}">
                    YTD
                  </button>
                  <button @click="setRangePreset(5)" type="button" class="btn btn-grey btn-round btn-outline"
                          :class="{'active': range_preset===5}">
                    5d
                  </button>
                  <button @click="setRangePreset(15)" type="button" class="btn btn-grey btn-round btn-outline"
                          :class="{'active': range_preset===15}">
                    15d
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
    <div v-if="period_df && df" class="col-12 text" style="padding-bottom: 5px;">
      {{ period_df.length }} rows in the current period, {{ df.length }} in all data.
    </div>

    <div class="col-lg-3 col-md-6">
      <stats-card :title="toCurrency(dashboard.totalPnl)" sub-title="PNL" type="stj-gray"
                  icon="tim-icons tim-icons icon-coins">
        <div slot="footer"><i></i> {{ toCurrency(dashboard.averageDailyPNL) }} per day
        </div>
      </stats-card>
    </div>
    <div class="col-lg-3 col-md-6">
      <stats-card :title="toCurrency(dashboard.averagePerTrade)" sub-title="Average Per Trade" type="dollar"
                  icon="fas fa-dollar-sign">
        <div slot="footer">
          {{ dashboard.numberOfTrades }} total closed ( {{ dashboard.numberOfWins }} wins, {{ dashboard.numberOfLosses }} losses)
        </div>
      </stats-card>
    </div>

    <!--    <div class="col-lg-3 col-md-6">-->
    <!--      <stats-card :title="toCurrency(dashboard.periodPnl)" sub-title="All time PNL" type="stj-green"-->
    <!--                  icon="fas fa-chart-line">-->
    <!--        <div slot="footer"><i :class="dashboard.periodPnlClass"></i> Period PNL {{ toCurrency(dashboard.totalPnl) }}-->

    <!--        </div>-->
    <!--      </stats-card>-->
    <!--    </div>-->

    <div class="col-lg-3 col-md-6">
      <stats-card :title="dashboard.bestWinner" sub-title="Best Winner" type="stj-green" icon="tim-icons icon-trophy">
        <div slot="footer">
          <i class="tim-icons"></i>{{ toCurrency(dashboard.bestWinnerPnl) }}
        </div>
      </stats-card>
    </div>


    <div class="col-lg-3 col-md-6">
      <stats-card :title="dashboard.worstLoser" sub-title="Worst Loser" type="stj-red"
                  icon="tim-icons icon-trash-simple">
        <div slot="footer">
          <i class="tim-icons"></i>{{ toCurrency(dashboard.worstLoserPnl) }}
        </div>
      </stats-card>
    </div>

    <div class="col-12">
      <card type="chart">
        <template slot="header">
          <div class="row">
            <div class="col-sm-6" :class="isRTL ? 'text-right' : 'text-left'">
              <h5 class="card-category">Daily Gains</h5>
              <h2 class="card-title">Period PNL <span style="font-size: .5em;">per day</span></h2>
            </div>

            <!--DONT DELETE THIS-->
            <!--            <div class="col-sm-6 d-flex d-sm-block">-->
            <!--              <div class="btn-group btn-group-toggle" :class="isRTL ? 'float-left' : 'float-right'"-->
            <!--                   data-toggle="buttons">-->
            <!--                <label v-for="(option, index) in lineChartDateButtons" :key="option.name"-->
            <!--                       class="btn btn-sm btn-info btn-simple"-->
            <!--                       :class="{ active: chart_line_PNL_YTD_SLICE.activeIndex === index }" :id="index"> <input-->
            <!--                    type="radio" @click="initBigChart(index)" name="options" autocomplete="off"-->
            <!--                    :checked="chart_line_PNL_YTD_SLICE.activeIndex === index"/> <span-->
            <!--                    class="d-none d-sm-block">{{ option.name }}</span> <span class="d-block d-sm-none">-->
            <!--                    <i :class="option.icon"></i>-->
            <!--                  </span> </label>-->
            <!--              </div>-->
            <!--            </div>-->
          </div>
        </template>
        <div class="chart-area">
          <generic-line-chart :chart-data="chart_line_PNL_YTD_SLICE.chartData"
                              :chart-options="chart_line_PNL_YTD_SLICE.options" :on-click="onClickChartWinLoss"
                              id="pnl-slice-line-chart" overlay-id="overlay-pnl-slice-line-chart"
                              update-column="pnl_cum" label-column="date"/>

        </div>
      </card>
    </div>

    <div class="col-lg-3 col-md-6">
      <stats-card :title="dashboard.numberOfTrades.toString() " sub-title="# of Trades" type="teal"
                  icon="fas fa-hashtag">
        <div slot="footer">
          <i class="tim-icons icon-up"></i> {{ dashboard.numberOfWins }} Wins, {{ dashboard.numberOfLosses }} Losses
        </div>
      </stats-card>
    </div>

    <div class="col-lg-3 col-md-6">
      <stats-card :title="toCurrency(dashboard.averageWin)" sub-title="Average Win" type="stj-green"
                  icon="tim-icons icon-minimal-up">
        <div slot="footer">
          per winning trade
        </div>
      </stats-card>
    </div>

    <div class="col-lg-3 col-md-6">
      <stats-card :title="toCurrency(dashboard.averageLoss) " sub-title="Average Loss" type="stj-red"
                  icon="tim-icons icon-minimal-down">
        <div slot="footer">
          per losing trade
        </div>
      </stats-card>
    </div>

    <div class="col-lg-3 col-md-6">
      <stats-card :title="toCurrency(dashboard.averageDailyPNL)" sub-title="Average per Day" icon="fa fa-calendar">
        <div slot="footer">
          per day
        </div>
      </stats-card>
    </div>
    <!--    <div class="col-12">-->
    <!--      <card type="chart">-->
    <!--        <template slot="header">-->
    <!--          <div class="row">-->
    <!--            <div class="col-sm-6" :class="isRTL ? 'text-right' : 'text-left'">-->
    <!--              <h5 class="card-category">Daily Gains</h5>-->
    <!--              <h2 class="card-title">PNL time slice from {{ toDisplayDate(range.start) }} to {{-->
    <!--                  toDisplayDate(range.end)-->
    <!--                                     }}</h2>-->
    <!--            </div>-->


    <!--            <div class="col-sm-6 d-flex d-sm-block">-->
    <!--              <div class="btn-group btn-group-toggle" :class="isRTL ? 'float-left' : 'float-right'"-->
    <!--                   data-toggle="buttons">-->
    <!--                <label v-for="(option, index) in lineChartDateButtons" :key="option.name"-->
    <!--                       class="btn btn-sm btn-info btn-simple"-->
    <!--                       :class="{ active: chart_line_PNL_YTD_SLICE.activeIndex === index }" :id="index"> <input-->
    <!--                    type="radio" @click="initBigChart(index)" name="options" autocomplete="off"-->
    <!--                    :checked="chart_line_PNL_YTD_SLICE.activeIndex === index"/> <span-->
    <!--                    class="d-none d-sm-block">{{ option.name }}</span> <span class="d-block d-sm-none">-->
    <!--                    <i :class="option.icon"></i>-->
    <!--                  </span> </label>-->
    <!--              </div>-->
    <!--            </div>-->
    <!--          </div>-->
    <!--        </template>-->
    <!--        <div class="chart-area">-->
    <!--          <generic-line-chart :chart-data="chart_line_PNL_YTD_SLICE.chartData"-->
    <!--                              :chart-options="chart_line_PNL_YTD_SLICE.options" :on-click="onChartClickPNL"-->
    <!--                              id="pnl-slice-line-chart" overlay-id="overlay-pnl-slice-line-chart"-->
    <!--                              update-column="pnl_cum" label-column="date"/>-->

    <!--        </div>-->
    <!--      </card>-->
    <!--    </div>-->

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
                       :class="{ active: chart_line_periodPNL.activeIndex === index }" :id="index"> <input type="radio"
                                                                                                           @click="initBigChart(index)"
                                                                                                           name="options"
                                                                                                           autocomplete="off"
                                                                                                           :checked="chart_line_periodPNL.activeIndex === index"/>
                  <span class="d-none d-sm-block">{{ option.name }}</span> <span class="d-block d-sm-none">
                    <i :class="option.icon"></i>
                  </span> </label>
              </div>
            </div>
          </div>
        </template>
        <div class="chart-area" style="padding-top: 0px;margin-top: -30px;">
          <generic-line-chart :chart-data="chart_line_periodPNL.chartData" :chart-options="chart_line_periodPNL.options"
                              :on-click="onClickChartPNL" id="pnl-line-chart" overlay-id="overlay-pnl-line-chart"
                              update-column="pnl_cum" label-column="date"/>
        </div>
      </card>
    </div>

    <div class="col-lg-4" :class="{ 'text-right': isRTL }">
      <card type="chart">
        <template slot="header">
          <h5 class="card-category">Last 5 trade days</h5>
          <h3 class="card-title">
            <i style="color: #42B883;" class="tim-icons el-icon-arrow-up"></i>{{ toCurrency(dashboard.lastFivePNL) }}
          </h3>
        </template>
        <div class="chart-area">
          <weekly-line-chart :chart-data="chart_line_last_5_grouped.chartData"
                             :chart-options="chart_line_last_5_grouped.options" :on-click="onClickChartPNL"
                             id="pnl-last-ten-line-chart"/>

        </div>
      </card>
    </div>

    <div class="col-lg-4" :class="{ 'text-right': isRTL }">
      <card class="card-chart" no-footer-line>
        <template slot="header">
          <h5 class="card-category">Wins and loss $</h5>
          <h3 class="card-title">
            <i class="tim-icons el-icon-plus"></i>{{
              toCurrency(dashboard.winAmount)
                                                  }}/{{ toCurrency(dashboard.lossAmount) }} </h3>
        </template>
        <div class="chart-area">
          <generic-bar-chart :chart-data="chart_bar_win_loss_amount.chartData"
                             :extra-options="chart_bar_win_loss_amount.extraOptions" :on-click="onClickChartWinLoss_bar"
                             :id="chart_bar_win_loss_amount.id" :height="200"></generic-bar-chart>

        </div>
      </card>
    </div>

    <div class="col-lg-4" :class="{ 'text-right': isRTL }">
      <card class="card-chart" no-footer-line>
        <template slot="header">
          <h5 class="card-category">Wins and loss count</h5>
          <h3 class="card-title">
            <i class="tim-icons el-icon-plus"></i>{{ dashboard.winCount }}/{{ dashboard.lossCount }} </h3>
        </template>
        <div class="chart-area">
          <generic-bar-chart :chart-data="chart_bar_win_loss.chartData" :extra-options="chart_bar_win_loss.extraOptions"
                             :on-click="onClickChartWinLoss_bar" :id="chart_bar_win_loss.id"
                             overlay-id="overlay-chart_bar_win_loss">
            :height="200" >
          </generic-bar-chart>
        </div>
      </card>
    </div>

    <div class="col-12">
      <card class="card" :header-classes="{ 'text-right': isRTL }">
        <h5 slot="header" class="card-title"><a style="color: cornflowerblue;" href="#/table-list/regular">Trades</a>
        </h5>
        <div class="table-responsive">
          <trades-table></trades-table>
        </div>
      </card>
    </div>

    <div class="col-12">

      <div v-if="!period_df && !df" class="alert alert-primary">No dataset, use Import at the bottom of the navar on the
                                                                left to add trades.
      </div>
      <div v-if="!period_df && df" class="alert alert-primary">No trades in the range, use the date fields below to
                                                               select a date range.
      </div>
      <div v-if="period_df && df" class="alert alert-info">{{ period_df.length }} rows in the current period,
                                                           {{ df.length }} in all data.
      </div>
    </div>

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
import TaskList from './TaskList';
import UserTable from './UserTable';
import TradesTable from './TradesLiteTable';
import CountryMapCard from './CountryMapCard';
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
import GenericBarChart from "@/components/Charts/GenericBarChart";
import {randomString, ensureDataOffsetIndex, subtractDateStrings} from "@/util";
import WeeklyLineChart from "@/components/Charts/WeeklyLineChart.vue";


function _onClickChartWinLoss(evt, activeElements, chart, skipOffset = false) {
  let result = '';
  const id = chart.data.datasets[0].id;

  const points = chart.getElementsAtEventForMode(evt, 'nearest', {intersect: true}, true);
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
    TaskList,
    VCalendar,
    CountryMapCard,
    Imports,
    TradesTable,
    Button,
    MessageBox
  },

  data() {
    return {
      range_preset: '90',
      is_sample_data: this.$store.state.is_sample_data,
      is_first_time: this.$store.state.is_first_time,
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

      chart_line_periodPNL: {},
      chart_line_PNL_YTD_SLICE: {},
      chart_line_PNL_last_ten: {},
      chart_line_last_5_grouped: {},
      chart_bar_stacked_cum_win_loss: {
        extraOptions: chartConfigs.greenChartOptions,
      },

      chart_bar_win_loss: {
        id: 'winLossChart'
      },
      chart_bar_win_loss_amount: {
        id: 'winLossAmountChart'
      },
    };

  },
  computed: {
    dashboard() {

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
      let numberOfDays = 1;
      if (periodDF) {

        numberOfDays = subtractDateStrings(periodDF['date'][periodDF['date'].length - 1], periodDF['date'][0]);
            // periodDF['date'][periodDF['date'].length - 1] - periodDF['date'][0];
        averageDailyPNL = totalPnl / numberOfDays;
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
          lastDayDiffIcon = 0,
          lastDayDiffText = 0;

      if (periodDF) {
        const closers = periodDF.filter(row => isClosingTrade(row));
        window.closers = closers;
        this.closers = closers;
        const lastTen = closers.slice(-10)
        this.chart_line_periodPNL.chartData = this.createChartData(closers, 'pnl_period_cum', 'date', 'symbol', 'pnl-line-chart');
        // This is for generic line chart tooltips , ghetto I know but not sure how to do it otherwise
        // window['pnl-line-chart'] = closers;

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
              return jf.filter(row => row.pnl > 0).data.map(row => row.symbol)
            }
          },
          'win_pnl': {
            'price': (jf) => {
              return jf.filter(row => row.pnl > 0).data.map(row => row.pnl);
            }
          },
          'loss_symbols': {
            'symbol': (jf) => {
              return jf.filter(row => row.pnl < 0).data.map(row => row.symbol);
            }
          },
          'symbols': {
            'symbol': (jf) => {
              return jf.data.map(row => row.symbol)
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
        this.chart_line_PNL_YTD_SLICE.chartData = this.createChartData(closersGrouped, 'pnl_cum', 'date', 'symbols', 'pnl-slice-line-chart');

        // window['pnl-slice-line-chart'] = closersGrouped;

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
        this.chart_line_last_5_grouped.chartData = this.createChartData(this.closersGrouped, 'pnl', 'date', 'symbols', 'pnl-last-ten-line-chart', 5);
        lastTenPNL = lastTen.sum('pnl');
        cumulativePnl = closers['pnl_cum'].slice(-1)[0];
        winCount = closers.filter(row => row.pnl > 0).length;
        lossCount = closers.filter(row => row.pnl < 0).length;
        winAmount = closers.filter(row => row.pnl > 0).sum('pnl');
        lossAmount = closers.filter(row => row.pnl < 0).sum('pnl');

        const _cum_win_loss_data = [];
        const win_lose_data = this.closersGrouped.data;
        for (let i = 0; i < win_lose_data.length; i++) {
          const ttl = win_lose_data[i].win_count + win_lose_data[i].loss_count;
          _cum_win_loss_data.push({'group': win_lose_data[i].group, 'ttl': ttl});
        }
        const cum_win_loss_data = new Jataframe(_cum_win_loss_data);
        const cum_wins = Jataframe.cumulative_sum(cum_win_loss_data['ttl']);

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
        const lastDayDiff = closers.slice(-1)['pnl'][0] - closers.slice(-2)['pnl'][0];
        lastDayDiffIcon = lastDayDiff > 0 ? 'fa fa-arrow-up' : 'fa fa-arrow-down';
        lastDayDiffText = lastDayDiff > 0 ? 'Up' : 'Down';
      }


      const pnlClass = totalPnl > 0 ? 'tim-icons icon-minimal-up' : 'tim-icons icon-minimal-down';
      const periodPnlClass = periodPnl > 0 ? 'tim-icons icon-minimal-up' : 'tim-icons icon-minimal-down';
      return {
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
        lastFivePNL
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

    onRefreshRange(range) {
      this.range = range;
    },
    setFalseToFirstTime() {
      this.is_first_time = false;
      this.$store.commit('setIsFirstTime', false);
    },
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
    onClickChartWinLoss: (evt, activeElements, chart) => {
      _onClickChartWinLoss(evt, activeElements, chart, false);
    },
    onClickChartWinLoss_bar: (evt, activeElements, chart) => {
      _onClickChartWinLoss(evt, activeElements, chart, true);
    },
    onClickChartPNL: (evt, activeElements, chart) => {
      const points = chart.getElementsAtEventForMode(evt, 'nearest', {intersect: true}, true);
        const id = chart.data.datasets[0].id;
        console.log(`ID: ${id}`);
      if (points.length) {
        // ensureDataOffsetIndex();
        // alert('FIX THE ensureDataOffsetIndex ISSUE HERE, NEED TO GET THE ID FROM SOMEWHERE , CHART PROBABLY, ITS ALSO IN TABLE somewhere')
        const dataOffset = ensureDataOffsetIndex(id);
        const index = points[0].index;
        const row = closers.data[dataOffset + index];
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
    createChartData(df, data_col, labels_col, tooltip_col, id, maxDataPoints = -1) {
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
      return chartData;
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
  mounted() {
    this.i18n = this.$i18n;
    if (this.enableRTL) {
      this.i18n.locale = 'ar';
      this.$rtl.enableRTL();
    }
  },


  beforeDestroy() {
    if (this.$rtl.isRTL) {
      this.i18n.locale = 'en';
      this.$rtl.disableRTL();
    }
  }


};
</script>
<style src="animate.css/animate.min.css"></style>
