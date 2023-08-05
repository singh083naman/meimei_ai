import * as vscode from "vscode";
import fetch from "node-fetch";
(global as any).fetch = fetch;
import { ChatGPTAPI } from "chatgpt";
import {
  FetchGptResponse,
  NameFormat,
  NameSettings,
  NameSettingsKeys,
  NameTarget,
  nameFormats,
} from "~/types";
import { prepareApiKey } from "~/utils/apiKey";

export class GptClient {
  context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  namePrompt(
    selectedBlock: string,
    selectedLanguageId: string,
    nameSettings: NameSettings,
    namingTarget: NameTarget,
  ) {
    if (this.hasNamingRule(selectedLanguageId, nameSettings, namingTarget)) {
      const nameSetting = nameSettings[selectedLanguageId][namingTarget];
      return this.createPrompt(selectedLanguageId, selectedBlock, namingTarget, nameSetting);
    } else {
      return this.createPrompt(selectedLanguageId, selectedBlock, namingTarget);
    }
  }

  createPrompt(
    languageId: string,
    selectedBlock: string,
    namingTarget: NameTarget,
    nameSettings?: NameFormat,
  ) {
    const prompt = `
      Please come up with six possible names for the following ${languageId} ${namingTarget} and output them in the following json format.
      ${nameSettings ? `Each name in the array should be a ${nameSettings}.` : ""}
      Don't include any explanations in your responses.
      \`\`\`
        ${selectedBlock}
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

  hasNamingRule(
    selectedLanguageId: string,
    nameSettings: NameSettings,
    nameTarget: NameTarget,
  ): selectedLanguageId is NameSettingsKeys {
    if (selectedLanguageId in nameSettings) {
      const nameRule = nameSettings[selectedLanguageId as NameSettingsKeys];
      if (!(nameTarget in nameRule) && !nameRule[nameTarget]) {
        return false;
      }
      return nameFormats.includes(nameRule[nameTarget]!);
    } else {
      return false;
    }
  }
}
