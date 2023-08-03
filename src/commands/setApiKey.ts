import * as vscode from "vscode";
import { STORE_GPT_API_KEY } from "~/utils/apiKey";

/**
 * APIキーをユーザに入力させ、保存する
 * @param context
 */
export const setApiKey = async (context: vscode.ExtensionContext) => {
  try {
    // Show an input box to the user
    const userInput = await vscode.window.showInputBox({
      prompt: "Enter your GPT API key",
    });

    if (userInput) {
      // If the user provided input, store it as a secret
      await context.secrets.store(STORE_GPT_API_KEY, userInput);
    }
  } catch (e: unknown) {
    console.log("error: ", e);
    // ユーザにエラーメッセージを表示する
    vscode.window.showErrorMessage("Failed to change API key");
  }
};
