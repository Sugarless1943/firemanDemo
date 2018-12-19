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
            prop="predict"
            label="校准值">
            <template slot-scope="scope">
              <predict :row="scope.row"></predict>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
  </section>
</template>

<script>
    import echarts from 'echarts'
    import moment from 'moment'
    import predict from './predict'

    export default {
    name: 'fireman',
    components: { predict },
    data () {
      return {
        tableData: [
          {
            name: '给粉机1',
            realtime: 0,
            predict: 0
          },
          {
            name: '给粉机2',
            realtime: 0,
            predict: 0
          },
          {
            name: '给粉机3',
            realtime: 0,
            predict: 0
          },
          {
            name: '给粉机4',
            realtime: 0,
            predict: 0
          },
          {
            name: '给粉机5',
            realtime: 0,
            predict: 0
          },
          {
            name: '给粉机6',
            realtime: 0,
            predict: 0
          },
          {
            name: '给粉机7',
            realtime: 0,
            predict: 0
          },
          {
            name: '给粉机8',
            realtime: 0,
            predict: 0
          },
          {
            name: '二次风机',
            realtime: 0,
            predict: 0
          },
          {
            name: '煤粉消耗',
            realtime: 0,
            predict: 0
          }
        ],

        times: [],
        finalTime: '',
        finalData: {},

        qibaoData: {
          'PT_1201A': [],
          'PT_1201B': []
        },
        qibaoPredict: [],

        chukouData: {
          'PT_3001': [],
          'PT_3002': []
        },
        chukouPredict: [],

        qushiObj: {},
        predictData: {}
      }
    },

    methods: {

      timeAdd(arr) {
        const final = moment(this.finalTime)
        let times = []
        for(let i=0;i<10;i++) {
          times.push(final.add(1,'m').format('HH:mm'))
        }
        return [...arr].concat(times)
      },

      dataAdd(arr) {
        for(let i=0;i<arr.length;i++) {
          if(arr[i] == null){
            let [start,end,len] = [arr[i-1],'',0]
            for(let j=i;j<arr.length;j++) {
              if(arr[j]){
                end = arr[j]
                len = j - i + 1
                break
              }
            }

            for(let k=0;k<len;k++) {
              arr[i+k] = arr[i-1] + ((end-start)/len)*(k+1)
            }
          }
        }

        return arr
      },

      qibaoyali() {
        const self = this
        if(self.qibaoData['PT_1201A'].length > 0){
          let [shishiData,yuce1,yuce2] = [[],self.qibaoPredict,[]]
          for(let i=0;i<self.qibaoData['PT_1201A'].length;i++){
            shishiData.push((self.qibaoData['PT_1201A'][i] + self.qibaoData['PT_1201B'][i]) / 2)
            yuce2.push(null)
          }

          let lastData = (self.finalData['PT_1201A'] + self.finalData['PT_1201B']) / 2
          // yuce1[yuce1.length - 1] = lastData
          yuce2[yuce2.length - 1] = lastData

          yuce1 = self.qibaoPredict.concat(self.dataAdd([self.predictData.drum_pressure11,null,null,null,self.predictData.drum_pressure12,null,null,null,null,self.predictData.drum_pressure13]))
          yuce2 = yuce2.concat(self.dataAdd([self.predictData.drum_pressure21,null,null,null,self.predictData.drum_pressure22,null,null,null,null,self.predictData.drum_pressure23]))

          var myChart = echarts.init(document.getElementById('qibaoyali'));
          // 指定图表的配置项和数据
          var option = {
            color: ['#157DE2', '#50E3C2', '#FAAD14'],
            title: {
              text: '汽包压力',
              x: 'center'
            },
            tooltip: {
              trigger: 'axis',
              //formatter: "{b} <br> 合格率: {c}%"
            },
            legend: {
              data: ['实时值', '预测值', '校准值'],
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
              data: self.timeAdd(self.times)
              // data: self.times
            },
            yAxis: {
              type: 'value',
              name: 'MPa',
              // scale: true
              min: 1,
              max: 3,
              splitNumber: 4
            },
            series: [{
              name: '实时值',
              type: 'line',
              data: shishiData
            },
              {
                name: '预测值',
                type: 'line',
                lineStyle:{
                  normal:{type:'dashed'}
                },
                data: yuce1
              },
              {
                name: '校准值',
                type: 'line',
                lineStyle:{
                  normal:{type:'dashed'}
                },
                data: yuce2
              }
            ]
          };
          // 使用刚指定的配置项和数据显示图表。
          myChart.setOption(option);
        }
      },

      chukouyali() {
        const self = this
        if(self.chukouData['PT_3001'].length > 0){
          let [shishiData,yuce1,yuce2] = [[],self.chukouPredict,[]]
          for(let i=0;i<self.chukouData['PT_3001'].length;i++){
            shishiData.push((self.chukouData['PT_3001'][i] + self.chukouData['PT_3002'][i]) / 2)
            yuce2.push(null)
          }

          let lastData = (self.finalData['PT_3001'] + self.finalData['PT_3002']) / 2
          // yuce1[yuce1.length - 1] = lastData
          yuce2[yuce2.length - 1] = lastData
          yuce1 = yuce1.concat(self.dataAdd([self.predictData.steam_pressure11,null,null,null,self.predictData.steam_pressure12,null,null,null,null,self.predictData.steam_pressure13]))
          yuce2 = yuce2.concat(self.dataAdd([self.predictData.steam_pressure21,null,null,null,self.predictData.steam_pressure22,null,null,null,null,self.predictData.steam_pressure23]))

          var myChart = echarts.init(document.getElementById('chukouyali'));
          // 指定图表的配置项和数据
          var option = {
            color: ['#157DE2', '#50E3C2', '#FAAD14'],
            title: {
              text: '出口压力',
              x: 'center'
            },
            tooltip: {
              trigger: 'axis',
              //formatter: "{b} <br> 合格率: {c}%"
            },
            legend: {
              data: ['实时值', '预测值', '校准值'],
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
              data: self.timeAdd(self.times)
              // data: self.times
            },
            yAxis: {
              type: 'value',
              name: 'MPa',
              // scale: true
              min: 0.8,
              max: 1,
              splitNumber: 4
            },
            series: [{
              name: '实时值',
              type: 'line',
              data: shishiData
            },
              {
                name: '预测值',
                type: 'line',
                lineStyle:{
                  normal:{type:'dashed'}
                },
                data: yuce1
              },
              {
                name: '校准值',
                type: 'line',
                lineStyle:{
                  normal:{type:'dashed'}
                },
                data: yuce2
              }
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

        fetch("/data?minute=-30",{
          method:"get"
        }).then((response) => response.json())
          .then((json) => {
            const data = json.hits.hits.sort((a,b) => Number(a._id) - Number(b._id))
            self.times = []
            let finalData = [...data].pop()
            self.finalTime = finalData._id - 0
            self.finalData = finalData._source
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
                if(i.includes('flow_') && !i.includes('去高新区总表')){
                  let name = i.split('_').pop()
                  if(!self.qushiObj[name]) {
                    self.qushiObj[name] = [item._source[i]]
                  }else {
                    self.qushiObj[name].push(item._source[i])
                  }
                }
              }
            })

            //预测值
            fetch("/predict?minute=-30",{
              method:"get"
            }).then((response) => response.json())
              .then((json) => {
                const data = [...json.hits.hits].pop()._source
                self.predictData = data
                self.tableData[0].predict = data['SK_1503'] || 0
                self.tableData[1].predict = data['SK_1504'] || 0
                self.tableData[2].predict = data['SK_1505'] || 0
                self.tableData[3].predict = data['SK_1506'] || 0
                self.tableData[4].predict = data['SK_1507'] || 0
                self.tableData[5].predict = data['SK_1508'] || 0
                self.tableData[6].predict = data['SK_1509'] || 0
                self.tableData[7].predict = data['SK_1510'] || 0
                self.tableData[8].predict = data['SK_1502'] || 0
                self.tableData[9].predict = data['coals2'] || 0

                self.qibaoPredict = [null]
                self.chukouPredict = [null]
                json.hits.hits.forEach(item => {
                  self.qibaoPredict.push(item._source['drum_pressure11'])
                  self.chukouPredict.push(item._source['steam_pressure11'])
                })
                self.qibaoPredict.pop()
                self.chukouPredict.pop()
                self.init()
              })

        })
      },

      nowServer() {
        const self = this
        //实时值
        fetch("/data?minute=-1",{
          method:"get"
        }).then((response) => response.json())
          .then((json) => {
          const data = json.hits.hits[0]._source
          self.tableData[0].realtime = data['SK_1503'] || 0
          self.tableData[1].realtime = data['SK_1504'] || 0
          self.tableData[2].realtime = data['SK_1505'] || 0
          self.tableData[3].realtime = data['SK_1506'] || 0
          self.tableData[4].realtime = data['SK_1507'] || 0
          self.tableData[5].realtime = data['SK_1508'] || 0
          self.tableData[6].realtime = data['SK_1509'] || 0
          self.tableData[7].realtime = data['SK_1510'] || 0
          self.tableData[8].realtime = data['SK_1502'] || 0
          self.tableData[9].realtime = data['coals1'] || 0
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
    padding: 6px 0;
  }
</style>
