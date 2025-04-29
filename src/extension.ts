// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import { exec } from 'child_process';
import * as path from 'path';
import { constrainedMemory } from 'process';
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "fleet-coder" is now active! Lets see');



	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	// const disposable = vscode.commands.registerCommand('fleet-coder.helloWorld', () => {
	// 	// The code you place here will be executed every time your command is executed
	// 	// Display a message box to the user
	// 	vscode.window.showInformationMessage('Hello World from fleet-coder!');
	// });


	// This was to sync individual files but seems uncessesary.
	// let syncCode = vscode.commands.registerCommand('fleet-coder.syncCode', async () => {
	// 	vscode.window.showInformationMessage('Syncing Code');
	// 	const editor = vscode.window.activeTextEditor;
    //     if (!editor) {
    //         vscode.window.showErrorMessage('No active editor found!');
    //         return;
    //     }
	// 	const filePath = editor.document.uri.fsPath;
    //     vscode.window.showInformationMessage(`Syncing file: ${filePath}`);

	// 	const config = vscode.workspace.getConfiguration('fleet-coder');
	// 	const username = config.get<string>('username') || 'username';
    //     const password = config.get<string>('password') || 'password';
	// 	const rosName = config.get<string>('rosVersionName') || 'humble';
    //     const buildCommand = config.get<string>('buildCommand') || 'colcon build';

	// 	// Get workspace folder
    //     const workspaceFolders = vscode.workspace.workspaceFolders;
    //     if (!workspaceFolders) {
    //         vscode.window.showErrorMessage("No workspace detected! Open a workspace first.");
    //         return;
    //     }

    //     const workspaceRoot = workspaceFolders[0].uri.fsPath;
    //     const workspaceName = path.basename(workspaceRoot);

    //     // Extract relative path inside workspace
    //     const relativePath = path.dirname(path.relative(workspaceRoot, filePath));
    //     if (relativePath.startsWith('..')) {
    //         vscode.window.showErrorMessage("File is outside the workspace!");
    //         return;
    //     }

    //     // Construct destination path
    //     const destPath = `/home/${username}/${workspaceName}/${relativePath}`;

	// 	console.log(`Username: ${username}`);
	// 	console.log(`Password: ${password}`);
	// 	console.log(`Build command: ${buildCommand}`);
	// 	console.log(`Destination path: ${destPath}`);
	// 	console.log(`Your PC file path: ${filePath}`);
	// 	console.log(`Workspace Name: ${workspaceName}`);
	// 	console.log(`Workspace Folder: ${workspaceRoot}`);
	// 	console.log("--------------------------------------");
	// 	// const csvFile = vscode.workspace.rootPath + "/ips.csv";
	// 	const csvFile = config.get<string>('IPs') || path.join(workspaceRoot, 'ips.csv');
	// 	if (!fs.existsSync(csvFile)) {
	// 		vscode.window.showErrorMessage('CSV file not found! Add path to csv with IPs of remote devices in Fleet Coder Settings (\'Ctrl + ,\' search: Fleet Coder)');
	// 		return;
	// 	}
	// 	const ips = fs.readFileSync(csvFile, 'utf-8').split('\n').map(line => line.trim()).filter(line => line);
    //     if (ips.length === 0) {
    //         vscode.window.showErrorMessage("No IPs found in CSV file!");
    //         return;
    //     }

	// 	//Main loop
	// 	for (const ip of ips) {
	// 		// vscode.window.showInformationMessage(`Copying to ${ip}...`);
	// 		// console.log(`Copying to ${ip}...`);

	// 		// Construct SCP command
    //         const scpCmd = `sshpass -p "${password}" scp -o StrictHostKeyChecking=no "${filePath}" "${username}@${ip}:${destPath}"`;

	// 		// TODO: Uncomment below to execute the SCP command 
	// 		// Execute SCP command compunded with build command
	// 		console.log("Command= ",scpCmd)
	// 		exec(scpCmd, (error, stdout, stderr) => {
    //             if (error) {
    //                 vscode.window.showErrorMessage(`Failed to copy to ${ip}: ${stderr}`);
    //                 return;
    //             }
	// 			if (stderr) {
	// 				vscode.window.showWarningMessage(`Stderr: ${stderr}`);
	// 				return;
	// 			}
    //             vscode.window.showInformationMessage(`File copied to ${ip}`);
	// 			vscode.window.showInformationMessage(`Success: ${stdout}`);
	// 		});
			
	// 	} //End of for loop

	// });
	let buildWorkspace = vscode.commands.registerCommand('fleet-coder.buildWorkspace', async () => {
		const config = vscode.workspace.getConfiguration('fleet-coder');
		const username = config.get<string>('username') || 'thymio';
        const password = config.get<string>('password') || 'thymio';
		const rosName = config.get<string>('rosVersionName') || 'humble';
        const buildCommand = config.get<string>('buildCommand') || 'colcon build';

		console.log(`Username: ${username}`);
		console.log(`Password: ${password}`);
		console.log(`Build command: ${buildCommand}`);
		console.log(`ROS Name: ${rosName}`);

		// Get workspace folder
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage("No workspace detected! Open a workspace first.");
            return;
        }

        const workspaceRoot = workspaceFolders[0].uri.fsPath;
		const workspaceName = path.basename(workspaceRoot);
		const csvFile = config.get<string>('IPs') || path.join(workspaceRoot, 'ips.csv');
		if (!fs.existsSync(csvFile)) {
			vscode.window.showErrorMessage('CSV file not found! Add path to csv with IPs of remote devices in Fleet Coder Settings (\'Ctrl + ,\' search: Fleet Coder)');
			return;
		}
		const destPath = config.get<string>('workspacePath') || `/home/${username}/`;
		const sourceCommands: string[] = config.get("sourceCommands", []);
		const workspacePath = `${destPath}${workspaceName}`;
		console.log("******** wrk path = "+workspacePath);
		const ips = fs.readFileSync(csvFile, 'utf-8').split('\n').map(line => line.trim()).filter(line => line);
        if (ips.length === 0) {
            vscode.window.showErrorMessage("No IPs found in CSV file!");
            return;
        }
		for (const ip of ips) {
			var sourceBeforeParams = "";
			if(sourceCommands.length != 0){
				sourceBeforeParams = sourceCommands.map(sourceCommand => ` && ${sourceCommand}`).join("");
			}
			const sshCmd = `sshpass -p "${password}" ssh -o StrictHostKeyChecking=no ${username}@${ip} "cd ${workspacePath}${sourceBeforeParams} && ${buildCommand}"`;
			console.log("ssh source build= "+sshCmd);
			vscode.window.showInformationMessage(`Building on ${ip}`);
            exec(sshCmd, (error, stdout, stderr) => {
                if (error) {
                    vscode.window.showErrorMessage(`Build failed on ${ip}: ${stderr}`);
                    return;
                }
                vscode.window.showInformationMessage(`Build completed on ${ip}`);
            });
		}
	});
	let launchFleet = vscode.commands.registerCommand('fleet-coder.launchFleet', () => {
		// TODO: Source the build (sourceAfterBuild) thing, then do the ros launch, add setting to define the launch file name and stuff
		vscode.window.showInformationMessage('Will execute ROS launch file on fleet');
		const config = vscode.workspace.getConfiguration('fleet-coder');
		const sourceAfterBuild = config.get<string>('sourceAfterBuild') || 'source install/setup.bash';
		const username = config.get<string>('username') || 'thymio';
        const password = config.get<string>('password') || 'thymio';

		console.log(`Username: ${username}`);
		console.log(`Password: ${password}`);

		// Get workspace folder
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage("No workspace detected! Open a workspace first.");
            return;
        }

        const workspaceRoot = workspaceFolders[0].uri.fsPath;
		const workspaceName = path.basename(workspaceRoot);
		const csvFile = config.get<string>('IPs') || path.join(workspaceRoot, 'ips.csv');
		if (!fs.existsSync(csvFile)) {
			vscode.window.showErrorMessage('CSV file not found! Add path to csv with IPs of remote devices in Fleet Coder Settings (\'Ctrl + ,\' search: Fleet Coder)');
			return;
		}
		const destPath = config.get<string>('workspacePath') || `/home/${username}/`;
		const workspacePath = `${destPath}${workspaceName}`;
		console.log("******** wrk path = "+workspacePath);
		const ips = fs.readFileSync(csvFile, 'utf-8').split('\n').map(line => line.trim()).filter(line => line);
        if (ips.length === 0) {
            vscode.window.showErrorMessage("No IPs found in CSV file!");
            return;
        }
		const packageName = config.get<string>('packageName') || 'my_package';
		const launchFile = "ros2 launch " +packageName+" "+config.get<string>('launchFileName') || 'launch.py';

		for (const ip of ips) {
			const sshCmd = `sshpass -p "${password}" ssh -o StrictHostKeyChecking=no ${username}@${ip} "cd ${workspacePath} ${sourceAfterBuild} && ${launchFile}"`;
			console.log("ssh source build= "+sshCmd);
			vscode.window.showInformationMessage(`Launching on ${ip}`);
            exec(sshCmd, (error, stdout, stderr) => {
                if (error) {
                    vscode.window.showErrorMessage(`Launching failed on ${ip}: ${stderr}`);
                    return;
                }
                vscode.window.showInformationMessage(`launched on ${ip}`);
            });
		}


		


	});
	let syncWorkspace = vscode.commands.registerCommand('fleet-coder.syncWorkspace', () => {
		const config = vscode.workspace.getConfiguration('fleet-coder');
		const username = config.get<string>('username') || 'thymio';
        const password = config.get<string>('password') || 'thymio';
		const excludes: string[] = config.get("excludedFolders", []);
		console.log(excludes);
    	const excludeParams = excludes.map(folder => `--exclude=${folder}`).join(" ");
		// Get workspace folder
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage("No workspace detected! Open a workspace first.");
            return;
        }
        const workspaceRoot = workspaceFolders[0].uri.fsPath;
		const csvFile = config.get<string>('IPs') || path.join(workspaceRoot, 'ips.csv');
		if (!fs.existsSync(csvFile)) {
			vscode.window.showErrorMessage('CSV file not found! Add path to csv with IPs of remote devices in Fleet Coder Settings (\'Ctrl + ,\' search: Fleet Coder)');
			return;
		}
		const ips = fs.readFileSync(csvFile, 'utf-8').split('\n').map(line => line.trim()).filter(line => line);
        if (ips.length === 0) {
            vscode.window.showErrorMessage("No IPs found in CSV file!");
            return;
        }
		const destPath = config.get<string>('workspacePath') || `/home/${username}/`;
		for (const ip of ips) {
			const command = `sshpass -p ${password} rsync -av --delete --delete-excluded ${excludeParams} "${workspaceRoot}" ${username}@${ip}:"${destPath}"`;
			console.log(command);
			exec(command, (error, stdout, stderr) => {
				if (error) {
					vscode.window.showErrorMessage(`Error syncing: ${stderr}`);
					return;
				}
				vscode.window.showInformationMessage("Workspace synced successfully.");
			});
		}

	});


	context.subscriptions.push(buildWorkspace, syncWorkspace, launchFleet);
}

// This method is called when your extension is deactivated
export function deactivate() {}
