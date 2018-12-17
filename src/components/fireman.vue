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

    import firemanService from './api'
    import queryEnergy from './queryEnergy'
    import echarts from 'echarts'

    export default {
    name: 'fireman',
    data () {
      return {
        tableData: [
          {
            name: '给粉机1',
            realtime: 225.5,
            change: 25
          },
          {
            name: '给粉机2',
            realtime: 225.5,
            change: 25
          },
          {
            name: '给粉机3',
            realtime: 225.5,
            change: 25
          },
          {
            name: '给粉机4',
            realtime: 225.5,
            change: 25
          },
          {
            name: '给粉机5',
            realtime: 225.5,
            change: 25
          },
          {
            name: '给粉机6',
            realtime: 225.5,
            change: 25
          },
          {
            name: '给粉机7',
            realtime: 225.5,
            change: 25
          },
          {
            name: '给粉机8',
            realtime: 225.5,
            change: 25
          },
          {
            name: '二次风机',
            realtime: 225.5,
            change: 25
          }
        ]
      }
    },

    methods: {
      qibaoyali() {
        var myChart = echarts.init(document.getElementById('qibaoyali'));

        // 指定图表的配置项和数据
        var option = {
          color: ['#D53A35', '#E98F6F'],
          title: {
            text: '汽包压力',
            x: 'center'
          },
          tooltip: {
            trigger: 'axis',
            //formatter: "{b} <br> 合格率: {c}%"
          },
          legend: {
            data: ['旅游运输', '班线运输'],
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
            name: '日期',
            boundaryGap: false,
            data: ['5.1', '5.2', '5.3', '5.4', '5.5', '5.6', '5.7']
          },
          yAxis: {
            type: 'value',
            name: '报警次数',
          },
          series: [{
            name: '旅游运输',
            type: 'line',
            data: [120, 132, 101, 134, 90]
          },
            {
              name: '班线运输',
              type: 'line',
              lineStyle:{
                normal:{type:'dashed'}
              },
              data: [null, null, null, null, 90, 230, 210]
            }
          ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
      },

      chukouyali() {
        var myChart = echarts.init(document.getElementById('chukouyali'));

        // 指定图表的配置项和数据
        var option = {
          color: ['#D53A35', '#E98F6F'],
          title: {
            text: '出口压力',
            x: 'center'
          },
          tooltip: {
            trigger: 'axis',
            //formatter: "{b} <br> 合格率: {c}%"
          },
          legend: {
            data: ['旅游运输', '班线运输'],
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
            name: '日期',
            boundaryGap: false,
            data: ['5.1', '5.2', '5.3', '5.4', '5.5', '5.6', '5.7']
          },
          yAxis: {
            type: 'value',
            name: '报警次数',
          },
          series: [{
            name: '旅游运输',
            type: 'line',
            data: [120, 132, 101, 134, 90]
          },
            {
              name: '班线运输',
              type: 'line',
              lineStyle:{
                normal:{type:'dashed'}
              },
              data: [null, null, null, null, 90, 230, 210]
            }
          ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
      },

      qushi() {
        var myChart = echarts.init(document.getElementById('qushi'));

        var option = {
          color: ['#D53A35', '#E98F6F', '#6AB0B8', '#334B5C'],
          title: {
            text: '消费趋势',
            x: 'center'
          },
          tooltip: {
            trigger: 'axis',
            //formatter: "{b} <br> 合格率: {c}%"
          },
          legend: {
            data: ['旅游运输', '班线运输', '危险品', '普货'],
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
            name: '日期',
            boundaryGap: false,
            data: ['5.1', '5.2', '5.3', '5.4', '5.5', '5.6', '5.7']
          },
          yAxis: {
            type: 'value',
            name: '报警次数',
          },
          series: [{
            name: '旅游运输',
            type: 'line',
            stack: '总量',
            data: [120, 132, 101, 134, 90, 230, 210]
          },
            {
              name: '班线运输',
              type: 'line',
              stack: '总量',
              data: [220, 182, 191, 234, 290, 330, 310]
            },
            {
              name: '危险品',
              type: 'line',
              stack: '总量',
              data: [150, 232, 201, 154, 190, 330, 410]
            },
            {
              name: '普货',
              type: 'line',
              stack: '总量',
              data: [320, 332, 301, 334, 390, 330, 320]
            },
          ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
      },
    },

    created() {
      queryEnergy.query().then(res => {

      })
    },


    mounted() {
      this.qibaoyali()
      this.chukouyali()
      this.qushi()
    }

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
