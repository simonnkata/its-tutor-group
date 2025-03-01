FROM python:3.13

WORKDIR /app

COPY requirements.txt /app/

RUN pip install -r requirements.txt

COPY requirements.txt app.py feedback.py seeder.py teacher.py /app/

EXPOSE 5001

CMD ["python", "app.py"]