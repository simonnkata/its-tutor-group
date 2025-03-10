from flask import jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import datetime
import re

def feedback_routes(app, db, bcrypt, jwt):
    @app.route('/feedback/<title>', methods=['POST'])
    @jwt_required()
    def feedback(title):
        message = ""
        res_data = {}
        code = 500
        status = "fail"
        feedback = ""
        isCorrect = False
        print("hello")
        try:
            data = request.get_json()
            task = db.tasks.find_one({'title': title})
            if task:
                taskType = task["type"]
                print(taskType)
                if (taskType == "gap"):
                    feedbackAndIsCorrect = feedback_gap(task, data)
                elif (taskType == "freetext"):
                    feedbackAndIsCorrect = feedback_freetext(task, data)
                elif (taskType == "flowchart"):
                    feedbackAndIsCorrect = feedback_flowchart(task, data)
                else:
                    print("here")
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
        return jsonify({"status": status, "feedback": feedback, "isCorrect": isCorrect, "message":message}), code
    
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
            return (True, task["feedback"])
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
            return (True, task["feedback"])
        for keyword in keywords:
            if not (keyword in studentAnswer):
                return (False, f"Your answer is missing at least the word {keyword}. Try again.")
        return (False, "Unfortunately, your answer is wrong. Try again.")
                
# check solution for flow chart tasks
def feedback_flowchart(task, data):
    studentAnswer = data["solution"]
    userNodes = studentAnswer.get("nodes")
    userLinks = studentAnswer.get("links")
    correctSolution = task["solution"]  
    correctNodes = correctSolution.get("nodes")
    correctLinks = correctSolution.get("links")
    nodesMatch = compareNodes(userNodes, correctNodes)
    linksMatch = compareLinks(userLinks, correctLinks)
    isCorrect = nodesMatch and linksMatch
    isComplete = not checkMissingElements(userNodes, userLinks, correctNodes, correctLinks)
    if isCorrect and isComplete:
        return (True, task["feedback"])
    if not isComplete:
        return (False, "Your answer is close but incomplete. Please check if you have added all necessary nodes and links.")
    return (False, "Unfortunately, your answer is not correct. Try again.")
    

# check if any of the entered nodes are wrong/not part of the correct solution
def compareNodes(userNodes, correctNodes): 
    for userNode in userNodes:
        if not (userNode in correctNodes):
            return False
    return True

# check if the entered links are contained in the correct solution
def compareLinks(userLinks, correctLinks):
    for userLink in userLink:
        if not (userLink in correctLinks):
            return False
    return True

# check which nodes/links are missing
def checkMissingElements(userNodes, userLinks, correctNodes, correctLinks):
    missingNodes = []
    missingLinks = []
    for correctNode in correctNodes:
        if not (correctNode in userNodes):
            missingNodes.append(correctNode)
    for correctLink in correctLinks:
        if not (correctLink in userLinks):
            missingLinks.append(correctLink)
    return missingNodes, missingLinks

# check solution for compiler tasks
def feedback_compiler(task, data):
    userCodeWithWhitespace = data["code"]
    userCode = re.sub(r"\s+|#[^\n]*", "", userCodeWithWhitespace) # student code without whitespace and without comments
    userOutput = re.sub(r"\s+|#[^\n]*", "", data["output"])
    correctCode = re.sub(r"\s+|#[^\n]*", "", task["solution"])
    correctOutput = re.sub(r"\s+|#[^\n]*", "", task["output"])
    keywords = task["keywords"]    
    print(keywords)
    if (userCode == correctCode):
        return (True, task["feedback"])
    if userOutput == correctOutput: # if code is not exactly like given solution, but gives the correct output
        feedback = check_keywords(keywords, userCode)
        if feedback:
            return (False, feedback)
        else:
            return (True, task["feedback"])
    else:
        errorMsg = check_error(userOutput)
        if errorMsg:
            return (False, errorMsg)
        feedback = check_keywords(keywords, userCode)
        if feedback:
            return (False, feedback)
        else:
            return (False, "Your answer is almost correct. Check it for mistakes and try again.")           

# explanation for compiler output when it states an error
def check_error(userOutput):
    for errorMsg in errorMessages:
        if errorMsg in userOutput:
            return errorMessages.get(errorMsg)
        
errorMessages = {
    "SyntaxError:invalidsyntax" : "Check the syntax of your function definition and ensure all parentheses and colons are correctly placed.",
    "NameError:nameisnotdefined" : "Make sure all variables are defined before you use them in your function.",
    "IndentationError:expectedanindentedblock": "Check that all code inside the loop or condition is properly indented.",
}

# check code for the keywords required for a correct solution
def check_keywords(keywords, userCode): 
    for keyword in keywords:
        if not (keyword in userCode):
            return feedbackKeywordsCompilerTask.get(keyword)
   
feedbackKeywordsCompilerTask = {
    "def" : "You are missing the function definition (def). Include it in your code and try again.",    
    "while" : "You are missing the while loop. Include it in your code and try again.",
    "for" : "You are missing the for loop. Include it in your code and try again.",
    "if" : "You are missing the if condition. Include it in your code and try again.",
    "else" : "Your if condition is missing an else branch. Include it in your code and try again.",
    "elif" : "Your if condition is missing an elif branch. Include it in your code and try again.",
    "print" : "Use the print() function to print your output.",
    "return" : "Your function is missing a return value. You can indicate it by using the keyword 'return'."   
}

