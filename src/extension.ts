// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

import fetch from "node-fetch";

(global as any).fetch = fetch;
import { ChatGPTAPI } from "chatgpt";

const names: string[] = [];

const example = async () => {
  // console.log("入った", process.env.OPENAI_API_KEY);
  // if (!process.env.OPENAI_API_KEY) {
  //   return "APIキーが設定されていません。";
  // }
  const editor = vscode.window.activeTextEditor;
  console.log("エディター", editor);

  if (editor) {
    let document = editor.document;
    console.log("document", document);
    let selection = editor.selection;

    // 選択範囲のテキストを取得
    const text = document.getText(selection);
    console.log("選択テキスト", text);

    // 選択範囲のテキストを表示
    vscode.window.showInformationMessage(`Selected text: ${text}`);

    try {
      const api = new ChatGPTAPI({
        apiKey: "自分のAPIキー",
      });
      const prompt = `
        以下の関数の名前の候補を３つ以上考えてください。
        ###
          ${text}
        ###
        ###
          候補は以下のjson形式で出力して下さい。
          {
            "nameType": "method",
            "result": string[]
          }";
        ###
      `;
      const res = await api.sendMessage(prompt);
      const obj = JSON.parse(res.text);
      console.log("オブジェ", obj);
      const array = obj.result;
      names.push(array);

      // 関数名の候補をユーザに提示し、選択させる
      let pickedFunctionName = await vscode.window.showQuickPick(array, {
        placeHolder: "Choose a new function name",
      });
      console.log("選択内容", pickedFunctionName);

      if (pickedFunctionName) {
        // ユーザが選択した関数名で元のテキストを置換
        editor.edit((editBuilder) => {
          editBuilder.replace(selection, pickedFunctionName!);
        });
      }
      return res.text;
    } catch (e) {
      console.log("エラー", e);
      return "";
    }
  }
  return "";
};

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "meimei-ai" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand("meimei-ai.helloWorld", () => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    vscode.window.showInformationMessage("Hello World from meimei_ai!");
  });

  const helloWorldGPT = vscode.commands.registerCommand("meimei-ai.helloWorldGPT", async () => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    const text = await example();
    vscode.window.showInformationMessage(text);
  });

  context.subscriptions.push(disposable);
  context.subscriptions.push(helloWorldGPT);

  context.subscriptions.push(
    vscode.commands.registerCommand("meimei-ai.テスト", () => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const document = editor.document;
        const selection = editor.selection;

        // 選択されたテキストを取得します。
        const text = document.getText(selection);

        // ここでテキストに対するあなたの処理を行います。
        // await example(text); // text を引数として渡す
        // そしてその結果に基づいて提案を作成します。
        const items: vscode.CompletionItem[] = [
          new vscode.CompletionItem("Suggested Function 1"),
          new vscode.CompletionItem("Suggested Function 2"),
          new vscode.CompletionItem("Suggested Function 3"),
        ];

        // 最後に、その提案を選択されたテキストの位置に挿入します。
        for (const item of items) {
          if (typeof item.label === "string") {
            editor.insertSnippet(new vscode.SnippetString(item.label), selection);
          }
        }
      }
    }),
  );

  // context.subscriptions.push(
  //   vscode.languages.registerCompletionItemProvider(
  //     { pattern: "**" },
  //     {
  //       async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
  //         console.log("きた");
  //         if (names.length === 0) {
  //           await example();
  //           const items: vscode.CompletionItem[] = [
  //             new vscode.CompletionItem("Suggested Function 1"),
  //             new vscode.CompletionItem("Suggested Function 2"),
  //             new vscode.CompletionItem("Suggested Function 3"),
  //           ];
  //           return items;
  //         }
  //         const items: vscode.CompletionItem[] = [
  //           new vscode.CompletionItem("Suggested Function 1"),
  //           new vscode.CompletionItem("Suggested Function 2"),
  //           new vscode.CompletionItem("Suggested Function 3"),
  //         ];
  //         return [];
  //       },
  //     },
  //     ".", // ピリオドでトリガー
  //   ),
  // );
}
