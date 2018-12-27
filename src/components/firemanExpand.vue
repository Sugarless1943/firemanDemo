<template>
  <section class="fireman">
    <div id="qugaoxin"></div>
    <div id="geifen"></div>
    <div style="height: auto; width: 100%">
      <el-table
        :data="tableData"
        stripe
        style="width: 100%">
        <el-table-column
          prop="name"
          label="name"
          width="220">
        </el-table-column>
        <el-table-column
          :prop="item"
          :label="item"
          v-for="item in tableList">
        </el-table-column>
      </el-table>
    </div>
  </section>
</template>

<script>
  import echarts from 'echarts'
  import moment from 'moment'

  export default {
    name: 'firemanExpand',
    data () {
      return {
        ids: [],
        times: [],
        finalTime: '',
        finalData: {},

        qugaoxinData: [],
        qugaoxinPredict: [],
        qugaoxinPredict5: [],

        ye1: [],
        ye2: [],
        ye3: [],
        ye4: [],
        ye5: [],
        ye6: [],
        ye7: [],
        ye8: [],

        chart1: {},
        chart2: {},

        tableData: [],
        tableList: []
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
              arr[i+k] = (arr[i-1] + ((end-start)/len)*(k+1)).toFixed(4) - 0
            }
          }
        }

        return arr
      },

      realtimeServer() {
        const self = this

        fetch("/data?minute=-50",{
          method:"get"
        }).then((response) => response.json())
          .then((json) => {
            console.log(json,'shishi')
            const data = json.hits.hits.sort((a,b) => Number(a._id) - Number(b._id))
            data.forEach(item => item._source = self.objNum(item._source))

            self.times = []
            self.ids = []
            let finalData = [...data].pop()
            self.finalTime = finalData._id - 0
            self.finalData = finalData._source

            self.qugaoxinData = []

            self.ye1 = []
            self.ye2 = []
            self.ye3 = []
            self.ye4 = []
            self.ye5 = []
            self.ye6 = []
            self.ye7 = []
            self.ye8 = []

            data.forEach(item => {
              //处理时间
              self.times.push(moment(item._id - 0).format('HH:mm'))
              //处理ID
              self.ids.push(item._id)
              self.qugaoxinData.push(item._source['flow_去高新区总表'])

              self.ye1.push(item._source['SK_1503'])
              self.ye2.push(item._source['SK_1504'])
              self.ye3.push(item._source['SK_1505'])
              self.ye4.push(item._source['SK_1506'])
              self.ye5.push(item._source['SK_1507'])
              self.ye6.push(item._source['SK_1508'])
              self.ye7.push(item._source['SK_1509'])
              self.ye8.push(item._source['SK_1510'])
            })

            // console.log(self.times,self.qugaoxin)

            //预测值
            fetch("/predict?minute=-50",{
              method:"get"
            }).then((response) => response.json())
              .then((json) => {
                // console.log(json,'yuce')
                const data = [...json.hits.hits].sort((a,b) => Number(a._id) - Number(b._id))
                data.forEach(item => item._source = self.objNum(item._source))

                self.predictData = [...data].pop()._source

                self.qugaoxinPredict = []
                self.qugaoxinPredict5 = []

                for(let i=0;i<self.ids.length;i++) {
                  self.qugaoxinPredict.push(null)

                  for(let j=0;j<data.length;j++) {
                    if(self.ids[i] == data[j]._id) {
                      self.qugaoxinPredict[i] = data[j]._source['gaoxin_flow1']
                      self.qugaoxinPredict5[i] = data[j]._source['gaoxin_flow2']
                      break;
                    }
                  }
                }

                self.qugaoxinPredict5 = self.arrShift(self.qugaoxinPredict5, 4)

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

      gaoxinChart() {
        const self = this
        let yuce1 = self.qugaoxinPredict

        yuce1 = self.qugaoxinPredict.concat(self.dataAdd([self.predictData.gaoxin_flow1,null,null,null,self.predictData.gaoxin_flow2,null,null,null,null,self.predictData.gaoxin_flow3]))

        self.chart1 = echarts.init(document.getElementById('qugaoxin'));
        // 指定图表的配置项和数据
        var option = {
          color: ['#157DE2', '#50E3C2', '#FAAD14'],
          title: {
            text: '去高新总表',
            x: 'center'
          },
          tooltip: {
            trigger: 'axis',
            //formatter: "{b} <br> 合格率: {c}%"
          },
          legend: {
            data: ['实时值', '预测值', '预测值5'],
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
            name: 't/h',
            scale: true
            // min: 0,
            // max: 80
          },
          series: [{
            name: '实时值',
            type: 'line',
            data: self.qugaoxinData,
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
              name: '预测值5',
              type: 'line',
              // lineStyle:{
              //   normal:{type:'dashed'}
              // },
              data: self.qugaoxinPredict5
            }
          ]
        };
        // 使用刚指定的配置项和数据显示图表。
        self.chart1.setOption(option);

      },

      geifenChart() {
        const self = this

        self.chart2 = echarts.init(document.getElementById('geifen'));
        // 指定图表的配置项和数据
        var option = {
          title: {
            text: '给粉机',
            x: 'center'
          },
          tooltip: {
            trigger: 'axis',
            //formatter: "{b} <br> 合格率: {c}%"
          },
          legend: {
            data: ['给粉机1','给粉机2','给粉机3','给粉机4','给粉机5','给粉机6','给粉机7','给粉机8'],
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
            // data: self.times
          },
          yAxis: {
            type: 'value',
            name: 'Hz',
            scale: true
            // min: 0,
            // max: 80
          },
          series: [
            {
              name: '给粉机1',
              type: 'line',
              data: self.ye1
            }, {
              name: '给粉机2',
              type: 'line',
              data: self.ye2
            }, {
              name: '给粉机3',
              type: 'line',
              data: self.ye3
            }, {
              name: '给粉机4',
              type: 'line',
              data: self.ye4
            }, {
              name: '给粉机5',
              type: 'line',
              data: self.ye5
            }, {
              name: '给粉机6',
              type: 'line',
              data: self.ye6
            }, {
              name: '给粉机7',
              type: 'line',
              data: self.ye7
            }, {
              name: '给粉机8',
              type: 'line',
              data: self.ye8
            }
          ]
        };
        // 使用刚指定的配置项和数据显示图表。
        self.chart2.setOption(option);
      },

      //table
      tableServer() {
        const self = this
        //表值
        fetch("/cost/?minute=-1440",{
          method:"get"
        }).then((response) => response.json())
          .then((json) => {
            const data = json.hits.hits.sort((a,b) => Number(a._id) - Number(b._id))
            // console.log(data,'table')
            self.tableData = []
            self.tableList = []
            data.forEach(item => {
              const time = moment(item._id - 0).format('HH:mm')
              self.tableList.push(time)

              if(self.tableData.length == 0){
                for(let i in item._source){
                  if(i.includes('agg_') || i.includes('t_') || i.includes('v_')){
                    self.tableData.push({
                      name: i,
                      [time]: item._source[i].toFixed(4)
                    })
                  }
                }
              }else {
                for(let i in item._source){
                  self.tableData.forEach(tItem => {
                    if(i == tItem.name){
                      tItem[time] = item._source[i].toFixed(4)
                    }
                  })
                }

              }
            })
          })
      },

      objNum(obj) {
        for(let i in obj) {
          if(obj[i] && typeof obj[i] == 'number') obj[i] = obj[i].toFixed(4) - 0
        }
        return obj
      },

      init() {
        this.gaoxinChart()
        this.geifenChart()
        const self = this
        if(screen.width > 768) {
          window.onresize = function () {
            self.chart1.resize();
          }
        }
      }
    },

    created() {
      this.realtimeServer()
      this.tableServer()
    },

    mounted() {
      setInterval(() => {
        this.realtimeServer()
        this.tableServer()
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
      height: 36%;
      background: #fff;
      box-shadow: 5px 5px 5px rgba(0,21,41,.08);
      padding: 5px;
      box-sizing: border-box;
    }
  }

  .el-table td, .el-table th {
    padding: 6px 0;
  }

  @media (max-width: 768px) {
    .fireman {
      &>div {
        width: 100%;
        height: 70%;
      }
    }
  }
</style>
