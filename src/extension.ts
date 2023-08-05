import * as vscode from "vscode";
import { suggestNames, setApiKey } from "./commands";
import { prepareApiKey } from "./utils/apiKey";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("mei-ai.suggest-function-names", async () => {
      const apiKey = await prepareApiKey(context);
      await suggestNames(apiKey, "function");
    }),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("mei-ai.suggest-class-names", async () => {
      const apiKey = await prepareApiKey(context);
      await suggestNames(apiKey, "class");
    }),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("mei-ai.suggest-struct-names", async () => {
      const apiKey = await prepareApiKey(context);
      await suggestNames(apiKey, "struct");
    }),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("mei-ai.suggest-method-names", async () => {
      const apiKey = await prepareApiKey(context);
      await suggestNames(apiKey, "method");
    }),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("mei-ai.suggest-variable-names", async () => {
      const apiKey = await prepareApiKey(context);
      await suggestNames(apiKey, "variable");
    }),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("mei-ai.change-api-key", async () => await setApiKey(context)),
  );
}
