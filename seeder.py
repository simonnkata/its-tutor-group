from flask import Flask
from pymongo import MongoClient
from flask_bcrypt import Bcrypt
from datetime import datetime
app = Flask(__name__)
bcrypt= Bcrypt(app)

client = MongoClient(host='localhost', port=27017)
db = client['IPT_db']

def generate_password(password):
    return bcrypt.generate_password_hash(password).decode('utf-8')

teachers = [
    {"username": "Teacher1", "password": generate_password("teacher1"), "firstName": "Teacher", "email": "example@gmail.com", "lastName": "One", "created": datetime.now()},  
    {"username": "Teacher2", "password": generate_password("teacher2"), "firstName": "Teacher", "email": "maxmusterman@gmail.com", "lastName": "Two", "created": datetime.now()},  
]

def seed_teachers():
    db.teachers.delete_many({}) 
    result = db.teachers.insert_many(teachers)
    if result.acknowledged:
       return "Teachers seeded successfully"
    return "Teachers seeding failed"

def get_teacher_ids():
    teacher_ids = []
    for doc in db.teachers.find():
        teacher_ids.append(doc['_id'])
    return teacher_ids

def seed_tasks(teacher_ids):
    tasks = [
    {
        "title": "P1C3", 
        "difficultyLevel": "beginner", 
        "topic": "Loops",
        'type' : 'compiler',
        'description': [
            {
                'text': 'Write a program that prints the numbers from 1 to 100. But for multiples of three print “Fizz” instead of the number and for the multiples of five print “Buzz”. For numbers which are multiples of both three and five print “FizzBuzz”.',
            }, 
            {
                'code': "print('hello world')"
            }
        ],
        'feedback': 'Good job!',
        'points': 5,
        'hints': ['Think Calmly', 'Use an iterator'],
        'solution': 'the answer',
        'keywords': ['for', 'if', 'else'],
        'availableLines': [],
        'teacher_id': teacher_ids[0],
        'taskCreated': datetime.now()
    },
    {
        "title": "P2C4",
        "difficultyLevel": "intermediate",
        "topic": "Functions",
        "type": "compiler",
        "description": [
            {
                "text": "Write a program that checks if a given number is prime or not. A prime number is only divisible by 1 and itself.",
            },
            {
                "code": "print('This is a prime-check program!')"
            }
        ],
        "feedback": "Well done! You now understand prime number checks.",
        "points": 6,
        "hints": ["Think about the definition of a prime number", "Use a loop to test divisors"],
        "solution": "the solution to the prime number problem",
        "keywords": ["if", "for", "return"],
        "availableLines": [],
        "teacher_id": teacher_ids[1],
        'taskCreated': datetime.now()
    },
    {
        "title": "L5C1",
        "difficultyLevel": "beginner",
        "topic": "Loops",
        "type": "freetext",
        "description": [
            {
                "text": "What exactly does this loop print? Write the answer in the textfield."
            },
            {
                "code": """    
1   num = 10
2   while num > 3:
3       num -= 1
4       print(num)"""
            }

        ],
        "feedback": 'Well done! The loop starts at num = 10 and reduces num by 1 with each iteration, printing the updated value. It stops when num is no longer greater than 3, meaning it prints values from 9 to 3 inclusive.',
        "points": 5,
        "hints": ['You need to set an initial value for the variable num to begin the countdown. In this case, num starts at 10.', 
                  'The while loop should continue to execute as long as num is greater than 3. This means the loop will run and decrement num until it reaches 3.', 
                  'In each iteration of the while loop, the value of num is decreased by 1. Pay attention to how this affects the value of num each time the loop runs.',
                  """The solution is: <span class="code-style-feedback">
9
8
7
6
5
4
3
        </span>
                """],
        "solution": """
9
8
7   
6
5
4
3""",
        "keywords": [],
        "availableLines": [],
        "teacher_id": teacher_ids[1],
        'taskCreated': datetime.now()
    },
    {
        "title": "V1C1",
        "difficultyLevel": "beginner",
        "topic": "Variables",
        "type": "freetext",
        "description": [
            {
                "text": "Given the following code, what is the output? Provide the answer in a free text field."
            },
            {
                "code": """
1   a=200
2   a=20
3   print(a)"""
            }

        ],
        "feedback": "Spot on! You got the correct output of 20. The reason is that in python, variables can be reassigned. Initially 'a' was set to 200, then immediately to 20, so the final value is what gets printed.",
        "points": 5,
        "hints": [
            "Pay attention to the order of operations in the code. Which line is executed last?",
            "In Python, when you assign a new value to a variable, it overwrites the previous value completely.",
            "The print() function outputs the current value of the variable, not its name or history.",
            "The solution is 20"
        ],
        "solution": "20",
        "keywords": [],
        "availableLines": [],
        "teacher_id": teacher_ids[1],
        "taskCreated": datetime.now()
    },
    {
        "title": "V3C1",
        "difficultyLevel": "beginner",
        "topic": "Variables",
        "type": "freetext",
        "description": [
            {
                "text": "Given the following code, what is the output? Provide the answer in a free text field."
            },
            {
                "code": """
1   a=100
2   a=a+1
3   print(a)""" 
            }

        ],
        "feedback": "Well done! 101 is the correct answer. This is because, after initally setting 'a' to 100, it is incremented by 1 in the next line with 'a = a + 1', so the final value printed is 101.",
        "points": 5,
        "hints": [ 
            "The expression 'a+1' on the right side of line 2 uses the current value of 'a'. What is that value at this point in the code?",
            "Focus on line 2 (highlight this line). In Python, the '=' sign is an assignment operator, not an equation. It assigns the value on the right to the variable on the left.",
            "Python executes lines in order from top to bottom. Consider how the value of 'a' changes after each line is executed.",
            "The solution is 101"],
        "solution": "101",
        "keywords": [],
        "availableLines": [],
        "teacher_id": teacher_ids[0],
        "taskCreated": datetime.now()
    },
    {
        "title": "V5C1",
        "difficultyLevel": "beginner",
        "topic": "Variables",
        "type": "freetext",
        "description": [
            {
                "text": "Given the following code, what is the output? Provide the answer in a free text field."  
            },
            {
                "code": """
1   a=100
2   b=20
3   a=20
4   print(a,b)"""
            }

        ],
        "feedback": "Excellent! You correctly identified the output as 20 20. Since 'a' was initially set to 100 and then changed to 20, while 'b' was set to 20 and stayed the same, the final output is 20 20.",
        "points": 5,
        "hints": [
            "Pay attention to line 3. How does this line affect the value of 'a'?",
            "In Python, variables can be reassigned multiple times. Each assignment overwrites the previous value.",
            "The print() function on the last line outputs the current values of both 'a' and 'b' at that point in the code execution.",
            "The solution is 20 20"
        ],
        "solution": "20 20",
        "keywords": [],
        "availableLines": [],
        "teacher_id": teacher_ids[0],
        "taskCreated": datetime.now()
    },
    {
        "title": "F1C1",
        "difficultyLevel": "beginner",
        "topic": "Functions",
        "type": "gap",
        "description": [
            {
                "text": "Create a function named 'my_func()' to fill the gap in line 1 and call this function to fill the gap in line 4:"

            },
            {
                "code": "1"
            },
            {
                "gap": "1"
            },
            {
                "code":"""
2       print("Hello from a function")
3   
4"""   
            },
            {
                "gap": "2"
            }

        ],
        "feedback": "You got it! By defining the function my_func() in line 1, you created a reusable block of code that prints 'Hello'. Then, by calling my_func() in line 4, you executed this function, resulting in 'Hello' being printed. Your solution effectively demonstrates the concept of function definition and invocation. Well done!",
        "points": 5,
        "hints": [
            "Remember that Python functions are defined using the 'def' keyword.",
            "Function definitions in Python end with a colon (:)",
            "To call a function, use its name followed by parentheses ().",
            "The solution for the first gap is def my_func(): The solution for the second gap is my_func()"
        ],
        "solution": [
            "def my_func():",
            "my_func()"],
        "keywords": [],
        "availableLines": [],
        "teacher_id": teacher_ids[1],
        "taskCreated": datetime.now()
    },
    {
        "title": "L1C1",
        "difficultyLevel": "beginner",
        "topic": "Loops",
        "type": "gap",
        "description": [
            {
                "text":"Print 'i' as long as 'i' is less than 6:"
            },
            {
                "code":"""
1   i = 1
2""" 
            },
            {
                "gap": "1"
            },
            {
                "code": "i<6"
            },
            {
                "code":"""
3       print(i)
4       i += 1"""
            }

        ],
        "feedback": "Good job! 'while' is the correct keyword to initiate a loop that continues as long the a specified condition 'while i <6:' remains true.",
        "points": 5,
        "hints": [
            "The task requires repetition until a condition is met, which suggests using a loop.",
            "Consider which type of loop continues executing as long as a condition is true.",
            "The condition 'i < 6' needs to be checked before each iteration of the loop.",
            "The solution for the first gap is: while"
        ],
        "solution": ["while"],
        "keywords": [],
        "availableLines": [],
        "teacher_id": teacher_ids[0],
        "taskCreated": datetime.now()
    },
    {
        "title": "L3C1",
        "difficultyLevel": "beginner",
        "topic": "Loops",
        "type": "flowchart",
        "description": [
            {
                "text": "Visualize the code below by creating a flowchart."
            },
            {
                "code": """
1   i = 1 
2   while i < 6:
3      if i == 3:
4         break
5      i += 1"""
            }

        ],
        "feedback": "Wow you seem to be in the 'flow' right now! Way to go!",
        "points": 5,
        "hints": [ 
            "Remember, conditions usually have a diamond shape and represent decisions, while processes are rectangles that show actions.",
            "Remember to follow the logical flow of your code. Each step should naturally lead to the next. If you find a step that doesn't seem to fit, it might be in the wrong place.",
            "Take a closer look at your connections. Each node should logically connect to the next step in the process. If a connection seems out of place, consider where it should logically flow to maintain the correct sequence.",
            "Check out the correct solution!",
            ],
        "solution": [
                {
                    "nodes": [
                        { "key": "i = 1", "shape": "Rectangle" },
                        { "key": "while i < 6:", "shape": "Diamond" },
                        { "key": "if i == 3:", "shape": "Diamond" },
                        { "key": "break", "shape": "Rectangle" },
                        { "key": "i += 1", "shape": "Rectangle" },
                        { "key": "Start", "shape": "Ellipse" },
                        { "key": "End", "shape": "Ellipse" }
                    ],
                    "links": [
                        { "from": "Start", "to": "i = 1"},
                        { "from": "i = 1", "to": "while i < 6:"},
                        { "from": "while i < 6:", "to": "if i == 3:", "text": "True" },
                        { "from": "if i == 3:", "to": "break", "text": "True" },
                        { "from": "if i == 3:", "to": "i += 1", "text": "False" },
                        { "from": "i += 1", "to": "while i < 6:"},
                        { "from": "break", "to": "End"},
                        { "from": "while i < 6:", "to": "End", "text": "False"}
                    ]
                }
            ],
        "keywords": [],
        "availableLines": ["Start", "End", "i = 1", "while i < 6:", "if i == 3:", "break", "i += 1"],
        "teacher_id": teacher_ids[0],
        "taskCreated": datetime.now()
    },
    {
        "title": "F1C2",
        "difficultyLevel": "advanced",
        "topic": "Functions",
        "type": "compiler",
        "description": [
            {
                "text": """The function below takes two arguments - in our case 3 and 2 - adds five to both arguments and is
                supposed to output the new numbers.
                Hence the code below should return the following output: (8,7)
                At the moment, the code is faulty and does not provide the requested output! Identify the error(s) and fix the code.
                Modify the body of the function to provide the corrected output. Rewrite the code in the code editor."""
            },
            {
                "code": """
1   def add5(a,b):
2   a=a+5, b=b+5
3
4   result = add5 (3,2)
5   print(result))"""
            }

        ],
        "feedback": "Nice ! You have successfully corrected the function to achieve the desired output.You have shown a strong grasp of how to modify and return values in Python.",
        "points": 10,
        "hints": [
            "Notice that in the current code, the addition operations are combined into a single line, which makes a a tuple rather than separate variables. You need to perform the addition separately for a and b.",
            "The function currently does not return any values. To get the correct output, you need to explicitly return the new values of a and b from the function",
            "The function call add5(3, 2) should store the result, and then you need to print this result. Ensure that the function returns a tuple of the updated values and that this returned value is printed.",
            """The solution is: 
<span class="code-style-feedback">
def add5(a,b):
    return a+5, b+5
result = add5 (3,2)
print(result)
</span>""",
        ],
        "solution": """
def add5(a,b):
    return a+5, b+5
result = add5(3,2)
print(result)""",
        "keywords": ["return"],
        "output": "(8,7)",
        "availableLines": [],
        "teacher_id": teacher_ids[1],
        "taskCreated": datetime.now()
    },
    {
        "title": "L2C2",
        "difficultyLevel": "advanced",
        "topic": "Loops",
        "type": "compiler",
        "description": [
            {
                "text": "Convert the following output into code that uses a for loop:"
            },
            {
                "code": """
2
4
6
8
10
Goodbye!"""
            }

        ],
        "feedback": "Nice ! Your function works perfectly to create the desired output.",
        "points": 10,
        "hints": [
            "Within the for loop, print each number generated by the range function. Ensure that the indentation of the print statement places it inside the loop body.",
            "Use a for loop with the range function to generate numbers from 2 to 10 (inclusive). The range function can start from 2 and step by 2 up to 10 to match the sequence.",
            "After the for loop completes, print Goodbye! outside of the loop. This ensures that Goodbye! is printed only once after all the numbers have been printed.",
            """The solution is:
for x in range (2,12,2):
    print(x)
print ("Goodbye!")""",
        ],
        "solution": """
for x in range (2,12,2):
    print(x)
print ("Goodbye!")""",
        "keywords": ["for", "print"],
        "output": """
2
4
6
8
10
Goodbye!""",
        "availableLines": [],
        "teacher_id": teacher_ids[1],
        "taskCreated": datetime.now()
    }
    
    ]

    db.tasks.delete_many({}) 
    result = db.tasks.insert_many(tasks)
    if result.acknowledged:
       return "Tasks seeded successfully"
    return "Tasks seeding failed"


if __name__ == "__main__":
    seed_teachers()
    teacher_ids = get_teacher_ids()
    seed_tasks(teacher_ids)