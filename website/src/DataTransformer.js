import csv from "csvtojson";

// import * as dfd from "danfojs-node";
import Jataframe from './Jataframe';
import moment from "moment";
import chunker from 'chunk-date-range' ;
import {randomString} from "./util";

// var chunk = require('chunk-date-range');

export function isClosingTrade(row) {
    return ((row.side && row.side.toLowerCase) &&
        ((row.side.toLowerCase() === 'sell' && row.pnl != 0)) ||
        ((row.short_or_long && row.short_or_long.toLowerCase && row.side && row.side.toLowerCase) && (row.side.toLowerCase() === 'buy' && row.short_or_long.toLowerCase() === 'cover')))
}

export let Brokers = {
    ameritrade: 'ameritrade',
    fidelity: 'fidelity',
    etrade: 'etrade',
    robinhood: 'robinhood'

}

export class TradeResp {
    buy_price = 0.0;
    pnl = 0.0;
    buy_date = 0;
    sell_price = 0.0;
    type_ = 'stock|option';
    short_or_long = 'short|long|cover';
    buys_for_close = [];

    constructor(options) {
        // Just check for misspellings in the options
        for (let key of Object.keys(options)) {
            if (!this.hasOwnProperty(key)) {
                throw new Error(`Unknown option ${key}`);
            }
        }

        Object.assign(this, options);
    }
}

class PriceTableImpl {

    constructor() {
        this.priceTable = {};
    }

    /**
     *
     * @param symbol
     * @param qty
     * @param price
     * @param date
     * @param stock_or_option
     * @param short_or_long
     * @return {TradeResp}
     */
    sell(symbol, qty, price, date, stock_or_option, short_or_long, estimate_missing_values) {


        if (typeof symbol === 'undefined' ||
            typeof qty === 'undefined' ||
            typeof price === 'undefined' ||
            typeof date === 'undefined' ||
            typeof stock_or_option === 'undefined' ||
            typeof short_or_long === 'undefined' ||
            typeof estimate_missing_values === 'undefined'
        ) {
            //console.log(symbol, qty, price, date, stock_or_option, short_or_long, estimate_missing_values);
            throw new Error('All fields must be set in sell');

        }


        let total = 0;
        let ret = 0;
        let first_date = 0;
        let buy_price = 0;
        const buys_for_close = [];
        let _prev_buy = null;


        if (short_or_long == 'short') {
            if (symbol in this.priceTable && this.priceTable[symbol].length > 0) {


                if (this.priceTable[symbol].every(row => row.short_or_long == 'short')) {
                    return this.buy(symbol, qty, price, date, stock_or_option, short_or_long, estimate_missing_values);
                } else throw new Error('Cant sell short a stock you already are long on');
            }
            return this.buy(symbol, qty, price, date, stock_or_option, short_or_long, estimate_missing_values);
        } else {
            if (symbol in this.priceTable) {
                const prices = this.priceTable[symbol];
                if (prices.length < qty) {
                    // throw new Error(`Not enough ${symbol} to sell, prices.length(${prices.length}) < ${qty}, ${short_or_long}`);

                    // How do we handle this gracefully.  Do we take the average price and just extend it ?
                    // Lets try that I guess

                    // Calculate the mean of the prices
                    if (estimate_missing_values) {
                        const prices_copy = JSON.parse(JSON.stringify(prices));
                        const column = 'price';
                        const sum = prices_copy.reduce((acc, row) => acc + row[column], 0);
                        const mean = parseFloat(sum / prices_copy.length).toFixed(2);
                        const share_size = qty - prices_copy.length;
                        const estimate = mean * share_size;
                        for (let i = 0; i < prices_copy.length; i++) {
                            let price = prices_copy.pop();
                            if (_prev_buy) {
                                if (_prev_buy['date'] != price['date'] ||
                                    _prev_buy['price'] != price['price']) {

                                    buys_for_close.push(price);
                                }
                            } else {
                                buys_for_close.push(price);
                            }
                            _prev_buy = price;
                        }

                        total = sum + estimate;
                        buy_price = total / qty;
                        ret = (price - buy_price) * qty;
                        if (stock_or_option.toLowerCase() === 'option') {
                            ret *= 10;
                        }
                        buys_for_close.push({date: 'estimated', price: buy_price})
                    } else return -1;
                } else {
                    for (let i = 0; i < qty; i++) {
                        let price = prices.pop();
                        if (_prev_buy) {
                            if (_prev_buy['date'] != price['date'] ||
                                _prev_buy['price'] != price['price']) {
                                buys_for_close.push(price);
                            }
                        } else {
                            buys_for_close.push(price);
                        }

                        if (!price) {
                            throw new Error(`Not enough ${symbol} to sell ${qty} shares for ${type}`);
                        }
                        first_date = price['date'];

                        let p = safeParseFloat(price['price']);
                        //
                        total += p;
                        _prev_buy = price;

                    }
                    buy_price = total / qty;
                    ret = (price - buy_price) * qty;
                    if (stock_or_option.toLowerCase() === 'option') {
                        ret *= 10;
                    }
                }
                //
            } else {
                return new TradeResp({
                    buy_price: buy_price,
                    pnl: ret,
                    buy_date: first_date || 0,
                    sell_price: price,
                    type_: stock_or_option,
                    short_or_long,
                    buys_for_close
                });
            }
        }

        return new TradeResp({
            buy_price: buy_price,
            pnl: ret,
            buy_date: first_date || 0,
            sell_price: price,
            type_: stock_or_option,
            short_or_long,
            buys_for_close
        });
    }


    /**
     *
     * @param symbol
     * @param qty
     * @param price
     * @param date
     * @param stock_or_option
     * @param short_or_long
     * @return {TradeResp}
     */
    buy(symbol, qty, price, date, stock_or_option, short_or_long, estimate_missing_values) {
        //
        if (typeof symbol === 'undefined' ||
            typeof qty === 'undefined' ||
            typeof price === 'undefined' ||
            typeof date === 'undefined' ||
            typeof stock_or_option === 'undefined' ||
            typeof short_or_long === 'undefined' ||
            typeof estimate_missing_values === 'undefined'
        ) {

            //console.log(symbol, qty, price, date, stock_or_option, short_or_long, estimate_missing_values);
            throw new Error('All fields must be set in buy');
        }

        if (short_or_long == 'cover') {
            // Treat it as a sell
            // Invert the PNL
            let ret = this.sell(symbol, qty, price, date, stock_or_option, short_or_long, estimate_missing_values);
            if (ret == -1) {
                return ret;
            } else {
                ret.pnl = -ret.pnl;
                return ret;
            }

        }
        if (symbol in this.priceTable) {
            for (let i = 0; i < qty; i++) {
                this.priceTable[symbol].push({
                    price: safeParseFloat(price),
                    date: date,
                    type_: stock_or_option,
                    short_or_long
                });
            }
        } else {
            this.priceTable[symbol] = [];
            for (let i = 0; i < qty; i++) {
                this.priceTable[symbol].push({
                    price: safeParseFloat(price),
                    date: date,
                    type_: stock_or_option,
                    short_or_long
                });
            }
        }
        return new TradeResp({
            buy_price: price,
            pnl: 0,
            buy_date: date || 0,
            sell_price: 0,
            type_: stock_or_option,
            short_or_long,
            buys_for_close: []
        });

    }


}


export const TradeSpec = {
    description: 'description',
    quantity: 'quantity',
    symbol: 'symbol',
    price: 'price',
    amount: 'amount',
    date: 'date',
    side: 'side',
    id: 'id',
    commission: 'commission',
    sell_price: 'sell_price',
    buy_price: 'buy_price',
    buy_date: 'buy_date',
    // These are for shorts etc, just calculate these when we do the datapoints
    effective_buy_price: 'effective_buy_price',
    effective_sell_price: 'effective_sell_price',
    sell_date: 'sell_date',
    pnl: 'pnl',
    pnl_cum: 'pnl_cum',
    pnl_percent: 'pnl_percent',
    timestamp: 'timestamp',
    stock_or_option: 'stock_or_option',
    short_or_long: 'short_or_long',
    fees: 'fees',
    buys_for_close: 'buys_for_close'
}


export const KeyTable = {

    DESCRIPTION: 'DESCRIPTION',
    QUANTITY: 'QUANTITY',
    SYMBOL: 'SYMBOL',
    PRICE: 'PRICE',
    AMOUNT: 'AMOUNT',
    DATE: 'DATE',
    SIDE: 'SIDE',
    TRANSACTION_ID: 'TRANSACTION ID',
    COMMISSION: 'COMMISSION',
    REG_FEE: 'REG FEE',
    SHORT_TERM_RDM_FEE: 'SHORT-TERM RDM FEE',
    FUND_REDEMPTION_FEE: 'FUND REDEMPTION FEE',
    DEFERRED_SALES_CHARGE: 'DEFERRED SALES CHARGE',
    SELL_PRICE: 'SELL_PRICE',
    BUY_PRICE: 'BUY_PRICE',
    BUY_DATE: 'BUY_DATE',
    SELL_DATE: 'SELL_DATE',
    PNL: 'PNL',
    PNL_CUM: 'PNL_CUM',
    PNL_PERCENT: 'PNL_PERCENT',
    DATE_DATE: 'DATE_DATE',
    TIMESTAMP: 'TIMESTAMP',
    stock_or_option: 'stock_or_option',
    SHORT_OR_LONG: 'SHORT_OR_LONG',
    FEES: 'FEES',
    buys_for_close: 'buys_for_close'

}

export function safeParseInt(value) {
    if (value) {
        try {
            return parseInt(value);
        } catch (e) {
            return 0;
        }
    }
    return 0;
}

export function safeParseFloat(value) {
    if (value) {
        try {
            return parseFloat(value);
        } catch (e) {
            return 0;
        }
    }
    return 0;
}

function lowercaseKeys(obj) {
    return Object.keys(obj).reduce((accumulator, key) => {
        accumulator[key.toLowerCase()] = obj[key];
        return accumulator;
    }, {});
}

function lowercaseColumns(rows) {
    const new_rows = [];
    for (let i = 0; i < rows.length; i++) {
        new_rows.push(lowercaseKeys(rows[i]));
    }
    return new_rows;
}

export function extractPeriodSlice(df, start, end) {
    let period_df;
    if (df) {
        if (typeof start === 'string') {
            start = new Date(start);
        }
        if (typeof end === 'string') {
            end = new Date(end);
        }
        let prev = 0;
        period_df = df.ts_slice('timestamp', start, end);
        // Add pnl_period_cum cumulative column
        for (let i = 0; i < period_df.data.length; i++) {
            period_df.data[i]['pnl_period_cum'] = prev + period_df.data[i].pnl;
            prev = period_df.data[i].pnl_period_cum;
        }
        // Add days_held column
        for (let i = 0; i < period_df.data.length; i++) {
            let daysHeld = -1;
            if (period_df.data[i].sell_date) {

                const date1 = new Date(period_df.data[i].buy_date);
                const date2 = new Date(period_df.data[i].sell_date);
                const diffTime = Math.abs(date2 - date1);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                daysHeld = diffDays;
            }
            period_df.data[i]['days_held'] = daysHeld;
        }


    }

    return period_df;
}

export function resetColumnTypes(df) {
    // df['amount'] = df['amount'].asType('float32')
    // df['price'] = df['price'].asType('float32')
    // df['quantity'] = df['quantity'].asType('int32')
    // df['commission'] = df['commission'].asType('float32')
    // df['sell_price'] = df['sell_price'].asType('float32')
    // df['buy_price'] = df['buy_price'].asType('float32')
    //
    df['pnl'].$dtypes = ['float32']
    df['pnl'] = df['pnl'].asType('float32').values;
    // df['date_date'] = df['date_date'].asType('datetime')
    // df['timestamp'] = df['timestamp'].asType('datetime')
    df.resetIndex({inplace: true});
    return df;
}


function getOptionOrCall(description) {
    return description.includes('Call') || description.includes('Put') ? 'option' : 'stock';
}

function getShortOrLong(s, amount) {
    let ret = s;

    if (s.startsWith('Sold Short')) {
        ret = 'short';
    } else if (s.startsWith('Sold')) {
        ret = 'long';
        if (amount < 0) {
            ret = 'short';
        }
    }

    if (s.includes('Bought to Cover')) {
        ret = 'cover';
    } else if (s.startsWith('Bought')) {
        ret = 'long';

    }


    return ret;
}

function addDataPoints(csv_json, estimate_missing_values, strict_checking = true) {
    if (typeof csv_json === 'undefined' || typeof estimate_missing_values === 'undefined') {
        throw new Error('csv_json and estimateMissingValues must be set');
    }
    const new_rows = [];
    let last_buy = {};
    let last_length = 0;
    let last_row = {};

    const price_table_impl = new PriceTableImpl();

    for (let i = 0; i < csv_json.length; i++) {
        //
        let row = csv_json[i];
        let new_row = {
            ...row
        }
        /* VERY IMPORTANT

        FOR ALL ADDED VARIABLES, YOU MUST PROVIDE A DEFAULT VALUE, for both sell and buy rows
         */

        //
        //
        if (row[KeyTable.DESCRIPTION]) {
            let stock_or_option = getOptionOrCall(new_row[KeyTable.DESCRIPTION]);
            console.log(row[KeyTable.DESCRIPTION]);
            if (row && row[KeyTable.DESCRIPTION] && row[KeyTable.DESCRIPTION].startsWith('Bought')) {

                const short_or_long = getShortOrLong(row[KeyTable.DESCRIPTION]);

                if (safeParseFloat(row[KeyTable.AMOUNT]) > 0) {
                    //console.log('BOUGHT TO COVER??');
                }

                // for (let i = 0; i < new_row[KeyTable.QUANTITY]; i++) {
                const ret = price_table_impl.buy(
                    new_row[KeyTable.SYMBOL],
                    parseInt(new_row[KeyTable.QUANTITY]),
                    safeParseFloat(new_row[KeyTable.PRICE]),
                    new_row[KeyTable.DATE],
                    stock_or_option,
                    short_or_long,
                    estimate_missing_values);
                // }

                if (ret == -1) {
                    //console.log(`Ignoring buy which is should be a cover for ${row.symbol} because estimateMissingValues is ${estimate_missing_values}`)
                } else {

                    new_row[KeyTable.SIDE] = 'BUY';
                    new_row[KeyTable.DATE_DATE] = new Date(new_row[KeyTable.DATE]);
                    new_row[KeyTable.TIMESTAMP] = new_row[KeyTable.DATE_DATE].getTime();
                    new_row[KeyTable.PNL] = ret.pnl;
                    new_row[KeyTable.PNL_PERCENT] = 0;
                    new_row[KeyTable.stock_or_option] = stock_or_option
                    new_row[KeyTable.BUY_DATE] = new_row[KeyTable.DATE];
                    new_row[KeyTable.SELL_DATE] = 0;
                    new_row[KeyTable.BUY_PRICE] = safeParseFloat(new_row[KeyTable.PRICE]);
                    new_row[KeyTable.SELL_PRICE] = ret.sell_price;
                    new_row[KeyTable.FEES] = 0;
                    new_row[KeyTable.SHORT_OR_LONG] = short_or_long;
                    new_row[KeyTable.buys_for_close] = [];

                    if (short_or_long === 'cover') {
                        new_row[TradeSpec.effective_sell_price] = safeParseFloat(ret.buy_price);
                        new_row[TradeSpec.effective_buy_price] = safeParseFloat(ret.sell_price);
                    } else {
                        new_row[TradeSpec.effective_sell_price] = safeParseFloat(ret.sell_price);
                        new_row[TradeSpec.effective_buy_price] = safeParseFloat(ret.buy_price);
                    }

                    last_length = Object.keys(new_row).length;
                    last_row = new_row;
                    //
                    //

                    new_rows.push(new_row);
                }

            } else if (row && row[KeyTable.DESCRIPTION] && row[KeyTable.DESCRIPTION].startsWith('Sold')) {
                // Calculate the difference in sell price and buy price
                //
                let short_or_long = getShortOrLong(row[KeyTable.DESCRIPTION], safeParseFloat(row[KeyTable.AMOUNT]));
                // if (safeParseFloat(row[KeyTable.AMOUNT]) < 0) {
                //     short_or_long = 'short';
                // }
                const pnl_object = price_table_impl.sell(
                    new_row[KeyTable.SYMBOL],
                    parseInt(new_row[KeyTable.QUANTITY]),
                    safeParseFloat(new_row[KeyTable.PRICE]),
                    new_row[KeyTable.DATE],
                    stock_or_option,
                    short_or_long,
                    estimate_missing_values);

                // We just ignore it if its -1 ( for ignore missing values )
                if (pnl_object == -1) {
                    //console.log(`Ignoring a sell for ${row[KeyTable.SYMBOL]} because estimateMissingValues is ${estimate_missing_values}`);
                } else {
                    const actual_pnl = pnl_object.pnl || 0;
                    //
                    new_row[KeyTable.SIDE] = 'SELL';
                    new_row[KeyTable.DATE_DATE] = new Date(new_row[KeyTable.DATE]);
                    new_row[KeyTable.TIMESTAMP] = new_row[KeyTable.DATE_DATE].getTime();
                    new_row[KeyTable.PNL] = actual_pnl;
                    new_row[KeyTable.PNL_PERCENT] = actual_pnl / (safeParseFloat(new_row[KeyTable.PRICE]) * safeParseFloat(new_row[KeyTable.QUANTITY]));
                    new_row[KeyTable.stock_or_option] = pnl_object.type_;
                    new_row[KeyTable.BUY_DATE] = pnl_object.buy_date;
                    new_row[KeyTable.SELL_DATE] = new_row[KeyTable.DATE];
                    new_row[KeyTable.BUY_PRICE] = pnl_object.buy_price;
                    new_row[KeyTable.SELL_PRICE] = pnl_object.sell_price;
                    new_row[KeyTable.FEES] = safeParseFloat(new_row[KeyTable.COMMISSION]) + new_row[KeyTable.REG_FEE] + new_row[KeyTable.SHORT_TERM_RDM_FEE] + new_row[KeyTable.FUND_REDEMPTION_FEE] + new_row[KeyTable.DEFERRED_SALES_CHARGE];
                    new_row[KeyTable.SHORT_OR_LONG] = short_or_long;
                    new_row[KeyTable.buys_for_close] = pnl_object.buys_for_close;
                    //

                    new_row[TradeSpec.effective_sell_price] = new_row[KeyTable.BUY_PRICE]
                    new_row[TradeSpec.effective_buy_price] = new_row[KeyTable.SELL_PRICE]


                    const new_length = Object.keys(new_row).length;
                    if (strict_checking
                        && (last_length > 0 && last_length != new_length)) {
                        //console.log('ERRROR');
                        //console.log(last_row);
                        throw new Error('Fatal error, length mismatch for buy and sell rows');

                    }
                    //
                    //
                    new_rows.push(new_row);
                }
            }

        } else {

        }
    }
    return new_rows;
}

function standardizeAmeritrade(rows) {
    let runningPnl = 0;

    for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        //
        // if (isClosingTrade(row)) {
        //
        // }

        runningPnl += safeParseFloat(row[KeyTable.PNL]);
        row[TradeSpec.id] = row[KeyTable.TRANSACTION_ID];
        row[KeyTable.PNL] = safeParseFloat(row[KeyTable.PNL]);
        row[KeyTable.PNL_CUM] = runningPnl;

        row[KeyTable.PNL_PERCENT] = safeParseFloat(row[KeyTable.PNL_PERCENT]);
        row[KeyTable.QUANTITY] = safeParseInt(row[KeyTable.QUANTITY]);
        row[KeyTable.AMOUNT] = safeParseInt(row[KeyTable.AMOUNT]);
        row[KeyTable.PRICE] = safeParseFloat(row[KeyTable.PRICE]);
        row[KeyTable.FEES] = safeParseFloat(row[KeyTable.FEES]);
        row[KeyTable.BUY_PRICE] = safeParseFloat(row[KeyTable.BUY_PRICE]);
        row[KeyTable.SELL_PRICE] = safeParseFloat(row[KeyTable.SELL_PRICE]);


        if (!row.hasOwnProperty(TradeSpec.effective_buy_price)) {
            row[TradeSpec.effective_buy_price] = row[KeyTable.BUY_PRICE];
        }
        if (!row.hasOwnProperty(TradeSpec.effective_sell_price)) {
            row[TradeSpec.effective_sell_price] = row[KeyTable.SELL_PRICE];
        }
        if (!row.hasOwnProperty(TradeSpec.buys_for_close)) {
            row[TradeSpec.buys_for_close] = row[KeyTable.buys_for_close];
            if (!row[TradeSpec.buys_for_close]) {
                row[TradeSpec.buys_for_close] = [];
            }
        }
        delete row[KeyTable.DEFERRED_SALES_CHARGE];
        delete row[KeyTable.FUND_REDEMPTION_FEE];
        delete row[KeyTable.REG_FEE];
        delete row[KeyTable.SHORT_TERM_RDM_FEE];
        delete row[KeyTable.TRANSACTION_ID];
        delete row[KeyTable.DATE_DATE];

    }

    return rows;
}

function standardizeRobinhood(rows) {
    return rows;
}

function standardizeEtrade(rows) {
    return rows;
}

/**
 *
 * @param rows
 * @param broker
 * @return TradeSpec[]
 */
export function standardizeBrokers(rows, broker) {
    if (broker === Brokers.ameritrade) {
        return standardizeAmeritrade(rows);
    } else if (broker === Brokers.robinhood) {
        return standardizeRobinhood(rows);

    }
    else if (broker === Brokers.fidelity) {
        return standardizeAmeritrade(rows);
    }
    else if (broker === Brokers.etrade) {
        return standardizeEtrade(rows);
    } else {
        throw new Error('Unknown broker', broker);
    }

}

function transformEtradeCsv(json) {

    let new_rows = [];
    for (let i = 0; i < json.length; i++) {
        const row =     json[i];
        const new_row = {};
        new_row[KeyTable.DATE] = row['TransactionDate'];
        new_row[KeyTable.SYMBOL] = row['Symbol'];
        new_row[KeyTable.DESCRIPTION] = row['TransactionType'] + ' ' + row['Description'];
        new_row[KeyTable.QUANTITY] = Math.abs(safeParseInt(row['Quantity']));
        new_row[KeyTable.PRICE] = safeParseFloat(row['Price']);
        new_row[KeyTable.AMOUNT] = safeParseFloat(row['Commission']);
        new_row[KeyTable.FEES] = safeParseFloat(row['Fees']);
        // new_row[KeyTable.PNL] = safeParseFloat(row['Net Amount']);
        // new_row[KeyTable.PNL_PERCENT] = safeParseFloat(row['% Change']);
        // new_row[KeyTable.PNL_CUM] = safeParseFloat(row['Cumulative P/L']);
        // new_row[KeyTable.BUY_PRICE] = safeParseFloat(row['Buy Price']);
        // new_row[KeyTable.SELL_PRICE] = safeParseFloat(row['Sell Price']);
        new_row[KeyTable.TRANSACTION_ID] = randomString(10);

        new_rows.push(new_row);
    }
    return new_rows.reverse();
}

function transformFidelityCsv(json) {

    let new_rows = [];
    for (let i = 0; i < json.length; i++) {
        const row =    json[i];
        const new_row = {};
        new_row[KeyTable.DATE] = row['Settlement Date'];
        new_row[KeyTable.SYMBOL] = row['Symbol'];
        new_row[KeyTable.DESCRIPTION] = row['Action'];
        // Replace the the string 'YOU ' from the beggining of the description
        new_row[KeyTable.DESCRIPTION] = new_row[KeyTable.DESCRIPTION].replace('YOU ', '');
        // Replace the word 'SOLD' with 'Sold' and 'BOUGHT' with 'Bought'
        new_row[KeyTable.DESCRIPTION] = new_row[KeyTable.DESCRIPTION].replace('SOLD', 'Sold');
        new_row[KeyTable.DESCRIPTION] = new_row[KeyTable.DESCRIPTION].replace('BOUGHT', 'Bought');

        new_row[KeyTable.QUANTITY] = Math.abs(safeParseInt(row['Quantity']));
        new_row[KeyTable.PRICE] = safeParseFloat(row['Price']);
        new_row[KeyTable.AMOUNT] = safeParseFloat(row['Amount']);
        new_row[KeyTable.FEES] = safeParseFloat(row['Fees']);

        new_rows.push(new_row);
    }
    return new_rows.reverse();

}

function correctCSVString(csv_string, broker) {
    if (broker === Brokers.etrade) {
        // Remove the first two lines
        let lines = csv_string.split('\n');
        lines.splice(0, 2);
        return lines.join('\n');
    }
    else if ( broker === Brokers.fidelity)
    {
        // Remove the first four lines
        let lines = csv_string.split('\n');
        lines.splice(0, 5);
        // Remove all occurrences of the string '($)' from the first line
        lines[0] = lines[0].replace(/\(\$?\)/g, '');

        // Join the first and second line into one line and remove the second line

        console.log('first', lines[0]);
        console.log('second', lines[1]);
        let ret =  lines.join('\n');
        // Now remove everything after two repeated new lines
        let index = ret.indexOf('\n\n');
        if (index > 0) {
            ret = ret.substring(0, index);
        }

        console.log('ret', ret);
        return ret;
    }
    else {
        return csv_string;
    }
}

export async function csvToDF(csv_string, broker = 'ameritrade', estimateMissingValues = false, strict_checking = true) {
    console.log('csvToDF', csv_string, broker, estimateMissingValues, strict_checking)
    let json = await csv().fromString(correctCSVString(csv_string, broker));
    console.log('json', json)
    let new_rows = [];
    if (broker === Brokers.etrade) {
        console.log('Now transforming etrade csv to standard format',json);
        json = transformEtradeCsv(json);
        console.log('Transformed etrade csv to standard format',json);
    }
    else if ( broker === Brokers.fidelity)
    {
        console.log('Now transforming fidelity csv to standard format',json);
        json = transformFidelityCsv(json);
        console.log('Transformed fidelity csv to standard format',json);
    }
    else if (broker === Brokers.ameritrade) {
        console.log('Skipping transform because its in base format');

    } else {
        throw new Error('Unknown broker', broker);
    }
    new_rows = addDataPoints(json, estimateMissingValues, strict_checking);
    console.log('Added data points  ', new_rows);
    const df = new Jataframe(lowercaseColumns(standardizeBrokers(new_rows, broker)));
    return df;
}

// export function sliceByDateRange(df, startDate, endDate) {
//     window.startDate = startDate;
//     window.endDate = endDate;
//
//     if (startDate.getYear() === endDate.getYear() &&
//         startDate.getMonth() === endDate.getMonth() &&
//         startDate.getDate() === endDate.getDate()) {
//
//         endDate = new Date(startDate.getYear(), startDate.getMonth(), startDate.getDate() + 2);
//     }
//     // This is fragile, have to make sure nothing breaks it
//     let ret = df.query(
//         df['timestamp'].gt((startDate.getTime())).and(
//             df['timestamp'].lt((endDate.getTime()))
//         )
//     )
//     try {
//         ret.resetIndex({inplace: true});
//     } catch (e) {
//
//         console.trace();
//         ret = new dfd.DataFrame();
//     }
//
//     return ret
//
// }

export function calculateDashboardStats(df) {
    const max = df.max();
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
});


export function toDisplayDate(val) {
    return moment(val).format('YYYY-MM-DD');
}

export function toCurrency(value) {
    return typeof value === 'number' ? currencyFormatter.format(value) : value;
}

export function stripYear(date) {
    if (typeof date === 'string') {
        return date.replace(/(\/|-)\d{4}/, '');
    } else {
        return date;
    }
}

const percentFormatter = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2


})

export function toPercent(value) {
    return percentFormatter.format(value);
}


function randomStockSymbol() {
    const stocks = ["AAPL", "TSLA", "MSFT", "AMD", "MMM", "ABBV", "ORCL", "SHOP", "SH", "TQQQ", "QQQ", "SQQQ", "GE", "IBM"];
    return stocks[Math.floor(Math.random() * stocks.length)];

}

function randomQuantity() {
    return Math.floor(Math.random() * 100) + 50;
}

function randomPrice() {
    return Math.floor(Math.random() * 1000);
}

function generateBuyRow(date) {
    // Pick from a array of stock symbols

    if (typeof date === 'string') {
        date = new Date(date);
    }

    const SYMBOL = randomStockSymbol();
    const QUANTITY = randomQuantity();
    const PRICE = randomPrice();
    const COMMISSION = 0;
    const AMOUNT = -(QUANTITY * PRICE);
    const DESCRIPTION = `Bought ${QUANTITY} ${SYMBOL} @ ${PRICE}`;
    const TIMESTAMP = date.getTime();
    const SIDE = 'BUY';
    const STOCK_OR_OPTION = 'stock';
    const BUY_DATE = date.toISOString().split('T')[0];
    const SELL_DATE = 0;
    const BUY_PRICE = PRICE;
    const SELL_PRICE = PRICE;
    const PNL = 0;
    const PNL_PERCENT = 0;
    const effective_buy_price = PRICE;
    const effective_sell_price = 0
    const buys_for_close = [];

    return {
        SYMBOL,
        QUANTITY,
        PRICE,
        COMMISSION,
        AMOUNT,
        DATE: date.toISOString().split('T')[0],
        DESCRIPTION,
        TIMESTAMP,
        SIDE,
        STOCK_OR_OPTION,
        BUY_DATE,
        SELL_DATE,
        BUY_PRICE,
        SELL_PRICE,
        PNL,
        PNL_PERCENT,
        effective_buy_price,
        effective_sell_price,
        buys_for_close
    }
}

function generateSellRow(start_date, symbol, qty, buy_price) {
    if (typeof start_date === 'string') {
        start_date = new Date(start_date);
    }
    const min = Math.ceil(-500);
    const max = Math.floor(500);
    const pnl = (Math.random() * (max - min + 1) + min) / 100
    //console.log('pnl', pnl);

    const price = buy_price + pnl;
    const row = {

        "DATE": start_date.toISOString().split('T')[0],
        "DESCRIPTION": `Sold ${qty} ${symbol} @ ${price}`,
        "QUANTITY": qty,
        "SYMBOL": symbol,
        "PRICE": price,
        "COMMISSION": "0.00",
        "AMOUNT": price * qty,
        "SIDE": "SELL",
        "TIMESTAMP": start_date.getTime(),
        "PNL": (price - buy_price) * qty,
        "PNL_PERCENT": (price - buy_price) / buy_price,
        "STOCK_OR_OPTION": "stock",
        "BUY_DATE": start_date.toISOString().split('T')[0],
        "SELL_DATE": start_date.toISOString().split('T')[0],
        "BUY_PRICE": buy_price,
        "SELL_PRICE": price,
        "FEES": 0.04,
        "SHORT_OR_LONG": "long",
        "buys_for_close": [
            {
                "price": qty,
                "date": new Date(),
                "type_": "stock",
                "short_or_long": "long"
            }
        ],
        "effective_sell_price": price,
        "effective_buy_price": buy_price,
        "id": randomString(),
    };
    return row;
}

export function generateTradingData(chunk_size = 32, upper_bound = 2, look_back_months = 4) {

    const end = new Date();
    const start = new Date()
    const broker = 'ameritrade';
    start.setMonth(start.getMonth() - look_back_months);
    //console.log('start=' + start, 'end=' + end);

    const chunks = chunker(start, end, chunk_size);

    const rows = [];
    const symbols = [];
    let chunk_end = null;
    for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];

        chunk_end = chunk.end;
        const rand_int = randomInt(0, upper_bound);
        if (rand_int === 2) {
            const row = generateBuyRow(chunk.start);
            symbols.push({price: row.PRICE, symbol: row.SYMBOL, qty: row.QUANTITY, id: randomString(5)});
            rows.push(row);

        } else if (rand_int === 1) {
            const buy_row = symbols.pop()
            if (buy_row && buy_row.symbol) {
                const row = generateSellRow(chunk.start, buy_row.symbol, buy_row.qty, buy_row.price);
                row.id = randomString(5);
                rows.push(row);
            }
        }
    }

    // Now just sell all the rest of them

    for (let i = 0; i < symbols.length; i++) {
        const buy_row = symbols[i];
        const row = generateSellRow(chunk_end, buy_row.symbol, buy_row.qty, buy_row.price);
        rows.push(row);
    }

    const new_rows = addDataPoints(rows, false, false);
    //console.log('new_rows', new_rows)
    const df = new Jataframe(lowercaseColumns(standardizeBrokers(new_rows, broker)));
    //console.log('df', df);
    return df;
}

export function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
