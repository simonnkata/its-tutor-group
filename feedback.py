from flask import jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import datetime
import re

def feedback_routes(app, db, bcrypt, jwt):
    @app.route('/feedback/<title>', methods=['GET'])
    @jwt_required()
    def feedback(title):
        message = ""
        res_data = {}
        code = 500
        status = "fail"
        try:
            data = request.get_json()
            task = db.tasks.find_one({'title': title})
            if task:
                taskType = task["type"]
                if taskType == "gap":
                    feedbackAndIsCorrect = feedback_gap(task, data)
                elif taskType == "freetext":
                    feedbackAndIsCorrect = feedback_freetext(task, data)
                elif taskType == "flowchart":
                    feedbackAndIsCorrect = feedback_flowchart(task, data)
                else:
                    feedbackAndIsCorrect = feedback_compiler(task, data)
                isCorrect = feedbackAndIsCorrect[0]
                feedback = feedbackAndIsCorrect[1]
                status = "successful"
                message = "task found"
                code = 200
                res_data = {"feedback": feedback, "isCorrect": isCorrect}
            else:                
                message = "no task found with that name"
                code = 404
                status = "fail"
        except Exception as ex:
            message = f"{ex}"
            status = "fail"
            code = 500    
        return jsonify({'status': status, "data": res_data, "message":message}), code
    
    # check solution for gap tasks
    def feedback_gap(task, data):
        studentAnswers = data["solution"]
        correctSolutions = task["solution"]
        correctAnswerList = ""
        wrongAnswerList = ""
        for i in range(0,len(correctSolutions)):
            if studentAnswers(i) == correctSolutions(i):
                correctAnswerList += str(i+1)
            else: 
                wrongAnswerList += str(i+1)
        if (len(wrongAnswerList) == 0 and len(correctAnswerList) == len(correctSolutions)):
            return (True, "Good job! You have filled all gaps correctly.")
        elif len(correctAnswerList) == 0:
            return (False, "Unfortunately, your answer is wrong. Try again.")
        else:
            return (False, f"Almost there! You got the right answer for gaps {correctAnswerList}. Try again for the correct solution for gaps {wrongAnswerList}.")
     
    # check solution for free text tasks
    def feedback_freetext(task, data):
        studentAnswer = data["solution"]
        correctSolution = task["solution"]  
        keywords = task["keywords"]
        if studentAnswer == correctSolution:
            return (True, "Good job! You entered the correct solution.")
        for keyword in keywords:
            if not (keyword in studentAnswer):
                return (False, f"Your answer is missing at least the word {keyword}. Try again.")
        return (False, "Unfortunately, your answer is wrong. Try again.")
                
    # check solution for flow chart tasks
    def feedback_flowchart(task, data):
        studentAnswer = data["solution"]
        correctSolution = task["solution"]  
        keywords = task["keywords"]

    # check solution for compiler tasks
    def feedback_compiler(task, data):
        userAnswerWithWhitespace = data["solution"]
        userAnswer = re.sub(r"\s+|#[^\n]*", "", userAnswerWithWhitespace) # student code without whitespace and without comments
        userResult = data["result"]
        correctSolution = task["solution"]
        correctResult = task["result"]  
        keywords = task["keywords"]    
        #add check: does it compile? if not: explain the compilers feedback
        if userAnswer == correctSolution:
            return (True, "Good job! You entered the correct solution.")
        if userResult == correctResult: # code is not exactly like given solution, but gives the correct result
            feedback = check_keywords(keywords, userAnswer)
            if feedback:
                return (False, feedback)
            else:
                return (True, "Good job! You entered the correct solution.")
        else:
            feedback = check_keywords(keywords, userAnswer)
            if feedback:
                return (False, feedback)
            else:
                return (False, "Your answer is almost correct. Check it for mistakes and try again.")           

def check_keywords(keywords, userAnswer):
    for keyword in keywords:
        if not (keyword in userAnswer):
            return feedbackKeywordsCompilerTask.get("keyword")
   
feedbackKeywordsCompilerTask = {
    "def" : "You are missing the function definition (def). Include it in your code and try again.",    
    "while" : "You are missing the while loop. Include it in your code and try again.",
    "for" : "You are missing the for loop. Include it in your code and try again.",
    "if" : "You are missing the if condition. Include it in your code and try again.",
    "else" : "Your if condition is missing an else branch. Include it in your code and try again.",
    "elif" : "Your if condition is missing an elif branch. Include it in your code and try again.",
    "print" : "Use the print() funtion to print your output.",
    "return" : "Your funtion is missing a return value. You can indicate it by using the keyword 'return'."   
}

