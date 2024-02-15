<template>

  <div class="container-fluid">
    <div class="row">
    <div class="col-12" style="width: 100%;">
      <div v-if="is_sample_data" class="alert alert-primary">
        You are currently using Sample Data.
      </div>

      <div v-if="!period_df && df" class="">No trades in the range, use the date fields below to select a date range.
      </div>


    </div>
    </div>
    <div class="row">
      {{ dashboard.symbol }}
      <div class="col-12">
        <fullCalendar ref="calendar" :options="calendarOptions"/>
      </div>
    </div>
  </div>
</template>
<script>
import swal from 'sweetalert2';
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {createEventId} from "./event-utils";
import moment from "moment/moment";
import {isClosingTrade, toCurrency} from "@/DataTransformer";
import {Button} from "element-ui";

const today = new Date();
const y = today.getFullYear();
const m = today.getMonth();
const d = today.getDate();
export default {
  components: {
    Button,
    FullCalendar
  },
  data() {

    return {
      range_preset: '90',
      is_sample_data: this.$store.state.is_sample_data,
      should_use_sample_data: true,
      df: this.$store.state.df,
      period_df: this.$store.state.period_df,
      closers: null,
      closersGrouped: null,


      range: {
        start: this.$store.state.startDate,
        end: this.$store.state.endDate
      },

      masks: {
        input: 'YYYY-MM-DD',
      },
      timeframe: moment().format('YYYY-MM-DD'),

      calendarOptions: {
        // dayCellDidMount: (args) => {
        //   console.log('td', args.el)
        //   window.test_el = args.el;
        // },

        dayCellContent: (args) => {
          const date = args.date.toString();
          console.log(date);
          const s = moment(date).format('MM/DD/YYYY')
          console.log('s='+ s)
          const closersGrouped = this.getClosersGrouped();
          const groups = closersGrouped.filter(row => row.group === s);
          let header = '';
          if ( groups.length > 0) {
            const group = groups.data[0];
            console.log('group=', group);
            header = toCurrency(group.pnl);
          }
          else {
            header = '0.00';
          }
          let content = `${header}`;
          if ( args.dayNumberText) {
            content = `${header}    [${args.dayNumberText}]`;
          }

          return content;
        },
        plugins: [
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin, // needed for dateClick
        ],
        headerToolbar: {
          center: "dayGridMonth,timeGridWeek,timeGridDay",
          right: "prev,next,today",
        },
        initialView: "dayGridMonth",
        // initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
        editable: true,
        selectable: true,
        // select: this.handleDateSelect,
        eventClick: this.handleEventClick,
        eventsSet: this.handleEvents,
      },
      currentEvents: [],

    };
  },
  computed: {
    dashboard() {

      const periodDF = this.df;

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
        const lastTen = closers.slice(-10)

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
          'symbol_pnl': {
            'price': (jf) => {
              return jf.filter(row => row.pnl != 0).data.map(row => row.pnl);
            }
          },
          'symbol_qty': {
            'quantity': (jf) => {
              return jf.filter(row => row.quantity != 0).data.map(row => row.quantity);
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

        // const sum = Jataframe.cumulative_sum(this.closersGrouped['pnl']);
        // this.closersGrouped['pnl_cum'] = sum;


        this.closersGrouped.print();
        window.closersGrouped = this.closersGrouped;
        const new_events = [];
        this.closersGrouped.data.forEach(row => {
          console.log(row);
          const date  = row['group'];
          const date_date = new Date(date);
          let show_date = new Date(date);
          if (show_date.getHours() == 0) {
              if ( row['symbols'].length < 12 ) {
                  show_date.setHours(8);
                  show_date.setMinutes(30);
              }
          }
          for ( let i = 0;i < row['symbols'].length;i++)
          {
            const symbol = row['symbols'][i];
            const pnl = row['symbol_pnl'][i];
            const qty = row['symbol_qty'][i];
            const has_profit = pnl > 0;
            const sign = has_profit ? '+' : '-';
            const lbracket = has_profit ? '' : '(';
            const rbracket = has_profit ? '' : ')';
            const event = {
              title: `${qty} of ${symbol} ${lbracket}${toCurrency(pnl)}${rbracket}`,
              start: show_date ,
              className: has_profit ? 'event-green' : 'event-red'
            }
            // Now increment the show_date date object by 30 mminutes
            console.log('minutes=', date_date.getMinutes(), 'hours=', date_date.getHours(), 'date=', date_date, 'show_date=', show_date, 'event=', event);
            if ( date_date.getMinutes() == 0 && date_date.getHours() == 0) {
              show_date = new Date(show_date.getTime() + 60 * 60 * 1000)
            }

            new_events.push(event);
          }

        });

        this.calendarOptions.events = new_events;
        console.dir(this.closersGrouped);
      }



      return {
        'symbol': 'TSLA',
      }
    }
  },
  methods: {
      getClosersGrouped() {
          const closers = window.closers;

          if (closers) {
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
                  'symbol_pnl': {
                      'price': (jf) => {
                          return jf.filter(row => row.pnl != 0).data.map(row => row.pnl);
                      }
                  },
                  'symbol_qty': {
                      'quantity': (jf) => {
                          return jf.filter(row => row.quantity != 0).data.map(row => row.quantity);
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
              return this.closersGrouped;
          }
          else {
              alert('no period df');
          }
          return null;
          },
    handleWeekendsToggle() {
      this.calendarOptions.weekends = !this.calendarOptions.weekends; // update a property
    },
    handleDateSelect(selectInfo) {
      // on select we show the Sweet Alert modal with an input
      const swalWithBootstrapButtons = swal.mixin({
        customClass: {
          confirmButton: "btn btn-success btn-fill",
          cancelButton: "btn btn-danger btn-fill",
        },
        buttonsStyling: false,
      });
      swalWithBootstrapButtons
          .fire({
            title: "Create an Event",
            html: `<div class="md-field md-theme-default">
          <input type="text" id="md-input" class="md-input">
          </div>`,
            showCancelButton: true,
          })
          .then(() => {
            var title = document.getElementById("md-input").value;
            let calendarApi = selectInfo.view.calendar;
            calendarApi.unselect(); // clear date selection
            if (title) {
              calendarApi.addEvent({
                id: createEventId(),
                title,
                start: selectInfo.startStr,
                end: selectInfo.endStr,
                allDay: selectInfo.allDay,
              });
            }
          });
    },
    handleEventClick(args) {
      // console.log(args)
    },
    handleEvents(events) {
      this.currentEvents = events;
    },
  },
};
</script>
<style>
#fullCalendar {
  min-height: 400px;
}

.el-loading-spinner .path {
  stroke: #66615b !important;
}
</style>
