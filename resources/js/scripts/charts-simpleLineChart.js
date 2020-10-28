// /*
// * ChartJS - Chart
// 
// Line chart
// ------------------------------

function CreateSimpleLineChart(strId, _nodeId){
   var timeFormat = 'YYYY-MM-DD[T]HH:mm:ssZ';
   function DesignSimpleLineChart(_canvasId, _chart, _nodeId){
      var _chartCanvas = document.getElementById(_canvasId).getContext("2d");
      _chartCanvas.globalAlpha = 0.7;

      $.ajax({
         url : window.location.origin + '/meta/node/',
         type : 'GET',
         data : {
            //'numberOfWords' : 10
            nodeId: _nodeId
         },
         async: false,
         dataType:'json',
         success : function(metaset) {     
            function updateDataset(element, index, array)
            {   
               var gradientStroke = _chartCanvas.createLinearGradient(500, 0, 0, 200);
               var gradientFill = _chartCanvas.createLinearGradient(500, 0, 0, 200);
               gradientStroke.addColorStop(0, element.primarycolor);
               gradientStroke.addColorStop(1, element.secondarycolor);
   
               gradientFill.addColorStop(0, element.primarycolor);
               gradientFill.addColorStop(1, element.secondarycolor);
   
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
                  fill: (element.fill == 1) ? true : false,
                  backgroundColor: gradientFill,
                  borderWidth: 1,      
                  yAxisID :'y-axis-' + index,
               };
   
               _chart.config.data.datasets[index] = dataset;
               
               let myMax = Math.ceil(element.max/5)*5;
               let myMin = (element.min > 0.0) ? 0.0 : Math.round(element.min/5)*5;
               let myPosition = (index != 0) ? 'left' : 'right';
               let myId = 'y-axis-' + index;
               let myDisplay = (index == 0) ? 'false' : 'true';
               let YAxis = {
                  display: true,
                  ticks: {
                     max: myMax,
                     min: myMin,
                     stepSize: 5
                  },
                  position: myPosition,
                  id: myId,
               }
               //Text mittig
               _chart.config.options.scales.yAxes[index] = YAxis;
            }
   
            _chart.config.options.title.text = 'no data';
            metaset.fields.forEach(updateDataset)
            _chart.update();
         },
         error : function(request,error)
         {
            console.log("Request: "+JSON.stringify(request));
         }
      });
   }

   var LineSL2ctx = document.getElementById(strId).getContext("2d");
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
                  value: Date.now(),
                  borderColor: "red",
                  label: {
                  content: "Now",
                  enabled: true,
                  position: "top"
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

export { CreateSimpleLineChart };