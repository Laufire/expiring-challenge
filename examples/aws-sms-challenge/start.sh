#!/bin/bash

# Init
cd $(dirname $0)

# Config
defaultRegion='ap-southeast-1'

# Tasks
gatherInput() {

	read -p "AWS accessKeyId: " accessKeyId
	export accessKeyId
	read -p "AWS secretAccessKey: " secretAccessKey
	export secretAccessKey
	read -p "AWS region ($defaultRegion): " region
	region=${region:-$defaultRegion}
	export region
	read -p "Target Phone: " phone
	export phone
}

# Main
gatherInput
node index.js
