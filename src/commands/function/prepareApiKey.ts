import * as vscode from "vscode";

/**
 * 保存されているAPIキーを取得する。APIキーが保存されていない場合はユーザに入力させ、保存する
 * @param context
 */
export const prepareApiKey = async (context: vscode.ExtensionContext) => {
  try {
    let apiKey = await context.secrets.get("gpt-api-key");
    if (apiKey) {
      return apiKey;
    }

    // The API key has not been set yet, ask the user to input it
    apiKey = await vscode.window.showInputBox({
      prompt: "Enter your GPT API key",
    });
    if (apiKey) {
      // If the user provided input, store it as a secret
      await context.secrets.store("gpt-api-key", apiKey);
      return apiKey;
    }

    throw new Error("Failed to get API key");
  } catch (e: unknown) {
    throw e;
    // ユーザにエラーメッセージを表示する
    vscode.window.showErrorMessage("Failed to get API key");
  }
};
