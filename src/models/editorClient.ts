import * as vscode from "vscode";
import nameSettings from "~/name-settings.json";

export class EditorClient {
  editor: vscode.TextEditor;
  document: vscode.TextDocument;
  selection: vscode.Selection;

  constructor(editor: vscode.TextEditor) {
    this.editor = editor;
    this.document = editor.document;
    this.selection = editor.selection;
  }

  getSelectedText() {
    return this.document.getText(this.selection);
  }

  getSelectedFileLanguageId() {
    return this.document.languageId;
  }

  pickSuggestionName(suggestionNames: string[], placeHolder: string) {
    return vscode.window.showQuickPick(suggestionNames, {
      placeHolder,
    });
  }

  replaceNameWithPickedName(selectedText: string, pickedName: string) {
    this.editor.edit((editBuilder) => {
      editBuilder.replace(this.selection, selectedText.replace("xxx", pickedName));
    });
  }
}