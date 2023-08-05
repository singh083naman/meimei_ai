import * as vscode from "vscode";
import { suggestFunctionNames, setApiKey } from "./commands";
import { prepareApiKey } from "./utils/apiKey";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("meimei-ai.suggest-function-names", async () => {
      const apiKey = await prepareApiKey(context);
      await suggestFunctionNames(apiKey);
    }),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "meimei-ai.change-api-key",
      async () => await setApiKey(context),
    ),
  );
}
