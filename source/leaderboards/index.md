# Leaderboards

**Table of Contents**

1. [Overview](#Overview)
1. [Rules](#Rules)
1. [Univariate time series](#Univariate-time-series)
1. [Multivariate time series](#Multivariate-time-series)

## Overview

Public leaderboards allow researchers to keep track of state-of-the-art methods and encourage reproducible research.

### How Leaderboards Work?

### How to Submit?

Use the [Google form](https://forms.gle/7PB7375i5P1rHgng6) to make a submission.

The results will be posted after we check the model validity (expect to take about about a week).



## Rules
对于单变量预测的模型，我们对10种数据集的msmape指标根据数据集的数据量进行加权平均，并按平均msmape进行排序。
对于多变量预测的模型，我们在PEMS04、PEMS-BAY、METR-LA、PEMS08等25个数据集上，分别进行了4次分割，每个方法进行100次实验并分别得到MAE、MSE指标，分实验、分指标对方法进行排序，并计算每种方法的排名情况，依次按照排名第1、2、3、4的次数进行排序。



## Univariate time series
<style>
   /* 基本表格样式 */
/* 基本表格样式 */
table {
  width: 100%;
  border-collapse: collapse;
  font-family: Arial, sans-serif;
}

/* 表头样式 */
th {
  background-color: #3498db; /* 表头背景色 */
  color: white; /* 表头文字颜色 */
  padding: 10px; /* 调整表头内边距 */
  text-align: center; /* 居中对齐 */
}

/* 偶数行背景色 */
tr:nth-child(even) {
  background-color: #f2f2f2; /* 偶数行背景色 */
}

/* 奇数行背景色 */
tr:nth-child(odd) {
  background-color: #ffffff; /* 奇数行背景色 */
}

/* 单元格样式 */
td {
  padding: 0;
  border: 1px solid #ddd; /* 单元格边框 */
  text-align: center; /* 居中对齐 */
   white-space: nowrap; 
}

</style>

<script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.0/papaparse.min.js"></script>

<script>
// Fetch the JSON data from the local file
fetch('univariate.json')
    .then(response => response.json()) // Parse the JSON data
    .then(data => {
        // Extract weights and methods
        const weights = data.weight;
        const methods = data.methods;

        // Calculate weighted averages
        methods.forEach(method => {
            const scores = method.metrics;
            const weightedSum = scores.reduce((sum, score, index) => sum + score * weights[index], 0);
            const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
            method.weightedAverage = weightedSum / totalWeight;
        });

        // Sort methods by weighted average
        methods.sort((a, b) => a.weightedAverage - b.weightedAverage);

        // Get table body element
        const tableBody = document.getElementById('univariateTable').querySelector('tbody');

        // Populate table with sorted methods
        methods.forEach((method, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${method.name}</td>
                <td>${method.weightedAverage.toFixed(2)}</td>
                <td>${method.contact}</td>
                <td>${method.Paper}</td>
                <td>${method.code}</td>
            `;
            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error('Error loading JSON data:', error));
</script>

The univariate datasets are carefully curated from 16 open-source datasets, thus covering dozens of domains. To fully reflect the complexity of real-world time series, we employed Pattern Frequency Analysis (PFA), a variation of Principal Component Analysis (PCA). PFA preserves the original values of individual time series data points. We employ the concept of explained variance, representing the ratio between the variance of a single time series and the sum of variances across all individual time series. A threshold 𝑡 for the explained variance is set to 0.9. This implies that for each dataset, we choose to retain the minimum number of time series required to encompass 90% of the variance contributed by the remaining time series. As a result, the selected data exhibits pronounced heterogeneity. Compared to datasets with strong homogeneity, it can better reflect methods performance. In the end, we select 8,068 time series to enable the combined dataset to capture the diversity of real-world time series. Statistical information is reported in Table 1.


<div style="display: flex;justify-content: center; /* 水平居中 */padding: 0;">
<table id="univariateTable" class="table" style="width:80%">
    <thead>
        <tr>
            <th>Rank</th>
            <th>Method</th>
            <th>Msmape</th>
            <th>Contact</th>
            <th>References</th>
        </tr>
    </thead>
    <tbody>
    </tbody>
</table>
</div>

<center style="font-size:14px;color:#C0C0C0;text-decoration:underline">Table 1: Univariate forecasting results.</center>

<script>
    const csvFilePath1 = 'univariate.csv'; 
    fetch(csvFilePath1)
        .then(response => response.text())
        .then(text => Papa.parse(text, {
            header: true,
            dynamicTyping: true,
            complete: function(results) {
                const data = results.data;
                processData(data);
            }
        }));

    function processData(data) {
        // Extract metadata
        const contactText = data[0];
        const contactUrl = data[1];
        const paperUrl = data[2];
        const codeUrl = data[3];

        // Filter out metadata rows
        const dataRows = data.slice(4);

        // Calculate the weighted average for each method
        const numsIndex = dataRows[0].nums;
        const methods = Object.keys(dataRows[0]).filter(key => key !== 'nums' && key !== 'Dataset');

        const weightedAverages = methods.map(method => {
            let weightedSum = 0;
            let totalNums = 0;
            dataRows.forEach(row => {
                const nums = parseFloat(row.nums);
                const value = parseFloat(row[method]);
                if (!isNaN(nums) && !isNaN(value)) {
                    weightedSum += nums * value;
                    totalNums += nums;
                }univariateTable
            });
            const weightedAverage = weightedSum / totalNums;
            return {
                method: method,
                weightedAverage: weightedAverage,
                contact: contactText[method],
                contactUrl: contactUrl[method],
                paperUrl: paperUrl[method],
                codeUrl: codeUrl[method]
            };
        });

        weightedAverages.sort((a, b) => a.weightedAverage - b.weightedAverage);

        const tableBody = document.querySelector('#univariateTable tbody');
        tableBody.innerHTML = weightedAverages.map((entry, rank) => `
            <tr>
                <td>${rank + 1}</td>
                <td>${entry.method}</td>
                <td>${entry.weightedAverage.toFixed(2)}</td>
                <td><a href="mailto:${entry.contactUrl}" target="_blank">${entry.contact}</a></td>
                <td><a href="${entry.paperUrl}" target="_blank">paper</a>, <a href="${entry.codeUrl}" target="_blank">code</a></td>
            </tr>
        `).join('');
    }
</script>


## Multivariate time series
Table 2 lists statistics of the 25 multivariate time series datasets, which cover 10 domains. The frequencies vary from 5 minutes to 1 month, the range of feature dimensions varies from 5 to 2,000, and the sequence length varies from 728 to 57,600. This substantial diversity of the datasets enables comprehensive studies of forecasting methods. To ensure fair comparisons, we choose a fixed data split ratio for each dataset chronologically, i.e., 7:1:2 or 6:2:2, for training, validation and testing.


<script>
function displayResults(rankCounts, connectTexts, connectUrls, paperUrls, codeUrls) {
    const tableBody = document.getElementById('multivariateTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear existing table body
    const sortedModels = Object.entries(rankCounts).sort((a, b) => {
        for (let rank = 1; rank <= 4; rank++) {
            if (b[1][rank] !== a[1][rank]) {
                return b[1][rank] - a[1][rank];
            }
        }
        return 0;
    });
    sortedModels.forEach(([model, counts], index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${model}</td>
            <td>${counts[1]}</td>
            <td>${counts[2]}</td>
            <td>${counts[3]}</td>
            <td>${counts[4]}</td>
            <td><a href="mailto:${connectUrls[model]}" target="_blank">${connectTexts[model]}</a></td>
            <td>
                <a href="${paperUrls[model]}"  target="_blank">paper</a>,
                <a href="${codeUrls[model]}" target="_blank">code</a>
            </td>
        `;
        tableBody.appendChild(row);
    });
}
const csvFilePath = 'multivariate.csv'; // Update this to the path of your CSV file
fetch(csvFilePath)
    .then(response => response.text())
    .then(text => Papa.parse(text, {
        header: true,
        dynamicTyping: true,
        complete: function(results) {
            const data = results.data;
            // Extract new fields
            const connectTexts = {};
            const connectUrls = {};
            const paperUrls = {};
            const codeUrls = {};
            data[0] = Object.keys(data[0]).reduce((obj, key) => {
                if (key !== 'Dataset-Quantity-metrics') {
                    connectTexts[key] = data[0][key];
                }
                return obj;
            }, {});
            data[1] = Object.keys(data[1]).reduce((obj, key) => {
                if (key !== 'Dataset-Quantity-metrics') {
                    connectUrls[key] = data[1][key];
                }
                return obj;
            }, {});
            data[2] = Object.keys(data[2]).reduce((obj, key) => {
                if (key !== 'Dataset-Quantity-metrics') {
                    paperUrls[key] = data[2][key];
                }
                return obj;
            }, {});
            data[3] = Object.keys(data[3]).reduce((obj, key) => {
                if (key !== 'Dataset-Quantity-metrics') {
                    codeUrls[key] = data[3][key];
                }
                return obj;
            }, {});
            // Remove the first four rows (new fields) from the data
            const experimentData = data.slice(4);
            const modelColumns = Object.keys(experimentData[0]).slice(1);
            const rankCounts = {};
            modelColumns.forEach(model => {
                rankCounts[model] = {1: 0, 2: 0, 3: 0, 4: 0};
            });
            experimentData.forEach(row => {
                const validModels = modelColumns.filter(model => {
                    const value = row[model];
                    return value !== null && value !== undefined && !isNaN(value);
                });
                validModels.sort((a, b) => row[a] - row[b]);
                validModels.slice(0, 4).forEach((model, index) => {
                    rankCounts[model][index + 1]++;
                });
            });
            displayResults(rankCounts, connectTexts, connectUrls, paperUrls, codeUrls);
        }
    }));


</script>
<div style="display: flex;justify-content: center; /* 水平居中 */padding: 0;">
    <table id="multivariateTable" class="table" style="width:90%">
        <thead>
            <tr>
                <th>Rank</th>
                <th>Model</th>
                <th>Rank 1</th>
                <th>Rank 2</th>
                <th>Rank 3</th>
                <th>Rank 4</th>
                <th>Contact</th>
                <th>References</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
</div>
<center style="font-size:14px;color:#C0C0C0;text-decoration:underline">Table 2: Multivariate forecasting results.</center>
