// /*
// * ChartJS - Chart
// 
// Line chart
// ------------------------------
import 'https://www.chartjs.org/dist/2.9.3/Chart.js';
import moment from "/vendors/moment/dist/moment.js";

function CreateChartJs(strId, _nodeId){
   var timeFormat = 'YYYY-MM-DD[T]HH:mm:ssZ';
   function DesignSimpleLineChart(_canvasId, _chart, _nodeId){
      var _chartCanvas = document.getElementById(_canvasId).getContext("2d");
      _chartCanvas.globalAlpha = 0.7;

      $.ajax({
         url : window.location.origin + '/api/nodes/' + _nodeId,
         type : 'GET',
         xhrFields: {
            withCredentials: true
         },
         data : {
            //nodeId: _nodeId
         },
         dataType:'json',
         success : function(metaset) {     
            function updateDataset(element, index, array)
            {   
               var gradientStroke = _chartCanvas.createLinearGradient(500, 0, 0, 200);
               var gradientFill = _chartCanvas.createLinearGradient(500, 0, 0, 200);
               gradientStroke.addColorStop(0, element.meta.primary_color);
               gradientStroke.addColorStop(1, element.meta.secondary_color);
   
               gradientFill.addColorStop(0, element.meta.primary_color);
               gradientFill.addColorStop(1, element.meta.secondary_color);
   
               let dataset =
               {
                  label: element.title,
                  borderColor: gradientStroke,
                  pointColor: "#fff",
                  pointBorderColor: gradientStroke,
                  pointBackgroundColor: "#fff",
                  pointHoverBackgroundColor: gradientStroke,
                  pointHoverBorderColor: gradientStroke,
                  pointRadius: 1,
                  pointBorderWidth: 1,
                  pointHoverRadius: 4,
                  pointHoverBorderWidth: 4,
                  fill: (element.meta.fill == 1) ? true : false,
                  backgroundColor: gradientFill,
                  borderWidth: 1,      
                  yAxisID :'y-axis-' + index,
               };
   
               _chart.config.data.datasets[index] = dataset;
               let YAxis = {
                  display: false,
                  id: 'y-axis-' + index,
               }
               //Text mittig
               _chart.config.options.scales.yAxes[index] = YAxis;
            }
   
            _chart.config.options.title.text = 'no data';
            metaset.fields.forEach(updateDataset);    
            _chart.update();
            UpdateChartJSData(_chart, _nodeId);
         },
         error : function(request,error)
         {
            console.log("Request: "+JSON.stringify(request));
         }
      });
   }

   var LineSL2ctx = document.getElementById(strId).getContext("2d");
   let timestampValue = null;
   console.log($('#lower_limit').val());

   timestampValue = new Date(moment($('#timestamp').val(), 'DD/MM/YYYY LTS').format());
   // Chart Options
   var config = {
      type: 'line',    
      data: {
         datasets: [],
      },
      options: {
         annotation: {
            annotations: [
               {
                  type: "line",
                  mode: "vertical",
                  scaleID: "x-axis-0",
                  value: timestampValue,
                  borderColor: "red",
                  label: {
                  content: "Here",
                  enabled: true,
                  position: "top"
                  }
               },
               {
                  type: 'line',
                  mode: 'horizontal',
                  scaleID: 'y-axis-0',
                  value: $('#upper_limit').val(),
                  borderColor: 'rgb(75, 192, 192)',
                  borderWidth: 4,
                  label: {
                    enabled: false,
                    content: 'Test label'
                  }
                },
                {
                  type: 'line',
                  mode: 'horizontal',
                  scaleID: 'y-axis-0',
                  value: $('#lower_limit').val(),
                  borderColor: 'rgb(75, 192, 192)',
                  borderWidth: 4,
                  label: {
                    enabled: false,
                    content: 'Test label'
                  }
                }
            ]
         },
         responsive: true,
         maintainAspectRatio: false,
         datasetStrokeWidth: 3,
         pointDotStrokeWidth: 4,
         tooltipFillColor: "rgba(0,0,0,0.6)",
         legend: {
            display: false,
            position: 'bottom',
         },
         hover: {
            mode: 'label'
         },
         scales: {
            xAxes: [{
               display: true,
               type: 'time',
               time: {
                  parser: timeFormat,
     
                  displayFormats: {
                        millisecond: 'HH:mm:ss.SSS',
                        second: 'HH:mm:ss',
                        minute: 'HH:mm',
                        hour: 'HH:mm'
                  }
               },
               offset: true,
               ticks: {
                  major: {
                     enabled: true,
                     fontStyle: 'bold'
                  },
                  autoSkip: true,
                  autoSkipPadding: 75,
                  maxRotation: 0,
                  sampleSize: 100
               },
               gridLines: {
                  display: false,
                  drawBorder: false,
               },
            }],
            yAxes: [{
               display: false,
               gridLines: {
                  display: false,
                  drawBorder: false,
               },
               ticks: {
                  min: 0,
                  max: 100,
                  stepSize: 10
               }
            }]
         },
         title : {
            display: true,
            fullWidth: false,
            text: "no data",
            fontSize: 40,
        }
      }
   };
   // Create the chart
   var chart = new Chart(LineSL2ctx, config); 
   DesignSimpleLineChart(strId, chart, _nodeId);
   return chart;
};


const UpdateChartJSData = async (_chart, nodeId) => {
   //console.log(moment.utc($('#start_date').val() + ' ' + $('#start_time').val(), 'DD/MM/YYYY LTS').format());
   $.ajax({
      url : window.location.origin + '/api/nodes/'+ nodeId + '/data',
      type : 'GET',
      xhrFields: {
         withCredentials: true
      },
      data : {
         nodeId: nodeId,
         startDate: moment.utc($('#start_date').val() + ' ' + $('#start_time').val(), 'DD/MM/YYYY LTS').format(),
         endDate: moment.utc($('#end_date').val() + ' ' + $('#end_time').val(), 'DD/MM/YYYY LTS').format(),
      },
      dataType:'json',
      success : function(dataset) {  
         function updateData(element, index, array) {
            _chart.config.data.datasets[index].data = element.data;

            let myMax;
            let myMin;
            if(element.meta != null){
               myMax = Math.ceil(element.meta.max/5)*5;
               myMin = (element.meta.min > 0.0) ? 0.0 : Math.min(Math.round(element.meta.min/5)*5, -5);
            } 
            let myPosition = (index != 0) ? 'right' : 'left';
            let YAxis = {
               ticks: {
                  max: myMax,
                  min: myMin,
                  stepSize: 5
               },
               position: myPosition,
            }
            //Text mittig
            _chart.config.options.scales.yAxes[index] = YAxis;
         };
         if(dataset.fields.length > 0 && dataset.fields[0].data.length > 0){
            _chart.config.options.title.display = false;
            $('#max_' + nodeId).text('max: ' + dataset.fields[0].meta['max'] + dataset.fields[0].meta.unit);
            $('#min_' + nodeId).text('min: ' + dataset.fields[0].meta['min'] + dataset.fields[0].meta.unit);
            $('#lastValuePrime_' + nodeId).text(dataset.fields[0].meta.last.value + dataset.fields[0].meta.unit);
            $('#lastupdate_' + nodeId).text('last update: ' + dataset.fields[0].meta.last.timestamp);
        
            if(dataset.fields.length > 1 && dataset.fields[1].data.length > 0){
               $('#lastValueSec_' + nodeId).text(dataset.fields[1].meta.last.value + dataset.fields[1].meta.unit);
            } 
         }

         dataset.fields.forEach(updateData);
        
         _chart.update();   
      },
      error : function(request,error)
      {
         console.log("Request: "+JSON.stringify(request));
      }
   });
}

export { CreateChartJs };