const Jataframe = require('./Jataframe');
const rows = [
    {
        DATE: '07/21/2022',

        DESCRIPTION: 'Bought 1 GOOG @ 108.12',
        QUANTITY: '1',
        SYMBOL: 'GOOG',
        PRICE: '2.00',
        COMMISSION: '0.00',
        AMOUNT: '-108.12',
        'REG FEE': '',
        'SHORT-TERM RDM FEE': '',
        'FUNDg REDEMPTION FEE': '',
        'DEFERRED SALES CHARGE': '',
        SIDE: 'BUY',
        DATE_DATE: '2022-07-21T05:00:00.000Z',
        TIMESTAMP: 1658379600000,
        PNL: 0,
        stock_or_option: 'stock',
        BUY_DATE: '07/21/2022',
        SELL_DATE: undefined,
        BUY_PRICE: 2,
        SELL_PRICE: 0,
        FEES: 0,
        SHORT_OR_LONG: 'long'
    },
    {
        DATE: '07/21/2022',

        DESCRIPTION: 'Bought 2 GOOG @ 108.11',
        QUANTITY: '2',
        SYMBOL: 'GOOG',
        PRICE: '4.0',
        COMMISSION: '0.00',
        AMOUNT: '-108.11',
        'REG FEE': '',
        'SHORT-TERM RDM FEE': '',
        'FUND REDEMPTION FEE': '',
        'DEFERRED SALES CHARGE': '',
        SIDE: 'BUY',
        DATE_DATE: '2022-07-22T05:00:00.000Z',
        TIMESTAMP: 1658466000000,
        PNL: 0,
        stock_or_option: 'stock',
        BUY_DATE: '07/22/2022',
        SELL_DATE: undefined,
        BUY_PRICE: 4,
        SELL_PRICE: 0,
        FEES: 0,
        SHORT_OR_LONG: 'long'
    },
    {
        DATE: '07/23/2022',

        DESCRIPTION: 'Bought 3 GOOG @ 108.11',
        QUANTITY: '3',
        SYMBOL: 'GOOG',
        PRICE: '6.0',
        COMMISSION: '0.00',
        AMOUNT: '-108.11',
        'REG FEE': '',
        'SHORT-TERM RDM FEE': '',
        'FUND REDEMPTION FEE': '',
        'DEFERRED SALES CHARGE': '',
        SIDE: 'BUY',
        DATE_DATE: '2022-07-23T05:00:00.000Z',
        TIMESTAMP: 1658552400000,
        PNL: 0,
        stock_or_option: 'stock',
        BUY_DATE: '07/23/2022',
        SELL_DATE: 0,
        BUY_PRICE: 6,
        SELL_PRICE: 0,
        FEES: 0,
        SHORT_OR_LONG: 'long'
    },
    {
        DATE: '07/23/2022',

        DESCRIPTION: 'Bought 4 GOOG @ 108.11',
        QUANTITY: '4',
        SYMBOL: 'GOOG',
        PRICE: '8.0',
        COMMISSION: '0.00',
        AMOUNT: '-108.11',
        'REG FEE': '',
        'SHORT-TERM RDM FEE': '',
        'FUND REDEMPTION FEE': '',
        'DEFERRED SALES CHARGE': '',
        SIDE: 'BUY',
        DATE_DATE: '2022-07-24T05:00:00.000Z',
        TIMESTAMP: 1658638800000,
        PNL: 0,
        stock_or_option: 'stock',
        BUY_DATE: '07/24/2022',
        SELL_DATE: 0,
        BUY_PRICE: 8,
        SELL_PRICE: 0,
        FEES: 0,
        SHORT_OR_LONG: 'long'
    },
    {
        DATE: '07/25/2022',

        DESCRIPTION: 'Bought 5 GOOG @ 108.11',
        QUANTITY: '5',
        SYMBOL: 'GOOG',
        PRICE: '10.0',
        COMMISSION: '0.00',
        AMOUNT: '-108.11',
        'REG FEE': '',
        'SHORT-TERM RDM FEE': '',
        'FUND REDEMPTION FEE': '',
        'DEFERRED SALES CHARGE': '',
        SIDE: 'BUY',
        DATE_DATE: '2022-07-25T05:00:00.000Z',
        TIMESTAMP: 1658725200000,
        PNL: 0,
        stock_or_option: 'stock',
        BUY_DATE: '07/25/2022',
        SELL_DATE: 0,
        BUY_PRICE: 10,
        SELL_PRICE: 0,
        FEES: 0,
        SHORT_OR_LONG: 'long'
    },
    {
        DATE: '07/26/2022',

        DESCRIPTION: 'Sold 10 GOOG @ 110.9',
        QUANTITY: '10',
        SYMBOL: 'GOOG',
        PRICE: '15.0',
        COMMISSION: '0.00',
        AMOUNT: '2772.44',
        'REG FEE': '0.06',
        'SHORT-TERM RDM FEE': '',
        'FUND REDEMPTION FEE': '',
        'DEFERRED SALES CHARGE': '',
        SIDE: 'SELL',
        DATE_DATE: '2022-07-26T05:00:00.000Z',
        TIMESTAMP: 1658811600000,
        PNL: 61.00,
        stock_or_option: 'stock',
        BUY_DATE: '07/23/2022',
        SELL_DATE: '07/26/2022',
        BUY_PRICE: 8.8,
        SELL_PRICE: 15,
        FEES: '00.06',
        SHORT_OR_LONG: 'long'
    },
    {
        DATE: '07/27/2022',

        DESCRIPTION: 'Bought 5 GOOG @ 108.11',
        QUANTITY: '5',
        SYMBOL: 'GOOG',
        PRICE: '10.0',
        COMMISSION: '0.00',
        AMOUNT: '-108.11',
        'REG FEE': '',
        'SHORT-TERM RDM FEE': '',
        'FUND REDEMPTION FEE': '',
        'DEFERRED SALES CHARGE': '',
        SIDE: 'BUY',
        DATE_DATE: '2022-07-27T05:00:00.000Z',
        TIMESTAMP: 1658898000000,
        PNL: 0,
        stock_or_option: 'stock',
        BUY_DATE: '07/27/2022',
        SELL_DATE: 0,
        BUY_PRICE: 10,
        SELL_PRICE: 0,
        FEES: 0,
        SHORT_OR_LONG: 'long'
    },
    {
        DATE: '07/28/2022',

        DESCRIPTION: 'Sold 10 AMZN @ 110.9',
        QUANTITY: '10',
        SYMBOL: 'AMZN',
        PRICE: '15.0',
        COMMISSION: '0.00',
        AMOUNT: '2772.44',
        'REG FEE': '0.06',
        'SHORT-TERM RDM FEE': '',
        'FUND REDEMPTION FEE': '',
        'DEFERRED SALES CHARGE': '',
        SIDE: 'SELL',
        DATE_DATE: '2022-07-28T05:00:00.000Z',
        TIMESTAMP: 1658984400000,
        PNL: -22,
        stock_or_option: 'stock',
        BUY_DATE: '07/21/2022',
        SELL_DATE: '07/28/2022',
        BUY_PRICE: 7.2,
        SELL_PRICE: 15,
        FEES: '00.06',
        SHORT_OR_LONG: 'long'
    }

]

const moreRows = [
    {
        date: '07/25/2022',

        description: 'Bought 25 GOOG @ 108.12',
        quantity: '25',
        symbol: 'GOOG',
        price: '108.00',
        commission: '0.00',
        amount: '-108.12',
        'reg fee': '',
        'short-term rdm fee': '',
        'fund redemption fee': '',
        'deferred sales charge': '',
        side: 'BUY',
        date_date: ' 2022-07-25T05:00:00.000Z',
        timestamp: 1658725200000,
        pnl: 0,
        stock_or_option: 'stock',
        buy_date: '07/25/2022',
        sell_date: 0,
        buy_price: 108,
        sell_price: 0,
        fees: 0,
        short_or_long: 'long'
    },
    {
        date: '07/25/2022',

        description: 'Bought 5 GOOG @ 108.11',
        quantity: '5',
        symbol: 'GOOG',
        price: '110.0',
        commission: '0.00',
        amount: '-108.11',
        'reg fee': '',
        'short-term rdm fee': '',
        'fund redemption fee': '',
        'deferred sales charge': '',
        side: 'BUY',
        date_date: ' 2022-07-25T05:00:00.000Z',
        timestamp: 1658725200000,
        pnl: -123.20,
        stock_or_option: 'stock',
        buy_date: '07/25/2022',
        sell_date: 0,
        buy_price: 110,
        sell_price: 0,
        fees: 0,
        short_or_long: 'long'
    },
    {
        date: '07/26/2022',

        description: 'Sold 30 GOOG @ 110.9',
        quantity: '30',
        symbol: 'GOOG',
        price: '112.0',
        commission: '0.00',
        amount: '2772.44',
        'reg fee': '0.06',
        'short-term rdm fee': '',
        'fund redemption fee': '',
        'deferred sales charge': '',
        side: 'SELL',
        date_date: ' 2022-07-26T05:00:00.000Z',
        timestamp: 1658811600000,
        pnl: 110.00000000000014,
        stock_or_option: 'stock',
        buy_date: '07/25/2022',
        sell_date: '07/26/2022',
        buy_price: 108.33333333333333,
        sell_price: 112,
        fees: '00.06',
        short_or_long: 'short'
    }
]
describe('Dataframe Tests', () => {

    it('Should create a dataframe with correct length', async () => {
        const df = new Jataframe([1, 2, 3]);

        expect(df.length).toBe(3);


        const df2 = new Jataframe([1, 2, 3, 'asdf', 'cvb']);

        expect(df2.length).toBe(5);

    });


    it('Should create a Jataframe with columns', async () => {
        const df = new Jataframe(rows);
        expect(df.length).toBe(8);
        const totalPnl = df.sum('PNL');
        expect(totalPnl).toBe(39);

        const dates = df['BUY_DATE'];
        expect(dates.length).toBe(8);

    });


    it('Should handle queries', async () => {
        const df = new Jataframe(rows);


        let dates = df.query('BUY_DATE', Jataframe.gt, '07/23/2022');
        expect(dates.length).toBe(3);


        dates = df.query('BUY_DATE', Jataframe.gte, '07/23/2022');
        expect(dates.length).toBe(5);

        dates = df.query('BUY_DATE', Jataframe.lt, '07/23/2022');
        expect(dates.length).toBe(3);

        dates = df.query('BUY_DATE', Jataframe.lte, '07/23/2022');
        expect(dates.length).toBe(5);


        let pnlGt = df.query('PNL', Jataframe.gt, 0);

        expect(pnlGt.length).toBe(1);


        let pnlLt = df.query('PNL', Jataframe.lt, 0);

        expect(pnlLt.length).toBe(1);

    });

    it('Should ts splice correctly', async () => {
        const df = new Jataframe(rows);
        const df2 = df.ts_slice('TIMESTAMP', 1658379700000, 1658811500000);
        expect(df2.length).toBe(4);


        const df3 = df.ts_slice('TIMESTAMP',
            new Date('2022-07-25').getTime(),
            new Date('2022-07-29').getTime(), true);
        expect(df3.length).toBe(4);

    });

    it('Should splice correctly', async () => {
        const df = new Jataframe(rows);
        const df2 = df.slice(2, 4);
        expect(df2.length).toBe(2);

    });

    it('Should support slicing with negative offset for start', async () => {
        const df = new Jataframe(rows);
        const df2 = df.slice(-2);
        expect(df2.length).toBe(2);
        expect(df2.data[0].PNL).toBe(0);
        expect(df2.data[1].PNL).toBe(-22);
    });

    it('Should calculate the mean', async () => {
        const df = new Jataframe(moreRows);
        const mean = df.mean('pnl');
        expect(mean).toBe(-4.399999999999953);
    });

    it('Should calculate the median', async () => {
            const df = new Jataframe(moreRows);
            const median = df.median('pnl');
            expect(median).toBe(0);
        }
    );


    it('Should calculate the std', async () => {
            const df = new Jataframe(moreRows);
            const median = df.std('pnl');
            expect(median).toBe(95.2543262359599);
        }
    );

    it('Should calculate the mode', async () => {
        const df = new Jataframe(moreRows);
        const mode = df.mode('pnl');
        expect(mode).toBe("110.00000000000014");

    });

    it('Should calculate the min', async () => {
        const df = new Jataframe(moreRows);
        const min = df.min('pnl');
        expect(min).toBe(-123.20);
    });

    it('Should calculate the max', async () => {
        const df = new Jataframe(moreRows);
        const max = df.max('pnl');
        expect(max).toBe(110.00000000000014);
    });


    it('Should have group by', async () => {

        const df = new Jataframe(moreRows);
        const groupBy = df.groupBy('short_or_long', {'pnl_sum': {'pnl': Jataframe.sum}});
        expect(Object.keys(groupBy).length).toBe(2);
        expect(groupBy.long.length).toBe(2);
        expect(groupBy.short.length).toBe(1);

        expect(groupBy.long.sum('pnl')).toBe(-123.2);
        expect(groupBy.short.sum('pnl')).toBe(110.00000000000014);


    });


    it('Should have a rolling sum', async () => {
        const data = [
            {group: 'A', name: 'Babe Lincoln', price: 2.12},
            {group: 'A', name: 'Franklin Brosevelt', price: 3.12},
            {group: 'B', name: 'Beninjamin Franklins', price: 154.12},
        ];

        const df = new Jataframe(data);
        const groups = df.aggregateBy('group', {
            'price_ttl': {'price': Jataframe.sum},
            'price_avg': {'price': Jataframe.mean},
        });

        expect(groups.length).toBe(2);
        expect(groups['price_ttl']).toEqual([5.24, 154.12]);
        expect(groups['price_avg']).toEqual([2.62, 154.12]);
        expect(groups.sum('price_ttl')).toBe(159.36);
    });

    it('Should handle whan a key doesnt exit with DF access', async () => {

        const df = new Jataframe(rows);
        const empty = df['DOESNT_EXIST'];
        expect(empty.length).toBe(0);
    });

    it('Should have fillna', async () => {

        const df = new Jataframe(rows);
        expect(df.count('SELL_DATE')).toBe(2);
        const filled = df.fillNa('SELL_DATE', 0);
        expect(df.count('SELL_DATE')).toBe(0);

    });

    it('Should have DF access', async () => {
        const df = new Jataframe(rows);
        const dates = df['DATE'];

        expect(dates.length).toBe(8);
        // expect(sorted['PNL')[7]).toBe(110.00000000000014];


        const empty = df['DOESNT_EXIST'];
        expect(empty.length).toBe(0);
    });

    it('Should have a sort function', async () => {

        const df = new Jataframe(moreRows);
        const sorted = df.sort('pnl');
        expect(sorted['pnl'][2]).toBe(110.00000000000014);
        expect(sorted['pnl'][0]).toBe(-123.20);

        // Sort descending

        const sorted2 = df.sort('pnl', 'desc');
        expect(sorted2['pnl'][2]).toBe(-123.20);
        expect(sorted2['pnl'][0]).toBe(110.00000000000014);

    });

    it('Should have unique ', async () => {

        const df = new Jataframe(rows);

        const unique = df.unique('DATE');

        expect(unique.length).toBe(6);
        expect(unique[0]).toBe('07/21/2022');
        expect(unique[1]).toBe('07/23/2022');
        expect(unique[2]).toBe('07/25/2022');
        expect(unique[3]).toBe('07/26/2022');
        expect(unique[4]).toBe('07/27/2022');
        expect(unique[5]).toBe('07/28/2022');


    });


    it('Should have a count function', async () => {

        const df = new Jataframe(rows);
        const count = df.count('PNL');

        expect(count).toBe(0);


    });

    it('Should have describe', async () => {

        const df = new Jataframe(rows);
        const row = df.describe('PNL');
        expect(row['mean']).toBe(4.875);
        expect(row['std']).toBe(22.40221808214535);
        expect(row['min']).toBe(-22);
        expect(row['max']).toBe(61);
        expect(row['count']).toBe(8);
        expect(row['median']).toBe(0);
        expect(row['mode']).toBe("0");


    });


    it('Should set values with array access', async () => {
        const df = new Jataframe(rows);
        const fakeValues = df['NOT_REAL'];
        expect(fakeValues.length).toBe(0);

        df['NOT_REAL'] = [1, 2, 3, 4, 5, 6, 7, 8];
        expect(df['NOT_REAL'].length).toBe(8);
    });

    it('Should explode when trying to set wrong column size', async () => {
        const df = new Jataframe(rows);


        expect(() => {
            df['NOT_REAL'] = [1, 2, 3, 4, 5, 6, 8];
        }).toThrowError('New column length is not equal to the number of rows');

    });

    it('Should have a cumulative_sum function for aggs ', async () => {
        const results = Jataframe.cumulative_sum([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        expect(results).toStrictEqual([
            1, 3, 6, 10, 15,
            21, 28, 36, 45, 55
        ]);
    });


    it('Should have aggregateBy', async () => {
        const df = new Jataframe(rows);
        // console.log('df', df);
        expect(df.length).toBe(8);

        const grouped = df.aggregateBy('DATE', {'pnl_sum': {'PNL': Jataframe.sum}});
        expect(grouped.length).toBe(6);
        expect(grouped['pnl_sum'][3]).toBe(61);
        expect(grouped['pnl_sum'][5]).toBe(-22);

        expect(grouped['row_count'][0]).toBe(2);
        expect(grouped['row_count'][3]).toBe(1);
        expect(grouped['row_count'][5]).toBe(1);

    });

    it('Should have aggregateBy that returns the whole row ', function () {
        const df = new Jataframe(rows);
        // console.log('df', df);
        expect(df.length).toBe(8);

        const grouped = df.aggregateBy('DATE', {
            'syms': {
                'SYMBOL': (rows) => {
                    return rows.SYMBOL;
                },
                'win_pnl': {
                    'PNL': (data) => {
                        return (data.filter(row => row.pnl > 0).length);
                    }
                }
            }
        }, true);


        expect(grouped['syms'][0].length).toBe(2);
        expect(grouped['syms'][1].length).toBe(2);
        expect(grouped['syms'][2].length).toBe(1);
    });

    it('Should have reduce ', function () {
        const df = new Jataframe(rows);
        const column = 'PNL';
        const pnl = df.reduce((acc, row) => acc + row[column], 0);
        expect(pnl).toBe(39);
    });

    it('Should have head', function () {
        const df = new Jataframe(rows);
        const heads = df.head(3);
        expect(heads.length).toBe(3);
        expect(heads[0].PNL).toBe(0);
        expect(heads[1].PNL).toBe(0);
        expect(heads[2].PNL).toBe(0);
    });

    it('Should have tail', function () {
        const df = new Jataframe(rows);
        const tails = df.tail(3);
        expect(tails.length).toBe(3);
        expect(tails[0].PNL).toBe(61);
        expect(tails[1].PNL).toBe(0);
        expect(tails[2].PNL).toBe(-22);
    });
});
