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
        API_URL: 'https://www.opents.top/outlier/uni/query',
        API_MULTI: 'https://www.opents.top/outlier/multi/query',
        API_UNI: 'https://www.opents.top/outlier/uni/query',
        // MODELS_LIST: ["DUET", "Amplifier", "PatchMLP", "xPatch", "TimeKAN", "PatchTST", "Crossformer", "FEDformer", "Informer", "Triformer", "DLinear", "NLinear", 
        // "MICN", "TimesNet", "TCN", "FiLM", "RNN", "Linear Regression", "VAR", "iTransformer", "FITS", "TimeMixer", "Pathformer", "PDF", "Non-stationary Transformer"],
        // MODEL_TYPES_LIST:{"TS-Pretrain":["Chronos","MOIRAI","Moment","ROSE",'TimesFM',"Timer","TTM","UniTS"], "LLM-Based":["CALF","GPT4TS","LLMMixer","S2IPLLM","TimeLLM","UniTime"], "Specific":["PatchTST","Dlinear","FedFormer","FITS","TimeMixer","TimesNet","iTransformer"]},
        // DATASET_CATEGORIES: {"Electricity": ["ETTh1", "ETTh2", "ETTm1", "ETTm2", "Electricity"], "Traffic": ["Traffic", "PEMS-BAY", "METR-LA", "PEMS04", "PEMS08"], "Environment": ["Weather", "AQShunyi", "AQWan"], "Economic": ["Exchange", "FRED-MD"], "Health": ["ILI", "Covid-19"], "Energy": ["Solar", "Wind"], "Nature": ["ZafNoo", "CzeLan"], "Stock": ["NASDAQ", "NYSE"], "Banking": ["NN5"], "Web": ["Wike2000"] },
        // METRICS_LIST: ['MAE', 'MSE'],
        SETTINGS_LIST:['Zero-shot', 'Few-shot', 'Full-shot'],
        MODEL_TYPES_LIST:{"Non-Learning":["LOF","CBLOF","HBOS"],
        "Machine-Learning":["OCSVM","DP","KNN","KMeans","IF","EIF","LODA","PCA"], 
        "Foundation-Model":["CALF","Chronos","GPT4TS","LLMMixer","MOIRAI","Moment","ROSE","S2IPLLM","TimeLLM","TimeMixer",'TimesFM',"TTM","UniTS","UniTime","Timer","Dada"], 
        "Deep-Learning":["DAGMM","Torsk","iTransformer","TimesNet","DUET","ATrans","PatchTST","ModernTCN","TranAD","DualTF","AE","VAE","NLinear","DLinear","LSTMED","DCdetector","ContraAD","CATCH"  ],
        },
        DATASET_CATEGORIES: {
          "Univariate": ["KDD21", "YAHOO","NAB","ECG","SVDB","MSL","SMAP","Daphnet", "OPP","Genesis","GHL","GAIA","IOPS","MGAB","SMD"],
          "Multivariate":["CICIDS","KDDcup99","PSM","SMD","DLR","ECG","LTDB","MITDB","SVDB","GECCO","PUMP","SWAT","CATSv2","GHL","Genesis","SKAB","Daphnet","OPP","TAO","ASD","Exathlon","Credit","SWAN","NYC","CalIt2","GutenTAG","TODS","MSL","SMAP"],
        },
        METRICS_LIST: {"Label":["Acc","P","R","F1","R-P","R-R","R-F1","Aff-P","Aff-F1","Aff-R",],"Score":["A-P","A-R","R-A-P","R-A-R", "V-PR","V-ROC "]},
        MODELS_INFO:{},
        METRICS_ORDER:[],
        DATASETS_ORDER:[],
        METHODS_ORDER:[], 
        SETTINGS_ORDER:[],
    },
    state: { isReady: false, isLoading: false },
    elements: {},

    async  init() {
        await this._loadJSON();
        this._cacheElements();
        this._initCollapsibles();
        this.debouncedUpdate = this._debounce(this.updateLeaderboard, 400);
        this._bindEventListeners();
        this._populateCheckboxes();
        this._setInitialState();
        this.state.isReady = true;
        this.updateLeaderboard();
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
    async _loadJSON()
  {
    const response = await fetch('../../../leaderboards/detection/paper.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    this.config.MODELS_INFO = await response.json();
    this.config.METHODS_ORDER = Object.values(this.config.MODEL_TYPES_LIST).flat().sort()
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
    },// --- AG-Grid 的辅助函数 (来自新页面，保持不变) ---
    generateColumnDefs(data) {
      
        if (!data || data.length === 0) return []; // 处理空数据情况
        const methodMetricMap = new Map();
        data.forEach(item => {
          item.method = item.method.replaceAll(' (label)','').replaceAll(' (score)','')
          item.method = item.method+' ('+item.value+')'
    
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
            suppressMovable: true ,
            // 直接使用我们预先计算好的值
            rowSpan: params => params.data.datasetRowSpan,
            cellClass: 'dataset-cell',
            sortable: false,
            filter: false
        }    ];

        const allMethods = Array.from(methodMetricMap.keys()).sort((a, b) => {
          // findIndex 会返回后缀在 order 数组中的索引 (0, 1, 2)
          // 如果找不到，会返回 -1，可以利用它将不匹配的项排在最后
          var indexA = this.config.METHODS_ORDER.findIndex(suffix => a.startsWith(suffix));
          var indexB = this.config.METHODS_ORDER.findIndex(suffix => b.startsWith(suffix));
          if (indexA==indexB)
          {
            var indexA = this.config.SETTINGS_ORDER.findIndex(suffix => a.toLowerCase().includes(suffix.replace('-shot','').toLowerCase()));
            var indexB = this.config.SETTINGS_ORDER.findIndex(suffix => b.toLowerCase().includes(suffix.replace('-shot','').toLowerCase()));
          }
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
                    suppressMovable: true ,
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
    generateRowData(data) {
      if (!data || data.length === 0) return [];
      const dataMap = new Map();
      data.forEach(item => {
          // var { dataset, value, method, metric} = item;
          dataset = item.dataset
          value = item.horizon
          method = item.method
          metric = item.metric
          horizon=1
          method = method.replaceAll(' (label)','').replaceAll(' (score)','')
          method = method
    
          const compositeKey = `${dataset}`;
          if (!dataMap.has(compositeKey)) {
              dataMap.set(compositeKey, {dataset});
          }
          const row = dataMap.get(compositeKey);
          
          const dynamicColumnName = `${method}_${metric}`;
          row[dynamicColumnName] = value;
      });
    
      const pivotedData = Array.from(dataMap.values());
      pivotedData.sort((a, b) => {
        const indexA = this.config.DATASETS_ORDER.indexOf(a.dataset);
        const indexB = this.config.DATASETS_ORDER.indexOf(b.dataset);
  
        // 如果 dataset 在 order 列表中找不到，则将它们放到列表的末尾
        const effectiveIndexA = indexA === -1 ? Infinity : indexA;
        const effectiveIndexB = indexB === -1 ? Infinity : indexB;
        
        const datasetCompare = effectiveIndexA - effectiveIndexB;
        // 如果 dataset 顺序相同（或都不在 order 列表中），则按 horizon 排序
        return datasetCompare
    });
      return pivotedData;
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
          if ((className=='Label'||className=='Score')&&checked)
          {
            this.config.METRICS_LIST[className].forEach(e=>{
              if (!this.config.METRICS_ORDER.includes(e))
              {
                this._change_list(this.config.METRICS_ORDER,e,checked)
              }
            })
          }else if ((className=='Label'||className=='Score')&&!checked)
          {
            this.config.METRICS_LIST[className].forEach(e=>{
              this.config.METRICS_ORDER.pop(e)
            })
          }else if ((className=='Non-Learning'||className=='Machine-Learning'||className=='Foundation-Model'||className=='Deep-Learning')&&checked)
          {
            
            this.config.MODEL_TYPES_LIST[className].forEach(e=>{
              if (!this.config.METHODS_ORDER.includes(e))
              {
                this._change_list(this.config.METHODS_ORDER,e,checked)
              }
            })
          }else if ((className=='Non-Learning'||className=='Machine-Learning'||className=='Foundation-Model'||className=='Deep-Learning')&&!checked)
          {
            
            this.config.MODEL_TYPES_LIST[className].forEach(e=>{
              this.config.METHODS_ORDER.pop(e)
            })
          } else {

            if (checked)
            {
              this.config.DATASET_CATEGORIES[className].forEach(e=>{
                if (!this.config.DATASETS_ORDER.includes(e))
              {
                this._change_list(this.config.DATASETS_ORDER, e, checked)
              }
              })
            }else{
              this.config.DATASET_CATEGORIES[className].forEach(e=>{
                this.config.METRICS_ORDER.pop(e)
              })
            }

          }

        }else{
          className = id.split('/')[0]
          itemName = id.split('/')[1]
  
          if (className=='Label'||className=='Score')
          {
            list = this.config.METRICS_ORDER
            item = itemName
          }else if(className=='Non-Learning'||className=='Machine-Learning'||className=='Foundation-Model'||className=='Deep-Learning')
          {className.replace(' ','-')
            list = this.config.METHODS_ORDER
            item = itemName
          }else if(className=='Settings')
          {
            list = this.config.SETTINGS_ORDER
            item = itemName
          }
          else
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
              
              if (parentH3.textContent.includes('Metrics')){ 
                this.config.METRICS_ORDER=[]
                this.toggleCategory('Metrics', isChecked);
                }
              else if (parentH3.textContent.includes('Datasets')) {
                this.config.DATASETS_ORDER=[]
                  if (text === 'profile1') this.p1(true);
                  else this.toggleSelectAll(isChecked);
              }
              else if (parentH3.textContent.includes('Methods')) 
              { 
                if (isChecked)
                {this.config.METHODS_ORDER = Object.values(this.config.MODEL_TYPES_LIST).flat().sort();}
                else
                {
                  this.config.METHODS_ORDER = []
                }

                this.toggleCategory('Methods', isChecked);
              }
              else if (parentH3.textContent.includes('Settings')) 
              { 
                this.config.SETTINGS_ORDER=[]
                this.toggleCategory('Settings', isChecked);
              }
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
          if (category=='Univariate' && target.checked)
          {
            this.config.DATASETS_ORDER = this.config.DATASET_CATEGORIES['Univariate'].sort()
            this.config.API_URL=this.config.API_UNI
            this.toggleCategoryDataset("Univariate", true,true, false);
            this.toggleCategoryDataset("Multivariate", true,false, true);
          }else if(category=='Multivariate' && target.checked)
          {
            this.config.DATASETS_ORDER = this.config.DATASET_CATEGORIES['Multivariate'].sort()
            this.config.API_URL=this.config.API_MULTI
            this.toggleCategoryDataset("Multivariate", true,true, false);
            this.toggleCategoryDataset("Univariate", true,false, true);
          }else if(!target.checked)
          {
            this.config.DATASETS_ORDER = []
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
      this.toggleCategoryDataset("Univariate", true,true, false);
      this.toggleCategoryDataset("Multivariate", true,false, true);
      this.toggleCategory('Metrics', true);
      this.toggleCategory('Settings', true);
      this.toggleCategory('Label', true);
      this.toggleCategory('Score', true);
      this.toggleCategory('Methods', true);
    },
  
    updateLeaderboard() {
        
        // if (!this.state.isReady || this.state.isLoading) return;
        const selections = this._getSelections();
        if (!selections || selections.uniDatasets.length + selections.multiDatasets.length=== 0 || selections.metrics.length === 0 || selections.methods.length === 0 || selections.settings.length === 0) {
            this._renderEmptyTable(); // 清空表格
            return;
        }
        this.state.isLoading = true;
        if (gridApi) { gridApi.showLoadingOverlay(); }
        // this._showLoadingOverlay();


        if (selections.uniDatasets.length>0){
          selections.datasets = selections.uniDatasets
        }else{
          selections.datasets = selections.multiDatasets
        }
        fetch(this.config.API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "datasets": selections.datasets,
                "metrics":  selections.metrics,
                "models": selections.methods,
                "settings": selections.settings
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
        var uniDatasets = getCheckedValues('.checkbox-Univariate', cb => cb.value).filter(Boolean);
        var multiDatasets = getCheckedValues('.checkbox-Multivariate', cb => cb.value).filter(Boolean);
        var metrics = [...getCheckedValues('.checkbox-Label', cb => cb.value), ...getCheckedValues('.checkbox-Score', cb => cb.value)].filter(Boolean);
        var settings = getCheckedValues('.checkbox-Settings', cb => cb.value).filter(Boolean).map(e => e.replaceAll('-shot', ''));
        var methods = [...getCheckedValues('.checkbox-Non-Learning', cb => cb.value), ...getCheckedValues('.checkbox-Machine-Learning', cb => cb.value), ...getCheckedValues('.checkbox-Foundation-Model', cb => cb.value), ...getCheckedValues('.checkbox-Deep-Learning', cb => cb.value)].filter(Boolean).map(e => e.replace(/-/g, '_'));
        return { uniDatasets, multiDatasets, metrics, methods, settings };
    },
  
    _renderEmptyTable() {
        if (gridApi) {
            gridApi.setGridOption('rowData', []); // 清空行数据
            gridApi.setGridOption('columnDefs', []); // 清空列定义
        }
    },
  
    _populateCheckboxes() {   

      if (!this.elements.metricsContainer || !this.elements.datasetsContainer || !this.elements.settingsContainer || !this.elements.methodsContainer) return;
      
      category = 'Metrics'
      Object.keys(this.config.METRICS_LIST).forEach(category => {
        const categoryDiv = this._createCategoryElement(category);
        const categoryDivInner = this._createCategoryElement_inner(category,'category_inner_grid')
        this.config.METRICS_LIST[category].forEach(name => categoryDivInner.appendChild(this._createCheckboxItem(`${category}/${name}`, name, `checkbox-${category}`)));
        categoryDiv.appendChild(categoryDivInner)
        this.elements.metricsContainer.appendChild(categoryDiv);
      });



      category = 'Settings'
      this.config.SETTINGS_LIST.forEach(name => this.elements.settingsContainer.appendChild(this._createCheckboxItem(`${category}/${name}`, name, `checkbox-${category}`)));
      // category = 'Methods'
      Object.keys(this.config.MODEL_TYPES_LIST).forEach(category => {
        const categoryDiv = this._createCategoryElement(category);
        const categoryDivInner = this._createCategoryElement_inner(category,'category_inner_grid')
        this.config.MODEL_TYPES_LIST[category].forEach(name => categoryDivInner.appendChild(this._createCheckboxItem(`${category}/${name}`, name, `checkbox-${category}`)));
        categoryDiv.appendChild(categoryDivInner)
        this.elements.methodsContainer.appendChild(categoryDiv);
      });

      
      // this.config.MODELS_LIST.forEach(name => this.elements.methodsContainer.appendChild(this._createCheckboxItem(`${category}/${name}`, name, `checkbox-${category}`)));
      Object.entries(this.config.DATASET_CATEGORIES).forEach(([category, datasets]) => {
        category = category.replace(' ', '-')
        const categoryDiv = this._createCategoryElement(category);
        const categoryDivInner = this._createCategoryElement_inner(category,'category_inner_grid')
        datasets.sort().forEach(name => categoryDivInner.appendChild(this._createCheckboxItem(`${category}/${name.replace('_', '-').replace(' ', '-')}`, name.replace('_', '-'), `checkbox-${category}`)));
        categoryDiv.appendChild(categoryDivInner)
        this.elements.datasetsContainer.appendChild(categoryDiv);
      });
    },
    
    _createCategoryElement(category) {
        var categoryClass = category
        var categoryName = category.replace('-',' ')

        const div = document.createElement('div');
        div.className = 'category';
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
        const div = document.createElement('div');
        div.className = 'checkbox-item';
        div.innerHTML = `<input type="checkbox" id="${id}" value="${id}" class="${className}"><label for="${id}" >${label}</label>`;
        return div;
    },
    toggleCategoryDataset(category, isChecked,parentChecked,isDisable) {

      const parentCb = document.getElementById(`select-all-${category}`);
      if(parentCb) parentCb.checked = parentChecked;
    
    
    
    document.querySelectorAll(`.checkbox-${category}`).forEach(cb => {cb.checked = isChecked
      cb.disabled = isDisable;
      });
  },
    toggleCategory(category, isChecked) {
      category = category.replace(' ','-')

      if (category === 'Methods') {
        Object.keys(this.config.MODEL_TYPES_LIST).forEach(cat => this._setCategoryChecked(cat, isChecked));
      } else if (category === 'Metrics') {
        Object.keys(this.config.METRICS_LIST).forEach(cat => this._setCategoryChecked(cat, isChecked));
      } 
      else {
          this._setCategoryChecked(category, isChecked);
      }
    },
    
    _setCategoryChecked(category, isChecked){
        category = category.replace(' ','-')
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
  

  async function start()
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