<template>
  <section class="fireman">
    <div>
      汽包压力
    </div>
    <div>
      出口压力
    </div>
    <div>
      消费趋势
    </div>
    <div>
      给粉机，二次风机
    </div>
  </section>
</template>

<script>
export default {
  name: 'fireman',
  data () {
    return {

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
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
    }
  }
</style>
