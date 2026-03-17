// constants/demoData.js
// Static demo data used when no live SkySpark connection is available.
// Replace with real Axon eval results in evals/loadData.js.

window.ActualVsModeled = window.ActualVsModeled || {};
window.ActualVsModeled.constants = window.ActualVsModeled.constants || {};

window.ActualVsModeled.constants.demoData = {

  siteName:  'East Campus Building',
  dateRange: 'Jan 2026 \u2013 Mar 2026',

  kpis: [
    {
      label: 'Building Consumption YTD',
      value: '275,577',
      unit: 'kWh',
      note: { type: 'neg', text: '\u221237,538 vs model' }
    },
    {
      label: 'Solar Generation YTD',
      value: '207,656',
      unit: 'kWh',
      note: { type: 'neg', text: '\u221223,589 vs model' }
    },
    {
      label: 'Net Zero Gap YTD',
      value: '\u221267,921',
      unit: 'kWh',
      note: { type: 'neutral', text: 'Cumulative deficit' }
    },
    {
      label: 'Solar Offset Ratio',
      value: '75.4',
      unit: '%',
      note: { type: 'neutral', text: 'of building load covered' }
    }
  ],

  buildingChart: {
    title: 'Building \u2014 Actual vs. Modeled',
    legend: [
      { color: '#0c2340', label: 'Actual' },
      { color: '#a3b4cc', label: 'Model' }
    ],
    yTicks: ['150,000', '100,000', '50,000', '0'],
    months: ['Jan 2026', 'Feb 2026', 'Mar 2026'],
    bars: [
      [
        { colorClass: 'b-actual', heightPct: 75,   tip: '112,461 kWh' },
        { colorClass: 'b-model',  heightPct: 68.2, tip: '102,343 kWh' }
      ],
      [
        { colorClass: 'b-actual', heightPct: 69.4, tip: '104,149 kWh' },
        { colorClass: 'b-model',  heightPct: 58.8, tip: '88,224 kWh'  }
      ],
      [
        { colorClass: 'b-actual', heightPct: 39.3, tip: '58,967 kWh' },
        { colorClass: 'b-model',  heightPct: 31.6, tip: '47,473 kWh' }
      ]
    ],
    tableRows: [
      { label: 'Actual',     cells: ['112,461', '104,149', '58,967'] },
      { label: 'Model',      cells: ['102,343', '88,224',  '47,473'] },
      {
        label: 'Difference',
        cells: [
          { text: '\u221210,118', cls: 'neg' },
          { text: '\u221215,925', cls: 'neg' },
          { text: '\u221211,494', cls: 'neg' }
        ]
      }
    ]
  },

  solarChart: {
    title: 'Solar \u2014 Actual vs. Modeled',
    legend: [
      { color: '#2ecc71', label: 'Actual' },
      { color: '#a8e6c1', label: 'Model' }
    ],
    yTicks: ['150,000', '100,000', '50,000', '0'],
    months: ['Jan 2026', 'Feb 2026', 'Mar 2026'],
    bars: [
      [
        { colorClass: 's-actual', heightPct: 49.9, tip: '74,840 kWh' },
        { colorClass: 's-model',  heightPct: 44.5, tip: '66,742 kWh' }
      ],
      [
        { colorClass: 's-actual', heightPct: 59.9, tip: '89,864 kWh' },
        { colorClass: 's-model',  heightPct: 49.6, tip: '74,373 kWh' }
      ],
      [
        { colorClass: 's-actual', heightPct: 28.6, tip: '42,952 kWh' },
        { colorClass: 's-model',  heightPct: 65.2, tip: '97,773 kWh' }
      ]
    ],
    tableRows: [
      { label: 'Actual', cells: ['74,840', '89,864', '42,952'] },
      { label: 'Model',  cells: ['66,742', '74,373', '97,773'] },
      {
        label: 'Difference',
        cells: [
          { text: '+8,098',        cls: 'pos' },
          { text: '+15,491',       cls: 'pos' },
          { text: '\u221254,821',  cls: 'neg' }
        ]
      }
    ]
  },

  netZeroChart: {
    title: 'Net Zero \u2014 Consumption vs. Generation',
    legend: [
      { color: '#0c2340', label: 'Building' },
      { color: '#2ecc71', label: 'Solar'    }
    ],
    yTicks: ['150,000', '100,000', '50,000', '0'],
    months: ['Jan 2026', 'Feb 2026', 'Mar 2026'],
    tall: true,
    bars: [
      [
        { colorClass: 'n-bldg',  heightPct: 75,   tip: 'Bldg: 112,461 kWh'  },
        { colorClass: 'n-solar', heightPct: 49.9, tip: 'Solar: 74,840 kWh'  }
      ],
      [
        { colorClass: 'n-bldg',  heightPct: 69.4, tip: 'Bldg: 104,149 kWh'  },
        { colorClass: 'n-solar', heightPct: 59.9, tip: 'Solar: 89,864 kWh'  }
      ],
      [
        { colorClass: 'n-bldg',  heightPct: 39.3, tip: 'Bldg: 58,967 kWh'  },
        { colorClass: 'n-solar', heightPct: 28.6, tip: 'Solar: 42,952 kWh' }
      ]
    ],
    tableRows: [
      { label: 'Building', cells: ['112,461', '104,149', '58,967'] },
      { label: 'Solar',    cells: ['74,840',  '89,864',  '42,952'] },
      {
        label: 'Net Zero',
        cells: [
          { text: '\u221237,621', cls: 'neg' },
          { text: '\u221214,286', cls: 'neg' },
          { text: '\u221216,015', cls: 'neg' }
        ]
      }
    ]
  },

  consumption: {
    months: ['January','February','March','April','May','June','July','August','September','October','November','December'],
    rows: [
      { label: 'HVAC',              cells: ['51,185','42,553','27,128','23,773','23,037','28,783','32,113','28,431','24,703','24,532','28,896','48,042'], total: '383,176' },
      { label: 'Plug \u0026 Process', cells: ['4,340','3,891','4,101','3,975','3,981','3,951','4,133','4,014','3,831','3,911','3,932','4,627'],           total: '48,687'  },
      { label: 'Exterior Lighting', cells: ['277','224','98','140','230','261','239','220','243','273','259','293'],                                       total: '2,757'   },
      { label: 'Interior Lighting', cells: ['5,600','5,340','5,078','4,688','4,809','4,630','4,740','4,800','4,910','5,335','5,436','5,881'],             total: '61,247'  },
      { label: 'DHW',               cells: ['2,976','2,705','2,870','2,790','2,873','3,132','3,296','3,067','2,966','3,006','2,770','2,918'],             total: '35,369'  }
    ],
    total: { label: 'Total Energy Consumption (kWh)', cells: ['64,378','54,713','39,275','35,366','34,930','40,757','44,521','40,532','36,653','37,057','41,293','61,761'], total: '531,236' }
  },

  generation: {
    rows: [
      { label: 'Elec Meter SolarEdge',                   cells: ['8,124','10,450','21,959','24,899','42,060','57,731','52,142','51,030','41,257','23,066','9,273','3,164'], total: '345,155' },
      { label: 'Elec Power Meter Solar Trans Disc (PV)', cells: ['3,045','2,713','5,369','5,367','6,665','6,775','6,233','6,763','6,134','4,437','2,776','1,168'],          total: '57,445'  }
    ],
    total: { label: 'Total Energy Generation (kWh)', cells: ['11,169','13,163','27,328','30,266','48,725','64,506','58,375','57,793','47,391','27,503','12,049','4,332'], total: '402,600' }
  },

  netPerformance: {
    label: 'Net Building Performance (kWh)',
    cells: [
      { text: '\u221253,209', cls: 'cell-neg' },
      { text: '\u221241,550', cls: 'cell-neg' },
      { text: '\u221211,947', cls: 'cell-neg' },
      { text: '\u22125,100',  cls: 'cell-neg' },
      { text: '13,795',       cls: 'cell-pos' },
      { text: '23,749',       cls: 'cell-pos' },
      { text: '13,854',       cls: 'cell-pos' },
      { text: '17,261',       cls: 'cell-pos' },
      { text: '10,738',       cls: 'cell-pos' },
      { text: '\u22129,554',  cls: 'cell-neg' },
      { text: '\u221229,244', cls: 'cell-neg' },
      { text: '\u221257,429', cls: 'cell-neg' },
      { text: '\u2212128,636',cls: 'cell-neg' }
    ]
  }

};
