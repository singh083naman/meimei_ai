import * as vscode from "vscode";
import { EditorClient, GptClient } from "~/models";
import nameSettings from "~/name-settings.json";
import { NameSettings } from "~/types";

export const suggestFunctionNames = async () => {
  const editor = vscode.window.activeTextEditor;

  if (editor) {
    const editorClient = new EditorClient(editor);
    const gptClient = new GptClient();
    const selectedText = editorClient.getSelectedText();
    const languageId = editorClient.getSelectedFileLanguageId();
    const prompt = gptClient.namePrompt(
      selectedText,
      languageId,
      nameSettings as NameSettings,
      "function",
    );

    try {
      const suggestionNames = await gptClient.fetchSuggestionNames(prompt);

      // 名前の候補をユーザに提示し、選択させる
      const pickedName = await editorClient.pickSuggestionName(
        suggestionNames,
        "Choose a new function name!",
      );

      if (pickedName) {
        // ユーザが選択した名前で、選択範囲の「xxx」の部分を置き換える
        editorClient.replaceNameWithPickedName(selectedText, pickedName);
      }
    } catch (e: unknown) {
      console.log("error:", e);
    }
  }
};
