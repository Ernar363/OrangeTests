/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 90.07782101167315, "KoPercent": 9.922178988326849};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6351351351351351, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"], "isController": false}, {"data": [0.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login-5"], "isController": false}, {"data": [0.926829268292683, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/directory/viewDirectory-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/directory/viewDirectory-0"], "isController": false}, {"data": [0.8163265306122449, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login-1"], "isController": false}, {"data": [0.7959183673469388, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login-0"], "isController": false}, {"data": [0.9565217391304348, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-0"], "isController": false}, {"data": [0.3877551020408163, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-1"], "isController": false}, {"data": [0.3979591836734694, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login-2"], "isController": false}, {"data": [0.9565217391304348, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-2"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate"], "isController": false}, {"data": [0.8478260869565217, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-3"], "isController": false}, {"data": [0.8478260869565217, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-4"], "isController": false}, {"data": [0.6739130434782609, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-5"], "isController": false}, {"data": [0.6521739130434783, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-6"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/directory/viewDirectory"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.9473684210526315, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/directory/viewDirectory-6"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/directory/viewDirectory-5"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/directory/viewDirectory-4"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/directory/viewDirectory-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/directory/viewDirectory-2"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1028, 102, 9.922178988326849, 794.4114785992216, 102, 5642, 261.0, 3069.3, 3406.4999999999995, 4047.460000000001, 8.39135722856653, 2882.72098737215, 10.810024822561159], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/login", 52, 21, 40.38461538461539, 3188.788461538461, 117, 5642, 3333.0, 4195.900000000001, 4847.999999999995, 5642.0, 0.4244655407446105, 1023.8848436977071, 1.6417269778461638], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/login-5", 49, 14, 28.571428571428573, 2232.3265306122453, 104, 3915, 2769.0, 3602.0, 3713.0, 3915.0, 0.40769461177488603, 421.88651353764516, 0.2786974885179885], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/directory/viewDirectory-1", 41, 3, 7.317073170731708, 261.390243902439, 112, 329, 263.0, 313.00000000000006, 320.6, 329.0, 0.4066653441777425, 1.675828518647094, 0.2740225463697679], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/login-4", 49, 12, 24.489795918367346, 2578.9591836734694, 109, 4264, 3069.0, 3787.0, 3927.5, 4264.0, 0.4072304176189487, 487.7261940317889, 0.28235702784126326], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/directory/viewDirectory-0", 41, 0, 0.0, 244.12195121951217, 220, 301, 239.0, 277.0, 281.7, 301.0, 0.4071054800369374, 0.6595585853332804, 0.2794874535800459], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/login-1", 49, 9, 18.367346938775512, 155.6326530612245, 102, 461, 117.0, 434.0, 460.0, 461.0, 0.4170638703527169, 0.6135766259107314, 0.2859168329957102], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/login-0", 49, 0, 0.0, 657.1020408163267, 245, 2164, 277.0, 2152.0, 2158.5, 2164.0, 0.40982578222359756, 1.8405160224107793, 0.25534067290884305], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-0", 46, 0, 0.0, 310.1956521739131, 225, 933, 242.5, 502.10000000000014, 752.3499999999997, 933.0, 0.42117985295329485, 0.684184782359889, 0.38364348613311117], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/login-3", 49, 11, 22.448979591836736, 558.1020408163266, 102, 996, 560.0, 755.0, 930.5, 996.0, 0.4155077674513262, 52.38561214257852, 0.2848500515144834], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-1", 46, 0, 0.0, 274.47826086956513, 244, 395, 261.5, 325.7000000000001, 361.59999999999997, 395.0, 0.4210988850033871, 1.902159376201505, 0.3038985117358428], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/login-2", 49, 10, 20.408163265306122, 656.6122448979593, 104, 1083, 674.0, 939.0, 1004.5, 1083.0, 0.4150713245010673, 81.06259582641547, 0.28860428031714835], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-2", 46, 2, 4.3478260869565215, 161.3695652173913, 103, 393, 114.0, 340.20000000000005, 356.5, 393.0, 0.42180551098069785, 0.4713880753977351, 0.3363053619733162], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate", 46, 2, 4.3478260869565215, 1856.6304347826087, 589, 4243, 1091.5, 3821.6, 3975.2999999999997, 4243.0, 0.41968122473929587, 462.806535508681, 2.359976295993869], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-3", 46, 1, 2.1739130434782608, 300.9347826086957, 104, 875, 122.5, 711.8000000000002, 787.3, 875.0, 0.4217977754752102, 27.27883805888205, 0.34025713044554684], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-4", 46, 1, 2.1739130434782608, 262.17391304347836, 103, 629, 117.5, 572.3000000000001, 605.8, 629.0, 0.42184032426682316, 18.16685124568989, 0.3361719194193276], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-5", 46, 1, 2.1739130434782608, 1074.1956521739137, 103, 3486, 241.0, 3234.9000000000005, 3400.0499999999997, 3486.0, 0.4217977754752102, 203.86439975196456, 0.3381438433571435], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-6", 46, 0, 0.0, 1097.782608695652, 103, 3333, 135.5, 2926.4, 3026.55, 3333.0, 0.42180551098069785, 212.77433834991515, 0.332436901104947], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/directory/viewDirectory", 42, 6, 14.285714285714286, 614.9999999999999, 152, 920, 619.0, 720.7, 743.1, 920.0, 0.4151920757626683, 4.135528548162281, 2.0130559990312187], "isController": false}, {"data": ["Test", 45, 23, 51.111111111111114, 5700.577777777776, 3776, 9748, 5149.0, 7918.8, 9639.699999999999, 9748.0, 0.4147274319155799, 1438.0936596383808, 5.830709486313995], "isController": true}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/directory/viewDirectory-6", 38, 2, 5.2631578947368425, 125.1052631578947, 104, 383, 112.0, 156.1, 179.6999999999994, 383.0, 0.3775196955999086, 0.3619578742660719, 0.29088187483235145], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/directory/viewDirectory-5", 38, 2, 5.2631578947368425, 125.26315789473689, 104, 377, 113.0, 159.0, 176.5499999999994, 377.0, 0.3775196955999086, 0.3619578742660719, 0.2945685906096943], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/directory/viewDirectory-4", 38, 2, 5.2631578947368425, 118.78947368421053, 104, 169, 112.5, 154.2, 156.64999999999998, 169.0, 0.3775121946373399, 0.3616014216314487, 0.29124475953466655], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/directory/viewDirectory-3", 38, 2, 5.2631578947368425, 127.28947368421048, 105, 380, 115.0, 158.1, 179.5499999999994, 380.0, 0.37750469397283953, 0.36159423709281646, 0.29492554216628086], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/directory/viewDirectory-2", 38, 1, 2.6315789473684212, 125.8421052631579, 104, 386, 112.5, 157.2, 176.99999999999937, 386.0, 0.37750469397283953, 0.36311737229413577, 0.29050165903378666], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503/Service Temporarily Unavailable", 80, 78.43137254901961, 7.782101167315175], "isController": false}, {"data": ["Assertion failed", 22, 21.568627450980394, 2.140077821011673], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1028, 102, "503/Service Temporarily Unavailable", 80, "Assertion failed", 22, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/login", 52, 21, "Assertion failed", 18, "503/Service Temporarily Unavailable", 3, "", "", "", "", "", ""], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/login-5", 49, 14, "503/Service Temporarily Unavailable", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/directory/viewDirectory-1", 41, 3, "503/Service Temporarily Unavailable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/login-4", 49, 12, "503/Service Temporarily Unavailable", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/login-1", 49, 9, "503/Service Temporarily Unavailable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/login-3", 49, 11, "503/Service Temporarily Unavailable", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/login-2", 49, 10, "503/Service Temporarily Unavailable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-2", 46, 2, "503/Service Temporarily Unavailable", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate", 46, 2, "Assertion failed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-3", 46, 1, "503/Service Temporarily Unavailable", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-4", 46, 1, "503/Service Temporarily Unavailable", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-5", 46, 1, "503/Service Temporarily Unavailable", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/directory/viewDirectory", 42, 6, "503/Service Temporarily Unavailable", 4, "Assertion failed", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/directory/viewDirectory-6", 38, 2, "503/Service Temporarily Unavailable", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/directory/viewDirectory-5", 38, 2, "503/Service Temporarily Unavailable", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/directory/viewDirectory-4", 38, 2, "503/Service Temporarily Unavailable", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/directory/viewDirectory-3", 38, 2, "503/Service Temporarily Unavailable", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/directory/viewDirectory-2", 38, 1, "503/Service Temporarily Unavailable", 1, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
