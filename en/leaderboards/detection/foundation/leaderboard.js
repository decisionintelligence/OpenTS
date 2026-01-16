/**
 * ==========================================================================
 * Leaderboard Application Module v5 (Robust Event Delegation with Rank Filter)
 * ==========================================================================
 * This version uses a fully robust event delegation model and adds a dropdown
 * to filter the number of ranks displayed.
 * It requires all onchange/onclick attributes to be removed from the HTML.
 */


const LeaderboardApp = {

  // --- 1. CONFIGURATION & CONSTANTS (内容不变) ---
  config: {
    API_URL: 'https://www.opents.xyz/outlier/uni/rank',
    API_MULTI: 'https://www.opents.xyz/outlier/multi/rank',
    API_UNI: 'https://www.opents.xyz/outlier/uni/rank',
    MODELS_INFO: {},
    
    MODEL_TYPES_LIST:{"Non-Learning":["LOF","CBLOF","HBOS"],
    "Machine-Learning":["OCSVM","DP","KNN","KMeans","IF","EIF","LODA","PCA"], 
    "Foundation-Model":["AutoTimes","CALF","Chronos","GPT4TS","LLMMixer","MOIRAI","Moment","ROSE","S2IPLLM","TimeLLM","TimeMixer",'TimesFM',"TTMs","UniTS","UniTime","Timer","Dada"], 
    "Deep-Learning":["DAGMM","Torsk","iTransformer","TimesNet","DUET","ATrans","PatchTST","ModernTCN","TranAD","DualTF","AE","VAE","NLinear","DLinear","LSTMED","DCdetector","ContraAD","CATCH"  ],
  },
    DATASET_CATEGORIES: {
    "Univariate": ["KDD21", "YAHOO","NAB","ECG","SVDB","MSL","SMAP","Daphnet", "OPP","Genesis","GHL","GAIA","IOPS","MGAB","SMD"],
    "Multivariate":["CICIDS","KDDcup99","PSM","SMD","DLR","ECG","LTDB","MITDB","SVDB","GECCO","PUMP","SWAT","CATSv2","GHL","Genesis","SKAB","Daphnet","OPP","TAO","ASD","Exathlon","Credit","SWAN","NYC","CalIt2","GutenTAG","TODS","MSL","SMAP"],
  },
    METRICS: {"Label":["Acc","P","R","F1","R-P","R-R","R-F1","Aff-P","Aff-F1","Aff-R",],"Score":["A-P","A-R","R-A-P","R-A-R", "V-PR","V-ROC "]}
  },
  state: { isReady: false, isLoading: false, lastResults: [] }, // 新增 lastResults 用于存储上次的API结果
  elements: {},

  async init() {

    this._cacheElements();
    this._initCollapsibles(); // <-- 在这里添加调用
    this._bindEventListeners();
    this._populateCheckboxes();
    this.sendHeight()
    this._setInitialState();
    await this._loadJSON();
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
    const response = await fetch('../paper.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    this.config.MODELS_INFO = await response.json();
  },
  _cacheElements() {
    this.elements.tableBody = document.getElementById('multivariateTable2')?.querySelector('tbody');
    this.elements.metricsContainer = document.getElementById('Metrics');
    this.elements.typesContainer = document.getElementById('ModelType');
    this.elements.settingsContainer = document.getElementById('Setting');
    this.elements.datasetsContainer = document.getElementById('dataset-container-mul');
    this.elements.mainContainer = document.getElementById('main-container-mul');
    this.elements.scoreInput1 = document.getElementById('scores/3/1');
    this.elements.scoreInput2 = document.getElementById('scores/3/2');
    this.elements.scoreInput3 = document.getElementById('scores/3/3');
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
            else if (parentH3.textContent.includes('Horizons')) this.toggleCategory('Horizons', isChecked);
            else if (parentH3.textContent.includes('Learning Paradigm')) this.toggleCategory('LearningParadigm', isChecked);
            else if (parentH3.textContent.includes('Setting')) this.toggleCategory('Setting', isChecked);
            this.updateLeaderboard();
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
        // if (category=='Univariate' && target.checked)
        // {
        //   this.config.API_URL=this.config.API_UNI
        //   this.toggleCategoryDataset("Univariate", true,true, false);
        //   this.toggleCategoryDataset("Multivariate", true,false, true);
        // }else if(category=='Multivariate' && target.checked)
        // {
        //   this.config.API_URL=this.config.API_MULTI
        //   this.toggleCategoryDataset("Multivariate", true,true, false);
        //   this.toggleCategoryDataset("Univariate", true,false, true);
        // }
      }
      else if (target.className.startsWith('checkbox-')) {
        const category = target.className.split('-')[1];
        this._updateParentCheckboxState(category);
      }
      this.updateLeaderboard();
    });
    
    this.elements.mainContainer.addEventListener('input', (event) => {
        if (event.target.type === 'number') {
            this._validateScoreInput(event.target);
            this.updateLeaderboard();
        }
    });
  },
   _setInitialState() {
    this.toggleSelectAll(true);
    // this.toggleCategoryDataset("Univariate", true,true, false);
    // this.toggleCategoryDataset("Multivariate", true,false, true);
    this.toggleCategory('Horizons', true);
    this.toggleCategory('Metrics', true);
    this.toggleCategory('Setting', true);
    this.toggleCategory('ModelType', true);
    this.toggleCategory('LearningParadigm', true);
    const score2 = document.getElementById('Scores/2');
    if (score2) score2.checked = true;
    if (this.elements.rankCountSelect) this.elements.rankCountSelect.value = "all";
  },
  count(result)
  {
    // cnt=0
    // result.forEach(row=>{
    //   Object.keys(row).forEach(key=>{
    //     cnt+=row[key][0]
    //   })
    // })
    // console.log(cnt)
  },
  updateLeaderboard() {
    if (!this.state.isReady || this.state.isLoading) return;

    const selections = this._getSelections();
    
    if (!selections || selections.uniDatasets.length+selections.multiDatasets.length === 0 || selections.models.length === 0 || selections.metrics.length === 0) {
      this._renderEmptyTable();
      return;
    }
    
    this.state.isLoading = true;
    this._showLoadingOverlay();

    const uniRequest = selections.uniDatasets.length !== 0 ?
    fetch(this.config.API_UNI, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      "datasets": selections.uniDatasets,
      "metrics": selections.metrics,
      "models": selections.models,
      "settings": selections.settings.map(e => e.split('-')[0]),
    })
    }).then(response => {
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
    }) :
    Promise.resolve([]); // 如果没有数据，则返回一个解析为[]的Promise

    const multiRequest = selections.multiDatasets.length !== 0 ?
    fetch(this.config.API_MULTI, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "datasets": selections.multiDatasets,
        "metrics": selections.metrics,
        "models": selections.models,
        "settings": selections.settings.map(e => e.split('-')[0]),
      })
    }).then(response => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    }) :
    Promise.resolve([]); // 如果没有数据，则返回一个解析为[]的Promise
    if (selections.uniDatasets.length!=0)
    {
      fetch(this.config.API_UNI, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "datasets": selections.uniDatasets, 
          "metrics": selections.metrics, 
          "models": selections.models, 
          "settings": selections.settings.map(e=>e.split('-')[0]),
        })
      })
      .then(response => { if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`); return response.json(); })
      .then(data =>{ 
        this._processApiResponse(data, selections.scoreWeights)})
      .catch(error => { console.error('API request failed:', error); this._renderEmptyTable(); })
      .finally(() => {
        this.state.isLoading = false;
        this._hideLoadingOverlay();
      });
    }

    // 使用Promise.all等待所有请求完成
    Promise.all([uniRequest, multiRequest])
    .then(([uniData, multiData]) => {
      this.count(uniData)
      this.count(multiData)
    // 合并两个请求返回的数据
    const mergedData = {};

    // 处理第一个API的返回数据
    uniData.forEach(item => {
    const key = Object.keys(item)[0];
    const value = item[key];
    if (!mergedData[key]) {
      mergedData[key] = [0, 0, 0];
    }
    mergedData[key][0] += value[0];
    mergedData[key][1] += value[1];
    mergedData[key][2] += value[2];
    });

    // 处理第二个API的返回数据
    multiData.forEach(item => {
    const key = Object.keys(item)[0];
    const value = item[key];
    if (!mergedData[key]) {
      mergedData[key] = [0, 0, 0];
    }
    mergedData[key][0] += value[0];
    mergedData[key][1] += value[1];
    mergedData[key][2] += value[2];
    });

    // 将合并后的对象转换回您期望的数组格式
    const finalData = Object.keys(mergedData).map(key => ({
    [key]: mergedData[key]
    }));
    this.count(finalData)
    this._processApiResponse(finalData, selections.scoreWeights);
    })
    .catch(error => {
    console.error('API request failed:', error);
    this._renderEmptyTable();
    })
    .finally(() => {
    // 无论成功或失败，最后都执行
    this.state.isLoading = false;
    this._hideLoadingOverlay();
    });
  },
  
  _processApiResponse(data, weights) {
    const results = data.map(item => {
      const modelName = Object.keys(item)[0];
      const ranks = item[modelName];
      const score = (ranks[0] * weights[0] + ranks[1] * weights[1] + ranks[2] * weights[2]).toFixed(0);
      return { model: modelName, rank1: ranks[0], rank2: ranks[1], rank3: ranks[2], rank4: score };
    });
    this.state.lastResults = results; // 缓存API结果
    this._renderTable(results, true);
  
  },

  _getSelections() {
    const getCheckedValues = (selector, transform) => Array.from(document.querySelectorAll(selector)).filter(cb => cb.checked&&!cb.disabled).map(transform);
    // const datasets = getCheckedValues('.checkbox-container input[type="checkbox"]', cb =>  ['on','Label','Score'].includes(cb.value.split('/')[0])?null:cb.value.split('/')[1]).filter(Boolean);
    const uniDatasets = getCheckedValues('.checkbox-Univariate', cb => cb.value.split('/')[1]).filter(Boolean)
    const multiDatasets = getCheckedValues('.checkbox-Multivariate', cb => cb.value.split('/')[1]).filter(Boolean)
    const settings = getCheckedValues('.checkbox-Setting', cb => cb.value).filter(Boolean)
    const metrics = [...getCheckedValues('.checkbox-Label', cb => cb.value.split('/')[1]), ...getCheckedValues('.checkbox-Score', cb => cb.value.split('/')[1])].filter(Boolean);
    const modeltypes = getCheckedValues('.checkbox-LearningParadigm', cb => cb.value).filter(Boolean)
    const models = modeltypes.flatMap(modeltype => this.config.MODEL_TYPES_LIST[modeltype] || [])
    const scoreOption = document.querySelector('.checkbox-Scores:checked')?.value.split('/')[1] || '2';
    let scoreWeights = [1, 1, 1];
    if (scoreOption === '1') scoreWeights = [1, 0, 0];
    else if (scoreOption === '3') scoreWeights = [parseFloat(this.elements.scoreInput1.value) || 0, parseFloat(this.elements.scoreInput2.value) || 0, parseFloat(this.elements.scoreInput3.value) || 0];
    return { uniDatasets, multiDatasets, metrics, scoreWeights, models, settings };
  },

  _renderTable(results, isRanked) {
    if (!this.elements.tableBody) return;
    
    // 排序
    results.sort((a, b) => b.rank4 - a.rank4 || b.rank1 - a.rank1 || b.rank2 - a.rank2 || b.rank3 - a.rank3);

    // 新增：根据下拉框的值截取结果
    const countToShow = this.elements.rankCountSelect ? this.elements.rankCountSelect.value : 'all';
    const finalResults = countToShow === 'all' ? results : results.slice(0, parseInt(countToShow, 10));

    this.elements.tableBody.innerHTML = finalResults.map((result, index) => {
      var name = result.model
      const info = this.config.MODELS_INFO[result.model.split(' ')[0]] ;
    
      return `<tr><td>${isRanked ? index + 1 : ''}</td><td>${name}</td><td>${result.rank4}</td><td>${result.rank1}</td><td>${result.rank2}</td><td>${result.rank3}</td><td><a href="${info['paper-url'] || '#'}" target="_blank">paper</a></td><td>${info.publication || 'N/A'} ${info.year || 'N/A'}</td></tr>`;
  
    }).join('');
    this.sendHeight();
  },

  _renderParameters(p){
    p=p/1000000
    return p.toFixed(2)+'M'
  },

  _renderEmptyTable() {
    const modelKeys = Object.keys(this.config.MODELS_INFO).sort((a, b) => this.config.MODELS_INFO[b].year - this.config.MODELS_INFO[a].year);
    const emptyResults = modelKeys.map(model => ({ model, rank1: 0, rank2: 0, rank3: 0, rank4: 0 }));
    this.state.lastResults = emptyResults; // 同样缓存空结果
    this._renderTable(emptyResults, false);
  },

  _populateCheckboxes() {
    if (!this.elements.metricsContainer || !this.elements.datasetsContainer) return;
    ['Label', 'Score'].forEach(category => {
      const categoryDiv = this._createCategoryElement(category);
      this.config.METRICS[category].forEach(name => categoryDiv.appendChild(this._createCheckboxItem(`${category}/${name}`, name, `checkbox-${category}`)));
      this.elements.metricsContainer.appendChild(categoryDiv);
    });


    Object.entries(this.config.DATASET_CATEGORIES).forEach(([category, datasets]) => {
      // category = category.replace(' ','_')
      const categoryDiv = this._createCategoryElement(category);
      datasets.sort().forEach(name => categoryDiv.appendChild(this._createCheckboxItem(`${category}/${name.replace('_', '-')}`, name.replace('_', '-'), `checkbox-${category.replace(" ",'')}`)));
      this.elements.datasetsContainer.appendChild(categoryDiv);
    });
  },
  
  _createCategoryElement(category) {
      const div = document.createElement('div');
      div.className = 'category';
      div.innerHTML = `<h3><input type="checkbox" id="select-all-${category}">${category}</h3>`;
      return div;
  },
  
  _createCheckboxItem(id, label, className) {
      const div = document.createElement('div');
      div.className = 'checkbox-item';
      div.innerHTML = `<input type="checkbox" id="${id}" value="${id}" class="${className}"><label for="${id}">${label}</label>`;
      return div;
  },
  
  toggleCategory(category, isChecked) {
    if (category === 'Metrics') {
        ['Metrics', 'Label', 'Score'].forEach(cat => this._setCategoryChecked(cat, isChecked));
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
      document.querySelectorAll(`.checkbox-${category.replace(" ",'')}`).forEach(cb => cb.checked = isChecked);
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
        // header.classList.add('is-collapsed');
        // 2. 默认将内容区域的高度设为 0，实现折叠效果
        // content.style.maxHeight = content.scrollHeight + "px"; ;

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

// 全局启动函数
async function start() {
  await LeaderboardApp.init();
}