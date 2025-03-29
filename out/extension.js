"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "fleet-coder" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    // const disposable = vscode.commands.registerCommand('fleet-coder.helloWorld', () => {
    // 	// The code you place here will be executed every time your command is executed
    // 	// Display a message box to the user
    // 	vscode.window.showInformationMessage('Hello World from fleet-coder!');
    // });
    let syncCode = vscode.commands.registerCommand('fleet-coder.syncCode', async () => {
        vscode.window.showInformationMessage('Syncing Code');
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found!');
            return;
        }
        const filePath = editor.document.uri.fsPath;
        vscode.window.showInformationMessage(`Syncing file: ${filePath}`);
        const config = vscode.workspace.getConfiguration('fleet-coder');
        const username = config.get('username') || 'thymio';
        const password = config.get('password') || 'thymio';
        const rosName = config.get('rosVersionName') || 'humble';
        const buildCommand = config.get('buildCommand') || 'colcon build';
        // Get workspace folder
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage("No workspace detected! Open a workspace first.");
            return;
        }
        const workspaceRoot = workspaceFolders[0].uri.fsPath;
        const workspaceName = path.basename(workspaceRoot);
        // Extract relative path inside workspace
        const relativePath = path.dirname(path.relative(workspaceRoot, filePath));
        if (relativePath.startsWith('..')) {
            vscode.window.showErrorMessage("File is outside the workspace!");
            return;
        }
        // Construct destination path
        const destPath = `/home/${username}/${workspaceName}/${relativePath}`;
        console.log(`Username: ${username}`);
        console.log(`Password: ${password}`);
        console.log(`Build command: ${buildCommand}`);
        console.log(`Destination path: ${destPath}`);
        console.log(`Your PC file path: ${filePath}`);
        console.log(`Workspace Name: ${workspaceName}`);
        console.log(`Workspace Folder: ${workspaceRoot}`);
        // const csvFile = vscode.workspace.rootPath + "/ips.csv";
        const csvFile = config.get('IPs') || path.join(workspaceRoot, 'ips.csv');
        if (!fs.existsSync(csvFile)) {
            vscode.window.showErrorMessage('CSV file not found! Add path to csv with IPs of remote devices in Fleet Coder Settings (\'Ctrl + ,\' search: Fleet Coder)');
            return;
        }
        const ips = fs.readFileSync(csvFile, 'utf-8').split('\n').map(line => line.trim()).filter(line => line);
        if (ips.length === 0) {
            vscode.window.showErrorMessage("No IPs found in CSV file!");
            return;
        }
        //Main loop
        for (const ip of ips) {
            // vscode.window.showInformationMessage(`Copying to ${ip}...`);
            console.log(`Copying to ${ip}...`);
            // Construct SCP command
            const scpCmd = password
                ? `sshpass -p "${password}" scp -o StrictHostKeyChecking=no "${filePath}" "${username}@${ip}:${destPath}"`
                : `scp -o StrictHostKeyChecking=no "${filePath}" "${username}@${ip}:${destPath}"`;
            // TODO: Uncomment below to execute the SCP command 
            // Execute SCP command compunded with build command
            // exec(scpCmd, (error, stdout, stderr) => {
            //     if (error) {
            //         vscode.window.showErrorMessage(`Failed to copy to ${ip}: ${stderr}`);
            //         return;
            //     }
            //     vscode.window.showInformationMessage(`File copied to ${ip}`);
            //     // Construct SSH command to run build
            //     const sshCmd = password
            //         ? `sshpass -p "${password}" ssh -o StrictHostKeyChecking=no ${username}@${ip} "cd /home/${username}/${workspaceName} && source /opt/ros/humble/setup.bash && ${buildCommand}"`
            //         : `ssh -o StrictHostKeyChecking=no ${username}@${ip} "cd /home/${username}/${workspaceName} && source /opt/ros/${rosName}/setup.bash && ${buildCommand}"`;
            //     exec(sshCmd, (error, stdout, stderr) => {
            //         if (error) {
            //             vscode.window.showErrorMessage(`Build failed on ${ip}: ${stderr}`);
            //             return;
            //         }
            //         vscode.window.showInformationMessage(`Build completed on ${ip}`);
            //     });
            // });
        } //End of for loop
    });
    let buttonTwo = vscode.commands.registerCommand('fleet-coder.launchFleet', () => {
        vscode.window.showInformationMessage('Will execute ROS launch file on fleet');
    });
    context.subscriptions.push(syncCode, buttonTwo);
}
// This method is called when your extension is deactivated
function deactivate() { }
//# sourceMappingURL=extension.js.map