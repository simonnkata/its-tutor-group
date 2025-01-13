from flask import jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import datetime

def register_teacher_routes(app, db, bcrypt, jwt):
    @app.route('/teacher_signup', methods=['POST'])
    def save_teacher():
        code = 500
        res_data = {}
        message = ""
        status = "fail"
        try:
            data = request.get_json()
            username = data['username']
            if db.teachers.find_one({'username': username}):
                message = "teacher with that username already exists"
                code = 401
                status = "fail"
            else:
                data['password'] = bcrypt.generate_password_hash(data['password']).decode('utf-8')
                data['UserCreated'] = datetime.now()
                access_token = create_access_token(identity=username)
                res = db.teachers.insert_one(data)
                if res.acknowledged:
                    status = "successful"
                    message = "teacher created successfully"
                    code = 200
                    res_data = {"username": username, "token": access_token, "firstName": data["firstName"], "lastName": data["lastName"]}
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
                password = data["password"]
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

    # create a task
    @app.route('/task', methods=['POST'])
    #@jwt_required()
    def create_task():
        message = ""
        res_data = {}
        code = 500
        status = "fail"
        try:
            data = request.get_json()
            #current_user = get_jwt_identity()
            #teacher = db.teachers.find_one({'username':current_user})
            teacher = db.teachers.find_one()
            title = make_task_title(data['topic'], data['type'])
            if db.tasks.find_one({'title':title}):
                message = "task with that name already exists"
                code = 401
                status = "fail"
            else:
                data['title'] = title
                data['teacher_id'] = teacher["_id"]
                data['points'] = get_task_points(data['difficultyLevel'])
                data['taskCreated'] = datetime.now()
                res = db.tasks.insert_one(data)
                if res.acknowledged:
                    status = "successful"
                    message = "task created successfully"
                    code = 200
                    res_data = {"title": title, "taskCreated": data["taskCreated"]}
        except Exception as ex:
            message = f"{ex}"
            status = "fail"
            code = 500    
        return jsonify({'status': status, "data": res_data, "message":message}), code
    
    # get all tasks
    @app.route('/task', methods=['GET'])
    #@jwt_required()
    def get_tasks():
        message = ""
        res_data = {}
        code = 500
        status = "fail"
        try:
            res = db.tasks.find()
            status = "successful"
            message = "task found"
            code = 200
            tasks = list(res)
            for task in tasks:
                del task["_id"]
                del task["teacher_id"]
            res_data = {"tasks": tasks}
        except Exception as ex:
            message = f"{ex}"
            status = "fail"
            code = 500    
        return jsonify({'status': status, "data": res_data, "message":message}), code

    # get a task by title
    @app.route('/task/<title>', methods=['GET'])
    @jwt_required()
    def get_task(title):
        message = ""
        res_data = {}
        code = 500
        status = "fail"
        try:
            task = db.tasks.find_one({'title':title})
            if task:
                status = "successful"
                message = "task found"
                code = 200
                del task["_id"]
                del task["teacher_id"]
                res_data = task
            else:                
                message = "no task found with that name"
                code = 404
                status = "fail"
        except Exception as ex:
            message = f"{ex}"
            status = "fail"
            code = 500    
        return jsonify({'status': status, "data": res_data, "message":message}), code #adjust return value
   
   #edit a task
    @app.route('/task/<title>', methods=['PUT'])
    @jwt_required()
    def edit_task(title):
        message = ""
        res_data = {}
        code = 500
        status = "fail"
        try:
            data = request.get_json()
            current_user = get_jwt_identity()
            teacher = db.teachers.find_one({'username':current_user})
            teacher_id = teacher["_id"]
            points = get_task_points(data['difficultyLevel'])
            task = db.tasks.find_one({'title':title})
            if task:
                if  teacher_id != task["teacher_id"]:
                    message = "you can only edit your own tasks"
                    code = 403
                    status = "fail"
                else:
                    newvalues = { "$set": { 'difficultyLevel': data.get('difficultyLevel'), 
                                            'description': data.get('description'), 
                                            'feedback': data.get('feedback'), 
                                            'points': points, 
                                            'hints': data.get('hints'), 
                                            'solution': data.get('solution'), 
                                            'keywords': data.get('keywords'), 
                                            'availableLines': data.get('availableLines')
                                            } }
                    res = db.tasks.update_one(task, newvalues)
                    if res.acknowledged:
                        status = "successful"
                        message= "edits saved"
                        code = 200
                        res_data = {"title": title}
            else:
                message = "there is no task with that name"
                code = 404
                status = "fail"
        except Exception as ex:
            message = f"{ex}"
            status = "fail"
            code = 500    
        return jsonify({'status': status, "data": res_data, "message":message}), code
    
    #delete a task
    @app.route('/task/<title>', methods=['DELETE'])
    @jwt_required()
    def delete_task(title):
        message = ""
        res_data = {}
        code = 500
        status = "fail"
        try:
            #verify that the currently logged in teacher is the one who created the task
            current_user = get_jwt_identity()
            teacher = db.teachers.find_one({'username':current_user})
            task = db.tasks.find_one({'title':title})
            if task:
                if task['teacher_id'] != teacher["_id"]:
                    message = "You do not have the authority to delete this task"
                    code = 403
                    status = "fail"
                else:
                    res = db.tasks.delete_one({"title": title})
                    if res.acknowledged:
                        status = "successful"
                        message = "task deleted successfully"
                        code = 200
                        res_data = {"title": title}
            else:
                message = "task not found"
                code = 404
                status = "fail"
        except Exception as ex:
            message = f"{ex}"
            status = "fail"
            code = 500    
        return jsonify({'status': status, "data": res_data, "message":message}), code
    
    @app.route('/generateTaskTitle', methods=['POST'])
    #@jwt_required()
    def createTitle():
        message = ""
        res_data = {}
        code = 500
        status = "fail"
        try:
            data = request.get_json()
            topic = data['topic']
            type = data['type']
            title = make_task_title(topic, type)
            status = "successful"
            message = "title generated successfully"
            code = 200
        except Exception as ex:
            message = f"{ex}, {data}"
            status = "fail"
            code = 500    
        return jsonify({'status': status, "title": title, "message":message}), code
    
    
    def make_task_title(topic, type): 
        topicCount = db.tasks.count_documents({"topic": topic })
        typeCount = db.tasks.count_documents({"type": type })
        title = f"{topic[0]}{topicCount+1}{type[0].upper()}{typeCount + 1}"
        return title
    
    def get_task_points(difficultyLevel):
        match difficultyLevel:
            case "beginner":
                return 5
            case "advanced":
                return 10
            case _:
                return 15
