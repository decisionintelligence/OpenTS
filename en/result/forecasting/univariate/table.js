/**
 * ==========================================================================
 * Leaderboard Application Module v5 (Robust Event Delegation with Rank Filter)
 * ==========================================================================
 * This version uses a fully robust event delegation model and adds a dropdown
 * to filter the number of ranks displayed.
 * It requires all onchange/onclick attributes to be removed from the HTML.
 */
// 全局变量
let gridApi;
function exportToCsv() {
    if (gridApi) {
        gridApi.exportDataAsCsv();
    } else {
        console.error("Grid API not ready.");
    }
}


const LeaderboardApp = {

    // --- 1. CONFIGURATION & CONSTANTS (内容不变) ---
    config: {
        // !! 重要：更新 API URL
        API_URL: 'https://www.opents.top/forecasting/uni/query',
        MODELS_LIST:{
          "Crossformer": {
            "paper-url": "https://openreview.net/forum?id=vSVLM2j9eie",
            "publication": "ICLR",
            "bib": "https://dblp.org/rec/conf/iclr/ZhangY23.html?view=bibtex",
            "paradigm": "DL",
            "year": "2023"
          },
          "Arima": {
            "paper-url": "https://www.tandfonline.com/doi/abs/10.1080/01621459.1970.10481180",
            "publication": "JASA",
            "bib": "https://www.tandfonline.com/doi/abs/10.1080/01621459.1970.10481180",
            "paradigm": "SL",
            "year": "2012"
          },
          "Kalman Filter": {
            "paper-url": "https://books.google.com.hk/books?hl=zh-CN&lr=&id=Kc6tnRHBwLcC&oi=fnd&pg=PR9&dq=Forecasting,+structural+time+series+models+and+the+Kalman+filter.&ots=I6QXVxW_FJ&sig=mDFREQcdTPiCVXttJZNiooV5lqQ&redir_esc=y#v=onepage&q=Forecasting%2C%20structural%20time%20series%20models%20and%20the%20Kalman%20filter.&f=false",
            "publication": "CUP",
            "bib": "https://books.google.com.hk/books?hl=zh-CN&lr=&id=Kc6tnRHBwLcC&oi=fnd&pg=PR9&dq=Forecasting,+structural+time+series+models+and+the+Kalman+filter.&ots=I6QXVxW_FJ&sig=mDFREQcdTPiCVXttJZNiooV5lqQ&redir_esc=y#v=onepage&q=Forecasting%2C%20structural%20time%20series%20models%20and%20the%20Kalman%20filter.&f=false",
            "paradigm": "SL",
            "year": "1990"
          },
          "Linear Regression": {
            "paper-url": "https://books.google.com/books?hl=zh-CN&lr=&id=8r0qE35wt44C&oi=fnd&pg=PR5&dq=Regression+models+for+time+series+analysis&ots=vd653g9LXv&sig=JPr8C-hETsPfWyuxTUlWgL0eKDA",
            "publication": "Wiley",
            "bib": "https://books.google.com/books?hl=zh-CN&lr=&id=8r0qE35wt44C&oi=fnd&pg=PR5&dq=Regression+models+for+time+series+analysis&ots=vd653g9LXv&sig=JPr8C-hETsPfWyuxTUlWgL0eKDA",
            "paradigm": "ML",
            "year": "2005"
          },
          "Naive Drift": {
            "paper-url": "https://unit8co.github.io/darts/generated_api/darts.models.forecasting.baselines.html?highlight=drift#darts.models.forecasting.baselines.NaiveDrift",
            "publication": "Darts",
            "bib": "https://github.com/unit8co/darts",
            "paradigm": "SL",
            "year": ""
          },
          "Naive Mean": {
            "paper-url": "https://unit8co.github.io/darts/generated_api/darts.models.forecasting.baselines.html#darts.models.forecasting.baselines.NaiveMean",
            "publication": "Darts",
            "bib": "https://github.com/unit8co/darts",
            "paradigm": "SL",
            "year": ""
          },
          "Naive Moving Average": {
            "paper-url": "https://unit8co.github.io/darts/generated_api/darts.models.forecasting.baselines.html?highlight=drift#darts.models.forecasting.baselines.NaiveMovingAverage",
            "publication": "Darts",
            "bib": "https://github.com/unit8co/darts",
            "paradigm": "SL",
            "year": ""
          },
          "Naive Seasonal": {
            "paper-url": "https://unit8co.github.io/darts/generated_api/darts.models.forecasting.baselines.html?highlight=drift#darts.models.forecasting.baselines.NaiveSeasonal",
            "publication": "Darts",
            "bib": "https://github.com/unit8co/darts",
            "paradigm": "SL",
            "year": ""
          },
          "N-BEATS": {
            "paper-url": "https://arxiv.org/pdf/1905.10437",
            "publication": "ICLR",
            "bib": "https://dblp.org/rec/conf/iclr/OreshkinCCB20.html?view=bibtex",
            "paradigm": "DL",
            "year": "2020"
          },
          "N-HiTS": {
            "paper-url": "https://ojs.aaai.org/index.php/AAAI/article/view/25854",
            "publication": "AAAI",
            "bib": "https://dblp.org/rec/conf/aaai/ChalluOORCD23.html?view=bibtex",
            "paradigm": "DL",
            "year": "2023"
          },
          "Random Forest": {
            "paper-url": "https://link.springer.com/article/10.1023/a:1010933404324",
            "publication": "ML",
            "bib": "https://link.springer.com/article/10.1023/a:1010933404324",
            "paradigm": "ML",
            "year": "2001"
          },
          "RNN": {
            "paper-url": "https://proceedings.mlr.press/v89/gasthaus19a.html",
            "publication": "Darts",
            "bib": "https://dblp.uni-trier.de/rec/conf/aistats/GasthausBWRSFJ19.html?view=bibtex",
            "paradigm": "DL",
            "year": ""
          },
          "AutoCES": {
            "paper-url": "https://unit8co.github.io/darts/generated_api/darts.models.forecasting.sf_auto_ces.html",
            "publication": "Darts",
            "bib": "https://github.com/unit8co/darts",
            "paradigm": "SL",
            "year": ""
          },
          "AutoETS": {
            "paper-url": "https://unit8co.github.io/darts/generated_api/darts.models.forecasting.sf_auto_ets.html",
            "publication": "Darts",
            "bib": "https://github.com/unit8co/darts",
            "paradigm": "SL",
            "year": ""
          },
          "AutoTheta": {
            "paper-url": "https://unit8co.github.io/darts/generated_api/darts.models.forecasting.sf_auto_theta.html",
            "publication": "Darts",
            "bib": "https://github.com/unit8co/darts",
            "paradigm": "SL",
            "year": ""
          },
          "TCN": {
            "paper-url": "https://arxiv.org/pdf/1803.01271",
            "publication": "arXiv",
            "bib": "https://dblp.org/rec/journals/corr/abs-1803-01271.html?view=bibtex",
            "paradigm": "DL",
            "year": "2018"
          },
          "TiDE": {
            "paper-url": "https://arxiv.org/pdf/2304.08424",
            "publication": "arXiv",
            "bib": "https://dblp.uni-trier.de/rec/journals/corr/abs-2304-08424.html?view=bibtex",
            "paradigm": "DL",
            "year": "2023"
          },
          "Xgboost": {
            "paper-url": "https://dl.acm.org/doi/abs/10.1145/2939672.2939785",
            "publication": "KDD",
            "bib": "https://dblp.uni-trier.de/rec/conf/kdd/ChenG16.html?view=bibtex",
            "paradigm": "ML",
            "year": "2016"
          },
          "DLinear": {
            "paper-url": "https://ojs.aaai.org/index.php/AAAI/article/view/26317",
            "publication": "AAAI",
            "bib": "https://dblp.org/rec/conf/aaai/ZengCZ023.html?view=bibtex",
            "paradigm": "DL",
            "year": "2023"
          },
          "Non-stationary Transformers": {
            "paper-url": "https://proceedings.neurips.cc/paper_files/paper/2022/hash/4054556fcaa934b0bf76da52cf4f92cb-Abstract-Conference.html",
            "publication": "NIPS",
            "bib": "https://dblp.org/rec/conf/nips/LiuWWL22.html?view=bibtex",
            "paradigm": "DL",
            "year": "2022"
          },
          "FEDformer": {
            "paper-url": "https://proceedings.mlr.press/v162/zhou22g.html",
            "publication": "ICML",
            "bib": "https://dblp.org/rec/conf/icml/ZhouMWW0022.html?view=bibtex",
            "paradigm": "DL",
            "year": "2022"
          },
          "FiLM": {
            "paper-url": "https://proceedings.neurips.cc/paper_files/paper/2022/hash/524ef58c2bd075775861234266e5e020-Abstract-Conference.html",
            "publication": "NIPS",
            "bib": "https://dblp.org/rec/conf/nips/ZhouMWW0YY022.html?view=bibtex",
            "paradigm": "DL",
            "year": "2022"
          },
          "Informer": {
            "paper-url": "https://ojs.aaai.org/index.php/AAAI/article/view/17325",
            "publication": "AAAI",
            "bib": "https://dblp.org/rec/conf/aaai/ZhouZPZLXZ21.html?view=bibtex",
            "paradigm": "DL",
            "year": "2021"
          },
          "NLinear": {
            "paper-url": "https://ojs.aaai.org/index.php/AAAI/article/view/26317",
            "publication": "AAAI",
            "bib": "https://dblp.org/rec/conf/aaai/ZengCZ023.html?view=bibtex",
            "paradigm": "DL",
            "year": "2023"
          },
          "PatchTST": {
            "paper-url": "https://openreview.net/forum?id=Jbdc0vTOcol",
            "publication": "ICLR",
            "bib": "https://dblp.org/rec/conf/iclr/NieNSK23.html?view=bibtex",
            "paradigm": "DL",
            "year": "2023"
          },
          "TimesNet": {
            "paper-url": "https://arxiv.org/pdf/2210.02186v2/1000",
            "publication": "ICLR",
            "bib": "https://dblp.org/rec/conf/iclr/WuHLZ0L23.html?view=bibtex",
            "paradigm": "DL",
            "year": "2022"
          },
          "Triformer": {
            "paper-url": "https://arxiv.org/pdf/2204.13767",
            "publication": "IJCAI",
            "bib": "https://dblp.org/rec/conf/ijcai/CirsteaG0KDP22.html?view=bibtex",
            "paradigm": "DL",
            "year": "2022"
          },
          "LightGBM": {
            "paper-url": "https://proceedings.neurips.cc/paper/2017/hash/6449f44a102fde848669bdd9eb6b76fa-Abstract.html",
            "publication": "NIPS",
            "bib": "https://dblp.uni-trier.de/rec/conf/nips/KeMFWCMYL17.html?view=bibtex",
            "paradigm": "ML",
            "year": "2017"
          }
        },
        MODEL_TYPES_LIST:{"TS-Pretrain":["Chronos","MOIRAI","Moment","ROSE",'TimesFM',"Timer","TTM","UniTS"], "LLM-Based":["CALF","GPT4TS","LLMMixer","S2IPLLM","TimeLLM","UniTime"], "Specific":["PatchTST","Dlinear","FedFormer","FITS","TimeMixer","TimesNet","iTransformer"]},
        DATASET_CATEGORIES: { "Frequency": ["Hourly","Daily","Weekly","Monthly","Quarterly","Yearly","Other"], 
        "Characteristics": ["w Trend", "w Transition","w Shifting", "w Seasonality","w Stationarity", "w-o Trend", "w-o Transition","w-o Shifting", "w-o Seasonality","w-o Stationarity"]},
        METRICS_LIST: ['mae',
        'mape',
        'mase',
        'mse',
        'msmape',
        'rmse',
        'smape',
        'wape'],
        METRICS_ORDER:[],
        DATASETS_ORDER:[],
        METHODS_ORDER:[],
    },
    state: { isReady: false, isLoading: false },
    elements: {},

    init() {
        this._cacheElements();
        this._initCollapsibles();
        this.debouncedUpdate = this._debounce(this.updateLeaderboard, 400);
        this._bindEventListeners();
        this._populateCheckboxes();
        this._setInitialState();
        this.state.isReady = true;
        this.updateLeaderboard();
    },
    
// --- AG-Grid 的辅助函数 (来自新页面，保持不变) ---
generateColumnDefs(data) {
  if (!data || data.length === 0) return []; // 处理空数据情况
  const methodMetricMap = new Map();
  data.forEach(item => {
      if (!methodMetricMap.has(item.method)) {
          methodMetricMap.set(item.method, new Set());
      }
      methodMetricMap.get(item.method).add(item.metric);
  });
  const fixedColumns = [
    {
      headerName: "Dataset",
      field: "dataset",
      width: 120,
      pinned: 'left',
      // 直接使用我们预先计算好的值
      rowSpan: params => params.data.datasetRowSpan,
      cellClass: 'dataset-cell',
      suppressMovable: true ,
      sortable: false,
      filter: false
  }
  ];
// 先获取所有 keys，方便在外层 map 中获取索引
const allMethods = Array.from(methodMetricMap.keys()).sort((a, b) => {
  // findIndex 会返回后缀在 order 数组中的索引 (0, 1, 2)
  // 如果找不到，会返回 -1，可以利用它将不匹配的项排在最后
  const indexA = this.config.METHODS_ORDER.findIndex(suffix => a.includes(suffix));
  const indexB = this.config.METHODS_ORDER.findIndex(suffix => b.includes(suffix));

  // 处理找不到后缀的情况，将它们排在最后面
  const finalIndexA = indexA === -1 ? Infinity : indexA;
  const finalIndexB = indexB === -1 ? Infinity : indexB;

  return finalIndexA - finalIndexB;
});

const dynamicColumns = allMethods.map((method, methodIndex) => { // <-- 1. 获取外层循环的索引

// 2. 判断当前是否为最后一个列组
const isLastGroup = methodIndex === allMethods.length - 1;

return {
    headerName: method,
    suppressMovable: true ,
    children: Array.from(methodMetricMap.get(method)).sort((a, b) => {
      // findIndex 会返回后缀在 order 数组中的索引 (0, 1, 2)
      // 如果找不到，会返回 -1，可以利用它将不匹配的项排在最后
      const indexA = this.config.METRICS_ORDER.findIndex(suffix => a == suffix);
      const indexB = this.config.METRICS_ORDER.findIndex(suffix => b == suffix);

      // 处理找不到后缀的情况，将它们排在最后面
      const finalIndexA = indexA === -1 ? Infinity : indexA;
      const finalIndexB = indexB === -1 ? Infinity : indexB;

      return finalIndexA - finalIndexB;
  }).map((metric, index, arr) => {
        
        const colDef = {
            headerName: metric.toUpperCase(),
            field: `${method}_${metric}`,
            suppressovable: true,
            width: 150,
            valueFormatter: params => {
                    // 1. 检查值是否存在且不为空
                    if (params.value == null || params.value === '') {
                        return 'NaN';
                    }
            
                    // 2. 将值转换为数字
                    const numericValue = parseFloat(params.value);
            
                    // 3. 检查转换后的结果是否是一个有效的数字
                    if (isNaN(numericValue)) {
                        return 'NaN';
                    }
            
                    // 4. 根据条件进行格式化
                    if (numericValue > 1000) {
                        // 大于1000，使用科学计数法，保留两位小数（即三位有效数字）
                        return numericValue.toExponential(3);
                    } else {
                        // 不大于1000，保留三位小数
                        return numericValue.toFixed(3);
                    }
                }
              };

        // 判断这是否是当前 children 数组中的最后一项
        const isLastChildInGroup = index === arr.length - 1;

        // --- 3. 修改判断条件 ---
        // 只有当“它是组里的最后一列” 并且 “它不属于整个表格的最后一个组”时，才添加类
        if (isLastChildInGroup && !isLastGroup) {
            colDef.headerClass = 'group-separator-header';
            colDef.cellClass = 'group-separator-cell';
        }

        return colDef;
    })
};
});
  return [...fixedColumns, ...dynamicColumns];
},

// 这是修改后的 generateRowData 函数
generateRowData(data) {
if (!data || data.length === 0) return [];
const dataMap = new Map();
data.forEach(item => {
    var { dataset, horizon, method, metric, value } = item;
    horizon=1
    if(dataset.includes('freq_')){
      dataset = dataset.replace('freq_','')
    }else if(dataset.includes('_True'))
    {
      dataset = 'w ' + dataset.replace('_True','')
    }else if (dataset.includes('_False'))
    {
      dataset = 'w/o ' +dataset.replace('_False','')

    }

    const compositeKey = `${dataset}-${horizon}`;
    if (!dataMap.has(compositeKey)) {
        dataMap.set(compositeKey, { dataset, horizon });
    }
    const row = dataMap.get(compositeKey);
    const dynamicColumnName = `${method}_${metric}`;
    row[dynamicColumnName] = value;
});

const pivotedData = Array.from(dataMap.values());

// 1. 必须先按 dataset 排序，这是计算 rowSpan 的基础
pivotedData.sort((a, b) => {
  const indexA = this.config.DATASETS_ORDER.indexOf(a.dataset);
  const indexB = this.config.DATASETS_ORDER.indexOf(b.dataset);

  // 如果 dataset 在 order 列表中找不到，则将它们放到列表的末尾
  const effectiveIndexA = indexA === -1 ? Infinity : indexA;
  const effectiveIndexB = indexB === -1 ? Infinity : indexB;
  
  const datasetCompare = effectiveIndexA - effectiveIndexB;
  
  if (datasetCompare !== 0) {
      return datasetCompare;
  }

  // 如果 dataset 顺序相同（或都不在 order 列表中），则按 horizon 排序
  return a.horizon - b.horizon;
});

// 2. 预先计算 RowSpan
for (let i = 0; i < pivotedData.length; i++) {
    const currentRow = pivotedData[i];
    // 检查是否是新的 dataset 分组的开始
    if (i === 0 || currentRow.dataset !== pivotedData[i - 1].dataset) {
        let span = 1;
        // 向后查找所有属于同一个 dataset 的行
        for (let j = i + 1; j < pivotedData.length; j++) {
            if (pivotedData[j].dataset === currentRow.dataset) {
                span++;
            } else {
                break; // 遇到不同 dataset，停止查找
            }
        }
        // 将计算好的 span 值存入该分组的第一行数据中
        currentRow.datasetRowSpan = span;
    } else {
        // 同一个分组内的其他行，span 设为 0 (AG-Grid 会自动处理)
        currentRow.datasetRowSpan = 0;
    }
}

return pivotedData;
},
    sendHeight(){
      // 使用 document.documentElement.scrollHeight 更可靠
      const height = document.documentElement.scrollHeight;
      // window.parent 指向父窗口
      // '*' 表示允许发送到任何源，为了安全，最好替换为父页面的源，例如 'https://your-main-site.com'
      window.parent.postMessage({
          type: 'iframeHeight',
          height: height
      }, '*'); 
    },
    _cacheElements() {
      this.elements.tableBody = document.getElementById('multivariateTable2')?.querySelector('tbody');
      this.elements.metricsContainer = document.getElementById('Metrics');
      this.elements.settingsContainer = document.getElementById('Settings');
      this.elements.datasetsContainer = document.getElementById('dataset-container-mul');
      this.elements.methodsContainer = document.getElementById('method-container-mul');
      this.elements.mainContainer = document.getElementById('main-container-mul');
      this.elements.scoreInput1 = document.getElementById('score/3/1');
      this.elements.scoreInput2 = document.getElementById('score/3/2');
      this.elements.scoreInput3 = document.getElementById('score/3/3');
      this.elements.loadingOverlay = document.querySelector('#table-container-mul .loading-overlay');
      // 新增：缓存下拉框元素
      this.elements.rankCountSelect = document.getElementById('rank-display-count');
    },
    _change_list(list, item, checked)
    {
      
      if (checked)
      {
        list.push(item)
      }else{
        list.pop(item)
      }
      return list
    },
    _order_list(id, checked)
    {   

        if (id.includes('select-all-'))
        {
          className = id.replace('select-all-','')
          if ((className=='Frequency' || className=='Characteristics')&&checked)
          {
            this.config.DATASET_CATEGORIES[className].forEach(e=>{
              if (!this.config.DATASETS_ORDER.includes(e))
              {
                this._change_list(this.config.DATASETS_ORDER,e,checked)
              }
            })
          }else if ((className=='Frequency' || className=='Characteristics')&&!checked)
          {
            this.config.DATASET_CATEGORIES[className].forEach(e=>{
              this.config.METRICS_ORDER.pop(e)
            })
          }else if ((className=='Deep-Learning' || className=='Statistics-Learning' || className=='Machine-Learning')&&checked)
          {
            this.config.MODEL_TYPES_LIST[className].forEach(e=>{
              if (!this.config.DATASETS_ORDER.includes(e))
              {
                this._change_list(this.config.DATASETS_ORDER,e,checked)
              }
            })
          }else if ((className=='Deep-Learning' || className=='Statistics-Learning' || className=='Machine-Learning')&&!checked)
          {
            this.config.MODEL_TYPES_LIST[className].forEach(e=>{
              this.config.METRICS_ORDER.pop(e)
            })
          }

        }else{
          className = id.split('/')[0]
          itemName = id.split('/')[1]
  
          if (className=='Metrics')
          {
            list = this.config.METRICS_ORDER
            item = itemName
          }
          else if(className=='Deep-Learning')
          {
            list = this.config.METHODS_ORDER
            item = itemName
          }
          else if(className=='Statistics-Learning')
          {
            list = this.config.METHODS_ORDER
            item = itemName
          }
          else if(className=='Machine-Learning')
          {
            list = this.config.METHODS_ORDER
            item = itemName
          }else
          {
            list = this.config.DATASETS_ORDER
            item = itemName
          }
          list = this._change_list(list,item,checked)
        }
    },
    _bindEventListeners() {
      if (!this.elements.mainContainer) return;
  
      // --- 主事件监听器 (处理点击和变更) ---
      this.elements.mainContainer.addEventListener('click', (event) => {
          const target = event.target;
  
          // Case 1: 点击 "all", "off", "profile1" 链接
          if (target.tagName === 'A' && target.closest('b')) {

              event.preventDefault();
              const parentH3 = target.closest('h3');
              if (!parentH3) return;
  
              const text = target.textContent;
              const isChecked = (text === 'all' || text === 'profile1');
              
              if (parentH3.textContent.includes('Metrics')) 
              {this.toggleCategory('Metrics', isChecked);
            this.config.METRICS_ORDER=[]}
              else if (parentH3.textContent.includes('Datasets')) {
                this.config.DATASETS_ORDER=[]
                  if (text === 'profile1') this.p1(true);
                  else this.toggleSelectAll(isChecked);
              }
              else if (parentH3.textContent.includes('Methods')) 
            {this.toggleCategory('Methods', isChecked);
            this.config.METHODS_ORDER=[]}
              
              // this.updateLeaderboard();
              this.debouncedUpdate()
          }
      });
  
      this.elements.mainContainer.addEventListener('change', (event) => {
        const target = event.target;
        this._order_list(target.id,target.checked)
        if (target.id === 'rank-display-count') {
          this._renderTable(this.state.lastResults, true);
          return;
        }
  
        if (target.type !== 'checkbox' && target.type !== 'radio') return;
        
        if (target.id.startsWith('select-all-')) {
          const category = target.id.replace('select-all-', '');
          this.toggleCategory(category, target.checked);
          if (category=='Characteristics' && target.checked)
          {
            this.toggleCategoryDataset("Characteristics", true,true, false);
            this.toggleCategoryDataset("Frequency", true,false, true);
          }else if(category=='Frequency' && target.checked)
          {
            this.toggleCategoryDataset("Frequency", true,true, false);
            this.toggleCategoryDataset("Characteristics", true,false, true);
          }
        }
        else if (target.className.startsWith('checkbox-')) {
          const category = target.className.split('-')[1];
          this._updateParentCheckboxState(category);
        }
        // this.updateLeaderboard();
        this.debouncedUpdate();
      });
      
      this.elements.mainContainer.addEventListener('input', (event) => {
          if (event.target.type === 'number') {
              this._validateScoreInput(event.target);
              // this.updateLeaderboard();
              this.debouncedUpdate();
          }
      });
    },  
    _setInitialState() {
      // this.toggleSelectAll(true);
      this.toggleCategory('Metrics', true);
      this.toggleCategoryDataset("Frequency", true,true, false);
      this.toggleCategoryDataset("Characteristics", true,false, true);
      this.toggleCategory('Settings', true);
      this.toggleCategory('Methods', true);
    },
  
    updateLeaderboard() {
        
        // if (!this.state.isReady || this.state.isLoading) return;
        const selections = this._getSelections();
        if (!selections || selections.datasets.length === 0 || selections.metrics.length === 0 || selections.methods.length === 0) {
            this._renderEmptyTable(); // 清空表格
            return;
        }
        this.state.isLoading = true;
        if (gridApi) { gridApi.showLoadingOverlay(); }
        // this._showLoadingOverlay();


        fetch(this.config.API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "datasets": selections.datasets,
                "metrics":  selections.metrics,
                "models": selections.methods,
            })
        })
        .then(response => { if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`); return response.json(); })
        .then(data => this._processApiResponse(data)) // 修改点
        .catch(error => { console.error('API request failed:', error); this._renderEmptyTable(); })
        .finally(() => {
          this.state.isLoading = false;
          // if (gridApi) { gridApi.hideLoadingOverlay(); }
            
            // this._hideLoadingOverlay();
        });
    },
    
    // <-- 新增: 防抖辅助函数
    _debounce(func, delay) {
      let timeoutId;
      // 返回一个新的函数
      return (...args) => {
          // 如果已经有一个计时器在运行，就清除它
          clearTimeout(timeoutId);
          // 设置一个新的计时器
          timeoutId = setTimeout(() => {
              // 当计时器结束时，执行原始函数
              func.apply(this, args);
          }, delay);
      };
  },
    // !! 核心改造点 1: 修改 _processApiResponse
    _processApiResponse(rawData) {
      
    if (!gridApi) return;
    // 使用 AG-Grid 的函数来生成列和行
    const newColumnDefs = this.generateColumnDefs(rawData);
    const newRowData = this.generateRowData(rawData);

    // 使用 AG-Grid API 来更新表格
    gridApi.setGridOption('columnDefs', newColumnDefs);
    gridApi.setGridOption('rowData', newRowData);
    },
  
    _getSelections() {
        const getCheckedValues = (selector) => Array.from(document.querySelectorAll(selector)).filter(cb => cb.checked&&!cb.disabled).map(cb => cb.value.split('/')[1]);
        var datasets = getCheckedValues('.checkbox-container2 input[type="checkbox"]:not([id^="select-all-"])', cb => cb.value.replace('-','_')).filter(Boolean).map(e => e.replace(/-/g, '_'));
        
       
        datasets = datasets.map(e=>{
            
          if(e.includes('w_o_'))
            {
              e = e.replace('w_o_','') + "_False"
            }
          else if(e.includes('w_'))
            {
              e = e.replace('w_','') + "_True"
            }else{
              e = 'freq_'+e
            }
            return e 
        })
  
        var metrics = getCheckedValues('.checkbox-Metrics', cb => cb.value).map(e => e.replace(/-/g, '_'));
        var methods = [...getCheckedValues('.checkbox-Deep-Learning', cb => cb.value), ...getCheckedValues('.checkbox-Statistics-Learning', cb => cb.value), ...getCheckedValues('.checkbox-Machine-Learning', cb => cb.value)].filter(Boolean).map(e => e.replace(/-/g, '_'))
        
        
        return { datasets, metrics, methods };
    },
  
    _renderEmptyTable() {
        if (gridApi) {
            gridApi.setGridOption('rowData', []); // 清空行数据
            gridApi.setGridOption('columnDefs', []); // 清空列定义
        }
    },
  
    _populateCheckboxes() {   

      if (!this.elements.metricsContainer || !this.elements.datasetsContainer || !this.elements.methodsContainer) return;
      
      category = 'Metrics'
      this.config.METRICS_LIST.forEach(name => this.elements.metricsContainer.appendChild(this._createCheckboxItem(`${category}/${name}`, name, `checkbox-${category}`)));
      // category = 'Methods'

      
        const groupedModels = Object.entries(this.config.MODELS_LIST).reduce((acc, [modelName, details]) => {
          // 'acc' (accumulator) 是我们正在构建的对象，初始值是 {}
          // '[modelName, details]' 是当前遍历到的键值对

          let category = details.paradigm;
          if (category == 'ML')
          {
            category = 'Machine Learning'
          }else if(category == 'SL')
          {
            category = 'Statistics Learning'
          }else if(category == 'DL')
          {
            category = 'Deep Learning'
          }

          // 获取该分类已有的数组，如果不存在则创建一个空数组
          const existingGroup = acc[category] || [];

          // 将当前模型名称加入数组，并更新累加器
          acc[category] = [...existingGroup, modelName];
          
          return acc; // 每次迭代都必须返回累加器
        }, {});

        
      Object.keys(groupedModels).forEach(category => {
        const categoryDiv = this._createCategoryElement(category);
        var categoryDivInner
        if (category=="Deep Learning"){
          categoryDivInner = this._createCategoryElement_inner(category,'category_inner_grid1')
        }
        else{
          categoryDivInner = this._createCategoryElement_inner(category,'category_inner_grid')
        }
        groupedModels[category].forEach(name => categoryDivInner.appendChild(this._createCheckboxItem(`${category}/${name}`, name, `checkbox-${category}`)));
        categoryDiv.appendChild(categoryDivInner)
        this.elements.methodsContainer.appendChild(categoryDiv);
      });

      
      // this.config.MODELS_LIST.forEach(name => this.elements.methodsContainer.appendChild(this._createCheckboxItem(`${category}/${name}`, name, `checkbox-${category}`)));
      Object.entries(this.config.DATASET_CATEGORIES).forEach(([category, datasets]) => {
        const categoryDiv = this._createCategoryElement(category);
        var categoryDivInner
        categoryDivInner = this._createCategoryElement_inner(category,'category_inner_grid')

        datasets.forEach(name => categoryDivInner.appendChild(this._createCheckboxItem(`${category}/${name.replace('_', '-')}`, name.replace('_', '-'), `checkbox-${category}`)));
        categoryDiv.appendChild(categoryDivInner)
        this.elements.datasetsContainer.appendChild(categoryDiv);
      });
    },
    
    _createCategoryElement(category) {
        var categoryClass = category.replace(' ','-')
        var categoryName = category

        const div = document.createElement('div');
        div.className = 'category';
        div.innerHTML = `<h3><input type="checkbox" id="select-all-${categoryClass}">${categoryName}</h3>`;
        return div;
    },

    _createCategoryElement1(category,name) {
      var categoryClass = category.replace(' ','-')
      var categoryName = category

      const div = document.createElement('div');
      div.className = name;
      div.innerHTML = `<h3><input type="checkbox" id="select-all-${categoryClass}">${categoryName}</h3>`;
      return div;
  },
    _createCategoryElement_inner(category, className) {
      const div = document.createElement('div');
      div.className = className;
      // div.innerHTML = `<h3><input type="checkbox" id="select-all-${category}">${category}</h3>`;
      return div;
  },
  
    _createCheckboxItem(id, label, className) {
        id = id.replace(' ', '-')
        className = className.replace(' ', '-')
        label = label.replace('w-o','w/o')
        const div = document.createElement('div');
        div.className = 'checkbox-item';
        div.innerHTML = `<input type="checkbox" id="${id}" value="${id}" class="${className}"><label for="${id}" >${label}</label>`;
        return div;
    },
    
    toggleCategory(category, isChecked) {
      if (category === 'Methods') {
        ['Deep-Learning','Statistics-Learning','Machine-Learning'].forEach(cat => this._setCategoryChecked(cat, isChecked));
      } else {
          this._setCategoryChecked(category, isChecked);
      }
    },
    toggleCategoryDataset(category, isChecked,parentChecked,isDisable) {

      const parentCb = document.getElementById(`select-all-${category}`);
      if(parentCb) parentCb.checked = parentChecked;
    
    
    
    document.querySelectorAll(`.checkbox-${category}`).forEach(cb => {cb.checked = isChecked
      cb.disabled = isDisable;
      });
  },
    _setCategoryChecked(category, isChecked){
        const parentCb = document.getElementById(`select-all-${category}`);
        if(parentCb) parentCb.checked = isChecked;
        document.querySelectorAll(`.checkbox-${category}`).forEach(cb => cb.checked = isChecked);
    },
  
    _updateParentCheckboxState(category) {
      const childCheckboxes = document.querySelectorAll(`.checkbox-${category}`);
      if (childCheckboxes.length === 0) return;
  
      const allChecked = Array.from(childCheckboxes).every(cb => cb.checked);
      const parentCheckbox = document.getElementById(`select-all-${category}`);
      if (parentCheckbox) {
        parentCheckbox.checked = allChecked;
      }
    },
  
    toggleSelectAll(isChecked) {
      const mainSelectAll = document.getElementById('select-all');
      if (mainSelectAll) mainSelectAll.checked = isChecked;
      Object.keys(this.config.DATASET_CATEGORIES).forEach(category => this.toggleCategory(category, isChecked));
    },
  
    p1(isChecked) {
      this.toggleSelectAll(false);
      if (!isChecked) return;
      ['Traffic/Traffic', 'Energy/Solar', 'Health/ILI', 'Environment/Weather', 'Economic/Exchange'].forEach(id => {
        const el = document.getElementById(id);
        if(el) { el.checked = true; this._updateParentCheckboxState(id.split('/')[0]); }
      });
      this.toggleCategory('Electricity', true);
    },
    
    _validateScoreInput(inputElement) {
      inputElement.value = inputElement.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    },
  
    _showLoadingOverlay() {
      if (this.elements.loadingOverlay) {
        this.elements.loadingOverlay.classList.add('is-active');
      }
    },
    _initCollapsibles() {
      const headers = document.querySelectorAll('.collapsible-header');
      headers.forEach(header => {
        const content = header.nextElementSibling;
        if (content) {
          // 为内容区域添加 class 以便 CSS 选择
          content.classList.add('collapsible-content');
          
          // --- 核心改动在这里 ---
          // 1. 默认给标题加上 'is-collapsed' 类，让箭头旋转
          header.classList.add('is-collapsed');
          // 2. 默认将内容区域的高度设为 0，实现折叠效果
          content.style.maxHeight = content.scrollHeight + "px"; 
  
          header.addEventListener('click', (event) => {
            // 确保点击链接不会触发折叠
            if (event.target.tagName === 'A') {
              return;
            }
  
            header.classList.toggle('is-collapsed');
            
            if (header.classList.contains('is-collapsed')) {
              content.style.maxHeight = '0'; // 折叠
            } else {
              // 展开时需要动态获取内容的实际高度
              content.style.maxHeight = content.scrollHeight + "px"; 
            }
          });
        }
      });
    },
    _hideLoadingOverlay() {
      if (this.elements.loadingOverlay) {
        this.elements.loadingOverlay.classList.remove('is-active');
      }
    }
  };
  

  function start()
  {
    const gridDiv = document.querySelector('#myGrid');
globalButton =  document.querySelector('#globalButton');

    globalButton.addEventListener('click', (event) => {
      // gridDiv.className='ag-theme-alpine .grid-fullscreen'
      if (gridDiv.requestFullscreen) {
        gridDiv.requestFullscreen();
        } else if (gridDiv.webkitRequestFullscreen) { /* Safari, Chrome, Opera */
        gridDiv.webkitRequestFullscreen();
        } else if (gridDiv.msRequestFullscreen) { /* IE11 */
        gridDiv.msRequestFullscreen();
        }
    })
      
    // 1. 初始化一个空的 AG-Grid
    const gridOptions = {
        columnDefs: [],
        rowData: [],
        defaultColDef: {
            sortable: false,
            filter: false,
            resizable: false
        },
        // <-- 可选：添加自定义加载文本
        overlayLoadingTemplate: '<div class="loading-overlay"> <div class="loading-spinner"></div> <p>Loading Data...</p> </div>',
        suppressRowTransform: true,
        onGridReady: (params) => {
            gridApi = params.api;
            
            // 2. Grid 准备好之后，启动 LeaderboardApp
            // LeaderboardApp 会自动获取数据并填充表格
            LeaderboardApp.init();
        }
    };

    // 创建 Grid 实例
    agGrid.createGrid(gridDiv, gridOptions);
  }