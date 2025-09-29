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
          { headerName: "Dataset", field: "dataset", width: 120, pinned: 'left', rowSpan: params => { if (params.node.rowIndex === 0 || params.data.dataset !== params.api.getDisplayedRowAtIndex(params.node.rowIndex - 1).data.dataset) { let span = 1; let nextRowIndex = params.node.rowIndex + 1; while (nextRowIndex < params.api.getDisplayedRowCount() && params.api.getDisplayedRowAtIndex(nextRowIndex).data.dataset === params.data.dataset) { span++; nextRowIndex++; } return span; } else { return 0; } }, cellClass: 'dataset-cell', sortable: true, filter: true },
          { headerName: "Horizon", field: "horizon", width: 100, pinned: 'left', sortable: false, filter: false }
      ];
      const dynamicColumns = Array.from(methodMetricMap.keys()).map(method => ({
          headerName: method,
          children: Array.from(methodMetricMap.get(method)).map(metric => ({
              headerName: metric.toUpperCase(),
              field: `${method}_${metric}`,
              width: 150,
              valueFormatter: params => params.value ? parseFloat(params.value).toFixed(3) : ''
          }))
      }));
      return [...fixedColumns, ...dynamicColumns];
  }

  function generateRowData(data) {
      if (!data || data.length === 0) return []; // 处理空数据情况
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
      return pivotedData.sort((a, b) => {
          const datasetCompare = a.dataset.localeCompare(b.dataset);
          if (datasetCompare !== 0) return datasetCompare;
          return a.horizon - b.horizon;
      });
  }

  function exportToCsv() {
      if (gridApi) {
          gridApi.exportDataAsCsv();
      } else {
          console.error("Grid API not ready.");
      }
  }


  // --- 完整的 LeaderboardApp 对象 (从旧页面复制并修改) ---
  const LeaderboardApp = {
      config: {
          // !! 重要：更新 API URL
          API_URL: 'https://120.77.11.87:3333/forecasting/multi/query',
          MODELS_LIST: ["PatchTST", "Crossformer", "FEDformer", "Informer", "Triformer", "DLinear", "NLinear", "MICN", "TimesNet", "TCN", "FiLM", "RNN", "Linear Regression", "VAR", "iTransformer", "FITS", "TimeMixer", "Non-stationary Transformer", "Pathformer", "DUET", "PDF"],
          DATASET_CATEGORIES: { "Electricity": ["ETTh1", "ETTh2", "ETTm1", "ETTm2", "Electricity"], "Traffic": ["Traffic", "PEMS-BAY", "METR-LA", "PEMS04", "PEMS08"], "Environment": ["Weather", "AQShunyi", "AQWan"], "Economic": ["Exchange", "FRED-MD"], "Health": ["ILI", "Covid-19"], "Energy": ["Solar", "Wind"], "Nature": ["ZafNoo", "CzeLan"], "Stock": ["NASDAQ", "NYSE"], "Banking": ["NN5"], "Web": ["Wike2000"] },
          METRICS: ['MAE', 'MAPE', 'MSE', 'MSMAPE', 'RMSE', 'SMAPE', 'WAPE']
      },
      state: { isReady: false, isLoading: false },
      elements: {},

      init() {
          this._cacheElements();
          this._initCollapsibles();
          this._bindEventListeners();
          this._populateCheckboxes();
          this._setInitialState();
          this.state.isReady = true;
          this.updateLeaderboard();
      },
      
      // ... (所有以 _ 开头的辅助函数和事件处理函数都复制过来)
      _cacheElements() {
          this.elements.metricsContainer = document.getElementById('Metrics');
        //   this.elements.methodsContainer = document.getElementById('Method');
          this.elements.datasetsContainer = document.getElementById('dataset-container-mul');
          this.elements.mainContainer = document.getElementById('main-container-mul');
          this.elements.loadingOverlay = document.querySelector('#table-container-mul .loading-overlay');
      },
      _bindEventListeners() {
          if (!this.elements.mainContainer) return;
          this.elements.mainContainer.addEventListener('click', (event) => {
              const target = event.target;
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
                  this.updateLeaderboard();
              }
          });
          this.elements.mainContainer.addEventListener('change', (event) => {
              const target = event.target;
              if (target.type !== 'checkbox') return;
              if (target.id.startsWith('select-all-')) {
                  const category = target.id.replace('select-all-', '');
                  this.toggleCategory(category, target.checked);
              } else if (target.className.startsWith('checkbox-')) {
                  const category = target.className.split('-')[1];
                  this._updateParentCheckboxState(category);
              }
              this.updateLeaderboard();
          });
      },
      _setInitialState() {
          this.toggleSelectAll(true);
          this.toggleCategory('Metrics', true);
          // 设定初始选择，例如
          // this.p1(true); // 选择 profile1
      },
      updateLeaderboard() {
          if (!this.state.isReady || this.state.isLoading) return;
          const selections = this._getSelections();
          if (!selections || selections.datasets.length === 0 || selections.metrics.length === 0) {
              this._renderEmptyTable(); // 清空表格
              return;
          }
          this.state.isLoading = true;
          this._showLoadingOverlay();
          fetch(this.config.API_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  "datasets": selections.datasets,
                  "metrics": selections.metrics,
                  "models": selections.models,
              })
          })
          .then(response => { if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`); return response.json(); })
          .then(data => this._processApiResponse(data)) // 修改点
          .catch(error => { console.error('API request failed:', error); this._renderEmptyTable(); })
          .finally(() => {
              this.state.isLoading = false;
              this._hideLoadingOverlay();
          });
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
          const getCheckedValues = (selector) => Array.from(document.querySelectorAll(selector))
              .filter(cb => cb.checked).map(cb => cb.value.split('/')[1]);
          const datasets = getCheckedValues('.checkbox-container input[type="checkbox"]:not([id^="select-all-"])');
          const metrics = getCheckedValues('#Metrics input[type="checkbox"]:not([id^="select-all-"])');
          // !! 注意: 您需要根据API调整需要发送的 models 列表
          const models = ['DUET','Pathformer','PDF','iTransformer']; // 或者从页面选择
          return { datasets, metrics, models };
      },

      // !! 核心改造点 2: 修改 _renderEmptyTable
      _renderEmptyTable() {
          if (gridApi) {
              gridApi.setGridOption('rowData', []); // 清空行数据
              gridApi.setGridOption('columnDefs', []); // 清空列定义
          }
      },

      // ... (其他所有辅助函数保持不变)
      _populateCheckboxes() {
        if (!this.elements.metricsContainer || !this.elements.datasetsContainer) return;
        ['Normalized', 'Denormalized'].forEach(category => {
          const categoryDiv = this._createCategoryElement(category);
          this.config.METRICS.forEach(name => categoryDiv.appendChild(this._createCheckboxItem(`${category}/${name}`, name, `checkbox-${category}`)));
          this.elements.metricsContainer.appendChild(categoryDiv);
        });
        
          Object.entries(this.config.DATASET_CATEGORIES).forEach(([category, datasets]) => {
              const categoryDiv = this._createCategoryElement(category);
              datasets.forEach(name => categoryDiv.appendChild(this._createCheckboxItem(`${category}/${name}`, name, `checkbox-${category}`)));
              this.elements.datasetsContainer.appendChild(categoryDiv);
          });
      },
      _createCategoryElement(category) { const div = document.createElement('div'); div.className = 'category'; div.innerHTML = `<h3><input type="checkbox" id="select-all-${category}">${category}</h3>`; return div; },
      _createCheckboxItem(id, label, className) { const div = document.createElement('div'); div.className = 'checkbox-item'; div.innerHTML = `<input type="checkbox" id="${id}" value="${id}" class="${className}"><label for="${id}">${label}</label>`; return div; },
      toggleCategory(category, isChecked) {
        if (category === 'Metrics') {
            ['Metrics', 'Normalized', 'Denormalized'].forEach(cat => this._setCategoryChecked(cat, isChecked));
        } else {
            this._setCategoryChecked(category, isChecked);
        }
      },
      _setCategoryChecked(category, isChecked){ const parentCb = document.getElementById(`select-all-${category}`); if(parentCb) parentCb.checked = isChecked; document.querySelectorAll(`.checkbox-${category}`).forEach(cb => cb.checked = isChecked);},
      _updateParentCheckboxState(category) { const childCheckboxes = document.querySelectorAll(`.checkbox-${category}`); if (childCheckboxes.length === 0) return; const allChecked = Array.from(childCheckboxes).every(cb => cb.checked); const parentCheckbox = document.getElementById(`select-all-${category}`); if (parentCheckbox) { parentCheckbox.checked = allChecked; } },
      toggleSelectAll(isChecked) { const mainSelectAll = document.getElementById('select-all'); if (mainSelectAll) mainSelectAll.checked = isChecked; Object.keys(this.config.DATASET_CATEGORIES).forEach(category => this.toggleCategory(category, isChecked)); },
      p1(isChecked) { this.toggleSelectAll(false); if (!isChecked) return; ['Traffic/Traffic', 'Energy/Solar', 'Health/ILI', 'Environment/Weather', 'Economic/Exchange'].forEach(id => { const el = document.getElementById(id); if(el) { el.checked = true; this._updateParentCheckboxState(id.split('/')[0]); } }); this.toggleCategory('Electricity', true); },
      _showLoadingOverlay() { if (this.elements.loadingOverlay) this.elements.loadingOverlay.classList.add('is-active'); },
      _hideLoadingOverlay() { if (this.elements.loadingOverlay) this.elements.loadingOverlay.classList.remove('is-active'); },
      _initCollapsibles() {
          const headers = document.querySelectorAll('.collapsible-header');
          headers.forEach(header => {
              const content = header.nextElementSibling;
              if (content && content.classList.contains('collapsible-content')) {
                  header.addEventListener('click', (event) => {
                      if (event.target.tagName === 'A') return;
                      header.classList.toggle('is-collapsed');
                      if (header.classList.contains('is-collapsed')) {
                          content.style.maxHeight = '0';
                      } else {
                          content.style.maxHeight = content.scrollHeight + "px";
                      }
                  });
                  // 默认展开
                  content.style.maxHeight = content.scrollHeight + "px";
              }
          });
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
            resizable: true
        },
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
