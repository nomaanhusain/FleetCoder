# Fleet Coder

Fleet Coder is a Visual Studio Code extension designed to simplify and streamline development workflows across multiple ROS-based robots or Linux machines in a fleet. With the click of a button, you can sync code, run builds, launch ROS nodes, and manage remote files seamlessly over SSH.

Made with ❤️ for robotics developers managing the chaos of multi-robot systems.<br/>

## Install Notes

**No supoort for Windows.**

For Linux based systems, install sshpass using:

Ubuntu
```bash
sudo apt install sshpass
```
Arch-based
```bash
sudo pacman -S sshpass
```
Fedora
```bash
sudo dnf install sshpass
```

For support on Mac
```bash
brew install hudochenkov/sshpass/sshpass
```
or

```bash
brew install sshpass
```
## 🔧 Features

- **Sync Workspace**  
  Recursively synchronize your entire workspace to all target devices using `rsync`. Supports exclusions for folders (like `build/`, `.git/`, etc.).

- **ROS-Aware Build and Launch Buttons**  
  - Automatically run `colcon build` or your preferred build command.
  - Source your workspace (e.g. `source install/setup.bash`) before running any ROS commands.
  - Launch ROS nodes via `ros launch` commands directly from the UI.

- **Configurable via Settings**  
  Customize:
  - SSH credentials (username, password or key)
  - Build commands
  - Source commands (multiple supported)
  - Path to IP list CSV
  - Exclude folders during sync

## 🛠️ Setup

1. Install the extension in VS Code.
2. Create a CSV file listing the IPs of the machines in your fleet.
3. Configure the extension via VS Code settings (`File > Preferences > Settings > Extensions > Fleet Coder`) or `Ctrl + ,` and search `fleet-coder`.

Example settings:
```json
"fleet-coder.username": "thymio",
"fleet-coder.password": "robot123",
"fleet-coder.ipCsvPath": "/home/user/fleet_ips.csv",
"fleet-coder.buildCommand": "colcon build",
"fleet-coder.sourceBeforeBuild": [
  "source /opt/ros/humble/setup.bash"
],
"fleet-coder.sourceAfterBuild": [
  "source install/setup.bash"
],
"fleet-coder.excludeFolders": [
  "build",
  "install",
  ".git"
]
```

## For the developers
Incase you would like to extend the functionality, you should have node version **>=14** and vscode version **>1.98.0** to build and run this project.
```bash
node -v
code --verison
```
[GitHub](https://github.com/nomaanhusain/FleetCoder)