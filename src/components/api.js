import { GraphQLService } from 'as-utils'

const firemanBaseUrl = '/api/stoker/graph'

class firemanService {
  static getDeviceList (param) {
    return GraphQLService.fetchData({
      query: 'query {deviceRuleInfo{findList{id, datasource, label, dataName, field , minValue, maxValue , unit, createTime , alarmCondition, uid, description, updateTime}}}}',
      args: {
        "engine": "realtime"
      },
      url: firemanBaseUrl,
      resProc: (response) => {
        return response.data.deviceRuleInfo.findList
      }
    })
  }
}

export default firemanService

