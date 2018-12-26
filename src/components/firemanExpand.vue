<template>
  <section class="fireman">
    <div id="qugaoxin"></div>
    <div>

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

        chart1: {},

        tableData: []
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
            // console.log(json,'shishi')
            const data = json.hits.hits.sort((a,b) => Number(a._id) - Number(b._id))
            data.forEach(item => item._source = self.objNum(item._source))

            self.times = []
            self.ids = []
            let finalData = [...data].pop()
            self.finalTime = finalData._id - 0
            self.finalData = finalData._source

            self.qugaoxinData = []

            data.forEach(item => {
              //处理时间
              self.times.push(moment(item._id - 0).format('HH:mm'))
              //处理ID
              self.ids.push(item._id)
              self.qugaoxinData.push(item._source['flow_去高新区总表'])
            })

            // console.log(self.times,self.qugaoxin)

            //预测值
            fetch("/predict?minute=-50",{
              method:"get"
            }).then((response) => response.json())
              .then((json) => {
                console.log(json,'yuce')
                const data = [...json.hits.hits].sort((a,b) => Number(a._id) - Number(b._id))
                data.forEach(item => item._source = self.objNum(item._source))

                self.predictData = [...data].pop()._source

                self.qugaoxinPredict = []

                for(let i=0;i<self.ids.length;i++) {
                  self.qugaoxinPredict.push(null)

                  for(let j=0;j<data.length;j++) {
                    if(self.ids[i] == data[j]._id) {
                      self.qugaoxinPredict[i] = data[j]._source['gaoxin_flow1']
                      break;
                    }
                  }
                }

                self.init()
              })

          })
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
            scale: true
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
            // {
            //   name: '校准值',
            //   type: 'line',
            //   // lineStyle:{
            //   //   normal:{type:'dashed'}
            //   // },
            //   data: yuce2
            // }
          ]
        };
        // 使用刚指定的配置项和数据显示图表。
        self.chart1.setOption(option);

      },

      //table
      tableServer() {
        const self = this
        //表值
        fetch("/cost/?minute=-200",{
          method:"get"
        }).then((response) => response.json())
          .then((json) => {
            console.log(json,'table')
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

  @media (max-width: 768px) {
    .fireman {
      &>div {
        width: 100%;
        height: 70%;
      }
    }
  }
</style>
