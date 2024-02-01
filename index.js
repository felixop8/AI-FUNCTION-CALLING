/**
 * Importing required modules and functions
 */
import getCurrentTime from './getCurrentTime.js';
import getCurrentWeather from './getCurrentWeather.js';
import openai from './config/open-ai.js';
import tools from './tools/tools.js';
import readlineSync from 'readline-sync'
import colors from 'colors'


const availableFunctions = {
  get_current_weather: getCurrentWeather,
  get_current_time: getCurrentTime,
};


async function main() {

  const chatHistory = [];

  while (true) {
    const input = readlineSync.question(colors.bold.yellow('You: '))
    try {
      // Add latest user input
      chatHistory.push({ "role": "user", "content": input })

      // Call the API with user input and the tools
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-1106",
        messages: chatHistory,
        tools: tools,
        tool_choice: "auto",
      });

      const responseMessage = response.choices[0].message;
      const content = responseMessage.content;
      const toolCalls = responseMessage.tool_calls;

      if(input.toLocaleLowerCase() === 'exit') {
        console.log(colors.bold.green('Steve: ') + content)
        break
    }

      if (content) {

        console.log(colors.green('Steve: ') + content)
        chatHistory.push({ "role": "assistant", "content": content })

      } else if (toolCalls) {
        chatHistory.push(responseMessage)
        for (const toolCall of toolCalls) {
          const functionName = toolCall.function.name;
          const functionToCall = availableFunctions[functionName];
          const functionArgs = JSON.parse(toolCall.function.arguments);
          const functionResponse = await functionToCall(functionArgs);

          chatHistory.push({
            tool_call_id: toolCall.id,
            role: "tool",
            name: functionName,
            content: functionResponse,
          });
        }
        const finalResponse = await openai.chat.completions.create({
          model: "gpt-3.5-turbo-1106",
          messages: chatHistory,
        });
        console.log(colors.green('Steve: ') + finalResponse.choices[0].message.content)
        chatHistory.push({ "role": "assistant", "content": finalResponse.choices[0].message.content })

      }
    } catch (error) {
      console.error(colors.red(error))
    }
  }
}

main()
