<template>
  <section class="fireman">
    <div id="qibaoyali"></div>
    <div id="chukouyali"></div>
    <div id="qushi"></div>
    <div style="overflow: auto">
      <template>
        <el-table
          :data="tableData"
          stripe
          :row-style="{height: '36px'}"
          style="width: 100%">
          <el-table-column
            prop="name"
            label="设备">
          </el-table-column>
          <el-table-column
            prop="realtime"
            label="反馈频率">
          </el-table-column>
          <el-table-column
            prop="change"
            label="校准值">
          </el-table-column>
        </el-table>
      </template>
    </div>
  </section>
</template>

<script>
    import echarts from 'echarts'
    import moment from 'moment'

    export default {
    name: 'fireman',
    data () {
      return {
        tableData: [
          {
            name: '给粉机1',
            realtime: '-',
            change: '-'
          },
          {
            name: '给粉机2',
            realtime: '-',
            change: '-'
          },
          {
            name: '给粉机3',
            realtime: '-',
            change: '-'
          },
          {
            name: '给粉机4',
            realtime: '-',
            change: '-'
          },
          {
            name: '给粉机5',
            realtime: '-',
            change: '-'
          },
          {
            name: '给粉机6',
            realtime: '-',
            change: '-'
          },
          {
            name: '给粉机7',
            realtime: '-',
            change: '-'
          },
          {
            name: '给粉机8',
            realtime: '-',
            change: '-'
          },
          {
            name: '二次风机',
            realtime: '-',
            change: '-'
          }
        ],

        times: [],

        qibaoData: {
          'PT_1201A': [],
          'PT_1201B': []
        },

        chukouData: {
          'PT_3001': [],
          'PT_3002': []
        },

        qushiObj: {}
      }
    },

    methods: {
      qibaoyali() {
        const self = this
        if(self.qibaoData['PT_1201A'].length > 0){
          let shishiData = []
          for(let i=0;i<self.qibaoData['PT_1201A'].length;i++){
            shishiData.push(self.qibaoData['PT_1201A'][i] + self.qibaoData['PT_1201B'][i]) / 2
          }

          var myChart = echarts.init(document.getElementById('qibaoyali'));
          // 指定图表的配置项和数据
          var option = {
            color: ['#157DE2', '#50E3C2'],
            title: {
              text: '汽包压力',
              x: 'center'
            },
            tooltip: {
              trigger: 'axis',
              //formatter: "{b} <br> 合格率: {c}%"
            },
            legend: {
              data: ['实时值', '预测值'],
              x: 'center',
              y: 'bottom'
            },
            grid: {
              left: '5%',
              right: '5%',
              top: '10%',
              bottom: '5%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              name: '时间',
              boundaryGap: false,
              data: self.times
            },
            yAxis: {
              type: 'value',
              name: 'MPa',
            },
            series: [{
              name: '实时值',
              type: 'line',
              data: shishiData
            },
              // {
              //   name: '预测值',
              //   type: 'line',
              //   lineStyle:{
              //     normal:{type:'dashed'}
              //   },
              //   data: [130, 155, 55, 124, 70, 70, 230, 210]
              // }
            ]
          };
          // 使用刚指定的配置项和数据显示图表。
          myChart.setOption(option);
        }
      },

      chukouyali() {
        const self = this
        if(self.chukouData['PT_3001'].length > 0){
          let shishiData = []
          for(let i=0;i<self.chukouData['PT_3001'].length;i++){
            shishiData.push(self.chukouData['PT_3001'][i] + self.chukouData['PT_3002'][i]) / 2
          }

          var myChart = echarts.init(document.getElementById('chukouyali'));
          // 指定图表的配置项和数据
          var option = {
            color: ['#157DE2', '#50E3C2'],
            title: {
              text: '出口压力',
              x: 'center'
            },
            tooltip: {
              trigger: 'axis',
              //formatter: "{b} <br> 合格率: {c}%"
            },
            legend: {
              data: ['实时值', '预测值'],
              x: 'center',
              y: 'bottom'
            },
            grid: {
              left: '5%',
              right: '5%',
              top: '10%',
              bottom: '5%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              name: '时间',
              boundaryGap: false,
              data: self.times
            },
            yAxis: {
              type: 'value',
              name: 'MPa',
            },
            series: [{
              name: '实时值',
              type: 'line',
              data: shishiData
            },
              // {
              //   name: '预测值',
              //   type: 'line',
              //   lineStyle:{
              //     normal:{type:'dashed'}
              //   },
              //   data: [120, 132, 101, 134, 90, 70, 230, 210]
              // }
            ]
          };
          // 使用刚指定的配置项和数据显示图表。
          myChart.setOption(option);
        }



      },

      qushi() {
        const self = this
        if(Object.keys(self.qushiObj).length > 0){
          let legends = []
          let series = []
          for(let i in self.qushiObj) {
            legends.push(i)

            series.push({
              name: i,
              type: 'line',
              data: self.qushiObj[i]
            })
          }

          var myChart = echarts.init(document.getElementById('qushi'));
          var option = {
            // color: ['#D53A35', '#E98F6F', '#6AB0B8', '#334B5C'],
            title: {
              text: '消费趋势',
              x: 'center'
            },
            tooltip: {
              trigger: 'axis',
              //formatter: "{b} <br> 合格率: {c}%"
            },
            legend: {
              data: legends || [],
              x: 'center',
              y: 'bottom'
            },
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
              data: self.times || []
            },
            yAxis: {
              type: 'value',
              name: 't/h',
            },
            series: series || []
          };
          // 使用刚指定的配置项和数据显示图表。
          myChart.setOption(option);
        }


      },

      realtimeServer() {
        const self = this

        fetch("/dataall",{
          method:"get"
        }).then((response) => response.json())
          .then((json) => {
            const data = json.hits.hits.sort((a,b) => Number(a._id) - Number(b._id))
            self.times = []
            self.qibaoData['PT_1201A'] = []
            self.qibaoData['PT_1201B'] = []
            self.chukouData['PT_3001'] = []
            self.chukouData['PT_3002'] = []
            self.qushiObj = {}

            data.forEach(item => {
              //处理时间
              self.times.push(moment(item._id - 0).format('HH:mm'))

              for(let i in item._source) {
                //汽包压力
                if(i == 'PT_1201A'){
                  self.qibaoData['PT_1201A'].push(item._source[i])
                }
                if(i == 'PT_1201B'){
                  self.qibaoData['PT_1201B'].push(item._source[i])
                }

                //出口压力
                if(i == 'PT_3001'){
                  self.chukouData['PT_3001'].push(item._source[i])
                }
                if(i == 'PT_3002'){
                  self.chukouData['PT_3002'].push(item._source[i])
                }

                //消费趋势分组
                if(i.includes('flow_')){
                  let name = i.split('_').pop()
                  if(!self.qushiObj[name]) {
                    self.qushiObj[name] = [item._source[i]]
                  }else {
                    self.qushiObj[name].push(item._source[i])
                  }
                }
              }
            })
            self.init()
        })
      },

      nowServer() {
        const self = this
        fetch("/datanow",{
          method:"get"
        }).then((response) => response.json())
          .then((json) => {
          const data = json.hits.hits[0]._source
          self.tableData[0].realtime = data['SK_1503']
          self.tableData[1].realtime = data['SK_1504']
          self.tableData[2].realtime = data['SK_1505']
          self.tableData[3].realtime = data['SK_1506']
          self.tableData[4].realtime = data['SK_1507']
          self.tableData[5].realtime = data['SK_1508']
          self.tableData[6].realtime = data['SK_1509']
          self.tableData[7].realtime = data['SK_1510']
          self.tableData[8].realtime = data['SK_1502']
        })

      },

      init() {
        this.qibaoyali()
        this.chukouyali()
        this.qushi()
      }
    },

    created() {
      this.realtimeServer()
      this.nowServer()
    },

    mounted() {
      setInterval(() => {
        this.realtimeServer()
        this.nowServer()
        this.init()
      },10000)
    },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .fireman {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    height: inherit;
    padding: 10px;
    box-sizing: border-box;

    &>div {
      width: 49%;
      height: 48.5%;
      background: #fff;
      box-shadow: 5px 5px 5px rgba(0,21,41,.08);
      padding: 5px;
      box-sizing: border-box;
    }
  }

  .el-table td, .el-table th {
    padding: 9px 0;
  }
</style>
