<template>
    <span>
      <span :style="{color: symbol ? 'blue' : 'red','font-size': '20px'}">{{symbol ? '-' : '+'}}</span> {{num}} ({{row.predict}})
    </span>
</template>

<script>
    export default {
      name: "predict",
      props: [ 'row' ],

      data() {
        return {

        }
      },

      methods: {

      },

      computed: {
        num() {
          let str = this.row.predict.toFixed(2) + ''
          if(str.includes('.')){
            let nums = str.split('.').map(item => item-0)
            if(nums[1] < 25) {
              nums.pop()
            }else if (nums[1] >= 25 && nums[1] <=75 ) {
              nums[1] = 5
            }else {
              nums.pop()
              nums[0]++
            }
            return nums.join('.')
          }else {
            return  this.row.predict
          }
        },

        symbol() {
          return this.row.realtime >= this.row.predict
        }
      }
    }
</script>

<style scoped>

</style>
