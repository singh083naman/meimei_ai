import * as vscode from "vscode";
import { suggestFunctionNames, setApiKey } from "./commands";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "meimei-ai.suggest-function-names",
      async () => await suggestFunctionNames(context),
    ),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "meimei-ai.change-api-key",
      async () => await setApiKey(context),
    ),
  );
}
