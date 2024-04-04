# Azure OpenAI NodeJS SDK Custom Tools Starter

## Introduction

This example shows how to use Custom Tools using the Azure OpenAI service.

## Setup and Configuration

### Prerequisites

- Node.js >=18
- Npm or Yarn
- An active subscription with Azure OpenAI

### Installation

1. `git clone <this-repo>`.
2. Install dependencies by running `yarn` or `npm install` in the project root directory.

### Setting up Credentials

Rename or copy `.env.sample` to `.env`

```
AZURE_OAI_RESOURCE_NAME="xxx-xxx-xxx-xxx"
AZURE_OAI_API_KEY="xxxxxxxxxxxx"
AZURE_OAI_API_VERSION="xxxx-xx-xx"
AZURE_OAI_DEPLOYMENT_NAME="the-deployment-name"
```

## System Prompt

In this example we are asking the model to check the weather and reply strictly in JSON format with some clothing tips. The System prompt can be found in `./prompts/system.mjs`. Edit the prompt as per your requirements.

## Custom Tools

### Adding a New Tool

To add a new tool:

1. Add the tool definitions in `./tools/definitions.mjs`.
2. Add the tool function in `./tools/functions`.

### Example Tool: Weather Information

The `getCurrentWeather` function fetches weather data for a specified location. It's invoked through the tool system during a conversation.

## Usage

The function:

```javascript
const theQuestion =
  "What's the weather like in San Francisco, Tokyo, and Paris?";

askAI(theQuestion)
  .then((response) => {
    //response.choices[0].message.content
    console.log(response);
  })
  .catch(console.error);
```

Run the script:

```
node index.mjs
```

## License

This project is licensed under the MIT License.

## Support

For support, open an issue in the GitHub repository or contact the project maintainers.
