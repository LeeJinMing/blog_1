const fs = require('fs')
const openai = require('./openai')

const systemPrompt = fs.readFileSync('./prompts/output_article.txt', 'utf8')

async function generateArticle (keyword) {
  console.log(keyword)

  const response = await openai.chat.completions.create({
    model: 'google/gemini-2.5-pro-preview',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: keyword }
    ]
  })
  return formatOutput(response)
}

function formatOutput (response) {
  return response.choices[0].message.content
}

module.exports = { generateArticle }
