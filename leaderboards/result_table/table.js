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
        sortable: true,
        filter: true
    },
        { headerName: "Horizon", field: "horizon", width: 100, pinned: 'left', sortable: false, filter: false }
    ];
    const dynamicColumns = Array.from(methodMetricMap.keys()).map(method => ({
        headerName: method,
        children: Array.from(methodMetricMap.get(method)).map(metric => ({
            headerName: metric.toUpperCase(),
            field: `${method}_${metric}`,
            width: 150,
            valueFormatter: params => params.value ? parseFloat(params.value).toFixed(3) : 'Nan'
        }))
    }));
    return [...fixedColumns, ...dynamicColumns];
}

// 这是修改后的 generateRowData 函数
function generateRowData(data) {
  if (!data || data.length === 0) return [];
  const dataMap = new Map();
  data.forEach(item => {
      const { dataset, horizon, method, metric, value } = item;
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
      const datasetCompare = a.dataset.localeCompare(b.dataset);
      if (datasetCompare !== 0) return datasetCompare;
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
        API_URL: 'http://120.77.11.87:3333/forecasting/multi/query',
        MODELS_LIST: ["DUET", "Amplifier", "PatchMLP", "xPatch", "TimeKAN", "PatchTST", "Crossformer", "FEDformer", "Informer", "Triformer", "DLinear", "NLinear", 
        "MICN", "TimesNet", "TCN", "FiLM", "RNN", "Linear Regression", "VAR", "iTransformer", "FITS", 
        "TimeMixer", "Pathformer", "PDF", "Non-stationary Transformer"],
        DATASET_CATEGORIES: { "Electricity": ["ETTh1", "ETTh2", "ETTm1", "ETTm2", "Electricity"], "Traffic": ["Traffic", "PEMS-BAY", "METR-LA", "PEMS04", "PEMS08"], "Environment": ["Weather", "AQShunyi", "AQWan"], "Economic": ["Exchange", "FRED-MD"], "Health": ["ILI", "Covid-19"], "Energy": ["Solar", "Wind"], "Nature": ["ZafNoo", "CzeLan"], "Stock": ["NASDAQ", "NYSE"], "Banking": ["NN5"], "Web": ["Wike2000"] },
        METRICS: ['MAE', 'MAPE', 'MSE', 'MSMAPE', 'RMSE', 'SMAPE', 'WAPE']
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
    const newColumnDefs = generateColumnDefs(rawData);
    const newRowData = generateRowData(rawData);

    // 使用 AG-Grid API 来更新表格
    gridApi.setGridOption('columnDefs', newColumnDefs);
    gridApi.setGridOption('rowData', newRowData);
    },
  
    _getSelections() {
        const getCheckedValues = (selector) => Array.from(document.querySelectorAll(selector)).filter(cb => cb.checked).map(cb => cb.value.split('/')[1]);
        const datasets = getCheckedValues('.checkbox-container2 input[type="checkbox"]:not([id^="select-all-"])');
        // const metrics = [...getCheckedValues('.checkbox-Normalized', cb => cb.value.split('/')[1]), ...getCheckedValues('.checkbox-Denormalized', cb => cb.value.split('/')[1] + "_Denorm")];
        const metrics1 = getCheckedValues('.checkbox-Normalized', cb => cb.value);
        const metrics2 = getCheckedValues('.checkbox-Denormalized', cb => cb.value + "_Denorm");
        const metrics = [...metrics1,...metrics2.map(e=>e+"_Denorm")]
        // !! 注意: 您需要根据API调整需要发送的 models 列表
        const methods = getCheckedValues('.checkbox-Methods');; // 或者从页面选择
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
      ['Normalized', 'Denormalized'].forEach(category => {
        const categoryDiv = this._createCategoryElement(category);
        const categoryDivInner = this._createCategoryElement_inner(category,'category_inner_grid')
        this.config.METRICS.forEach(name => categoryDivInner.appendChild(this._createCheckboxItem(`${category}/${name}`, name, `checkbox-${category}`)));
        categoryDiv.appendChild(categoryDivInner)
        this.elements.metricsContainer.appendChild(categoryDiv);
      });
      category = 'Methods'
      this.config.MODELS_LIST.forEach(name => this.elements.methodsContainer.appendChild(this._createCheckboxItem(`${category}/${name}`, name, `checkbox-${category}`)));
      Object.entries(this.config.DATASET_CATEGORIES).forEach(([category, datasets]) => {
        const categoryDiv = this._createCategoryElement(category);
        datasets.forEach(name => categoryDiv.appendChild(this._createCheckboxItem(`${category}/${name.replace('_', '-')}`, name.replace('_', '-'), `checkbox-${category}`)));
        this.elements.datasetsContainer.appendChild(categoryDiv);
      });
    },
    
    _createCategoryElement(category) {
        const div = document.createElement('div');
        div.className = 'category';
        div.innerHTML = `<h3><input type="checkbox" id="select-all-${category}">${category}</h3>`;
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
        div.innerHTML = `<input type="checkbox" id="${id}" value="${id}" class="${className}"><label style="padding-left:5px" for="${id}" >${label}</label>`;
        return div;
    },
    
    toggleCategory(category, isChecked) {
      if (category === 'Metrics') {
          ['Metrics', 'Normalized', 'Denormalized'].forEach(cat => this._setCategoryChecked(cat, isChecked));
      } else {
          this._setCategoryChecked(category, isChecked);
      }
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