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
    API_URL: 'https://www.opents.top/rank',
    MODELS_INFO: {
      "PatchTST": {
        "paper-url": "https://openreview.net/forum?id=Jbdc0vTOcol",
        "publication": "ICLR",
        "bib": "https://dblp.org/rec/conf/iclr/NieNSK23.html?view=bibtex",
        "year": "2023"
      },
      "Crossformer": {
        "paper-url": "https://openreview.net/forum?id=vSVLM2j9eie",
        "publication": "ICLR",
        "bib": "https://dblp.org/rec/conf/iclr/ZhangY23.html?view=bibtex",
        "year": "2023"
      },
      "FEDformer": {
        "paper-url": "https://proceedings.mlr.press/v162/zhou22g.html",
        "publication": "ICML",
        "bib": "https://dblp.org/rec/conf/icml/ZhouMWW0022.html?view=bibtex",
        "year": "2022"
      },
      "Informer": {
        "paper-url": "https://ojs.aaai.org/index.php/AAAI/article/view/17325",
        "publication": "AAAI",
        "bib": "https://dblp.org/rec/conf/aaai/ZhouZPZLXZ21.html?view=bibtex",
        "year": "2021"
      },
      "Triformer": {
        "paper-url": "https://arxiv.org/pdf/2204.13767",
        "publication": "IJCAI",
        "bib": "https://dblp.org/rec/conf/ijcai/CirsteaG0KDP22.html?view=bibtex",
        "year": "2022"
      },
      "DLinear": {
        "paper-url": "https://ojs.aaai.org/index.php/AAAI/article/view/26317",
        "publication": "AAAI",
        "bib": "https://dblp.org/rec/conf/aaai/ZengCZ023.html?view=bibtex",
        "year": "2023"
      },
      "NLinear": {
        "paper-url": "https://ojs.aaai.org/index.php/AAAI/article/view/26317",
        "publication": "AAAI",
        "bib": "https://dblp.org/rec/conf/aaai/ZengCZ023.html?view=bibtex",
        "year": "2023"
      },
      "MICN": {
        "paper-url": "https://openreview.net/forum?id=zt53IDUR1U",
        "publication": "ICLR",
        "bib": "https://dblp.org/rec/conf/iclr/Wang0HWCX23.html?view=bibtex",
        "year": "2022"
      },
      "TimesNet": {
        "paper-url": "https://arxiv.org/pdf/2210.02186v2/1000",
        "publication": "ICLR",
        "bib": "https://dblp.org/rec/conf/iclr/WuHLZ0L23.html?view=bibtex",
        "year": "2023"
      },
      "TCN": {
        "paper-url": "https://arxiv.org/pdf/1803.01271",
        "publication": "arXiv",
        "bib": "https://dblp.org/rec/journals/corr/abs-1803-01271.html?view=bibtex",
        "year": "2018"
      },
      "FiLM": {
        "paper-url": "https://openreview.net/forum?id=zTQdHSQUQWc",
        "publication": "NIPS",
        "bib": "https://dblp.org/rec/conf/nips/ZhouMWW0YY022.html?view=bibtex",
        "year": "2022"
      },
      "RNN": {
        "paper-url": "https://proceedings.mlr.press/v89/gasthaus19a.html",
        "publication": "arXiv",
        "bib": "https://proceedings.mlr.press/v89/gasthaus19a.html",
        "year": "2019"
      },
      "Linear Regression": {
        "paper-url": "https://books.google.com/books?hl=zh-CN&lr=&id=8r0qE35wt44C&oi=fnd&pg=PR5&dq=Regression+models+for+time+series+analysis&ots=vd653g9LXv&sig=JPr8C-hETsPfWyuxTUlWgL0eKDA",
        "publication": "Wiley",
        "bib": "https://books.google.com/books?hl=zh-CN&lr=&id=8r0qE35wt44C&oi=fnd&pg=PR5&dq=Regression+models+for+time+series+analysis&ots=vd653g9LXv&sig=JPr8C-hETsPfWyuxTUlWgL0eKDA",
        "year": "2005"
      },
      "VAR": {
        "paper-url": "https://www.tandfonline.com/doi/abs/10.1080/07474939408800286",
        "publication": "Economet Rev",
        "bib": "https://www.tandfonline.com/doi/abs/10.1080/07474939408800286",
        "year": "1994"
      },
      "iTransformer": {
        "paper-url": "https://arxiv.org/pdf/2310.06625",
        "publication": "ICLR",
        "bib": "https://dblp.org/rec/journals/corr/abs-2310-06625.html?view=bibtex",
        "year": "2024"
      },
      "FITS": {
        "paper-url": "[2307.03756] FITS: Modeling Time Series with $10k$ Parameters",
        "publication": "ICLR",
        "bib": "https://dblp.org/rec/journals/corr/abs-2307-03756.html?view=bibtex",
        "year": "2024"
      },
      "TimeMixer": {
        "paper-url": "https://arxiv.org/pdf/2405.14616",
        "publication": "ICLR",
        "bib": "https://dblp.org/rec/journals/corr/abs-2405-14616.html?view=bibtex",
        "year": "2024"
      },
      "Non-stationary Transformer": {
        "paper-url": "https://arxiv.org/pdf/2205.14415",
        "publication": "NIPS",
        "bib": "https://dblp.org/rec/conf/nips/LiuWWL22.html?view=bibtex",
        "year": "2022"
      },
      "Pathformer": {
        "paper-url": "https://arxiv.org/pdf/2402.05956",
        "publication": "ICLR",
        "bib": "https://dblp.org/rec/journals/corr/abs-2402-05956.html?view=bibtex",
        "year": "2024"
      },
      "DUET": {
        "paper-url": "https://arxiv.org/pdf/2412.10859",
        "publication": "KDD",
        "bib": "",
        "year": "2025"
      },
      "PDF": {
        "paper-url": "https://openreview.net/forum?id=dp27P5HBBt",
        "publication": "ICLR",
        "bib": "https://dblp.uni-trier.de/rec/conf/iclr/0001WLLB0X24.html?view=bibtex",
        "year": "2024"
      },
    
      "TimeKAN": {
        "paper-url": "https://arxiv.org/pdf/2502.06910",
        "publication": "ICLR",
        "bib": "https://dblp.org/rec/conf/iclr/HuangZL025.html?view=bibtex",
        "year": "2025"
      },
      "xPatch": {
        "paper-url": "https://arxiv.org/pdf/2412.17323",
        "publication": "AAAI",
        "bib": "https://dblp.org/rec/conf/aaai/StitsyukC25.html?view=bibtex",
        "year": "2025"
      },
      "PatchMLP": {
        "paper-url": "https://arxiv.org/pdf/2405.13575",
        "publication": "AAAI",
        "bib": "https://dblp.org/rec/conf/aaai/TangZ25.html?view=bibtex",
        "year": "2025"
      },
      "Amplifier": {
        "paper-url": "https://arxiv.org/pdf/2501.17216",
        "publication": "AAAI",
        "bib": "https://dblp.org/rec/conf/aaai/Fei000N25.html?view=bibtex",
        "year": "2025"
      }
    },
    MODELS_LIST: ["xPatch","PatchMLP","TimeKAN","Amplifier", "PatchTST", "Crossformer", "FEDformer", "Informer", "Triformer", "DLinear", "NLinear", "MICN", "TimesNet", "TCN", "FiLM", "RNN", "Linear Regression", "VAR", "iTransformer", "FITS", "TimeMixer", "Non-stationary Transformer", "Pathformer", "DUET", "PDF"],
    DATASET_CATEGORIES: { "Electricity": ["ETTh1", "ETTh2", "ETTm1", "ETTm2", "Electricity"], "Traffic": ["Traffic", "PEMS-BAY", "METR-LA", "PEMS04", "PEMS08"], "Environment": ["Weather", "AQShunyi", "AQWan"], "Economic": ["Exchange", "FRED-MD"], "Health": ["ILI", "Covid-19"], "Energy": ["Solar", "Wind"], "Nature": ["ZafNoo", "CzeLan"], "Stock": ["NASDAQ", "NYSE"], "Banking": ["NN5"], "Web": ["Wike2000"] },
    METRICS: ['MAE', 'MAPE', 'MSE', 'MSMAPE', 'RMSE', 'SMAPE', 'WAPE']
  },
  state: { isReady: false, isLoading: false, lastResults: [] }, // 新增 lastResults 用于存储上次的API结果
  elements: {},

  init() {
    this._cacheElements();
    this._initCollapsibles(); // <-- 在这里添加调用
    this._bindEventListeners();
    this._populateCheckboxes();
    this._setInitialState();
    this.sendHeight();
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
            else if (parentH3.textContent.includes('Horizons')) this.toggleCategory('Horizons', isChecked);
            
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
  // _bindEventListeners() {
  //   if (!this.elements.mainContainer) return;

  //   this.elements.mainContainer.addEventListener('change', (event) => {
  //     const target = event.target;
      
  //     // 新增：处理下拉框变化
  //     if (target.id === 'rank-display-count') {
  //       this._renderTable(this.state.lastResults, true); // 使用缓存的数据重新渲染表格
  //       return;
  //     }

  //     if (target.type !== 'checkbox' && target.type !== 'radio') return;
      
  //     if (target.id.startsWith('select-all-')) {
  //       const category = target.id.replace('select-all-', '');
  //       this.toggleCategory(category, target.checked);
  //     }
  //     else if (target.className.startsWith('checkbox-')) {
  //       const category = target.className.split('-')[1];
  //       this._updateParentCheckboxState(category);
  //     }
  //     this.updateLeaderboard();
  //   });
    
  //   this.elements.mainContainer.addEventListener('input', (event) => {
  //       if (event.target.type === 'number') {
  //           this._validateScoreInput(event.target);
  //           this.updateLeaderboard();
  //       }
  //   });

  //   // document.addEventListener('click', (event) => {
  //   //     const target = event.target;
  //   //     if (target.tagName !== 'A' || !target.closest('b')) return;
  //   //     event.preventDefault();

  //   //     const parentH3 = target.closest('h3');
  //   //     if (!parentH3) return;

  //   //     const text = target.textContent;
  //   //     const isChecked = (text === 'all' || text === 'profile1');
        
  //   //     if (parentH3.textContent.includes('Metrics')) this.toggleCategory('Metrics', isChecked);
  //   //     else if (parentH3.textContent.includes('Datasets')) {
  //   //         if (text === 'profile1') this.p1(true);
  //   //         else this.toggleSelectAll(isChecked);
  //   //     }
  //   //     else if (parentH3.textContent.includes('Horizons')) this.toggleCategory('Horizons', isChecked);
        
  //   //     this.updateLeaderboard();
  //   // });
  // },
  
  _setInitialState() {
    this.toggleSelectAll(true);
    this.toggleCategory('Horizons', true);
    this.toggleCategory('Metrics', true);
    const score2 = document.getElementById('Score/2');
    if (score2) score2.checked = true;
    if (this.elements.rankCountSelect) this.elements.rankCountSelect.value = "10";
  },

  updateLeaderboard() {
    if (!this.state.isReady || this.state.isLoading) return;

    const selections = this._getSelections();
    if (!selections || selections.datasets.length === 0 || selections.metrics.length === 0 || selections.horizons.length === 0) {
      this._renderEmptyTable();
      return;
    }
    
    this.state.isLoading = true;
    this._showLoadingOverlay();

    fetch(this.config.API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "metrics": selections.metrics, 
        "datasets": selections.datasets, 
        "models": this.config.MODELS_LIST, 
        "pred_len": selections.horizons,
      })
    })
    .then(response => { if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`); return response.json(); })
    .then(data => this._processApiResponse(data, selections.scoreWeights))
    .catch(error => { console.error('API request failed:', error); this._renderEmptyTable(); })
    .finally(() => {
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
    const getCheckedValues = (selector, transform) => Array.from(document.querySelectorAll(selector)).filter(cb => cb.checked).map(transform);
    const datasets = getCheckedValues('.checkbox-container input[type="checkbox"]', cb => cb.value.split('/')[1]?.replace('-', '_')).filter(Boolean);
    const metrics = [...getCheckedValues('.checkbox-Normalized', cb => cb.value.split('/')[1]), ...getCheckedValues('.checkbox-Denormalized', cb => cb.value.split('/')[1] + "_Denorm")].filter(Boolean);
    const horizons = getCheckedValues('.checkbox-Horizons', cb => cb.value.split('/')[1]).filter(Boolean);
    const scoreOption = document.querySelector('.checkbox-Score:checked')?.value.split('/')[1] || '2';
    let scoreWeights = [1, 1, 1];
    if (scoreOption === '1') scoreWeights = [1, 0, 0];
    else if (scoreOption === '3') scoreWeights = [parseFloat(this.elements.scoreInput1.value) || 0, parseFloat(this.elements.scoreInput2.value) || 0, parseFloat(this.elements.scoreInput3.value) || 0];
    return { datasets, metrics, horizons, scoreWeights };
  },

  _renderTable(results, isRanked) {
    if (!this.elements.tableBody) return;
    
    // 排序
    results.sort((a, b) => b.rank4 - a.rank4 || b.rank1 - a.rank1 || b.rank2 - a.rank2 || b.rank3 - a.rank3);

    // 新增：根据下拉框的值截取结果
    const countToShow = this.elements.rankCountSelect ? this.elements.rankCountSelect.value : 'all';
    const finalResults = countToShow === 'all' ? results : results.slice(0, parseInt(countToShow, 10));

    this.elements.tableBody.innerHTML = finalResults.map((result, index) => {
      const info = this.config.MODELS_INFO[result.model] || {};
      return `<tr><td>${isRanked ? index + 1 : ''}</td><td>${result.model}</td><td>${result.rank4}</td><td>${result.rank1}</td><td>${result.rank2}</td><td>${result.rank3}</td><td><a href="${info['paper-url'] || '#'}" target="_blank">paper</a></td><td>${info.publication || 'N/A'} ${info.year || 'N/A'}</td></tr>`;
    }).join('');
    this.sendHeight();
  },

  _renderEmptyTable() {
    const modelKeys = Object.keys(this.config.MODELS_INFO).sort((a, b) => this.config.MODELS_INFO[b].year - this.config.MODELS_INFO[a].year);
    const emptyResults = modelKeys.map(model => ({ model, rank1: 0, rank2: 0, rank3: 0, rank4: 0 }));
    this.state.lastResults = emptyResults; // 同样缓存空结果
    this._renderTable(emptyResults, false);
  },

  _populateCheckboxes() {
    if (!this.elements.metricsContainer || !this.elements.datasetsContainer) return;
    ['Normalized', 'Denormalized'].forEach(category => {
      const categoryDiv = this._createCategoryElement(category);
      this.config.METRICS.forEach(name => categoryDiv.appendChild(this._createCheckboxItem(`${category}/${name}`, name, `checkbox-${category}`)));
      this.elements.metricsContainer.appendChild(categoryDiv);
    });
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
  
  _createCheckboxItem(id, label, className) {
      const div = document.createElement('div');
      div.className = 'checkbox-item';
      div.innerHTML = `<input type="checkbox" id="${id}" value="${id}" class="${className}"><label for="${id}">${label}</label>`;
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
        // header.classList.add('is-collapsed');
        // 2. 默认将内容区域的高度设为 0，实现折叠效果
        // content.style.maxHeight = content.scrollHeight + "px"; 

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
function start() {
  LeaderboardApp.init();
}