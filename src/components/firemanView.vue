<template>
  <div style="width: 100%;height: 100%;box-sizing: border-box" id="chart">

  </div>
</template>

<script>
  import moment from 'moment'
  import echarts from 'echarts'

    export default {
      name: "firemanView",

      data() {
        return {
          times: [],

          series: [],
          chart: null
        }
      },

      methods: {
        objNum(obj) {
          for(let i in obj) {
            if(obj[i] && typeof obj[i] == 'number') obj[i] = obj[i].toFixed(4) - 0
          }
          return obj
        },

        chartInit() {
          this.chart = echarts.init(document.getElementById('chart'));
          var option = {
            // color: ['#D53A35', '#E98F6F', '#6AB0B8', '#334B5C'],
            title: {
              text: '',
              x: 'center'
            },
            tooltip: {
              trigger: 'axis',
              //formatter: "{b} <br> 合格率: {c}%"
            },
            // legend: {
            //   data: legends || [],
            //   x: 'center',
            //   y: 'bottom'
            // },
            grid: {
              left: '5%',
              right: '5%',
              top: '12%',
              bottom: '12%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              name: '时间',
              boundaryGap: false,
              data: this.times || []
            },
            yAxis: {
              type: 'value',
              name: 't/h',
            },
            series: this.series || []
          };
          // 使用刚指定的配置项和数据显示图表。
          this.chart.setOption(option);
        },

        realtimeServer() {
          const self = this
          fetch("/predict?minute=-50",{
            method:"get"
          }).then((response) => response.json())
            .then((json) => {
              console.log(json,'shishi')
              self.times = []
              self.series = []
              const data = [...json.hits.hits].sort((a, b) => Number(a._id) - Number(b._id))
              let obj = {}
              data.forEach(item => {
                item._source = self.objNum(item._source)
                self.times.push(moment(item._id - 0).format('HH:mm'))

                const source = item._source
                for(let i in source){
                  if(i.startsWith('delta_SK_15')){
                    if(obj[i]){
                      obj[i].push(source[i])
                    }else {
                      obj[i] = [source[i]]
                    }
                  }
                }
              })

              console.log(obj, 'obj')

              for(let i in obj){
                if(i === 'delta_SK_1503') {
                  self.series.push({
                    name: '给粉机1',
                    type: 'line',
                    data: obj[i]
                  })
                }
                if(i === 'delta_SK_1504') {
                  self.series.push({
                    name: '给粉机2',
                    type: 'line',
                    data: obj[i]
                  })
                }
                if(i === 'delta_SK_1505') {
                  self.series.push({
                    name: '给粉机3',
                    type: 'line',
                    data: obj[i]
                  })
                }
                if(i === 'delta_SK_1506') {
                  self.series.push({
                    name: '给粉机4',
                    type: 'line',
                    data: obj[i]
                  })
                }
                if(i === 'delta_SK_1507') {
                  self.series.push({
                    name: '给粉机5',
                    type: 'line',
                    data: obj[i]
                  })
                }
                if(i === 'delta_SK_1508') {
                  self.series.push({
                    name: '给粉机6',
                    type: 'line',
                    data: obj[i]
                  })
                }
                if(i === 'delta_SK_1509') {
                  self.series.push({
                    name: '给粉机7',
                    type: 'line',
                    data: obj[i]
                  })
                }
                if(i === 'delta_SK_1510') {
                  self.series.push({
                    name: '给粉机8',
                    type: 'line',
                    data: obj[i]
                  })
                }
                if(i === 'delta_SK_1502') {
                  self.series.push({
                    name: '二次风机',
                    type: 'line',
                    data: obj[i]
                  })
                }
              }

              this.chartInit()
            })
        }
      },

      created() {
        this.realtimeServer()
      },

      mounted() {
        setInterval(() => {
          this.realtimeServer()
        },10000)
      },
    }
</script>

<style scoped>

</style>
