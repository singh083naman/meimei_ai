import * as vscode from "vscode";
import { EditorClient, GptClient } from "~/models";

export const suggestFunctionNames = async () => {
  const editor = vscode.window.activeTextEditor;

  if (editor) {
    const editorClient = new EditorClient(editor);
    const gptClient = new GptClient();
    const prompt = gptClient.functionNamePrompt(editorClient.getSelectedText());

    try {
      const suggestionNames = await gptClient.fetchSuggestionNames(prompt);

      // 名前の候補をユーザに提示し、選択させる
      const pickedName = await editorClient.pickSuggestionName(suggestionNames, "Choose a new function name!");

      if (pickedName) {
        // ユーザが選択した名前で、選択範囲の「xxx」の部分を置き換える
        editorClient.replaceWithPickedName(pickedName);
      }
    } catch (e: unknown) {
      console.log("error:", e);
    }
  }
};

