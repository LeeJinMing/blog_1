const { getJson } = require('serpapi')

getJson({
  engine: 'google_trends_trending_now',
  geo: 'US',
  api_key: process.env.SERPAPI_API_KEY
}, (json) => {
  console.log(json.trending_searches)
})

function formatTrends (trends) {
  return trends.map((trend) => {
    return {
      keyword: trend.keyword,
      url: trend.url
    }
  })
}

function getTrends () {
  return getJson({
    engine: 'google_trends_trending_now',
    geo: 'US',
    api_key: process.env.SERPAPI_API_KEY
  })
}

module.exports = getTrends
