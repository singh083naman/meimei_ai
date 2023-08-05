import * as vscode from "vscode";
import { suggestFunctionNames } from "./commands";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("meimei-ai.suggest-function-names", suggestFunctionNames),
  );
}
