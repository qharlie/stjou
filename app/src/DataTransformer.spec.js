const dt = require('./DataTransformer');
const {isClosingTrade} = require("./DataTransformer");


// Create some fake rows where we know our expected PNL

// Actually these are just cut from the real file

const fakeCSV = `DATE,TRANSACTION ID,DESCRIPTION,QUANTITY,SYMBOL,PRICE,COMMISSION,AMOUNT,REG FEE,SHORT-TERM RDM FEE,FUND REDEMPTION FEE, DEFERRED SALES CHARGE
07/25/2022,44064812221,Bought 25 GOOG @ 108.12,25,GOOG,108.00,0.00,-108.12,,,,
07/25/2022,44064812616,Bought 5 GOOG @ 108.11,5,GOOG,110.0,0.00,-108.11,,,,
07/26/2022,44092310443,Sold 30 GOOG @ 110.9,30,GOOG,112.0,0.00,2772.44,0.06,,,`;


const fakeCSV2 = `DATE,TRANSACTION ID,DESCRIPTION,QUANTITY,SYMBOL,PRICE,COMMISSION,AMOUNT,REG FEE,SHORT-TERM RDM FEE,FUND REDEMPTION FEE, DEFERRED SALES CHARGE
07/21/2022,44064812221,Bought 1 GOOG @ 108.12,1,GOOG,2.00,0.00,-108.12,,,,
07/22/2022,44064812616,Bought 2 GOOG @ 108.11,2,GOOG,4.0,0.00,-108.11,,,,
07/23/2022,44064812616,Bought 3 GOOG @ 108.11,3,GOOG,6.0,0.00,-108.11,,,,
07/24/2022,44064812616,Bought 4 GOOG @ 108.11,4,GOOG,8.0,0.00,-108.11,,,,
07/25/2022,44064812616,Bought 5 GOOG @ 108.11,5,GOOG,10.0,0.00,-108.11,,,,
07/26/2022,44092310443,Sold 10 GOOG @ 110.9,10,GOOG,15.0,0.00,2772.44,0.06,,,
07/27/2022,44064812616,Bought 5 GOOG @ 108.11,5,GOOG,10.0,0.00,-108.11,,,,
07/28/2022,44092310443,Sold 10 GOOG @ 110.9,10,GOOG,15.0,0.00,2772.44,0.06,,,

`;


const shortSellCSV = `DATE,TRANSACTION ID,DESCRIPTION,QUANTITY,SYMBOL,PRICE,COMMISSION,AMOUNT,REG FEE,SHORT-TERM RDM FEE,FUND REDEMPTION FEE, DEFERRED SALES CHARGE
07/25/2022,44092310443,Sold Short 30 GOOG @ 112.00,25,GOOG,112.0,0.00,2772.44,0.06,,,
07/26/2022,44064812221,Bought to Cover 30 GOOG @ 108.00,25,GOOG,108.00,0.00,-108.12,,,,`;

const csvWithMissingBuy = `DATE,TRANSACTION ID,DESCRIPTION,QUANTITY,SYMBOL,PRICE,COMMISSION,AMOUNT,REG FEE,SHORT-TERM RDM FEE,FUND REDEMPTION FEE, DEFERRED SALES CHARGE
07/26/2022,44092310443,Sold 10 GOOG @ 110.9,10,GOOG,15.0,0.00,2772.44,0.06,,,
07/25/2022,44064812616,Bought 5 GOOG @ 108.11,5,GOOG,10.0,0.00,-108.11,,,,
`;


const csvWithMissingShort = `DATE,TRANSACTION ID,DESCRIPTION,QUANTITY,SYMBOL,PRICE,COMMISSION,AMOUNT,REG FEE,SHORT-TERM RDM FEE,FUND REDEMPTION FEE, DEFERRED SALES CHARGE
07/26/2022,44064812221,Bought to Cover 30 GOOG @ 108.12,25,GOOG,108.00,0.00,-108.12,,,,`;

const fidelityCsv = `


Brokerage

Run Date,Account,Action,Symbol,Security Description,Security Type,Quantity,Price ($),Commission ($),Fees ($),Accrued Interest ($),Amount ($),Settlement Date
 07/05/2023,"Individual" X91636470," Electronic Funds Transfer Paid (Cash)", ," No Description",Cash,0.000,,,,,-581.93,
 06/30/2023,"Individual" X91636470," INTEREST EARNED FDIC INSURED DEPOSIT AT US BANK NOT ... (QUSBQ) (Cash)", QUSBQ," FDIC INSURED DEPOSIT AT US BANK NOT COV",Cash,0.000,,,,,0.1,
 06/27/2023,"Individual" X91636470," YOU SOLD TOPGOLF CALLAWAY BRANDS CORP COM (MODG) (Cash)", MODG," TOPGOLF CALLAWAY BRANDS CORP COM",Cash,-29,19.7,,0.01,,571.29,06/29/2023
 05/31/2023,"Individual" X91636470," INTEREST EARNED FDIC INSURED DEPOSIT AT UNION BANK N... (QPIBQ) (Cash)", QPIBQ," FDIC INSURED DEPOSIT AT UNION BANK NA N",Cash,0.000,,,,,0.27,
 05/31/2023,"Individual" X91636470," INTEREST EARNED FDIC INSURED DEPOSIT AT US BANK NOT ... (QUSBQ) (Cash)", QUSBQ," FDIC INSURED DEPOSIT AT US BANK NOT COV",Cash,0.000,,,,,0.47,
 05/26/2023,"Individual" X91636470," YOU BOUGHT TOPGOLF CALLAWAY BRANDS CORP COM (MODG) (Cash)", MODG," TOPGOLF CALLAWAY BRANDS CORP COM",Cash,29,17.2,,,,-498.66,05/31/2023
 05/15/2023,"Individual" X91636470," EXCHANGED TO QUSBQ FDIC INSURED DEPOSIT AT US BANK NOT ... (QUSBQ) (Cash)", QUSBQ," FDIC INSURED DEPOSIT AT US BANK NOT COV",Cash,0.000,,,,,0.00,
 05/10/2023,"Individual" X91636470," YOU SOLD AMAZON.COM INC (AMZN) (Cash)", AMZN," AMAZON.COM INC",Cash,-4,109.76,,0.01,,439.03,05/12/2023
 04/28/2023,"Individual" X91636470," INTEREST EARNED FDIC INSURED DEPOSIT AT UNION BANK N... (QPIBQ) (Cash)", QPIBQ," FDIC INSURED DEPOSIT AT UNION BANK NA N",Cash,0.000,,,,,0.3,
 04/11/2023,"Individual" X91636470," YOU BOUGHT AMAZON.COM INC (AMZN) (Cash)", AMZN," AMAZON.COM INC",Cash,4,99.32,,,,-397.28,04/13/2023
 04/05/2023,"Individual" X91636470," YOU SOLD DIREXION DAILY FINANCIAL BULL 3X SHARES (FAS) (Cash)", FAS," DIREXION DAILY FINANCIAL BULL 3X SHARES",Cash,-4,55.8,,0.01,,223.19,04/10/2023
 04/05/2023,"Individual" X91636470," YOU SOLD WELLS FARGO CO NEW COM (WFC) (Cash)", WFC," WELLS FARGO CO NEW COM",Cash,-5,36.63,,0.01,,183.16,04/10/2023
 03/31/2023,"Individual" X91636470," YOU BOUGHT DIREXION DAILY FINANCIAL BULL 3X SHARES (FAS) (Cash)", FAS," DIREXION DAILY FINANCIAL BULL 3X SHARES",Cash,4,56.9,,,,-227.6,04/04/2023
 03/31/2023,"Individual" X91636470," INTEREST EARNED FDIC INSURED DEPOSIT AT UNION BANK N... (QPIBQ) (Cash)", QPIBQ," FDIC INSURED DEPOSIT AT UNION BANK NA N",Cash,0.000,,,,,0.94,
 03/31/2023,"Individual" X91636470," YOU BOUGHT WELLS FARGO CO NEW COM (WFC) (Cash)", WFC," WELLS FARGO CO NEW COM",Cash,5,37.41,,,,-187.05,04/04/2023
 02/28/2023,"Individual" X91636470," INTEREST EARNED FDIC INSURED DEPOSIT AT UNION BANK N... (QPIBQ) (Cash)", QPIBQ," FDIC INSURED DEPOSIT AT UNION BANK NA N",Cash,0.000,,,,,0.81,
 02/24/2023,"Individual" X91636470," YOU SOLD PROSHARES TR ULTRAPRO SHT QQQ (SQQQ) (Cash)", SQQQ," PROSHARES TR ULTRAPRO SHT QQQ",Cash,-5,39.84,,0.01,,199.19,02/28/2023
 02/24/2023,"Individual" X91636470," YOU BOUGHT PROSHARES TR ULTRAPRO SHT QQQ (SQQQ) (Cash)", SQQQ," PROSHARES TR ULTRAPRO SHT QQQ",Cash,5,40.16,,,,-200.8,02/28/2023
 02/01/2023,"Individual" X91636470," Electronic Funds Transfer Received (Cash)",  ," No Description",Cash,0.000,,,,,500,





"The data and information in this spreadsheet is provided to you solely for your use and is not for distribution. The spreadsheet is provided for"
"informational purposes only, and is not intended to provide advice, nor should it be construed as an offer to sell, a solicitation of an offer to buy or a"
"recommendation for any security or insurance product by Fidelity or any third party. Data and information shown is based on information known to Fidelity as of the date it was"
"exported and is subject to change. It should not be used in place of your account statements or trade confirmations and is not intended for tax reporting"
"purposes. For more information on the data included in this spreadsheet, including any limitations thereof, go to Fidelity.com."

"Brokerage services are provided by Fidelity Brokerage Services LLC, 900 Salem Street, Smithfield, RI 02917. Custody and other services provided by National"
"Financial Services LLC. Both are Fidelity Investment companies and members SIPC, NYSE. Insurance products at Fidelity are distributed by"
"Fidelity Insurance Agency, Inc., and, for certain products, by Fidelity Brokerage Services, Member NYSE, SIPC."

Date downloaded 07/25/2023 9:41 am`;
const etradeCsv = `For Account:,####3525

TransactionDate,TransactionType,SecurityType,Symbol,Quantity,Amount,Price,Commission,Description

04/05/23,Sold,EQ,AMZN,-2,202.19,101.1,0,AMAZON.COM INC
04/05/23,Bought,EQ,SQQQ,9,-280.06,31.1176,0,PROSHARES TR                  PROSHARES ULTRAPRO SHORT QQQ  PROSPECTUS ON INITIAL PURCHASE
04/03/23,Bought,EQ,AMZN,2,-204.9,102.45,0,AMAZON.COM INC
04/03/23,Sold,EQ,SQQQ,-5,148.83,29.767,0,PROSHARES TR                  PROSHARES ULTRAPRO SHORT QQQ
04/03/23,Sold,EQ,TSLA,-1,196.95,196.9579,0,TESLA INC                     COMMON STOCK
03/31/23,Bought,EQ,TSLA,1,-204.1,204.098,0,TESLA INC                     COMMON STOCK
03/31/23,Sold,EQ,FAS,-4,227.61,56.905,0,DIREXION SHS ETF TR           DAILY FINL BULL 3X SHS
03/31/23,Bought,EQ,FAS,4,-227.64,56.91,0,DIREXION SHS ETF TR           DAILY FINL BULL 3X SHS        PROSPECTUS ON INITIAL PURCHASE
03/31/23,Bought,EQ,SQQQ,5,-150.53,30.105,0,PROSHARES TR                  PROSHARES ULTRAPRO SHORT QQQ  PROSPECTUS ON INITIAL PURCHASE
02/24/23,Sold,EQ,TQQQ,-10,218.49,21.85,0,PROSHARES TRUST               ULTRAPRO QQQ
02/24/23,Bought,EQ,TQQQ,5,-107.85,21.5692,0,PROSHARES TRUST               ULTRAPRO QQQ                  PROSPECTUS ON INITIAL PURCHASE
02/24/23,Bought,EQ,TQQQ,5,-107.43,21.485,0,PROSHARES TRUST               ULTRAPRO QQQ                  PROSPECTUS ON INITIAL PURCHASE
02/01/23,Transfer,UNKNOWN, ,0,500,0,0,ACH DEPOSIT                   REFID:12312312312;

`;

function confirmDF(df, keys = [
    dt.KeyTable.SYMBOL.toLowerCase(),
    dt.KeyTable.DATE.toLowerCase(),
    dt.KeyTable.TRANSACTION_ID.toLowerCase(),
    dt.KeyTable.DESCRIPTION.toLowerCase(),
    dt.KeyTable.QUANTITY.toLowerCase(),
    dt.KeyTable.PRICE.toLowerCase(),
    dt.KeyTable.COMMISSION.toLowerCase(),
    dt.KeyTable.AMOUNT.toLowerCase(),
    dt.KeyTable.REG_FEE.toLowerCase(),
    dt.KeyTable.SHORT_TERM_RDM_FEE.toLowerCase(),
    dt.KeyTable.FUND_REDEMPTION_FEE.toLowerCase(),
    dt.KeyTable.DEFERRED_SALES_CHARGE.toLowerCase(),
    dt.KeyTable.BUY_PRICE.toLowerCase(),
    dt.KeyTable.PNL.toLowerCase(),
    dt.KeyTable.SELL_DATE.toLowerCase(),
    dt.KeyTable.BUY_DATE.toLowerCase(),
    dt.KeyTable.SELL_PRICE.toLowerCase()]) {
    hasAllKeys(df, keys);
}

function hasAllKeys(obj, keys) {
    for (const key of keys) {
        expect(obj[key]).toBeDefined();
    }
    return true;
}


describe('DataTransformer tests', () => {

    it('Should parse the CSV string into a dataframe', async () => {
        const df = await dt.csvToDF(fakeCSV);
        expect(df.length).toBe(3);

        confirmDF(df);

    });

    it('Should be correct', async () => {
        const df = await dt.csvToDF(fakeCSV);
        const buy_prices = df['buy_price'];

        expect(buy_prices[0]).toBe(108.0);
        expect(buy_prices[1]).toBe(110.0);
        expect(dt.safeParseFloat(buy_prices[2].toFixed(2))).toBe(108.33);
        confirmDF(df);

    });

    it('Should be as expected', async () => {
        const df = await dt.csvToDF(fakeCSV2);
        const buy_prices = df['buy_price'];

        expect(buy_prices[0]).toBe(2);
        expect(buy_prices[1]).toBe(4.0);
        expect(buy_prices[2]).toBe(6.0);
        expect(buy_prices[3]).toBe(8.0);
        expect(buy_prices[4]).toBe(10.0);
        expect(buy_prices[5]).toBe(8.8);
        expect(buy_prices[6]).toBe(10.0);
        expect(buy_prices[7]).toBe(7.2);
        confirmDF(df);

    });

    it('Should sum to expected values', async () => {
        const df = await dt.csvToDF(fakeCSV);
        const pnl = df.sum('pnl');
        // df.print();
        expect(dt.safeParseFloat(pnl.toFixed(2))).toBe(110.00);
        confirmDF(df);

    });

    it('Should handle simple short sells ', async () => {
        const df = await dt.csvToDF(shortSellCSV);
        // df.print();
        const pnl = df.sum('pnl');
        expect(pnl).toBe(100);
        confirmDF(df);

    });

    it('should be handled gracefully ', async () => {
        expect(() => {
            new dt.TradeResp({bad_option: 'bad'});
        }).toThrow('Unknown option bad_option');

    });


    it('should be handled gracefully ', async () => {

        const df = await dt.csvToDF(csvWithMissingBuy);
        // df.print();
        const pnl = df.sum('pnl');
        expect(pnl).toBe(0);
        confirmDF(df);


    });

    it('should be handled gracefully ', async () => {

        const df = await dt.csvToDF(csvWithMissingShort);
        // df.print();
        const pnl = df.sum('pnl');
        expect(pnl).toBe(0);
        confirmDF(df);


    });



});

const exepectedColumns = [
    'symbol',
    'side',
    'quantity',
    'price',
    'commission',
    'amount',
    'reg_fee',
    'short_term_rdm_fee',
    'fund_redemption_fee',
    'deferred_sales_charge',
    'buy_price',
    'pnl',
    'sell_date',
    'buy_date',
    'sell_price',

];
describe('DataFrame columns', () => {


    it('Should have all fields set', async () => {
        const df = await dt.csvToDF(fakeCSV);

        for (const col of exepectedColumns) {
            expect(df[col]).not.toBeNull();
        }

    });


    it('Should standardized broker to spec', async () => {

        const df = await dt.csvToDF(fakeCSV);


        for (let key of Object.keys(dt.TradeSpec)) {

            df.data.forEach(row => expect(row[key],`"${key}" should be defined`).toBeDefined());
        }
    });

    it('Should have types set ', async () => {
        const df = await dt.csvToDF(fakeCSV);


        const pnls = df['pnl'];
        expect(typeof pnls[0]).toBe('number');
        expect(pnls[2]).toBe(110.00000000000014);

        expect(typeof df['quantity'][1]).toBe('number');
        expect(typeof df['buy_price'][1]).toBe('number');
        expect(typeof df['sell_price'][1]).toBe('number');
        expect(typeof df['amount'][1]).toBe('number');

    });
    it('Should have pnl_cum set correctly ', async () => {

        const df = await dt.csvToDF(fakeCSV);

        const pnl_cum = df['pnl_cum'];


        expect(pnl_cum[0]).toBe(0);
        expect(pnl_cum[1]).toBe(0);
        expect(pnl_cum[2]).toBe(110.00000000000014);


    });
    it('Should have pnl_cum set correctly ', async () => {

        const df = await dt.csvToDF(fakeCSV2);

        const pnl_cum = df['pnl_cum'];


        expect(pnl_cum[0]).toBe(0);
        expect(pnl_cum[1]).toBe(0);
        expect(pnl_cum[2]).toBe(0);
        expect(pnl_cum[3]).toBe(0);
        expect(pnl_cum[4]).toBe(0);

        expect(pnl_cum[5]).toBe(61.99999999999999);
        expect(pnl_cum[6]).toBe(61.99999999999999);
        expect(pnl_cum[7]).toBe(140);

    });


    it('Should have effective_buy_price set correctly ', async () => {

        const df = await dt.csvToDF(shortSellCSV);

        const effective_buy_price = df['effective_buy_price'];
        const effective_sell_price = df['effective_sell_price'];

        expect(effective_buy_price[0]).toBe(112);
        expect(effective_sell_price[0]).toBe(0);
        expect(effective_buy_price[1]).toBe(108);
        expect(effective_sell_price[1]).toBe(112);
    });


    it('Should extractPeriodSlice correctly ', async () => {

            const df = await dt.csvToDF(fakeCSV2);
            expect(df.length).toBe(8);

            const df2 =dt.extractPeriodSlice(df,'2022-07-23', '2022-07-27');
            //console.log(df2);
            expect(df2.length).toBe(4);
            expect(df2['buy_price'][0]).toBe(6);
            expect(df2['buy_price'][1]).toBe(8);


    });

    it('Should have buys_for_close properly set', async () => {


        const df = await dt.csvToDF(fakeCSV);
        expect(df.length).toBe(3);

        const row = df.data[2];
        const buys_for_close = row.buys_for_close;
        //console.log(buys_for_close);
        expect(buys_for_close.length).toBe(2);
        expect(buys_for_close[0].price).toBe(110);
        expect(buys_for_close[1].price).toBe(108);
        expect(buys_for_close[0].date).toBe('07/25/2022');
        expect(buys_for_close[1].date).toBe('07/25/2022');
    });

    it('Should generateTestData', async () => {

        const data = dt.generateTradingData();
        //console.log('data', data);
    });

    it('Should import etrade', async () => {
        const df = await dt.csvToDF(etradeCsv, dt.Brokers.etrade);
        expect(df.length).toBe(12);
        //console.log('data', data);
    });

    it('Should import fidelity', async () => {
        const df = await dt.csvToDF(fidelityCsv, dt.Brokers.fidelity);
        expect(df.length).toBe(10);


        // It should have 3 closes
        const closers = df.filter(row => isClosingTrade(row));
        expect(closers.length).toBe(5);

        const close1 = closers.data[0];
        expect(close1.symbol).toBe('SQQQ');
        expect(close1.quantity).toBe(5);
        expect(close1.price).toBe(39.84);
        expect(close1.amount).toBe(199.19);
        // expect(close1.commission).toBe(-4.95);
        expect(close1.pnl).toBe(-1.599999999999966);
        expect(close1.buy_price).toBe(40.16);
        expect(close1.sell_price).toBe(39.84);
        expect(close1.buy_date).toBe('02/28/2023');
        expect(close1.sell_date).toBe('02/28/2023');
        expect(close1.side).toBe('SELL');
        expect(close1.effective_buy_price).toBe(40.16);
        expect(close1.stock_or_option).toBe('stock');
        expect(close1.short_or_long).toBe('long');
        expect(close1.effective_sell_price).toBe(39.84);
        expect(close1.buys_for_close.length).toBe(1);
        expect(close1.buys_for_close[0].price).toBe(40.16);
        expect(close1.buys_for_close[0].date).toBe('02/28/2023');

        //console.log('data', data);
    });
});
