from flask import Flask, jsonify, request, make_response
from pymongo import MongoClient
from bson import json_util, ObjectId
from flask_cors import CORS
import jwt
from flask_bcrypt import Bcrypt
from datetime import datetime, timedelta
from flask_jwt_extended import create_access_token, JWTManager, jwt_required, get_jwt_identity
from teacher import register_teacher_routes
from backend.task import register_task_routes
from student import register_student_routes
from feedback import feedback_routes
app = Flask(__name__)
bcrypt= Bcrypt(app)
secret= "Very_secret_key_thatshouldntbesavedinplaintext"
app.config["SECRET_KEY"]="Very_secret_key_thatshouldntbesavedinplaintext"
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
jwt=JWTManager(app)
CORS(app, origins=["http://localhost:4200","http://localhost:4200/tutor", "*"])

client = MongoClient("mongodb://mongo:27017/IPT_db")  
db = client["IPT_db"]
register_teacher_routes(app, db, bcrypt, jwt)
feedback_routes(app, db, bcrypt, jwt)
register_task_routes(app, db, bcrypt, jwt)
register_student_routes(app, db, bcrypt, jwt)
if __name__=='__main__':
        app.run(host='0.0.0.0', port=5001)
