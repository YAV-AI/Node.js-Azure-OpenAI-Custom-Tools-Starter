import "dotenv/config";
export const credentials = {
  resource: process.env.AZURE_OAI_RESOURCE_NAME,
  deployment: process.env.AZURE_OAI_DEPLOYMENT_NAME,
  apiVersion: process.env.AZURE_OAI_API_VERSION,
  azOaiKey: process.env.AZURE_OAI_API_KEY,
};
