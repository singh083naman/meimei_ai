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
  const defaultKeybindings = [
    {
        command: 'meimei-ai.suggest-function-names',
        key: 'alt+cmd+m'
    },
    {
      command: 'meimei-ai.change-api-key',
      key: 'alt+cmd+a'
    },
  ];
  const missingKeybindings = defaultKeybindings.filter(binding => {
    const existingKeybinding = vscode.workspace.getConfiguration('keybindings').inspect(`[${binding.key}]`);
    return !existingKeybinding || existingKeybinding.globalValue === undefined;
  });
  if (missingKeybindings.length > 0) {
    // Ask the user whether they want to use default keybindings
    vscode.window.showInformationMessage(
        `YourExtension: Some default keybindings are missing. Do you want to set them now?`,
        'Yes', 'No'
    ).then(choice => {
        if (choice === 'Yes') {
            vscode.commands.executeCommand('workbench.action.openGlobalKeybindingsFile')
                .then(() => {
                    const editor = vscode.window.activeTextEditor;
                    if (editor) {
                        const edit = new vscode.WorkspaceEdit();
                        missingKeybindings.forEach(binding => {
                            edit.insert(editor.document.uri, new vscode.Position(0, 0), `[{
                                "key": "${binding.key}",
                                "command": "${binding.command}",
                                "when": "editorTextFocus"
                            }]`);
                        });
                        return vscode.workspace.applyEdit(edit);
                    }
                })
                .then(() => {
                    vscode.window.showInformationMessage(`Default keybindings set.`);
                });
        }
    });
}
}
