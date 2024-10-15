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

6. Go to [http://localhost:4200](http://localhost:4200)

<br />

# Python Backend Guide

0. Ensure **Python 3** and **pip** are installed (usually installed if Python is downloaded from [Python.org](https://www.python.org/downloads/))

1. Install **MongoDB** from [MongoDB Community Server](https://www.mongodb.com/try/download/community) (the _community server edition_)

2. Start **MongoDBCompass** and create a basic connection

3. Try it out by opening [http://localhost:27017/](http://localhost:27017/) in your browser

4. Click on **Databases**, you should see 3 databases: **admin**, **config**, **local**. Create a new database with _Database\_name_ and _Collection\_name_ _IPT\_logs_

5. Create a virtual environment in Python and activate it (activation is **different** on _Windows_ or _macOS_)

> Skip this step if it's not working and hope your normal python environment has no conflicts.
> [How to setup virtual environments in Python](https://www.freecodecamp.org/news/how-to-setup-virtual-environments-in-python/)
---

   ```bash
   pip install virtualenv
   ```
   
   ```bash
   python -m venv flask-mongodb
   ```
   
   or
   
   ```bash
   python3 -m venv flask-mongodb
   ```
   
   ### On macOS:
   ```bash
   source /env/bin/activate
   ```
   
   ### On Windows using CMD:
   ```bash
   env/Scripts/activate.bat
   ```
   
   ### On Windows using PowerShell:
   ```bash
   env/Scripts/Activate.ps1
   ```

6. Once it's activated, stay in the terminal and type
   ```bash
   pip install flask
   ```
   ```bash
   pip install pymongo
   ```

7. Run the `app.py` either with `python app.py` or `python3 app.py` as required by your installation

8. Access the website shown in your terminal

9. Append `/upload_logged_data` to the end of the link or `/add_random_data_for_example`

   **Example:**
   [http://127.0.0.1:5000/get_logged_data](http://127.0.0.1:5000/get_logged_data)
