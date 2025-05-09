const fs = require('fs')
const openai = require('./openai')

const systemPrompt = fs.readFileSync('./prompts/output_json.txt', 'utf8')

async function generatePost (article) {
  const response = await openai.chat.completions.create({
    model: 'google/gemini-2.5-flash-preview',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: article }
    ]
  })
  return formatOutput(response)
}

function formatOutput (response) {
  try {
    if (response.choices[0].message.content.startsWith('```json')) {
      const result = response.choices[0].message.content.replace(/^```json/, '').replace(/```$/, '')
      return JSON.parse(result)
    } else if (response.choices[0].message.content.startsWith('```')) {
      const result = response.choices[0].message.content.replace(/^```/, '').replace(/```$/, '')
      return JSON.parse(result)
    } else {
      return JSON.parse(response.choices[0].message.content)
    }
  } catch (error) {
    console.error(error)
    return null
  }
}

module.exports = { generatePost }
