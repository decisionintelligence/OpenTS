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
    API_URL: 'https://120.77.11.87:3333/forecasting/uni/rank',
    MODELS_INFO: {"Crossformer": {"paper-url": "https://openreview.net/forum?id=vSVLM2j9eie", "publication": "ICLR", "bib": "https://dblp.org/rec/conf/iclr/ZhangY23.html?view=bibtex", "paradigm": "DL"}, "Arima": {"paper-url": "https://www.tandfonline.com/doi/abs/10.1080/01621459.1970.10481180", "publication": "JASA", "bib": "https://www.tandfonline.com/doi/abs/10.1080/01621459.1970.10481180", "paradigm": "SL"}, "Kalman Filter": {"paper-url": "https://books.google.com.hk/books?hl=zh-CN&lr=&id=Kc6tnRHBwLcC&oi=fnd&pg=PR9&dq=Forecasting,+structural+time+series+models+and+the+Kalman+filter.&ots=I6QXVxW_FJ&sig=mDFREQcdTPiCVXttJZNiooV5lqQ&redir_esc=y#v=onepage&q=Forecasting%2C%20structural%20time%20series%20models%20and%20the%20Kalman%20filter.&f=false", "publication": "CUP", "bib": "https://books.google.com.hk/books?hl=zh-CN&lr=&id=Kc6tnRHBwLcC&oi=fnd&pg=PR9&dq=Forecasting,+structural+time+series+models+and+the+Kalman+filter.&ots=I6QXVxW_FJ&sig=mDFREQcdTPiCVXttJZNiooV5lqQ&redir_esc=y#v=onepage&q=Forecasting%2C%20structural%20time%20series%20models%20and%20the%20Kalman%20filter.&f=false", "paradigm": "SL"}, "Linear Regression": {"paper-url": "https://books.google.com/books?hl=zh-CN&lr=&id=8r0qE35wt44C&oi=fnd&pg=PR5&dq=Regression+models+for+time+series+analysis&ots=vd653g9LXv&sig=JPr8C-hETsPfWyuxTUlWgL0eKDA", "publication": "Wiley", "bib": "https://books.google.com/books?hl=zh-CN&lr=&id=8r0qE35wt44C&oi=fnd&pg=PR5&dq=Regression+models+for+time+series+analysis&ots=vd653g9LXv&sig=JPr8C-hETsPfWyuxTUlWgL0eKDA", "paradigm": "ML"}, "Naive Drift": {"paper-url": "https://unit8co.github.io/darts/generated_api/darts.models.forecasting.baselines.html?highlight=drift#darts.models.forecasting.baselines.NaiveDrift", "publication": "Darts", "bib": "https://github.com/unit8co/darts", "paradigm": "SL"}, "Naive Mean": {"paper-url": "https://unit8co.github.io/darts/generated_api/darts.models.forecasting.baselines.html#darts.models.forecasting.baselines.NaiveMean", "publication": "Darts", "bib": "https://github.com/unit8co/darts", "paradigm": "SL"}, "Naive Moving Average": {"paper-url": "https://unit8co.github.io/darts/generated_api/darts.models.forecasting.baselines.html?highlight=drift#darts.models.forecasting.baselines.NaiveMovingAverage", "publication": "Darts", "bib": "https://github.com/unit8co/darts", "paradigm": "SL"}, "Naive Seasonal": {"paper-url": "https://unit8co.github.io/darts/generated_api/darts.models.forecasting.baselines.html?highlight=drift#darts.models.forecasting.baselines.NaiveSeasonal", "publication": "Darts", "bib": "https://github.com/unit8co/darts", "paradigm": "SL"}, "N-BEATS": {"paper-url": "https://arxiv.org/pdf/1905.10437", "publication": "ICLR", "bib": "https://dblp.org/rec/conf/iclr/OreshkinCCB20.html?view=bibtex", "paradigm": "DL"}, "N-HiTS": {"paper-url": "https://ojs.aaai.org/index.php/AAAI/article/view/25854", "publication": "AAAI", "bib": "https://dblp.org/rec/conf/aaai/ChalluOORCD23.html?view=bibtex", "paradigm": "DL"}, "Random Forest": {"paper-url": "https://link.springer.com/article/10.1023/a:1010933404324", "publication": "ML", "bib": "https://link.springer.com/article/10.1023/a:1010933404324", "paradigm": "ML"}, "RNN": {"paper-url": "https://proceedings.mlr.press/v89/gasthaus19a.html", "publication": "arXiv", "bib": "https://dblp.uni-trier.de/rec/conf/aistats/GasthausBWRSFJ19.html?view=bibtex", "paradigm": "DL"}, "AutoCES": {"paper-url": "https://unit8co.github.io/darts/generated_api/darts.models.forecasting.sf_auto_ces.html", "publication": "Darts", "bib": "https://github.com/unit8co/darts", "paradigm": "SL"}, "AutoETS": {"paper-url": "https://unit8co.github.io/darts/generated_api/darts.models.forecasting.sf_auto_ets.html", "publication": "Darts", "bib": "https://github.com/unit8co/darts", "paradigm": "SL"}, "AutoTheta": {"paper-url": "https://unit8co.github.io/darts/generated_api/darts.models.forecasting.sf_auto_theta.html", "publication": "Darts", "bib": "https://github.com/unit8co/darts", "paradigm": "SL"}, "TCN": {"paper-url": "https://arxiv.org/pdf/1803.01271", "publication": "arXiv", "bib": "https://dblp.org/rec/journals/corr/abs-1803-01271.html?view=bibtex", "paradigm": "DL"}, "TiDE": {"paper-url": "https://arxiv.org/pdf/2304.08424", "publication": "arXiv", "bib": "https://dblp.uni-trier.de/rec/journals/corr/abs-2304-08424.html?view=bibtex", "paradigm": "DL"}, "Xgboost": {"paper-url": "https://dl.acm.org/doi/abs/10.1145/2939672.2939785", "publication": "KDD", "bib": "https://dblp.uni-trier.de/rec/conf/kdd/ChenG16.html?view=bibtex", "paradigm": "ML"}, "DLinear": {"paper-url": "https://ojs.aaai.org/index.php/AAAI/article/view/26317", "publication": "AAAI", "bib": "https://dblp.org/rec/conf/aaai/ZengCZ023.html?view=bibtex", "paradigm": "DL"}, "FEDformer": {"paper-url": "https://proceedings.mlr.press/v162/zhou22g.html", "publication": "ICML", "bib": "https://dblp.org/rec/conf/icml/ZhouMWW0022.html?view=bibtex", "paradigm": "DL"}, "FiLM": {"paper-url": "https://proceedings.neurips.cc/paper_files/paper/2022/hash/524ef58c2bd075775861234266e5e020-Abstract-Conference.html", "publication": "NeurIPS", "bib": "https://dblp.org/rec/conf/nips/ZhouMWW0YY022.html?view=bibtex", "paradigm": "DL"}, "Informer": {"paper-url": "https://ojs.aaai.org/index.php/AAAI/article/view/17325", "publication": "AAAI", "bib": "https://dblp.org/rec/conf/aaai/ZhouZPZLXZ21.html?view=bibtex", "paradigm": "DL"}, "NLinear": {"paper-url": "https://ojs.aaai.org/index.php/AAAI/article/view/26317", "publication": "AAAI", "bib": "https://dblp.org/rec/conf/aaai/ZengCZ023.html?view=bibtex", "paradigm": "DL"}, "Non-stationary Transformers": {"paper-url": "https://proceedings.neurips.cc/paper_files/paper/2022/hash/4054556fcaa934b0bf76da52cf4f92cb-Abstract-Conference.html", "publication": "NeurIPS", "bib": "https://dblp.org/rec/conf/nips/LiuWWL22.html?view=bibtex", "paradigm": "DL"}, "PatchTST": {"paper-url": "https://openreview.net/forum?id=Jbdc0vTOcol", "publication": "ICLR", "bib": "https://dblp.org/rec/conf/iclr/NieNSK23.html?view=bibtex", "paradigm": "DL"}, "TimesNet": {"paper-url": "https://arxiv.org/pdf/2210.02186v2/1000", "publication": "ICLR", "bib": "https://dblp.org/rec/conf/iclr/WuHLZ0L23.html?view=bibtex", "paradigm": "DL"}, "Triformer": {"paper-url": "https://arxiv.org/pdf/2204.13767", "publication": "IJCAI", "bib": "https://dblp.org/rec/conf/ijcai/CirsteaG0KDP22.html?view=bibtex", "paradigm": "DL"}, "LightGBM": {"paper-url": "https://proceedings.neurips.cc/paper/2017/hash/6449f44a102fde848669bdd9eb6b76fa-Abstract.html", "publication": "NIPS", "bib": "https://dblp.uni-trier.de/rec/conf/nips/KeMFWCMYL17.html?view=bibtex", "paradigm": "ML"}},   
    DATASET_CATEGORIES: { "Frequency": ["Hourly","Daily","Weekly","Monthly","Quarterly","Yearly","Other"], 
    "Characteristics": ["W Trend", "W Transition","W Shifting", "W Seasonality","W Stationarity", "W/O Trend", "W/O Transition","W/O Shifting", "W/O Seasonality","W/O Stationarity"]},
    METRICS: ['MAE', 'MSE', 'MSMAPE']
  },
  state: { isReady: false, isLoading: false, lastResults: [] }, // 新增 lastResults 用于存储上次的API结果
  elements: {},

  init() {
    this._cacheElements();
    this._initCollapsibles(); // <-- 在这里添加调用
    this._bindEventListeners();
    this._populateCheckboxes();
    this.sendHeight();
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
    this.elements.typesContainer = document.getElementById('ModelType');
    this.elements.settingsContainer = document.getElementById('Setting');
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
            else if (parentH3.textContent.includes('Learning Paradigm')) this.toggleCategory('ModelType', isChecked);
            
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
    this.toggleCategory('Setting', true);
    this.toggleCategory('ModelType', true);
    const score2 = document.getElementById('Score/2');
    if (score2) score2.checked = true;
    if (this.elements.rankCountSelect) this.elements.rankCountSelect.value = "all";
  },

  updateLeaderboard() {
    if (!this.state.isReady || this.state.isLoading) return;

    const selections = this._getSelections();
    if (!selections || selections.datasets.length === 0 || selections.models.length === 0 || selections.metrics.length === 0) {
      this._renderEmptyTable();
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
    .then(
      data => this._processApiResponse(data, selections.scoreWeights)
      )
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
    const metrics = getCheckedValues('.checkbox-Metrics', cb => cb.value).filter(Boolean);

    datasets = getCheckedValues('.checkbox-container input[type="checkbox"]', cb => cb.value.split('/')[1]?.replace('-', '_')).filter(Boolean);
    datasets = datasets.map(e=>{
      if (e.includes('W '))
      {
        return e.replace('W ','')+'_true'
      }
      else if (e.includes('W/O '))
      {
        return e.replace('W ','')+'_false'
      }else
      {
        return 'freq_'+e
      }
 
    })
    // const datasets_false = getUnCheckedValues('.checkbox-container input[type="checkbox"]', cb => cb.value.split('/')[1]?.replace('-', '_')).filter(Boolean);

  //   const datasets = [
  //     ...datasets_true.map(e => e + '_true'),
  //     ...datasets_false.map(e => e + '_false')
  // ];
    const modeltypes = getCheckedValues('.checkbox-ModelType', cb => cb.value).filter(Boolean)

    // console.log(modeltypes)
    // this.config.MODELS_INFO.map(method=> console.log(method))
    const models =  Object.keys(this.config.MODELS_INFO).filter(key => modeltypes.includes(this.config.MODELS_INFO[key].paradigm))
    // const models = [key for key, value in this.config.MODELS_INFO.items() if value['c'] in a]
    // console.log(datasets)
    
    const scoreOption = document.querySelector('.checkbox-Score:checked')?.value.split('/')[1] || '2';

  
    let scoreWeights = [1, 1, 1];
    if (scoreOption === '1') scoreWeights = [1, 0, 0];
    else if (scoreOption === '3') scoreWeights = [parseFloat(this.elements.scoreInput1.value) || 0, parseFloat(this.elements.scoreInput2.value) || 0, parseFloat(this.elements.scoreInput3.value) || 0];
    return { datasets, metrics, scoreWeights, models };
  },

  _renderTable(results, isRanked) {
    if (!this.elements.tableBody) return;
    
    // 排序
    results.sort((a, b) => b.rank4 - a.rank4 || b.rank1 - a.rank1 || b.rank2 - a.rank2 || b.rank3 - a.rank3);

    // 新增：根据下拉框的值截取结果
    const countToShow = this.elements.rankCountSelect ? this.elements.rankCountSelect.value : 'all';
    const finalResults = countToShow === 'all' ? results : results.slice(0, parseInt(countToShow, 10));

    this.elements.tableBody.innerHTML = finalResults.map((result, index) => {
      const info = this.config.MODELS_INFO[result.model.split(' ')[0]] || {};
      return `<tr><td>${isRanked ? index + 1 : ''}</td><td>${result.model.replace("_shot","")}</td><td>${result.rank4}</td><td>${result.rank1}</td><td>${result.rank2}</td><td>${result.rank3}</td><td><a href="${info['paper-url'] || '#'}" target="_blank">paper</a></td><td>${info.publication || 'N/A'} [<a href="${info.bib || '#'}" target="_blank">bib</a>]</td><td>${info.year || 'N/A'}</td></tr>`;
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
    // if (!this.elements.metricsContainer || !this.elements.datasetsContainer) return;
    // ['MSE', 'MAE'].forEach(category => {
    //   // const categoryDiv = this._createCategoryElement(category);
    //   // this.config.METRICS.forEach(name => categoryDiv.appendChild());
    //   this.elements.metricsContainer.appendChild(this._createCheckboxItem(`${category}/${category}`, category, `checkbox-${category}`));
    // });
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
      div.innerHTML = `<input type="checkbox" id="${id}" value="${id}" class="${className}"><label style="padding-left:2px" for="${id}">${label}</label>`;
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
function start() {
  LeaderboardApp.init();
}