import { credentials } from "./credentials/index.mjs";
import OpenAI from "openai";
import { toolDefinitions } from "./tools/definitions.mjs";
import { getCurrentWeather } from "./tools/functions/weather.mjs";
import { systemPrompt } from "./prompts/system.mjs";

const { resource, deployment, apiVersion, azOaiKey } = credentials;

const openai = new OpenAI({
  apiKey: azOaiKey,
  baseURL: `https://${resource}.openai.azure.com/openai/deployments/${deployment}`,
  defaultQuery: { "api-version": apiVersion },
  defaultHeaders: { "api-key": azOaiKey },
  maxRetries: 10,
  timeout: 60 * 1000,
});

async function askAI(question) {
  const messages = [
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "user",
      content: question,
    },
  ];

  const response = await openai.chat.completions.create({
    model: deployment,
    messages: messages,
    tools: toolDefinitions,
    tool_choice: "auto",
  });

  const responseMessage = response.choices[0].message;

  const toolCalls = responseMessage.tool_calls;
  if (responseMessage.tool_calls) {
    const availableFunctions = {
      get_current_weather: getCurrentWeather,
    };

    messages.push(responseMessage);

    for (const toolCall of toolCalls) {
      const functionName = toolCall.function.name;
      const functionToCall = availableFunctions[functionName];
      const functionArgs = JSON.parse(toolCall.function.arguments);
      const functionResponse = functionToCall(
        functionArgs.location,
        functionArgs.unit
      );
      const functionExecutionObject = {
        tool_call_id: toolCall.id,
        role: "tool",
        name: functionName,
        content: functionResponse,
      };

      console.log("\n--------------<ToolCall>-----------------\n");
      console.log("Running Function: ", functionName);
      console.log("Function Args: ", functionArgs);
      console.log("Output: ", functionResponse);
      console.log("\n--------------</ToolCall>----------------\n");

      messages.push(functionExecutionObject);
    }

    const secondResponse = await openai.chat.completions.create({
      model: deployment,
      messages: messages,
    });

    return secondResponse;
  }
}

const theQuestion =
  "What's the weather like in San Francisco, Tokyo, and Paris?";

askAI(theQuestion)
  .then((res) => {
    console.log("\n--------------<RawResponse>-----------------\n");
    console.log(res);
    console.log("\n--------------</RawResponse>-----------------\n");

    console.log("\n--------------<Answer>-----------------\n");
    console.log(res.choices[0].message.content);
    console.log("\n--------------</Answer>-----------------\n");

    console.log("\n--------------<Usage>-----------------\n");
    console.table(res.usage);
    console.log("\n--------------</Usage>-----------------\n");
  })
  .catch(console.error);
