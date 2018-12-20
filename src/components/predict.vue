<template>
    <span class="pre">
      <span v-if="row.name != '煤粉消耗'">
        {{num()}}({{row.predict}})
      </span>
      <span v-else>{{row.predict}}</span>
      <img v-for="(item,index) in symbols"
           :src="item.png"
           :key="index"
      >
    </span>
</template>

<script>
    export default {
      name: "predict",
      props: [ 'row' ],

      data() {
        return {
          symbols: [],
          pngs: {
            add1: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAAGWB6gOAAAAAXNSR0IArs4c6QAAAaFJREFUWAntWEtOxDAMzfA7EmKDOBRnGAmkQRwJsUWciE15L60zTrDTVGQRjWrhie28OP50kg4hLDSF8AN+pXolRoy34GvqByIWA/VIN/h8BxPxDP4Gf4JnwooJfBI90MXiJkPANm8QBYEzjDdRkgwInWbICJKJZUy7moErt1HUKZdztu5up+EAsWaRDiHcKVnEmApwMwGEv5maYmJ2abWsLMcmT00gNlz3hE0XSvaUAWd0fJuzE9d/Rnp1ODVeL2pKTi/w5G6Omh5LLwpt7xZRN0c6ukx2OpYfEmpFt4i6OVLBnUWkdQTHo60cz6hc4hfJIp6kPHObqVtqF+yo6ZBsqPh0wTUaL7XyrpEGPUK4F6UY0x2k7PhKGgTrC9i8RQx4NI1Xo/Ei8mpn2mtN8JoDu3nFmxvA2K1E3gZb7XtAaxUbrkK8QI6IOv4SWose80/ghwachnxB+dCGijx1e3usbLJlqt/NuGXXGna4Z2gPqNYuzg1XobWAs3kcEe4LBebMFw3Y97ssq+J/leGeoeEC8n55epXHM7r+H6ZiMdc00y8XqbN7MpCz9AAAAABJRU5ErkJggg==',
            add2: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAAGWB6gOAAAAAXNSR0IArs4c6QAAAkNJREFUWAntV81OwzAM7sYAwQNx48iBtxpIcEXifTjxRkibtI5tfF8Up3YXp+1WpB5mNYp/vtiOnWZrVUU6VNUB443iXJSzqsITiQjhZZ5Bs6QA2BL8N9gvyomgDD6DAgKD4IlkBFGmGVY6DXDywSCKhBJGG8CnqMwRT0OyK6M3QoP1Ob0AfBNOL9EgCavtgQcoVBnzWhtTG7SyzS+8EFrfXnQkE9wrXGp4dPGKzPdYXUN+P3JLBYzBcwQlTK9wCd1mmDBGqJvYIK8xUidEz/m8aMpT0RHSQQL9SI7ldQ4OR79aD68LLSt+y5C9o6qFhqWPEAHM1lga4Za9FhG4FfgbkXvNjIJhagi5xvjfrnnFk6x3yOB0wuJPjHC1tWfPazEjFBpPQ3TaSJYzxVQm40DpXdZz5C7wDNNzZC5JL22tdwpeS9eyL612EHkPtxrrpd1Mr9hysZkLTGqDU2lqgkJ7182exX6RhWp+Bv+gZGE9/E4AZkbk8NIaJQSn9QE2vWKPlpGc7HY5glyqSXZBX6U0gQEGjOyPhRezuDNvUdTPcV6RV55g4P+1u7zV1w7t2eCb3A+dtwxNKO9lRO3kEuIPyMeADT4KtnR+BBPnJ8S4b+k8cSeXrAdw9UioeJ5OPNR1SqgrgJvZSAZsAE9VT+4MXRLq6nC6qWMPu/DafoVzlz5OtIE8/PED1fzzaGPOlhFEfwUU282EuEmMQb9lRadn7+AEB5eEuoo2uQqlt6wr82jfYOanPukHB7ZEfMtklHDG9gcK7sWBp1QJbQAAAABJRU5ErkJggg==',
            sub1: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAAGWB6gOAAAAAXNSR0IArs4c6QAAALpJREFUWAntmOEOgjAMhFvgDfUJ8S2Ns3b/JjG5Bg8Tye3XyLrr9Vu2AWbV5na9PSxiHidM48OXfbfLGqMGSTyNr/fUfTM+5un9xcynrI6Ucyt/3HOvriH5xcJgZTCgZykFITsaTwIf99MeMrQloQntqUJzROAwAqVDspC9lQ5SKOTOu2dom/bEQnBBFCACIiAC/0OA9vZIKdm90a4PiqEUkSFEUoQQofwrEM/8UnMU+Jvx9KImAmcj8ALc+B7fLkmkFwAAAABJRU5ErkJggg==',
            sub2: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAAGWB6gOAAAAAXNSR0IArs4c6QAAALNJREFUWAntlUsOgCAMRFvjDXXt4XTtAdWF4mejIXGCYzRk2AFl2j4KNcNH1c5XY7fI4tUodU4SB2VeTCQVAHIOzO5OKmRf3Nms+yR3iKvsbRgVh94bAhMqAERINiLwKwKcX8t9NEq/q7uB9tYyFiq3Gnr+S4Zb0xABERCBbAhwOhoLR+iM+2e9CvaNs3STdI6GQWuMSUFEDimgCJTT0u8IhVfWTacQv5y4DV+6l28ReIXAArrlJkxLxrKpAAAAAElFTkSuQmCC'
          }
        }
      },

      methods: {
        num(n = this.row.predict) {
          let str = n.toFixed(2) + ''
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
            return n
          }
        },

        forSymbol() {
          const flag = this.row.realtime >= this.row.predict
          this.symbols = []
          if(this.row.realtime && this.row.predict) {
            if(flag) {
              let res = this.num(this.row.realtime - this.row.predict) + ''
              console.log(res,'-')
              if(res.includes('.')){
                res = Math.floor(res - 0)
                for(let i=0;i<res;i++) {
                  this.symbols.push({png: this.pngs.sub1})
                }
                this.symbols.push({png: this.pngs.sub2})
              }else {
                res = res - 0
                for(let i=0;i<res;i++) {
                  this.symbols.push({png: this.pngs.sub1})
                }
              }

            }else {
              let res = this.num(this.row.predict - this.row.realtime) + ''
              console.log(res,'+')
              if(res.includes('.')){
                res = Math.floor(res - 0)
                for(let i=0;i<res;i++) {
                  this.symbols.push({png: this.pngs.add1})
                }
                this.symbols.push({png: this.pngs.add2})
              }else {
                res = res - 0
                for(let i=0;i<res;i++) {
                  this.symbols.push({png: this.pngs.add1})
                }
              }
            }
          }
        }
      },


      watch: {
        'row.realtime' () {
          this.forSymbol()
        }
      },

      mounted() {
        this.forSymbol()
      }
    }
</script>

<style scoped>
  img {
    width: 16px;
    height: 16px;
    position: relative;
    top: 2px;
    margin-right: 5px;
  }

  .pre>span {
    margin-right: 5px;
  }
</style>
