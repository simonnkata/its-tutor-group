var app = angular.module("myApp");

app.factory('FeedbackService', function($timeout) {
    var feedbacks = {
        V1C1: [
            { text: "Pay attention to the order of operations in the code. Which line is executed last?", highlight: null },
            { text: "In Python, when you assign a new value to a variable, it overwrites the previous value completely.", highlight: 2 },
            { text: "The print() function outputs the current value of the variable, not its name or history.", highlight: null },
            { text: "The solution is 20", highlight: null },
        ],
        V3C1: [
            { text: "The expression 'a+1' on the right side of line 2 uses the current value of 'a'. What is that value at this point in the code?", highlight: null },
            { text: "Focus on line 2 (highlight this line). In Python, the '=' sign is an assignment operator, not an equation. It assigns the value on the right to the variable on the left.", highlight: 2 },
            { text: "Python executes lines in order from top to bottom. Consider how the value of 'a' changes after each line is executed.", highlight: null },
            { text: "The solution is 101", highlight: null },
        ],
        V5C1: [
            { text: "Pay attention to line 3. How does this line affect the value of 'a'?", highlight: 3 },
            { text: "In Python, variables can be reassigned multiple times. Each assignment overwrites the previous value.", highlight: null },
            { text: "The print() function on the last line outputs the current values of both 'a' and 'b' at that point in the code execution.", highlight: null },
            { text: "The solution is 20 20", highlight: null },
        ], 
        F1C1: [
            { text: "Remember that Python functions are defined using the 'def' keyword.", highlight: null },
            { text: "Function definitions in Python end with a colon (:)", highlight: null },
            { text: "To call a function, use its name followed by parentheses ().", highlight: null },
            { text: "The solution for the first gap is def my_func(): The solution for the second gap is my_func()", highlight: null },
        ],
        L1C1: [
            { text: "The task requires repetition until a condition is met, which suggests using a loop.", highlight: null },
            { text: "Consider which type of loop continues executing as long as a condition is true.", highlight: null},
            { text: "The condition 'i < 6' needs to be checked before each iteration of the loop.", highlight: null },
            { text: `
                The solution for the first gap is: while
                `, highlight: null },
        ],
        F1C3: [
            { text: 'Start by defining a function named calculation that accepts two parameters, num1 and num2. Use the def keyword to define the function.', highlight: null },
            { text: 'Inside the function, perform both the addition and the subtraction. Store the results of these operations in separate variables. You need to calculate num1 + num2 and num1 - num2.', highlight: null},
            { text: 'Return the results of the addition and subtraction as a tuple from the function. When calling the function, capture the returned values and print them in a single print statement. Tuples are returned in parentheses, and you can print multiple values separated by a comma.', highlight: null },
            { text: 'When calling the function, capture both returned values by assigning them to two variables, which can then be printed or used in further calculations.', highlight: null},
            { text: `
The solution is:
<span class="code-style-feedback">
def calculation(a, b):
    addition = a + b
    subtraction = a - b
    return addition, subtraction
result_addition, result_subtraction = calculation(num1, num2)
print(result_addition, result_subtraction)
</span>
                `, highlight: null },
        ],
        F2C3: [
            { text: 'Start by defining a function that accepts three parameters. Use the def keyword and name your function something descriptive, such as find_largest.', highlight: null },
            { text: 'Inside the function, use conditional statements to compare the three numbers. You can use if-elif-else statements to determine which number is the largest. Remember to handle cases where two or more numbers might be equal.', highlight: null},
            { text: 'Ensure that your function returns the largest number found. You dont need to print anything inside the function; just return the value. When calling the function, print the returned value directly without any additional text.', highlight: null },
            { text: 'Return the largest number found using a single return statement without any additional text. This should be done after all comparisons are made.', Highlight: null},
            { text: `
The solution is:
<span class="code-style-feedback">
def maximum(a, b, c):
    if (a >= b) and (a >= c):
        largest = a
    elif (b >= a) and (b >= c):
        largest = b
    else:
        largest = c
    return largest
print(maximum(num1,num2,num3))
                </span>
                                `, highlight: null },
                        ],
        F5C2: [
            { text: 'Think about how to pass both the name and the salary to the show_employee function. You need to add an extra parameter in the function definition.', highlight: null },
            { text: 'In case the function is called without a salary value, it should use a default value. Consider using default parameter values in Python.', highlight: null},
            { text: 'Pay attention to how the arguments are passed in the function calls. Ensure that the order of the arguments in the calls matches the order in the function definition.', highlight: null },
            { text: 'If a default salary is intended for cases where the salary is not provided, set a default value for the salary parameter in the function definition. This way, the function can be called with just the name and still work correctly.'},
            { text: `
The solution is:
<span class="code-style-feedback">
def show_employee(name, salary=46000):
    print("Name:", name, "Salary:", salary)
show_employee("Emma", 55000)
show_employee("Ben")
</span>
                `, highlight: null },
        ],
        L2C3: [
            { text: 'Use a loop to iterate through all the numbers from start to end, inclusive. The range function will be helpful here.', highlight: null },
            { text: 'Inside the loop, create a helper function to check if a number is prime. A number is prime if it is greater than 1 and has no divisors other than 1 and itself. You can check for divisors by looping from 2 up to the square root of the number (to optimize performance).', highlight: null},
            { text: 'If the number is determined to be prime, print it. Ensure that you print only the prime numbers without any additional text.', highlight: null },
            { text: 'Optimize the helper function by checking for divisors only up to the square root of the number, as any factor larger than the square root would have a corresponding factor smaller than the square root.', highlight: null},
            { text: `
The solution is:
<span class="code-style-feedback">
for num in range(start, end + 1):
    if num > 1:
        for i in range(2, int(num**0.5) + 1):
            if (num % i) == 0:
                break
        else:
            print(num)
</span>
                `, highlight: null },
        ],
        V1C3: [
            { text: 'You need a variable to keep track of the running total as you loop through the numbers from 1 to "end". Initialize this variable to 0 before the loop starts.', highlight: null },
            { text: 'Use a while loop to iterate through the range of numbers from 1 to "end", inclusive. Do not forget to set a condition for the while loop.', highlight: null},
            { text: 'Inside the loop, add each number to your sum variable. After the loop finishes, print the result. Make sure to print only the sum without any additional text.', highlight: null },
            { text: 'After the loop has completed, print the sum variable. Make sure to print only the sum without any additional text.', highlight: null},
            { text: `
            The solution is:
<span class="code-style-feedback">
sum = 0
i = 0
while i <= end:
    sum += i
    i +=1
print(sum)
</span>
                `, highlight: null },
        ],
        L5C1: [
            { text: 'You need to set an initial value for the variable num to begin the countdown. In this case, num starts at 10.', highlight: null },
            { text: '"The while loop should continue to execute as long as num is greater than 3. This means the loop will run and decrement num until it reaches 3.', highlight: null},
            { text: 'In each iteration of the while loop, the value of num is decreased by 1. Pay attention to how this affects the value of num each time the loop runs.', highlight: null },
            { text: `
        The solution is:
<span class="code-style-feedback">
9
8
7
6
5
4
3
</span>
                `, highlight: null },
        ],
        
        F1C2: [
        { text: 'Notice that in the current code, the addition operations are combined into a single line, which makes a a tuple rather than separate variables. You need to perform the addition separately for a and b.', highlight: null },
        { text: 'The function currently does not return any values. To get the correct output, you need to explicitly return the new values of a and b from the function', highlight: null},
        { text: 'The function call add5(3, 2) should store the result, and then you need to print this result. Ensure that the function returns a tuple of the updated values and that this returned value is printed.', highlight: null },
        { text: `
The solution is: 
<span class="code-style-feedback">
def add5(a,b):
    return a+5, b+5
result = add5 (3,2)
print(result)
</span>`
, highlight: null },
        ],

        V2C2: [
            { text: 'When you want to modify a global variable inside a function, you need to declare it as global within the function. This tells Python that you are referring to the global variable rather than creating a local one.', highlight: null },
            { text: 'Check that the global variable c is properly initialized before the function modifies it. This way, the function can correctly increment the value of c.', highlight: null},
            { text: 'Make sure the function is called after defining it to execute the code within the function. This ensures that the global variable is incremented and printed as expected.', highlight: null },
            { text: `
The solution is:
<span class="code-style-feedback">
c = 1
def add():
    global c
    c = c+2
    print(c)
add()
</span>
                `, highlight: null },
        ],
        L2C2: [
            { text: 'Within the for loop, print each number generated by the range function. Ensure that the indentation of the print statement places it inside the loop body.', highlight: null },
            { text: 'Use a for loop with the range function to generate numbers from 2 to 10 (inclusive). The range function can start from 2 and step by 2 up to 10 to match the sequence.', highlight: null},
            { text: 'After the for loop completes, print Goodbye! outside of the loop. This ensures that Goodbye! is printed only once after all the numbers have been printed.', highlight: null },
            { text: `
            The solution is:
<span class="code-style-feedback">
for x in range (2,12,2):
    print(x)
print ("Goodbye!")
</span>
                `, highlight: null },
        ],
        L4C2: [
            { text: 'Within the while loop, include code to increment the count variable by 1 on each iteration. This ensures that the count increases with each iteration of the loop.', highlight: null },
            { text: 'The condition (count < 1) in the while loop is incorrect for achieving the desired output. It should be adjusted to ensure that the loop runs as long as count is less than or equal to 5.', highlight: null},
            { text: 'Inside the while loop, use a print statement to display the current value of count with the format the count is : X, where X is the current value of count.', highlight: null },
            { text: `
The solution is:
<span class="code-style-feedback">
count = 1
while (count<=5):
    print("The count is",count)
    count+=1
print("Finished")
</span>
                `, highlight: null },

        ],
            L3C1: [
            { text: 'Remember, conditions usually have a diamond shape and represent decisions, while processes are rectangles that show actions.', highlight: null },
            { text: "Remember to follow the logical flow of your code. Each step should naturally lead to the next. If you find a step that doesn't seem to fit, it might be in the wrong place.", highlight: null},
            { text: 'Take a closer look at your connections. Each node should logically connect to the next step in the process. If a connection seems out of place, consider where it should logically flow to maintain the correct sequence.', highlight: null },
            { text: 'Check out the correct solution!', highlight: null },
            
        ]



    };

    var positiveFeedbacks = {
        V1C1: [
            { text: 'Spot on! You got the correct output of 20. The reason is that in python, variables can be reassigned. Initially "a" was set to 200, then immediately to 20, so the final value is what gets printed.' , highlight: null }
        ],
        V3C1: [
            { text: 'Well done! 101 is the correct answer. This is because, after initally setting "a" to 100, it is incremented by 1 in the next line with "a = a + 1", so the final value printed is 101.', highlight: null }
        ],
        V5C1: [
            { text: 'Excellent! You correctly identified the output as 20 20. Since "a" was initially set to 100 and then changed to 20, while "b" was set to 20 and stayed the same, the final output is 20 20.', highlight: null }         
        ], 
        F1C1: [
            { text: 'You got it! By defining the function my_func() in line 1, you created a reusable block of code that prints "Hello". Then, by calling my_func() in line 4, you executed this function, resulting in "Hello" being printed. Your solution effectively demonstrates the concept of function definition and invocation. Well done!', highlight: null }
        ],
        L1C1: [
            { text: 'Good job! "while" is the correct keyword to initiate a loop that continues as long the a specified condition "while i <6:" remains true.', highlight: null }
        ],
        F1C3: [
            { text: 'Fantastic job! You successfully created a program that defines a function to perform addition and subtraction on two arguments and returns both results in a single call. It shows that you have a solid understanding of defining a function and how to return multiple variables using data structures.', highlight: null }
        ],
        F2C3: [
            { text: 'Awesome! You successfully created a program that defines a function to find the largest number among three numbers, considering cases where two numbers are identical and larger than the third. Your function accepts three numbers and correctly returns the largest of them. ', highlight: null }
        ],
        F5C2: [
            { text: 'You correctly fixed the error by adding the second parameter "salary=46000" as a default value to the function definition. This ensures that the function show_employee() works even if the salary is not explicitly provided, demonstrating your understanding of default parameters.', highlight: null }
        ],
        L2C3: [
            { text: 'Great job! You have a solid understanding of both iteration and prime number concepts! Your code efficiently iterates through the range to determine which numbers are prime.', highlight: null }
        ],
        V1C3: [
            { text: 'Nice work! Your code fulfills all given requirements! Your implementation correctly adds each incremented value to the sum up to the end value. ', highlight: null }
        ],
        F1C2: [ 
            { text:'Nice ! You have successfully corrected the function to achieve the desired output.You have shown a strong grasp of how to modify and return values in Python. ', highlight: null}
        ],
        L4C2: [ 
            {text: 'Very Good ! You have corrected the loop and fixed the condition. Your code now executes perfectly, demonstrating a solid understanding of while loops and incrementing values.', highlight: null}   
        ],
        V2C2: [ 
            {text: 'You have successfully identified and corrected the scope issue in the function. By using the global keyword, your code now properly accesses and modifies the global variable', highlight: null}
        ],
        L3C1: [
            {text: 'Wow you seem to be in the "flow" right now! Way to go!'}
        ],
        L5C1: [
            {text: 'Well done! The loop starts at num = 10 and reduces num by 1 with each iteration, printing the updated value. It stops when num is no longer greater than 3, meaning it prints values from 9 to 3 inclusive.'}
        ]


    };

    var reassuringFeedbacks = [
        "That's not quite it, but your effort level is off the charts!",
        "Not quite, but hey, Rome wasn't built in a day!",
        "Not quite the jackpot, but you're getting closer!",
        "Not quite right, but your effort deserves an A+!",
        "Not quite the bullseye, but you're definitely hitting the target!",
        "Not quite there, but your persistence is admirable!",
        "Don't be discouraged by setbacks. Use them as opportunities to learn and grow!",
        "Believe in yourself and your abilities. You've got this!",
        "You're doing better than you think. Keep going and you'll reach your goal!",
        "Learning is a journey, not a destination. Keep moving forward!",
        "Stay positive and keep pushing through challenges. You're making progress!",
        "Don't worry, mistakes are part of the learning process. Keep trying!",
        "You're getting closer with each attempt. Keep pushing forward!",
        "Learning something new takes time and effort. You're doing great!",
    ];
    
    var negativeFeedbacks = {
        V1C1: reassuringFeedbacks,
        V3C1: reassuringFeedbacks,
        V5C1: reassuringFeedbacks,
        F1C1: reassuringFeedbacks,
        L1C1: reassuringFeedbacks,
        F1C3: reassuringFeedbacks,
        F2C3: reassuringFeedbacks,
        F5C2: reassuringFeedbacks,
        L2C3: reassuringFeedbacks,
        V1C3: reassuringFeedbacks,
        L5C1: reassuringFeedbacks,
        F1C2: reassuringFeedbacks,
        V2C2: reassuringFeedbacks,
        L2C2: reassuringFeedbacks,
        L4C2: reassuringFeedbacks,
        L3C1: reassuringFeedbacks,
    };


    this.getFeedbacks = function(taskId) {
        return feedbacks[taskId] || [];
    };

    this.getPositiveFeedbacks = function(taskId) {
        return positiveFeedbacks[taskId] || [];
    };

    this.getNegativeFeedbacks = function(taskId) {
        if (negativeFeedbacks[taskId]) {
            return [{
                text: reassuringFeedbacks[Math.floor(Math.random() * reassuringFeedbacks.length)]
            }];
        }
        return [];
    };

    // Sad/Happy Tutor 
    this.updatePythonTutorImage = function(feedbackType, timestamp) {
        console.log("FEEDBACKTYPE: " + feedbackType);
        var imageElement = document.getElementById('python-tutor-img');
        var baseImageUrl;

        if (feedbackType === 'positive') {
            console.log("Bildertausch pos");
            baseImageUrl = 'assets/happy_pythonTutor.png'; 
        } else if (feedbackType === 'negative') {
            console.log("Bildertausch");
            baseImageUrl = 'assets/sad_pythonTutor.png';
        } else if (feedbackType === 'incomplete'){
            baseImageUrl = 'assets/incomplete_pythonTutor.png';
        } else {
            baseImageUrl = 'assets/pythonTutor.png';
        }

        // Append timestamp to the image URL to prevent caching
        var timestamp = new Date().getTime();
        imageElement.src = baseImageUrl + '?t=' + timestamp;

        // Revert to default image after 5 seconds
        $timeout(function() {
            imageElement.src = 'assets/pythonTutor.png?t=' + new Date().getTime();
        }, 2000);
    };

    return this;
});
