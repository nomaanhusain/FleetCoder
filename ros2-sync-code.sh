#!/bin/bash

# Configuration
CSV_FILE="ips.csv"         # File containing the IP addresses
USERNAME="thymio"          # Default Ubuntu username
PASSWORD="your_password"   # Replace with the actual password
FILE_TO_COPY="file.txt"    # File you want to copy
DEST_PATH="/home/$USERNAME/ros2_ws/"  # Destination path
BUILD_COMMAND="colcon build" # Command to build ROS 2 workspace

# Install sshpass if not installed
if ! command -v sshpass &> /dev/null; then
    echo "sshpass is not installed. Installing..."
    sudo apt install sshpass -y
fi

# Check if file exists
if [ ! -f "$FILE_TO_COPY" ]; then
    echo "Error: File '$FILE_TO_COPY' not found!"
    exit 1
fi

# Read the IP addresses from CSV and copy the file + build ROS 2 workspace
while IFS= read -r IP; do
    echo "Copying $FILE_TO_COPY to $USERNAME@$IP..."
    
    # Copy the file
    sshpass -p "$PASSWORD" scp -o StrictHostKeyChecking=no "$FILE_TO_COPY" "$USERNAME@$IP:$DEST_PATH"

    if [ $? -eq 0 ]; then
        echo "File successfully copied to $IP"

        # SSH into the Raspberry Pi and build ROS 2 workspace
        echo "Building ROS 2 workspace on $IP..."
        sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no "$USERNAME@$IP" << EOF
            cd /home/$USERNAME/ros2_ws
            source /opt/ros/humble/setup.bash
            $BUILD_COMMAND
EOF

        echo "Build completed on $IP"
    else
        echo "Failed to copy file to $IP"
    fi
done < "$CSV_FILE"

echo "All operations completed!"