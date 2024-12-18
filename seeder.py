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