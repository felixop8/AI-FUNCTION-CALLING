const tools = [
  {
    type: "function",
    function: {
      name: "get_current_time",
      description: "Get the current time in a given an area and location",
      parameters: {
        type: "object",
        properties: {
          area: {
            type: "string",
            description: "The area, e.g. America",
          },
          location: {
            type: "string",
            description: "The location, e.g. San Francisco",
          },
        },
        required: ["area", "location"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_current_weather",
      description: "Get the current weather in a given location",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "The city and state, e.g. San Francisco",
          },
          unit: { type: "string", enum: ["celsius", "fahrenheit"] },
        },
        required: ["location"],
      },
    },
  },
]

export default tools