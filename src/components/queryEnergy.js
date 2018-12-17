import { GraphQLService } from 'as-utils'

const queryBaseUrl = '/api/queryengine/query'

class firemanService {
  static query (param) {
    return GraphQLService.fetchData({
      query: "select temperature1 from CoalBin where uid = '64b2a357-cdb8-4afe-a036-c021ba7302d6'",
      args: {
        object: param
      },
      url: queryBaseUrl,
      resProc: (response) => {
        // return response.data.deviceRuleInfo.findList
      }
    })
  }
}

export default firemanService

