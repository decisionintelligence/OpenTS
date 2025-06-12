


function displayResults(rankCounts, connectTexts, connectUrls, paperUrls, codeUrls,pub,bib,year,table,is_rank) {

    const tableBody = document.getElementById(table).getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear existing table body
    
    rankCounts.sort((a, b) => {
        // 优先比较 rank4，降序排列
        if (b['rank4'] !== a['rank4']) {
          return b['rank4'] - a['rank4'];
        }

        // 如果 rank4 相同，比较 rank1，降序排列
        if (b['rank1'] !== a['rank1']) {
          return b['rank1'] - a['rank1'];
        }

        // 如果 rank1 也相同，比较 rank2，降序排列
        if (b['rank2'] !== a['rank2']) {
          return b['rank2'] - a['rank2'];
        }

        // 如果 rank2 也相同，比较 rank3，降序排列
        return b['rank3'] - a['rank3'];
      });


    var total = 0
    rankCounts.forEach(( counts, index) => {
    
        model = counts['model']
        total += counts['rank1']
        if (!is_rank)
        {
            index=''
        }
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index+1}</td>
            <td>${model}</td>
            <td>${counts['rank4']}</td>
            <td>${counts['rank1']}</td>
            <td>${counts['rank2']}</td>
            <td>${counts['rank3']}</td>
            <td>
                <a href="${paperUrls[model]}"  target="_blank">paper</a>
            </td>
            <td>
             ${pub[model]} [<a href="${bib[model]}" target="_blank">bib</a>]
            </td>
            <td>
                ${year[model]}
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function phraseMultiTable(results, table, datasets,select_metrics,select_horizons,select_score) {
     // Prepare results
    const result = [];
    
    const data =  results
    // Extract new fields
    const connectTexts = {}, connectUrls = {}, paperUrls = {}, codeUrls = {}, pub = {}, year = {}, bib = {};

    // Extract metadata from the first seven rows
    for (let i = 0; i < 7; i++) {
        const row = data[i];
        for (const key in row) {
            if (key !== 'Dataset-Quantity-metrics') {
                if (i === 0) connectTexts[key] = row[key];
                if (i === 1) connectUrls[key] = row[key];
                if (i === 2) paperUrls[key] = row[key];
                if (i === 3) codeUrls[key] = row[key];
                if (i === 4) pub[key] = row[key];
                if (i === 5) bib[key] = row[key];
                if (i === 6) year[key] = row[key];
            }
        }
    }
    const all_datasets = new Set();
    
    // Loop through all rows in the data
    for (let i = 7; i < data.length; i++) {
        const row = data[i];
        
        // Check if 'Dataset-Quantity-metrics' exists and is not null
        if (row['Dataset-Quantity-metrics']) {
            all_datasets.add(row['Dataset-Quantity-metrics'].split('-')[0]);
        }
    }
    
    // Remove the first seven rows (metadata)
    const experimentData = data.slice(7);
      const filteredExperimentData = experimentData.filter(row => {
        if (row && row['Dataset-Quantity-metrics']) {
            const dataset = row['Dataset-Quantity-metrics'];
            var items = dataset.split('-')
            var metric = items[items.length - 1].toUpperCase()
            var horizon = items[items.length - 2]
            return dataset && datasets.includes(dataset.split('-')[0]) && select_metrics.includes(metric) && select_horizons.includes(horizon);
        }
        return false;
    });

    console.log(datasets,select_metrics,select_horizons,select_score)

    if (filteredExperimentData.length == 0 || datasets.length ==0)
    {
        const tableBody = document.getElementById('multivariateTable2').getElementsByTagName('tbody')[0];
       
        const modelColumns = Object.keys(experimentData[0]).slice(1);
        const rankCounts = {};
        modelColumns.forEach(model => {
            rankCounts[model] = {1: 0, 2: 0, 3: 0, 4: 0};
        });
        Object.entries(rankCounts).forEach(([model, values]) => {
        result.push({"model": model, 'rank1': values['1'], 'rank2': values['2'], 'rank3': values['3'], 'rank4': values['4']});
    });
        const url = 'http://120.77.11.87:3333/https://www.kdocs.cn/api/v3/ide/file/ckR1qyzsn6Hj/script/V2-6eUD5ERNWnaJUCBZVdvbTf/sync_task';
// const url = 'http://120.77.11.87:3333/https://www.baidu.com';

        const headers = {
        // 'Content-Type': 'application/json',
        'AirScript-Token': '5rgDVviMAZi1UxMq7IPsUw',  
        'Origin':''
        };
        const body = {
            "Context": {
                "argv": {
                    "metrics": ['mae','mse'],
                    "datasets": datasets,
                    "models": ["PatchTST","Crossformer","FEDformer","Informer","Triformer","DLinear","NLinear","MICN","TimesNet","TCN","FiLM","RNN","Linear Regression","VAR","iTransformer","FITS","TimeMixer","Non-stationary Transformer","Pathformer","DUET","PDF"],
                    "pred_len": [96,192,336.720],
                }
            }
        };

        
        fetch(url, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(body)
        })
        .then(response => {
          // 1. 首先检查响应状态
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          // 2. 正确解析JSON响应
          return response.json();
        })
        .then(data => {
          // 3. 处理解析后的数据
          console.log('请求成功:', data);
           displayResults(result, connectTexts, connectUrls, paperUrls, codeUrls, pub, bib, year, table,false);
          
        })
        .catch(error => {
          // 4. 添加错误处理
          console.error('请求失败:', error);
        });
       
        return all_datasets;
    }
    // Identify model columns
    const modelColumns = Object.keys(filteredExperimentData[0]).slice(1);
    const rankCounts = {};
    modelColumns.forEach(model => {
        rankCounts[model] = {1: 0, 2: 0, 3: 0, 4: 0};
    });
    
    var socre31 =  document.getElementById('score/3/1');
    var socre32 =  document.getElementById('score/3/2');
    var socre33 =  document.getElementById('score/3/3');
    var v1=0,v2=0,v3=0
    if (socre31.value)
    {
        v1 =  parseFloat(socre31.value)
    }
    if (socre32.value)
    {
        v2 = parseFloat(socre32.value)
    }
    if (socre33.value)
    {
        v3 =  parseFloat(socre33.value)
    }
    // Process filtered experiment data
    filteredExperimentData.forEach(row => {

        const validModels = modelColumns.filter(model => !isNaN(row[model]));
        validModels.sort((a, b) => row[a] - row[b]);
        minValue = Infinity
        secondMinValue = Infinity
        thirdMinValue = Infinity
        validModels.forEach(model => {
        const value = row[model];
        if(typeof value === 'number')
        {
          if (value < minValue) {
          // 更新第三小值、第二小值和最小值
          [thirdMinValue, secondMinValue, minValue] = [secondMinValue, minValue, value];
          } else if (value < secondMinValue && value !== minValue) {
              // 更新第三小值和第二小值
              [thirdMinValue, secondMinValue] = [secondMinValue, value];
          } else if (value < thirdMinValue && value !== minValue && value !== secondMinValue) {
              // 更新第三小值
              thirdMinValue = value;
          }
        }
        });
     
        // 最后对每个模型的对应排名做计数加一
        validModels.forEach(model => {
            if (row[model]== minValue)
            {
                rank = 1;
                rankCounts[model][rank] = (rankCounts[model][rank] || 0) + 1;
            }else if(row[model]== secondMinValue)
            {
                rank = 2;
                rankCounts[model][rank] = (rankCounts[model][rank] || 0) + 1;
            }else if(row[model]== thirdMinValue)
            {
                rank = 3;
                rankCounts[model][rank] = (rankCounts[model][rank] || 0) + 1;
            }
        });
        validModels.forEach(model => {
            if (select_score[0] == '1' )
            {
                rankCounts[model][4] = rankCounts[model][1];
            }
            else if (select_score[0] == '2' )
            {
                rankCounts[model][4] = rankCounts[model][1] + rankCounts[model][2] + rankCounts[model][3];
            }
            else if (select_score[0] == '3' )
            {
                rankCounts[model][4] = parseFloat(( v1* rankCounts[model][1] + v2 * rankCounts[model][2] + v3* rankCounts[model][3]).toFixed(2))
            }
            
        });
    });


    Object.entries(rankCounts).forEach(([model, values]) => {
        result.push({"model": model, 'rank1': values['1'], 'rank2': values['2'], 'rank3': values['3'], 'rank4': values['4']});
    });
    
    // Display results
    displayResults(result, connectTexts, connectUrls, paperUrls, codeUrls, pub, bib, year, table,true);
    return all_datasets;
}


function populateCheckboxes(datasets) {
    const container = document.getElementById('dataset-container-mul');
    const groupedDatasets = {};

    datasets.forEach(dataset => {
        const [category, name] = dataset.split('/');
        if (!groupedDatasets[category]) {
            groupedDatasets[category] = [];
        }
        groupedDatasets[category].push(name);
    });
    
    groupedDatasets['Metrics'] = ['MAE', 'MSE'];
    
    const sortedCategories = Object.keys(groupedDatasets).sort((a, b) => groupedDatasets[b].length - groupedDatasets[a].length);
    
    sortedCategories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';
    
        const categoryLabel = document.createElement('h3');
        const categoryCheckbox = document.createElement('input');
        categoryCheckbox.type = 'checkbox';
        categoryCheckbox.id = `select-all-${category}`;
        categoryCheckbox.addEventListener('change', () => toggleCategory(category, categoryCheckbox.checked));
    
        categoryLabel.appendChild(categoryCheckbox);
        categoryLabel.appendChild(document.createTextNode(` ${category}`));
        categoryDiv.appendChild(categoryLabel);
    
        const d = document.createElement('div');
        if (category == 'Metrics') {
            d.className = 'checkbox-wrapper1';
        }
        groupedDatasets[category].forEach(name => {
            name = name.replace('_', '-');
            const div = document.createElement('div');
            div.className = 'checkbox-item';
    
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `${category}/${name}`;
            checkbox.value = `${category}/${name}`;
            checkbox.className = `checkbox-${category}`;
            checkbox.addEventListener('change', handleChildCheckboxChange);
    
            const label = document.createElement('label');
            label.htmlFor = `${category}/${name}`;
            label.textContent = name;
    
            div.appendChild(checkbox);
            div.appendChild(label);
            d.appendChild(div);
            categoryDiv.appendChild(d);
        });
        if (category == 'Metrics') {
            // let container1 = document.getElementById('dataset-container-mul-up');
            // container1.appendChild(categoryDiv);
        } else {
            container.appendChild(categoryDiv);
        }
    });
}

function updateP1checkbox()
{
    checked=true

    p1_dataset=['Traffic/Traffic', 'Energy/Solar','Health/ILI','select-all-Electricity','Environment/Weather','Economic/Exchange']
    
    p1_dataset.forEach(checkbox_id=>{
        var check_box = document.getElementById(checkbox_id)
        if(!check_box.checked)
        {
            checked=false
        }
    })
    category = 'Electricity'
    const checkboxes = document.querySelectorAll(`.checkbox-${category}`);
    checkboxes.forEach(checkbox => {
        if(!checkbox.checked)
        {
            checked=false
        }
    });
    
    check_box = document.getElementById('select-p1')
    check_box.checked = checked


}
function toggleCategory(category, isChecked) {
    const checkbox = document.getElementById('select-all-' + category);
    checkbox.checked = isChecked;
    const checkboxes = document.querySelectorAll(`.checkbox-${category}`);
    checkboxes.forEach(checkbox => {
        checkbox.checked = isChecked;
    });
    updateAllCheckbox();
    submitSelection();  
}

function submitSelection() {
    const selectedDatasets = [];
    const checkboxes = document.querySelectorAll('.checkbox-container input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectedDatasets.push(checkbox.value.replace('-','_'));
        }
    });

    select_metrics = []
    const checkboxes1 = document.querySelectorAll('#dataset-container-mul-up input[type="checkbox"]');
    checkboxes1.forEach(checkbox => {
        if (checkbox.checked) {
            items = checkbox.value.split('/')
            if (items.length == 2) {
                select_metrics.push(items[1])
            }
        }
    }); 
    
    select_horizons = []
    const checkboxes2 = document.querySelectorAll('#dataset-container-mul-down input[type="checkbox"]');
    checkboxes2.forEach(checkbox => {
        if (checkbox.checked) {
            items = checkbox.value.split('/')
            if (items.length == 2) {
                select_horizons.push(items[1])
            }
        }
    });
    
    select_score = []
    const checkboxes3 = document.querySelectorAll('#dataset-container-mul-down1 input[type="radio"]');
    checkboxes3.forEach(checkbox => {
        if (checkbox.checked) {
            items = checkbox.value.split('/')
            if (items.length == 2) {
                select_score.push(items[1])
            }
        }
    });
    phraseMultiTable(all_data_ , 'multivariateTable2', selectedDatasets, select_metrics, select_horizons, select_score)
}

function updateParentCheckbox(category) {
    const checkboxes = document.querySelectorAll(`.checkbox-${category}`);
    const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
    document.getElementById(`select-all-${category}`).checked = allChecked;
}

function handleChildCheckboxChange(event) {
    const checkbox = event.target;
    const category = checkbox.className.split('-')[1];
    if (category != 'Score')
    {
        updateParentCheckbox(category);
        updateAllCheckbox();
        
    }
    else
    {
        checkbox.checked = true
        var id = checkbox.value
        for (let i1 = 1; i1 < 4; i1++) {
            const scoreBox = document.getElementById(`Score/${i1}`);
            if (scoreBox.value!=id) {
                scoreBox.checked = false;
            }
        }
    }
    submitSelection();
}


function toggleSelectAll(selectAllCheckbox) {
    const container = document.getElementById('all');
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox;
    });
    submitSelection(); // 调用submitSelection来处理选中的数据
}


function p1(checked)
{
    toggleSelectAll(false)
    p1_dataset=['Traffic/Traffic', 'Energy/Solar','Health/ILI','select-all-Electricity','Environment/Weather','Economic/Exchange']

    p1_dataset.forEach(checkbox_id=>{
        var check_box = document.getElementById(checkbox_id)
        check_box.checked = checked;
    })
    toggleCategory('Electricity', checked) 
    submitSelection()
}
function setContainerHeight() {
    // const tableContainer = document.querySelector('#table-container1');
    // const mainContainer = document.querySelector('#main-container1');
    // mainContainer.style.height = tableContainer.offsetHeight + 'px';

    // const tableContainer = document.querySelector('#table-container1');
    // const mainContainer = document.querySelector('#main-container1');
    // mainContainer.style.height = tableContainer.offsetHeight + 'px';
}
let lastValidValue = '';
function validateInput(input) {
    let value = input.value;

    // 保存光标位置
    const cursorPos = input.selectionStart;
    
    // 处理整数和小数部分
    let [integerPart, decimalPart] = value.split('.');
    

    // 处理整数部分：去除前导零并限制最大两位数
    
    // 去除前导零
    if (integerPart.length > 1) {
        integerPart = integerPart.replace(/^0+/, ''); 
    }
    
    // 处理小数部分：限制最多两位
    if (decimalPart) {
        decimalPart = decimalPart.slice(0, 2);
    }
    
    // 合并整数部分和小数部分
    let newValue = integerPart;
    if (decimalPart) {
        newValue += '.' + decimalPart;
    }
    
    // 如果小数点后有数字，但是小数点前的数字部分为空，应至少显示 `0`
    if (newValue === '' || newValue === '.') {
        newValue = '0';
    }
    
    // 验证并更新输入值
    if (newValue !== value) {
        input.value = newValue;
    }
    
    // 更新最后一个有效值
    lastValidValue = input.value;
    
    // 恢复光标的位置
    // input.setSelectionRange(cursorPos, cursorPos);
    submitSelection()
}


function findBottomThreeKeys(obj) {
    let minKey = null;
    let secondMinKey = null;
    let thirdMinKey = null;
    let minValue = Infinity;
    let secondMinValue = Infinity;
    let thirdMinValue = Infinity;

    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'number') {
            if (value < minValue) {
                // 更新第三小值和键
                thirdMinValue = secondMinValue;
                // 更新第二小值和键
                secondMinValue = minValue;
                // 更新最小值和键
                minValue = value;

            } else if (value < secondMinValue && value!=minValue) {
                // 更新第三小值和键
                thirdMinValue = secondMinValue;
                // 更新第二小值和键
                secondMinValue = value;

            } else if (value < thirdMinValue&& value!=minValue&& value!=secondMinValue) {
                // 更新第三小值和键
                thirdMinValue = value;
            }
        }
    }

    return {
        minValue,
        secondMinValue,
        thirdMinValue,
    };
}
function format(num)
{
  if (typeof(num)!='number')
  {
    return 'NaN'
  }else
  {
    return num.toFixed(3)
  }
}
function displayResults11(rankCounts, connectTexts, connectUrls, paperUrls, codeUrls,pub,bib,year,table,is_rank) {

    const tableHeadr = document.getElementById(table).getElementsByTagName('thead')[0];
    const tableBody = document.getElementById(table).getElementsByTagName('tbody')[0];

    const rowHeadr = document.createElement('tr');
    const rowHeadrYear = document.createElement('tr');
    const rowHeadr2 = document.createElement('tr');
    models = []
    year.forEach((res) =>{
        key = res[0]

        if (key!='Dataset-Quantity-metrics')
        {
            models.push(key)
            const th = document.createElement('th');
            if (key=='Non-stationary Transformer')
            {
                th.innerHTML='Stationary'
            }else if (key=='Linear Regression')
            {
                th.innerHTML='LR'
            }else
            {
                th.innerHTML = key
            }
            th.style='padding-bottom:5px'
            th.colSpan  = 2
            rowHeadr.appendChild(th)
        }else
        {
          const th = document.createElement('th');
            th.innerHTML = 'Model'
            th.className='sticky-col-header sticky-col2'
            th.style='left:0;vertical-align: middle;'
            th.colSpan  = 2
            th.rowSpan  = 2
            rowHeadr.appendChild(th)
        }
        })
    
    rowHeadr.className='sticky-th'
    rowHeadr.style='z-index:3'
    rowHeadrYear.className='sticky-th'
    rowHeadrYear.style='top:37.4px;font-size:14px' 
    rowHeadr2.className='sticky-th'
    rowHeadr2.style='top:62.4px;box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 3px -2px;' 
    year.forEach((res) =>{

       
        key = res[0]
        if (key!='Dataset-Quantity-metrics')
        {
            const thYear = document.createElement('th');
            thYear.style='padding:0px;height:25px'
            thYear.innerHTML = res[1]
            thYear.colSpan  = 2
            rowHeadrYear.appendChild(thYear)

            const th1 = document.createElement('th');
            const th2 = document.createElement('th');
            th1.innerHTML = 'mse'
            th2.innerHTML = 'mae'
            rowHeadr2.appendChild(th1)
            rowHeadr2.appendChild(th2)
        }else
        {
            const th = document.createElement('th');
            th.innerHTML = 'Metrics'
            th.className='sticky-col-header sticky-col2'
            th.style='left:0'
            th.colSpan  = 2
            rowHeadr2.appendChild(th)
        }
        })


    tableHeadr.appendChild(rowHeadr)
    tableHeadr.appendChild(rowHeadrYear)
    tableHeadr.appendChild(rowHeadr2)

    jinpai=0
    yinpai=0
    tongpai=0
    watch='DUET'
    watch='Pathformer'
    watch='PDF'
    for (let i = 0; i < rankCounts.length; i += 2) {
      if (i + 1 < rankCounts.length) {
      const row = document.createElement('tr');
      result_mae = rankCounts[i]
      result_mse = rankCounts[i+1]
      mae_sort = findBottomThreeKeys(result_mae)
      mse_sort = findBottomThreeKeys(result_mse)
       year.forEach((res)=>{
        key = res[0]
        if (key=='Dataset-Quantity-metrics')
        {
          const td1 = document.createElement('td');
          const div1 = document.createElement('div');
          const td2 = document.createElement('td');
          dataset = result_mae[key].split('/')[1]
          content = dataset.split('-')
          if (i %8 ==0)
          {
            div1 .innerHTML = content[0].replace('_','-')
            if (i%16==0)
            {
              div1.style=' writing-mode: vertical-rl; transform: rotate(180deg);margin:auto;text-rendering: geometricPrecision; -webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;width: 20px '
              td1.style='background-color: #f2f2f2;'
            }else
            {
              div1.style=' writing-mode: vertical-rl; transform: rotate(180deg);margin:auto;text-rendering: geometricPrecision; -webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale; width: 20px '
              td2.style='background-color: #ffffff;'
            }
            td1.className='sticky-col'
            td1.rowSpan  = 4
            td1.appendChild(div1)
            row.appendChild(td1)
          }
          
          td2.innerHTML = content[1]

          td2.className='sticky-col2'
          if (i%4==0)
          {
            td2.style='background-color: #ffffff;'
          }else
          {
            td2.style='background-color: #f2f2f2;'
          }
          
          row.appendChild(td2)
        }else
        {
          const td1 = document.createElement('td');
          const td2 = document.createElement('td');
          if (result_mae[key] == mae_sort['minValue'])
          {

            if(key == watch)
            {
              jinpai +=1
            }
            td1.innerHTML = '<b>'+format(result_mae[key])+'</b>'
          }
          else if (result_mae[key] == mae_sort['thirdMinValue'])
          {
            if(key == watch)
            {
              tongpai +=1
            }
             td1.innerHTML = '<u>'+format(result_mae[key])+'</u>'
          }else if (result_mae[key] == mae_sort['secondMinValue'])
          {
            if(key == watch)
            {
              yinpai +=1
            }
             td1.innerHTML = '<p class="double-underline">'+format(result_mae[key])+'</p>'
          }
          else
          {
            td1.innerHTML = format(result_mae[key])
          }

          if (result_mse[key] == mse_sort['minValue'])
          {
             if(key == watch)
            {
              jinpai +=1
            }
            td2.innerHTML = '<b>'+format(result_mse[key])+'</b>'
          }
          else if (result_mse[key] == mse_sort['thirdMinValue'])
          {
             if(key == watch)
            {
              tongpai +=1
            }
             td2.innerHTML = '<u>'+format(result_mse[key])+'</u>'
          }else if (result_mse[key] == mse_sort['secondMinValue'])
          {
            if(key == watch)
            {
              yinpai +=1
            }
             td2.innerHTML = '<p class="double-underline">'+format(result_mse[key])+'</p>'
          }
          else
          {
            td2.innerHTML = format(result_mse[key])
          }

          row.appendChild(td2)
          row.appendChild(td1)
        }
        
      })
      tableBody.append(row)
      }
    };

}

function phraseMultiTable11(results, table) {
     // Prepare results
    const data = results;

    // Extract new fields
    var connectTexts = {}, connectUrls = {}, paperUrls = {}, codeUrls = {}, pub = {}, year = {}, bib = {};
    
    // Extract metadata from the first seven rows
    for (let i = 0; i < 7; i++) {
        const row = data[i];
        for (const key in row) {
            if (key !== 'Dataset-Quantity-metrics') {
                if (i === 0) connectTexts[key] = row[key];
                if (i === 1) connectUrls[key] = row[key];
                if (i === 2) paperUrls[key] = row[key];
                if (i === 3) codeUrls[key] = row[key];
                if (i === 4) pub[key] = row[key];
                if (i === 5) bib[key] = row[key];
                if (i === 6) year[key] = row[key];
            }
        }
    }
   
    // Remove the first seven rows (metadata)
    const experimentData = data.slice(7);
    year['Dataset-Quantity-metrics']=9999
    year = Object.entries(year);
    year.sort((a, b) => b[1] - a[1]);
    // Display results
    displayResults11(experimentData, connectTexts, connectUrls, paperUrls, codeUrls, pub, bib, year, table,true);
}