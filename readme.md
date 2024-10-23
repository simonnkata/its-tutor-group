# Update: AngularJS Setup

1. Install **NodeJS LTS (_Long Term Support_)** version:  
   [Download NodeJS](https://nodejs.org/en)

2. Navigate to `/angularApp` directory

3. Run in terminal (might have to run as **admin**):
   ```bash
   npm install
   ```

4. Then run
   ```bash
   npm install -g @angular/cli
   ```

5. Start the development server with
   ```bash
   ng serve
   ```
If you are using Windows you might run into an "UnautorizedAccess" issue, one fix for that would be to change the execution policy. Search for the issue shown in your terminal and you should find a guide on how to fix it.

6. Go to [http://localhost:4200](http://localhost:4200)

<br />

# Python Backend Guide

0. Ensure **Python 3** and **pip** are installed (usually installed if Python is downloaded from [Python.org](https://www.python.org/downloads/))

1. Install **MongoDB** from [MongoDB Community Server](https://www.mongodb.com/try/download/community) (the _community server edition_)

2. Start **MongoDBCompass** and create a basic connection inside MongoDBCompass. (If you are using Mac, you have to do it differently)

3. Try it out by opening [http://localhost:27017/](http://localhost:27017/) (or the IP:PORT shown in MongoDBCompass) in your browser

4. Click on **Databases** inside **MongoDBCompass**, you should see 3 collections: **admin**, **config**, **local**.

5. (Optional) Create a virtual environment in Python and activate it (activation is **different** on _Windows_ or _macOS_)
> [How to setup virtual environments in Python](https://www.freecodecamp.org/news/how-to-setup-virtual-environments-in-python/)
> Skip this step if it's not working and hope your normal python environment has no conflicts.

6. Install the required packages
   ```bash
   pip install -t requirements.txt
   ```
   or
   ```bash
   pip3 install -t requirements.txt
   ```
   
7. Run the `app.py` either with `python app.py` or `python3 app.py` as required by your installation

# Final setup
Ensure you have MongoDB running and a connection open before running the Python app. You should have both the Python app (python app.py) and the development server (ng serve) running at the same time, for the Application to function correctly.
