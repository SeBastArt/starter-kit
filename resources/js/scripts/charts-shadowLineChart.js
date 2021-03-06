// /*
// * Chartist - Chart
// 
// Line chart
// ------------------------------

function CreateShadowLineChart(_strId, _nodeId) {
  var unit = '';
  var primary_color = '#fff';
  var secondary_color = '#000';

  let TotalTransactionLine = new Chartist.Line(
    "#" + _strId,
    {
      series: [
        {
          data: []
        }
      ]
    },
    {
      chartPadding: 0,
      axisX: {
        showLabel: true,
        showGrid: false,
        type: Chartist.FixedScaleAxis,
        divisor: 5,
        labelInterpolationFnc: function (value) {
          return moment(value).format('MM-DD HH:mm:ss');
        }
      },
      axisY: {
        showLabel: true,
        showGrid: true,
        scaleMinSpace: 40
      },
      lineSmooth: Chartist.Interpolation.simple({
        divisor: 2
      }),
      plugins: [
        Chartist.plugins.tooltip({
          class: "total-transaction-tooltip",
          appendToBody: true,
          transformTooltipTextFnc: function (tooltip) {
            var xy = tooltip.split(",");
            return moment(xy[2]).format('DD.MMM HH:mm:ss') + '<br>' + xy[1] + unit;
          }
        })
      ],
      fullWidth: true
    }
  )

  $.ajax({
    url: window.location.origin + '/api/nodes/' + _nodeId,
    type: 'GET',
    xhrFields: {
      withCredentials: true
    },
    data: {
      //'numberOfWords' : 100
      //nodeId: _nodeId
    },
    dataType: 'json',
    success: function (metaset) {
      unit = metaset.fields[0].meta.unit;
      primary_color = metaset.fields[0].meta.primary_color;
      secondary_color = metaset.fields[0].meta.secondary_color;
      TotalTransactionLine.on("created", function (data) {
        let defs = data.svg.querySelector("defs") || data.svg.elem("defs")
        defs
          .elem("linearGradient", {
            id: "lineLinearStats",
            x1: 0,
            y1: 0,
            x2: 1,
            y2: 0
          })
          .elem("stop", {
            offset: "0%",
            "stop-color": primary_color + '19'
          })
          .parent()
          .elem("stop", {
            offset: "10%",
            "stop-color": primary_color + 'ff'
          })
          .parent()
          .elem("stop", {
            offset: "30%",
            "stop-color": primary_color + 'ff'
          })
          .parent()
          .elem("stop", {
            offset: "95%",
            "stop-color": secondary_color + 'ff'
          })
          .parent()
          .elem("stop", {
            offset: "100%",
            "stop-color": secondary_color + '19'
          })
        return defs

      });
      UpdateChartistData(TotalTransactionLine, _nodeId)
    },
    error: function (request, error) {
      console.log("Request: " + JSON.stringify(request));
    }
  });
};

const UpdateChartistData = (_chart, nodeId) => {

  $.ajax({
    url: window.location.origin + '/api/nodes/'+ nodeId + '/data',
    type: 'GET',
    xhrFields: {
      withCredentials: true
    },
    data: {
      //'numberOfWords' : 10
      //nodeId: nodeId
    },
    dataType: 'json',
    success: function (dataset) {
      function updateData(element, index, array) {
        //timeformatter
        dataset.fields[0].data[index].x = new Date(element.x);
      }
      if (dataset.fields[0].data != null) {
        dataset.fields[0].data.forEach(updateData);
        _chart.data.series[0].data = dataset.fields[0].data;
        _chart.update();
      }
    },
    error: function (request, error) {
      console.log("Request: " + JSON.stringify(request));
    }
  });
}

export { CreateShadowLineChart };