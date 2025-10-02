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

// --- AG-Grid 的辅助函数 (来自新页面，保持不变) ---
function generateColumnDefs(data) {
  
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
    const order = ['(full)', '(few)', '(zero)'];
    const allMethods = Array.from(methodMetricMap.keys()).sort((a, b) => {
      // findIndex 会返回后缀在 order 数组中的索引 (0, 1, 2)
      // 如果找不到，会返回 -1，可以利用它将不匹配的项排在最后
      const indexA = order.findIndex(suffix => a.endsWith(suffix));
      const indexB = order.findIndex(suffix => b.endsWith(suffix));

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
        children: Array.from(methodMetricMap.get(method)).map((metric, index, arr) => {
            
            const colDef = {
                headerName: metric.toUpperCase(),
                field: `${method}_${metric}`,
                suppressMovable: true ,
                width: 150,
                valueFormatter: params => params.value ? parseFloat(params.value).toFixed(3) : 'NaN'
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
}

// 这是修改后的 generateRowData 函数
function generateRowData(data) {
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
  
  // // 1. 必须先按 dataset 排序，这是计算 rowSpan 的基础
  // pivotedData.sort((a, b) => {
  //     const datasetCompare = a.dataset.localeCompare(b.dataset);
  //     if (datasetCompare !== 0) return datasetCompare;
  //     return a.horizon - b.horizon;
  // });

  // // 2. 预先计算 RowSpan
  // for (let i = 0; i < pivotedData.length; i++) {
  //     const currentRow = pivotedData[i];
  //     // 检查是否是新的 dataset 分组的开始
  //     if (i === 0 || currentRow.dataset !== pivotedData[i - 1].dataset) {
  //         let span = 1;
  //         // 向后查找所有属于同一个 dataset 的行
  //         for (let j = i + 1; j < pivotedData.length; j++) {
  //             if (pivotedData[j].dataset === currentRow.dataset) {
  //                 span++;
  //             } else {
  //                 break; // 遇到不同 dataset，停止查找
  //             }
  //         }
  //         // 将计算好的 span 值存入该分组的第一行数据中
  //         currentRow.datasetRowSpan = span;
  //     } else {
  //         // 同一个分组内的其他行，span 设为 0 (AG-Grid 会自动处理)
  //         currentRow.datasetRowSpan = 0;
  //     }
  // }
  
  return pivotedData;
}
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
        API_URL: 'https://www.opents.top/outlier/multi/query',
        // MODELS_LIST: ["DUET", "Amplifier", "PatchMLP", "xPatch", "TimeKAN", "PatchTST", "Crossformer", "FEDformer", "Informer", "Triformer", "DLinear", "NLinear", 
        // "MICN", "TimesNet", "TCN", "FiLM", "RNN", "Linear Regression", "VAR", "iTransformer", "FITS", "TimeMixer", "Pathformer", "PDF", "Non-stationary Transformer"],
        // MODEL_TYPES_LIST:{"TS-Pretrain":["Chronos","MOIRAI","Moment","ROSE",'TimesFM',"Timer","TTMs","UniTS"], "LLM-Based":["AutoTimes","CALF","GPT4TS","LLMMixer","S2IPLLM","TimeLLM","UniTime"], "Specific":["PatchTST","Dlinear","FedFormer","FITS","TimeMixer","TimesNet","iTransformer"]},
        // DATASET_CATEGORIES: {"Electricity": ["ETTh1", "ETTh2", "ETTm1", "ETTm2", "Electricity"], "Traffic": ["Traffic", "PEMS-BAY", "METR-LA", "PEMS04", "PEMS08"], "Environment": ["Weather", "AQShunyi", "AQWan"], "Economic": ["Exchange", "FRED-MD"], "Health": ["ILI", "Covid-19"], "Energy": ["Solar", "Wind"], "Nature": ["ZafNoo", "CzeLan"], "Stock": ["NASDAQ", "NYSE"], "Banking": ["NN5"], "Web": ["Wike2000"] },
        // METRICS_LIST: ['MAE', 'MSE'],
        SETTINGS_LIST:['Zero-shot', 'Few-shot', 'Full-shot'],
        MODEL_TYPES_LIST:{"Non-Learning":["LOF","CBLOF","HBOS"],
        "Machine-Learning":["OCSVM","DP","KNN","KMeans","IF","EIF","LODA","PCA"], 
        "Foundation-Model":["AutoTimes","CALF","Chronos","GPT4TS","LLMMixer","MOIRAI","Moment","ROSE","S2IPLLM","TimeLLM","TimeMixer",'TimesFM',"TTMs","UniTS","UniTime","Timer","Dada"], 
        "Deep-Learning":["DAGMM","Torsk","iTransformer","TimesNet","DUET","ATrans","PatchTST","ModernTCN","TranAD","DualTF","AE","VAE","NLinear","DLinear","LSTMED","DCdetector","ContraAD","CATCH"  ],
      },
        DATASET_CATEGORIES: {"Health":["DLR","ECG","LTDB","MITDB","SVDB"],"Machinery":["CATSv2","GHL","Genesis","SKAB"],"Web":["CICIDS","KDDcup99"],"Water Treatment":["GECCO","PUMP","SWAT"],"Server Machine":["PSM","SMD"],"Movement":["Daphnet","OPP"],"Climate":["TAO"],"Finance":["Credit"],"Application Server":["ASD","Exathlon"],"Space Weather":["SWAN"],"Synthetic":["GutenTAG","TODS"],"Spacecraft":["MSL","SMAP"],"Transport":["NYC"],"Visitor Flowrate":["CalIt2"]},
        METRICS_LIST: {"Label":["Acc","P","R","F1","R-P","R-R","R-F1","Aff-P","Aff-F1","Aff-R",],"Score":["A-P","A-R","R-A-P","R-A-R", "V-PR","V-ROC "]},
        MODELS_INFO:{}
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
              
              if (parentH3.textContent.includes('Metrics')) this.toggleCategory('Metrics', isChecked);
              else if (parentH3.textContent.includes('Datasets')) {
                  if (text === 'profile1') this.p1(true);
                  else this.toggleSelectAll(isChecked);
              }
              else if (parentH3.textContent.includes('Methods')) this.toggleCategory('Methods', isChecked);
              else if (parentH3.textContent.includes('Settings')) this.toggleCategory('Settings', isChecked);
              // this.updateLeaderboard();
              this.debouncedUpdate()
          }
      });
  
      this.elements.mainContainer.addEventListener('change', (event) => {
        const target = event.target;
        
        if (target.id === 'rank-display-count') {
          this._renderTable(this.state.lastResults, true);
          return;
        }
  
        if (target.type !== 'checkbox' && target.type !== 'radio') return;
        
        if (target.id.startsWith('select-all-')) {
          const category = target.id.replace('select-all-', '');
          this.toggleCategory(category, target.checked);
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
      this.toggleSelectAll(true);
      this.toggleCategory('Metrics', true);
      this.toggleCategory('Settings', true);
      this.toggleCategory('Label', true);
      this.toggleCategory('Score', true);
      this.toggleCategory('Methods', true);
    },
  
    updateLeaderboard() {
        
        // if (!this.state.isReady || this.state.isLoading) return;
        const selections = this._getSelections();
        if (!selections || selections.datasets.length === 0 || selections.metrics.length === 0 || selections.methods.length === 0 || selections.settings.length === 0) {
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
    const newColumnDefs = generateColumnDefs(rawData);
    const newRowData = generateRowData(rawData);
    
    // 使用 AG-Grid API 来更新表格
    gridApi.setGridOption('columnDefs', newColumnDefs);
    gridApi.setGridOption('rowData', newRowData);
    },
  
    _getSelections() {
        const getCheckedValues = (selector) => Array.from(document.querySelectorAll(selector)).filter(cb => cb.checked).map(cb => cb.value.split('/')[1]);
        var datasets = getCheckedValues('.checkbox-container2 input[type="checkbox"]:not([id^="select-all-"])', cb => cb.value.replace('-','_')).filter(Boolean);
        var metrics = [...getCheckedValues('.checkbox-Label', cb => cb.value), ...getCheckedValues('.checkbox-Score', cb => cb.value)].filter(Boolean);
        var settings = getCheckedValues('.checkbox-Settings', cb => cb.value).filter(Boolean).map(e => e.replaceAll('-shot', ''));
        var methods = [...getCheckedValues('.checkbox-Non-Learning', cb => cb.value), ...getCheckedValues('.checkbox-Machine-Learning', cb => cb.value), ...getCheckedValues('.checkbox-Foundation-Model', cb => cb.value), ...getCheckedValues('.checkbox-Deep-Learning', cb => cb.value)].filter(Boolean).map(e => e.replace(/-/g, '_'));
        return { datasets, metrics, methods, settings };
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
        datasets.forEach(name => categoryDiv.appendChild(this._createCheckboxItem(`${category}/${name.replace('_', '-').replace(' ', '-')}`, name.replace('_', '-'), `checkbox-${category}`)));
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