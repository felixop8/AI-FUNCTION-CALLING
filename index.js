import getCurrentTime from './getCurrentTime.js'
import getCurrentWeather from './getCurrentWeather.js'
import openai from './config/open-ai.js'
import tools from './tools/tools.js'


const availableFunctions = {
  get_current_weather: getCurrentWeather,
  get_current_time: getCurrentTime,
}

async function runConversation(prompt) {
  // Step 1: send the conversation and available functions (tools) to the model
  const messages = [{ role: "user", content: prompt }]
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    messages,
    tools: tools,
    tool_choice: "auto",
  })


  const responseMessage = response.choices[0].message
  // Step 2: check if the model wanted to call a function
  const toolCalls = responseMessage.tool_calls
  if (toolCalls) {
    messages.push(responseMessage) // extend conversation with assistant's reply
    for (const toolCall of toolCalls) {
      const functionName = toolCall.function.name
      const functionToCall = availableFunctions[functionName]
      const functionArgs = JSON.parse(toolCall.function.arguments)
      // Step 3: call the function
      const functionResponse = await functionToCall(functionArgs)

      messages.push({
        tool_call_id: toolCall.id,
        role: "tool",
        name: functionName,
        content: functionResponse,
      }) // extend conversation with function response


      const finalResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-1106",
        messages: messages,
      }) // get a new response from the model where it can see the function response
      return finalResponse.choices[0].message.content;
    }
  }
}

const prompt1 = "What's the time in Madrid?"
runConversation(prompt1).then(console.log)
const prompt2 = "What's the weather in Tokyo?"
runConversation(prompt2).then(console.log)