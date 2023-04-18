<template>

  <base-table :data="table" thead-classes="text-primary">
    <template slot="columns">
      <th width="10%">Ticker</th>
      <th width="10%"> Side</th>
      <th width="10%">Instrument</th>
      <th width="10%">Time</th>

      <th width="5%">Short/Long</th>
      <th width="10%">Qty</th>
      <th width="10%">Buy Price</th>
      <th width="10%">Sell Price</th>
      <th width="15%">Net PNL</th>
      <th width="15%"> % Change</th>
      <th width="5%">Fees</th>
    </template>

    <template slot-scope="{ row, index }">

      <td><span :class="row.pnl > 0 ? 'stj-green-text' : 'stj-red-text'" style="border-radius: 4px;"> {{
          row.symbol
        }}</span></td>
      <td>{{ row.side }}</td>
      <td>{{ row.stock_or_option }}</td>
      <td>{{ row.date }}</td>
      <td>{{ row.short_or_long }}</td>

      <td>{{ row.quantity || '' }}</td>

      <td>{{ toCurrency(row.buy_price.toFixed(3)) }}</td>
      <td>{{ toCurrency(row.sell_price) }}</td>

      <td><span :class="row.pnl > 0 ? 'stj-green-text' : 'stj-red-text'"
                style="border-radius: 4px;"> {{ toCurrency(row.pnl) }}</span></td>
      <td><span
          :class="row.pnl > 0 ? 'stj-green-text' : 'stj-red-text'">{{
          toPercent(((row.sell_price - row.buy_price) / row.buy_price))
        }}</span>
      </td>
      <td>{{ row.fees }}</td>

    </template>
  </base-table>

</template>
<script>
import {BaseTable, BaseProgress} from '@/components';
import {toCurrency, toPercent} from "@/DataTransformer";
import {Option, Select, Table, TableColumn} from 'element-ui';
export default {
  components: {
    BaseTable,
    BaseProgress,
    [Select.name]: Select,
  },
//   [
//       {
//         ticker: 'AAPL',
//         qty: 100,
//         price: 102.02,
//         netChange: +515.02,
//         percentChange: 12.4,
//         time: '01-12-22 9:30 AM',
//         className: 'net-up',
//         textClass: 'stj-green-text'
//       },
// {
//   ticker: 'TSLA',
//       qty: 150,
//     price: 102.02,
//     netChange: -615.02,
//     percentChange: -8.4,
//     time: '01-12-22 10:30 AM',
//     className: 'net-down',
//     textClass: 'stj-red-text'
// }
// ,
// {
//   ticker: 'NFLX',
//       qty: 450,
//     price: 13.02,
//     netChange: 15.02,
//     percentChange: 1.4,
//     time: '01-12-22 12:30 PM',
//     className: 'net-up',
//     textClass: 'stj-green-text'
// }
// ,
// {
//   ticker: 'MU',
//       qty: 350,
//     price: 112.02,
//     netChange: '4,615.02',
//     percentChange: 38.4,
//     time: '01-12-22 13:30 PM',
//     className: 'net-up',
//     textClass: 'stj-green-text'
// }
// ,
// {
//   ticker: 'INTC',
//       qty: 150,
//     price: 3202.02,
//     netChange: '-3,215.02',
//     percentChange: -13.4,
//     time: '01-12-22 14:30 PM',
//     className: 'net-down',
//     textClass: 'stj-red-text'
// }
// ]
  data() {
    return {
      pagination: {
        perPage: 25,
        currentPage: 1,
        perPageOptions: [25, 50, 100],
        total: 0
      },

    };
  },
  methods: {
    toCurrency: toCurrency,
    toPercent: toPercent

  },
  computed: {
    table() {
      let df = this.$store.state.period_df;

      if (df) {
        const ret = df.filter(row => row.side === 'SELL' &&
            (row.short_or_long === 'long' || 'short_or_long' === 'cover'));
        // console.log('here', ret);
        return ret.head(20)

      }

      // if (df && df['side']) {
      //   df = df.query(
      //       df['side'].eq('SELL').and(
      //           df['short_or_long'].eq('long')).or(
      //               df['short_or_long'].eq('cover')));
      //   if (df)
      //     return df.head(50).toJSON();
      //   else return [];
      // } else return [];
    }
  },


};
</script>
<style></style>
