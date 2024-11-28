from flask import jsonify, request
from flask_jwt_extended import create_access_token
from datetime import datetime
from flask_jwt_extended import create_access_token, JWTManager, jwt_required, get_jwt_identity


def register_teacher_routes(app, db, bcrypt, jwt):
    @app.route('/teacher_signup', methods=['POST'])
    def save_teacher():
        code = 500
        res_data = {}
        message = ""
        status = "fail"
        try:
            data = request.get_json()
            username=data['username']
            if db.teachers.find_one({'username':username}):
                message = "teacher with that username already exists"
                code = 401
                status = "fail"
            else:
                data['password'] = bcrypt.generate_password_hash(data['password']).decode('utf-8')
                data['UserCreated'] = datetime.now()
                access_token=create_access_token(identity=username)
                res = db.teachers.insert_one(data)
                if res.acknowledged:
                    status = "successful"
                    message = "teacher created successfully"
                    code = 200
                    res_data={"username":username, "token":access_token, "firstName":data["firstName"],"lastName":data["lastName"]}
        except Exception as ex:
            message = f"{ex}"
            status = "fail"
            code = 500    
        return jsonify({'status': status, "data": res_data, "message":message}), code
    
    @app.route('/teacher_login', methods=['POST'])
    def teacher_login():
        message = ""
        res_data = {}
        code = 500
        status = "fail"
        try:
            data = request.get_json()
            username=data['username']
            teacher = db.teachers.find_one({'username':username})
            print(teacher)
            if teacher:
                passwordhashed=teacher["password"]
                password=data["password"]
                firstName = teacher["firstName"]
                lastName = teacher["lastName"]
                if teacher and bcrypt.check_password_hash(passwordhashed, password):
                    access_token=create_access_token(identity=username)
                    message = "teacher authenticated"
                    code = 200
                    status = "successful"
                    res_data={"username":username, "token":access_token, "firstName":firstName,"lastName":lastName}
                    print(res_data)

                else:
                    message = "wrong password"
                    code = 401
                    status = "fail"
            else:
                message = "invalid login details"
                code = 401
                status = "fail"

        except Exception as ex:
            message = f"{ex}"
            code = 500
            status = "fail"
        return jsonify({'status': status, "data": res_data, "message":message}), code

    @app.route('/create_task', methods=['POST'])
    @jwt_required()
    def create_task():
        message = ""
        res_data = {}
        code = 500
        status = "fail"
        try:
            data = request.get_json()
            current_user=get_jwt_identity()
            teacher = db.teachers.find_one({'username':current_user})
            taskName=data['title']
            if db.tasks.find_one({'taskName':taskName}):
                message = "task with that name already exists"
                code = 401
                status = "fail"
            else:
                data['teacher_id']  = teacher["_id"]
                data['taskCreated'] = datetime.now()
                res = db.tasks.insert_one(data)
                if res.acknowledged:
                    status = "successful"
                    message = "task created successfully"
                    code = 200
                    res_data={"taskName":taskName, "taskCreated":data["taskCreated"]}
        except Exception as ex:
            message = f"{ex}"
            status = "fail"
            code = 500    
        return jsonify({'status': status, "data": res_data, "message":message}), code