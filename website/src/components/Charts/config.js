import {toCurrency} from "@/DataTransformer";
import config from "@/config";

export const basicOptions = {
    maintainAspectRatio: false,
    legend: {
        display: false
    },
    responsive: true
};

export let lineChartOptionsBlue = {
    ...basicOptions,
    tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: 'nearest',
        intersect: 0,
        position: 'nearest'
    },
    responsive: true,
    scales: {
        yAxes: [
            {
                barPercentage: 1.6,
                gridLines: {
                    drawBorder: false,
                    color: 'rgba(29,140,248,0.0)',
                    zeroLineColor: 'transparent'
                },
                ticks: {
                    suggestedMin: 60,
                    suggestedMax: 125,
                    padding: 20,
                    fontColor: '#9e9e9e'
                }
            }
        ],

        xAxes: [
            {
                barPercentage: 1.6,
                display: true,
                gridLines: {
                    drawBorder: false,
                    color: 'rgba(29,140,248,0.1)',
                    zeroLineColor: 'transparent'
                },
                ticks: {
                    padding: 20,
                    fontColor: '#9e9e9e'
                }
            }
        ]
    }
};

export let barChartOptionsGradient = {
    ...basicOptions,
    tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: 'nearest',
        intersect: 0,
        position: 'nearest'
    },
    responsive: true,
    scales: {
        yAxes: [
            {
                gridLines: {
                    drawBorder: false,
                    color: 'rgba(253,93,147,0.1)',
                    zeroLineColor: 'transparent'
                },
                ticks: {
                    // suggestedMin: 60,
                    // suggestedMax: 125,
                    padding: 20,
                    fontColor: '#9e9e9e'
                }
            }
        ],

        xAxes: [
            {
                gridLines: {
                    drawBorder: false,
                    color: 'rgba(253,93,147,0.1)',
                    zeroLineColor: 'transparent'
                },
                ticks: {
                    // padding: 20,
                    fontColor: '#9e9e9e'
                }
            }
        ]
    }
};

export let pieChartOptions = {
    ...basicOptions,
    cutoutPercentage: 70,
    tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: 'nearest',
        intersect: 0,
        position: 'nearest'
    },

    scales: {
        yAxes: [
            {
                display: 0,
                ticks: {
                    display: false
                },
                gridLines: {
                    drawBorder: false,
                    zeroLineColor: 'transparent',
                    color: 'rgba(255,255,255,0.05)'
                }
            }
        ],

        xAxes: [
            {
                display: 0,
                barPercentage: 1.6,
                gridLines: {
                    drawBorder: false,
                    color: 'rgba(255,255,255,0.1)',
                    zeroLineColor: 'transparent'
                },
                ticks: {
                    display: false
                }
            }
        ]
    }
};

export let purpleChartOptions = {
    ...basicOptions,
    tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: 'nearest',
        intersect: 0,
        position: 'nearest'
    },
    scales: {
        yAxes: [
            {
                barPercentage: 1.6,
                gridLines: {
                    drawBorder: false,
                    color: 'rgba(29,140,248,0.0)',
                    zeroLineColor: 'transparent'
                },
                ticks: {
                    suggestedMin: 60,
                    suggestedMax: 125,
                    padding: 20,
                    fontColor: '#9a9a9a'
                }
            }
        ],

        xAxes: [
            {
                barPercentage: 1.6,
                gridLines: {
                    drawBorder: false,
                    color: 'rgba(225,78,202,0.1)',
                    zeroLineColor: 'transparent'
                },
                ticks: {
                    padding: 20,
                    fontColor: '#9a9a9a'
                }
            }
        ]
    }
};

export let orangeChartOptions = {
    ...basicOptions,
    tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: 'nearest',
        intersect: 0,
        position: 'nearest'
    },
    scales: {
        yAxes: [
            {
                barPercentage: 1.6,
                gridLines: {
                    drawBorder: false,
                    color: 'rgba(29,140,248,0.0)',
                    zeroLineColor: 'transparent'
                },
                ticks: {
                    suggestedMin: 50,
                    suggestedMax: 110,
                    padding: 20,
                    fontColor: '#ff8a76'
                }
            }
        ],

        xAxes: [
            {
                barPercentage: 1.6,
                gridLines: {
                    drawBorder: false,
                    color: 'rgba(220,53,69,0.1)',
                    zeroLineColor: 'transparent'
                },
                ticks: {
                    padding: 20,
                    fontColor: '#ff8a76'
                }
            }
        ]
    }
};
export let greenChartOptions = {
    ...basicOptions,
    tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: 'nearest',
        intersect: 0,
        position: 'nearest'
    },
    scales: {
        yAxes: [
            {
                barPercentage: 1.6,
                gridLines: {
                    drawBorder: false,
                    color: 'rgba(29,140,248,0.0)',
                    zeroLineColor: 'transparent'
                },
                ticks: {
                    suggestedMin: 50,
                    suggestedMax: 125,
                    padding: 20,
                    fontColor: '#9e9e9e'
                }
            }
        ],

        xAxes: [
            {
                barPercentage: 1.6,
                gridLines: {
                    drawBorder: false,
                    color: 'rgba(0,242,195,0.1)',
                    zeroLineColor: 'transparent'
                },
                ticks: {
                    padding: 20,
                    fontColor: '#9e9e9e'
                }
            }
        ]
    }
};

export let barChartOptions = {
    ...basicOptions,
    tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: 'nearest',
        intersect: 0,
        position: 'nearest'
    },
    scales: {
        yAxes: [
            {
                gridLines: {
                    drawBorder: false,
                    color: 'rgba(29,140,248,0.1)',
                    zeroLineColor: 'transparent'
                },
                ticks: {
                    suggestedMin: 60,
                    suggestedMax: 120,
                    padding: 20,
                    fontColor: '#9e9e9e'
                }
            }
        ],
        xAxes: [
            {
                gridLines: {
                    drawBorder: false,
                    color: 'rgba(29,140,248,0.1)',
                    zeroLineColor: 'transparent'
                },
                ticks: {
                    padding: 20,
                    fontColor: '#9e9e9e'
                }
            }
        ]
    }
};

// export const pnlChartOptions = {
//
//
//     pointHitRadius: 30,
//     pointHoverRadius: 4,
//     tension: .1,
//     maintainAspectRatio: false,
//     plugins: {
//         legend: {
//             display: false,
//         },
//         tooltip: {
//             mode: 'nearest',
//             intersect: false,
//             callbacks: {
//                 beforeBody: (t, d) => {
//                     const table = t[0];
//                     let dataIndex = table.dataIndex;
//                     const pnl = table.dataset.data[dataIndex];
//                     const row = self.closers.data[dataIndex];
//                     const plus = row.pnl > 0 ? '+' : '';
//                     return `${row.symbol} ${plus}${toCurrency(row.pnl)}`;
//                 },
//                 labelColor: function (context) {
//                     let row = null;
//                     if ( self.chartData) {
//                         row = self.chartData.data[context.dataIndex];
//                     }
//                     if (row && row.pnl > 0) {
//                         return {
//                             borderColor: config.colors.black,
//                             backgroundColor: config.colors.green,
//                             borderWidth: 2,
//                             borderRadius: 2,
//                         };
//                     } else {
//
//                         return {
//                             borderColor: config.colors.black,
//                             backgroundColor: config.colors.red,
//
//                             borderWidth: 2,
//                             borderRadius: 2,
//                         };
//                     }
//                 },
//                 labelTextColor: function (context) {
//                     return '#EFEFEF';
//                 }
//
//             }
//         },
//     },
//     responsive: true,
//     scales: {
//         x: {
//             grid: {display: false},
//             ticks: {
//                 display: true //this will remove only the label
//             }
//         },
//         y: {
//             grid: {display: false}
//         }
//     },
//
// };

export const weeklyChartOptions = {


    pointHitRadius: 30,
    pointHoverRadius: 4,
    tension: .1,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            mode: 'nearest',
            intersect: false,
            callbacks: {
                beforeBody: (t, d) => {
                    const table = t[0];
                    let dataIndex = table.dataIndex;
                    const pnl = table.dataset.data[dataIndex];
                    const row = self.closersGrouped.data[dataIndex];
                    const plus = pnl > 0 ? '+' : '';
                    if ( row) {
                        const symbols = [...new Set(row.symbols)].join(',');
                        return `${symbols} ${plus}${toCurrency(pnl)}`;
                    }
                    else return '';
                },
                labelColor: function (context) {
                    const table = context;
                    const row = table.dataset.data[table.dataIndex];
                    if ( row) {
                        if (row > 0) {
                            return {
                                borderColor: config.colors.black,
                                backgroundColor: config.colors.green,
                                borderWidth: 2,
                                borderRadius: 2,
                            };
                        } else {
                            return {
                                borderColor: config.colors.black,
                                backgroundColor: config.colors.red,

                                borderWidth: 2,
                                borderRadius: 2,
                            };
                        }
                    }
                    else return {};
                },
                labelTextColor: function (context) {
                    return '#EFEFEF';
                }

            }
        },
    },
    responsive: true,
    scales: {
        x: {
            display: false
        },
        y: {
            display: false
        }
    },

};
