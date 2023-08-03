import * as vscode from "vscode";
import fetch from "node-fetch";
(global as any).fetch = fetch;
import { ChatGPTAPI } from "chatgpt";
import { FetchGptResponse } from "~/types";
import { prepareApiKey } from "~/commands";

export class GptClient {
  context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  functionNamePrompt(selectedFunctionText: string) {
    const prompt = `
      Please come up with six possible names for the following functions and output them in the following json format.
      Don't include any explanations in your responses.
      \`\`\`
        ${selectedFunctionText}
      \`\`\`

      \`\`\`json
        { "result": ["name1", "name2", "name3", "name4", "name5", "name6"] }
      \`\`\`
    `;
    return prompt;
  }

  async fetchSuggestionNames(prompt: string) {
    try {
      const apiKey = await prepareApiKey(this.context);
      const api = new ChatGPTAPI({
        apiKey,
      });
      const res = await api.sendMessage(prompt);
      const gptResponse: FetchGptResponse = JSON.parse(res.text);
      const suggestionNames = gptResponse.result;
      return suggestionNames;
    } catch (e: unknown) {
      console.log("error:", e);
      throw e;
    }
  }
}
