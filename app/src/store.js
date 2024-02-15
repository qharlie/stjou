import Jataframe from "@/Jataframe";
import {isClosingTrade} from "@/DataTransformer";
import Vuex from 'vuex'
import Vue from "vue";
import {version} from '../package.json';
import log from './logger';
import idb from './db/idb';

Vue.use(Vuex)

function getDefaultState() {
    return {
        startDate: new Date(),
        endDate: new Date(),
        lastUpdated: null,
        csvData: '{}',
        df: null,
        period_df: null,
        filterSymbol: null,
        closers: null,
        version: null,
        themeNumber: 1,
        is_sample_data: false,
        is_first_time: true,
        currentDatasetId: '',
        imports: [],
        import_data: [],
    };
}

const store = new Vuex.Store({
    state: getDefaultState(),
    actions: {

        async resetApplication(context) {

            context.commit('resetState');
            await idb.clearAll();
            localStorage.clear();
            log.info('Reset application');
            // Refresh the page
            window.location.reload();
        },
        async getImports(context) {

            context.state.imports = [];
            const data = await idb.getImport();
            data.forEach((item) => {
                context.state.imports.push(item.meta);
            });

        }, async getImportData(context) {

            context.state.import_data = [];
            const data = await idb.getImport();
            data.forEach((item) => {
                context.state.import_data.push(item.data);
            });

        },

        async addImport(context, importData) {
            const res = await idb.saveImport(importData);
            log.info(`Saved import to ${importData.id}`);
            return res;
        },
        async removeImport(context, importId) {
            const res = await idb.deleteImport(importId);
            log.info(`Deleted import ${importId}`);
            return res;
        }

    },
    mutations: {
        resetState(state) {
            // Merge rather than replace so we don't lose observers
            // https://github.com/vuejs/vuex/issues/1118
            Object.assign(state, getDefaultState())
        },
        initialiseStore(state) {
            log.info('initialized store from local storage');
            if (localStorage.getItem('store')) {
                let store = JSON.parse(localStorage.getItem('store'));
                // Check the version stored against current. If different, don't
                // load the cached version
                if (store.version === version) {
                    this.replaceState(
                        Object.assign(state, store)
                    );

                    // Now replace the types of the dates
                    state.startDate = new Date(state.startDate);
                    state.endDate = new Date(state.endDate);
                    // state.filterSymbol = store.filterSymbol;

                    if (state.df) {
                        state.df = new Jataframe(state.df);
                    }
                    if (state.period_df) {
                        state.period_df = new Jataframe(state.period_df);
                        state.closers = state.period_df.filter(isClosingTrade);
                    }


                    window.df = state.df
                    window.period_df = state.period_df
                    window.closers = state.closers
                    console.log('Eventually, fix the theme loading from local storage here' );
                    // let docClasses = document.body.classList;
                    // setTheme(state.theme,docClasses);

                } else {
                    state.version = version;
                }
            }
        },
        setIsSampleData: function (state, is_sample_data) {
            state.is_sample_data = is_sample_data;
        },
        setIsFirstTime: function (state, is_first_time) {
            state.is_first_time = is_first_time;
        },
        setStartDate: function (state, startDate) {
            state.startDate = startDate;
        },
        setEndDate: function (state, endDate) {
            state.endDate = endDate;
        },
        setLastUpdated: function (state, lastUpdated) {
            state.lastUpdated = lastUpdated;
        },
        setCurrentDatasetId: function (state, id) {
            state.currentDatasetId = id;
        },
        setFilterSymbol: function (state, symbol) {
            state.filterSymbol = symbol;
        },
        setDF: function (state, df) {
            state.df = df;
            window.df = df;
            //log.log('setDF');
            // log.log(df);
        },
        setThemeNumber: function (state, themeNumber) {
            state.themeNumber = themeNumber;
        },
        setPeriodDF: function (state, period_df) {
            if (period_df) {
                state.period_df = period_df;
                state.closers = period_df.filter(isClosingTrade)
                window.period_df = period_df;
                window.closers = state.closers;

            }
        },
        setCSVData: function (state, csvData) {
            state.csvData = csvData;
        }
    },
})


store.subscribe((mutation, state) => {
    try {
        const stateCopy = Object.assign({}, state);
        stateCopy.imports = [];
        stateCopy.import_data = [];

        localStorage.setItem('store', JSON.stringify(stateCopy));
    } catch (e) {
        console.log(e.toString());
        console.log(e);
        console.log('Uh oh!  You have exceeded the maximum size of local storage.  Please delete some imports and try again.  This should have been handled earlier, but I something went wrong');
    }
});


export default store;
