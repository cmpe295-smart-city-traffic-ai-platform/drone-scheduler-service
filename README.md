# Drone Scheduler Service
Cloud Based Drone Service

**Important Note:**
This repo's code was created by a former team that contributed to this ongoing project.
It is being used here as the task at hand is to integrate their code with the rest of the services.
Their original code can be found at: https://github.com/saitejagoruganthu/Surveillance-Drone-Cloud-Platform


# Installation

Installation steps for the frontend:

	npm install  --force 

Installation steps for the backend:

	cd backend  

	npm install


# Run
Open a new terminal to start backend:

	cd backend  

	node index.js  


Open another terminal to start frontend. From Current Working Directory:

	npm start  

# Drone Kit Simulation Setup

Setup WSL (if you are using Windows OS)

In WSL, Open a terminal and perform following steps:

	sudo apt update
	
	sudo apt install python2
	
	sudo apt install python-pip
	
	python2 -V
	
	pip2 -V
	
	pip2 install virtualenv
	
	sudo apt-get install python2-dev

In a new project directory, run the following command to init the virtualenv:

	virtualenv myenv

Activate this:

	source myenv/bin/activate

Install all dependencies using pip command:

	pip install dronekit==2.9.2
	
	pip install dronekit-sitl==3.3.0
	
	pip install mavproxy==1.8.34
	
	pip uninstall pymavlink
	
	pip install pymavlink==2.4.8
	

Transfer all dependencies to requirements.txt file:

	pip freeze > requirements.txt

To deactivate:

	deactivate

Note: Before starting the simulation, make sure you have the correct IP address in start_mission.py file:

	Go to command prompt on your windows machine and type 'ipconfig'.
	
	Copy the WSL IPv4 address and paste it in start_mission.py file.

Once virtualenv is activated, you can run below commands to start the simulation.

Open a new terminal and type:

	python run_mission.py
	
	Enter how many missions you want to simulate (Eg: 1 or 2)
	
	Enter the mission id: (Eg: "5edbd0fd-c57e-4b41-948f-ec52fe1e1358") (Double quotes are necessary)
	
Click Enter.
	
This will start a virtual drone simulation environment and sends live telemetry data to the backend.

# Getting Started with Create React App
This project was bootstrapped with Create React App.

Available Scripts
In the project directory, you can run:

	npm start
Runs the app in the development mode.
Open http://localhost:3000 to view it in your browser.

The page will reload when you make changes.
You may also see any lint errors in the console.

	npm test
Launches the test runner in the interactive watch mode.
See the section about running tests for more information.

	npm run build
Builds the app for production to the build folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!
