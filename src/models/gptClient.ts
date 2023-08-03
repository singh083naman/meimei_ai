import * as vscode from "vscode";
import fetch from "node-fetch";
(global as any).fetch = fetch;
import { ChatGPTAPI } from "chatgpt";
import { prepareApiKey } from "~/commands";
import { FetchGptResponse, NameSettings, NameSettingsKeys } from "~/types";

export class GptClient {
  context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }
  
  functionNamePrompt(selectedFunctionText: string, selectedLanguageId: string, nameSettings: NameSettings) {
    let prompt: string;

    if (this.hasNameSettingsOfLanguageId(selectedLanguageId, nameSettings)) {
      const functionNameSettings = nameSettings[`${selectedLanguageId}`].function;
      prompt = `
        Please come up with six possible names for the following ${selectedLanguageId} functions and output them in the following json format.
        Each name in the array should be a ${functionNameSettings}.
        Don't include any explanations in your responses.
        \`\`\`
          ${selectedFunctionText}
        \`\`\`

        \`\`\`json
          { "result": ["name1", "name2", "name3", "name4", "name5", "name6"] }
        \`\`\`
      `;
    } else {
      prompt = `
        Please come up with six possible names for the following ${selectedLanguageId} functions and output them in the following json format.
        Don't include any explanations in your responses.
        \`\`\`
          ${selectedFunctionText}
        \`\`\`

        \`\`\`json
          { "result": ["name1", "name2", "name3", "name4", "name5", "name6"] }
        \`\`\`
      `;
    }

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
  };

  // todo: このメソッドをこのクラスの中に書くかは悩みどころ。
  hasNameSettingsOfLanguageId(languageId: string, nameSettings: NameSettings): languageId is NameSettingsKeys {
    return Object.keys(nameSettings).includes(languageId);
  }
}
