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
            label="设备"
            width="180">
          </el-table-column>
          <el-table-column
            prop="realtime"
            label="反馈频率"
            width="180">
          </el-table-column>
          <el-table-column
            prop="predict"
            label="校准值">
            <template slot-scope="scope">
              <predict :row="scope.row" :ref="'pre'+scope.row.name"></predict>
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
    name: 'firemanTest',
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

        ids: [],
        times: [],
        finalTime: '',
        finalData: {},

        qibaoData: {
          'PT_1201A': [],
          'PT_1201B': []
        },
        qibaoPredict: [],
        qibao5: [],
        qibao10: [],

        chukouData: {
          'PT_3001': [],
          'PT_3002': []
        },
        chukouPredict: [],
        chukou5: [],
        chukou10: [],

        qushiObj: {},
        predictData: {},

        chart1: {},
        chart2: {},
        chart3: {}
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

          yuce2[yuce2.length - 1] = self.qibaoPredict[self.qibaoPredict.length - 1]
          yuce1 = self.qibaoPredict.concat(self.dataAdd([self.predictData.drum_pressure11,null,null,null,self.predictData.drum_pressure12,null,null,null,null,self.predictData.drum_pressure13]))
          yuce2 = yuce2.concat(self.dataAdd([self.predictData.drum_pressure21,null,null,null,self.predictData.drum_pressure22,null,null,null,null,self.predictData.drum_pressure23]))

          self.chart1 = echarts.init(document.getElementById('qibaoyali'));
          // 指定图表的配置项和数据
          var option = {
            // color: ['#157DE2', '#50E3C2', '#FAAD14'],
            title: {
              text: '汽包压力',
              x: 'center'
            },
            tooltip: {
              trigger: 'axis',
              //formatter: "{b} <br> 合格率: {c}%"
            },
            legend: {
              data: ['实时值', '预测值', '预测5', '预测10', '校准值'],
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
              data: shishiData,
              showSymbol: false,
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#157DE2'
                  }, {
                    offset: 1,
                    color: '#fff'
                  }])
                }
              },
              lineStyle: {
                width: 0
              }
            },
              {
                name: '预测值',
                type: 'line',
                // lineStyle:{
                //   normal:{type:'dashed'}
                // },
                data: yuce1
              },
              {
                name: '校准值',
                type: 'line',
                // lineStyle:{
                //   normal:{type:'dashed'}
                // },
                data: yuce2
              },
              {
                name: '预测5',
                type: 'line',
                // lineStyle:{
                //   normal:{type:'dashed'}
                // },
                data: self.qibao5
              },
              {
                name: '预测10',
                type: 'line',
                // lineStyle:{
                //   normal:{type:'dashed'}
                // },
                data: self.qibao10
              }
            ]
          };
          // 使用刚指定的配置项和数据显示图表。
          self.chart1.setOption(option);
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

          yuce2[yuce2.length - 1] = self.chukouPredict[self.chukouPredict.length - 1]
          yuce1 = yuce1.concat(self.dataAdd([self.predictData.steam_pressure11,null,null,null,self.predictData.steam_pressure12,null,null,null,null,self.predictData.steam_pressure13]))
          yuce2 = yuce2.concat(self.dataAdd([self.predictData.steam_pressure21,null,null,null,self.predictData.steam_pressure22,null,null,null,null,self.predictData.steam_pressure23]))

          self.chart2 = echarts.init(document.getElementById('chukouyali'));
          // 指定图表的配置项和数据
          var option = {
            // color: ['#157DE2', '#50E3C2', '#FAAD14'],
            title: {
              text: '出口压力',
              x: 'center'
            },
            tooltip: {
              trigger: 'axis',
              //formatter: "{b} <br> 合格率: {c}%"
            },
            legend: {
              data: ['实时值', '预测值', '预测5', '预测10', '校准值'],
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
              min: 0.7,
              max: 1,
              splitNumber: 4
            },
            series: [{
              name: '实时值',
              type: 'line',
              data: shishiData,
              showSymbol: false,
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#157DE2'
                  }, {
                    offset: 1,
                    color: '#fff'
                  }])
                }
              },
              lineStyle: {
                width: 0
              }
            },
              {
                name: '预测值',
                type: 'line',
                // lineStyle:{
                //   normal:{type:'dashed'}
                // },
                data: yuce1
              },
              {
                name: '校准值',
                type: 'line',
                // lineStyle:{
                //   normal:{type:'dashed'}
                // },
                data: yuce2
              },
              {
                name: '预测5',
                type: 'line',
                // lineStyle:{
                //   normal:{type:'dashed'}
                // },
                data: self.chukou5
              },
              {
                name: '预测10',
                type: 'line',
                // lineStyle:{
                //   normal:{type:'dashed'}
                // },
                data: self.chukou10
              },
            ]
          };
          // 使用刚指定的配置项和数据显示图表。
          self.chart2.setOption(option);
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

          self.chart3 = echarts.init(document.getElementById('qushi'));
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
          self.chart3.setOption(option);
        }


      },

      realtimeServer() {
        const self = this

        fetch("/data?minute=-50",{
          method:"get"
        }).then((response) => response.json())
          .then((json) => {
            // console.log(json,'shishi')
            const data = json.hits.hits.sort((a,b) => Number(a._id) - Number(b._id))
            self.times = []
            self.ids = []
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
              //处理ID
              self.ids.push(item._id)

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
            fetch("/predict?minute=-50",{
              method:"get"
            }).then((response) => response.json())
              .then((json) => {
                // console.log(json,'yuce')
                const data = [...json.hits.hits].sort((a,b) => Number(a._id) - Number(b._id))
                self.predictData = [...data].pop()._source
                self.tableData[0].predict = self.predictData['SK_1503'] || 0
                self.tableData[1].predict = self.predictData['SK_1504'] || 0
                self.tableData[2].predict = self.predictData['SK_1505'] || 0
                self.tableData[3].predict = self.predictData['SK_1506'] || 0
                self.tableData[4].predict = self.predictData['SK_1507'] || 0
                self.tableData[5].predict = self.predictData['SK_1508'] || 0
                self.tableData[6].predict = self.predictData['SK_1509'] || 0
                self.tableData[7].predict = self.predictData['SK_1510'] || 0
                self.tableData[8].predict = self.predictData['SK_1502'] || 0
                self.tableData[9].realtime = self.predictData['coals1'] || 0
                self.tableData[9].predict = self.predictData['coals2'] || 0

                self.qibaoPredict = []
                self.chukouPredict = []

                self.qibao5 = []
                self.chukou5 = []

                for(let i=0;i<self.ids.length;i++) {
                  self.qibaoPredict.push(null)
                  self.chukouPredict.push(null)

                  for(let j=0;j<data.length;j++) {
                    if(self.ids[i] == data[j]._id) {
                      self.qibaoPredict[i] = data[j]._source['drum_pressure11']
                      self.chukouPredict[i] = data[j]._source['steam_pressure11']
                      self.qibao5[i] = data[j]._source['drum_pressure12']
                      self.chukou5[i] = data[j]._source['steam_pressure12']
                      self.qibao10[i] = data[j]._source['drum_pressure13']
                      self.chukou10[i] = data[j]._source['steam_pressure13']
                      break;
                    }
                  }
                }
                //需要一个null占位，元素是预测1min后的
                // self.qibaoPredict.unshift(null)
                // self.chukouPredict.unshift(null)
                // self.qibaoPredict.pop()
                // self.chukouPredict.pop()

                // console.log(self.qibaoPredict,self.qibaoPredict.length)

                self.qibao5 = self.arrShift(self.qibao5,4)
                self.chukou5 = self.arrShift(self.chukou5,4)

                self.qibao10 = self.arrShift(self.qibao10,9)
                self.chukou10 = self.arrShift(self.chukou10,9)

                for(let i in self.$refs) {
                  self.$refs[i].forSymbol()
                }
                self.init()
              })

          })
      },

      arrShift(arr,num) {
        let newArr = []
        for(let i=0;i<num;i++) {
          newArr.push(null)
        }
        newArr = newArr.concat(arr)
        // for(let i=0;i<num;i++) {
        //   newArr.pop()
        // }

        return newArr
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
          })
      },

      init() {
        this.qibaoyali()
        this.chukouyali()
        this.qushi()

        const self = this
        window.onresize = function () {
          self.chart1.resize();
          self.chart2.resize();
          self.chart3.resize();
        }
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
