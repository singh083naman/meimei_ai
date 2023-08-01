import * as vscode from "vscode";

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

  pickSuggestionName(suggestionNames: string[], placeHolder: string) {
    return vscode.window.showQuickPick(suggestionNames, {
      placeHolder,
    });
  }

  replaceWithPickedName(pickedName: string) {
    const selectedText = this.getSelectedText();

    this.editor.edit((editBuilder) => {
      editBuilder.replace(this.selection, selectedText.replace("xxx", pickedName));
    });
  }
}