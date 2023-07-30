// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import fetch from "node-fetch";
(global as any).fetch = fetch;
import { ChatGPTAPI } from "chatgpt";
import { FetchGptResponse } from "./types";

const fetchSuggestionNames = async (selectedText: string) => {
  try {
    const api = new ChatGPTAPI({
      apiKey: "自分のAPIキー",
    });
    const prompt = `
      以下の関数の名前の候補を３つ以上考えてください。
      ###
        ${selectedText}
      ###

      候補は以下のjson形式で出力して下さい。
      ###
        {
          "status": "success",
          "result": string[]
        }
      ###
    `;
    const res = await api.sendMessage(prompt);
    const gptResponse: FetchGptResponse = JSON.parse(res.text);
    const suggestionNames = gptResponse.result;
    return suggestionNames;
  } catch (e: unknown) {
    console.log("エラー", e);
    throw e;
  }
};

const names: string[] = [];

const example = async () => {
  const editor = vscode.window.activeTextEditor;

  if (editor) {
    let document = editor.document;
    let selection = editor.selection;

    // 選択範囲のテキストを取得
    const text = document.getText(selection);

    try {
      const suggestionNames = await fetchSuggestionNames(text);
      // 関数名の候補をユーザに提示し、選択させる
      let pickedFunctionName = await vscode.window.showQuickPick(suggestionNames, {
        placeHolder: "Choose a new function name",
      });

      if (pickedFunctionName) {
        // ユーザが選択した関数名で、選択範囲の関数名「xxx」の部分を置き換える
        editor.edit((editBuilder) => {
          editBuilder.replace(selection, text.replace("xxx", pickedFunctionName!));
        });
      }
    } catch (e: unknown) {
      console.log("エラー", e);
    }
  }
};

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("meimei-ai.テスト", async () => {
      await example();
    }),
  );
}
