// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
const generator = require('./mainProcess');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
// 插件激活时的入口
export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    // console.log(
    //     'Congratulations, your extension "api-generator" is now active!'
    // );

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand(
        'api-generator.helloWorld',
        (textEditor) => {
            const { fsPath } = textEditor;
            generator.create(fsPath);
            // const panel = vscode.window.createWebviewPanel(
            //     'testWebview',
            //     '演示',
            //     vscode.ViewColumn.One,
            //     {
            //         enableScripts: true,
            //         retainContextWhenHidden: true,
            //     }
            // );

            // handle(fsPath);
            // The code you place here will be executed every time your command is executed
            // Display a message box to the user
            vscode.window.showInformationMessage('api请求已经生成！');
        }
    );
    // 给插件订阅 helloWorld 命令
    context.subscriptions.push(disposable);

    // return 的内容可以作为这个插件对外的接口
    // return {
    //     hello() {
    //         return 'hello world';
    //     },
    // };
}

// this method is called when your extension is deactivated
// 插件释放的时候触发
export function deactivate() {}
