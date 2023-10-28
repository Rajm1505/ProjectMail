# Python Libraries
import easyimap as e
import jwt
import datetime
import pandas as pd
from decouple import config

# Django Imports
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mass_mail, send_mail

from .models import Departments, Recipients, User
from ProjectMail.settings import SECRET_KEY

# Rest Framework Imports
from rest_framework.response import Response
from rest_framework.parsers import JSONParser, MultiPartParser
from rest_framework.decorators import api_view, parser_classes
from rest_framework.exceptions import AuthenticationFailed


# Serializers
from .serializers import UserSerializer

# Celery Tasks
from .tasks import sendMailWorker


def index(request):
    return HttpResponse('Use Appropriate path')


@api_view(['POST'])
@csrf_exempt
def sendMail(request):
    if request.method == 'POST':
        # Parsing json string
        data = JSONParser().parse(request)
        response = Response()
        message = data['message']
        subject = data['subject']

        # Checking if department exists
        try:
            dept = Departments.objects.get(name=data["department"])
        except:
            print("Dept not found!")
            response.data = {
                "isSent": 0,
                "message": "Department not foundsss!"
            }
            response.status_code = 400
            return response

        # Getting reciepent's emails in a list
        reciepents = Recipients.objects.filter(did=dept)
        if reciepents:
            reciepentlist = reciepentsToList(reciepents)
            print('list', reciepentlist)
        else:
            print("Reciepents not found!")
            response.data = {
                "isSent": 0,
                "message": f"There are no Reciepents in {dept}"
            }
            return response

        # Sends mail through a celery worker
        print(
            f"Sending Data to worker subject: {subject} Message: {message} Reciepents List: ")
        print(reciepentlist)
        sendMailWorker.delay(subject, message, reciepentlist)

        response.data = {
            'isSent': 1
        }
        return response


def reciepentsToList(reciepents):
    reciepentlist = []
    for rec in reciepents:
        reciepentlist.append(rec.email)
    return reciepentlist


@api_view(['GET'])
def newMailReplies(request):
    if request.method == "GET":

        start = datetime.datetime.now()
        response = Response()
        mailserver = e.connect("imap.gmail.com", config(
            "EMAIL_HOST_USER"), config("EMAIL_HOST_PASSWORD"))

        # Returns mailobjects of all the unseen mails
        unseen_mails = mailserver.unseen(20)
        if not unseen_mails:
            print("no mails")
            response.status_code = 404
            response.data = {
                'detail': 'No unseen mails Found'
            }
            return response
        print("Unseen Mails: ", unseen_mails)

        # If mails found
        mails = {}
        counter = 1
        for i in range(0, len(unseen_mails)):
            if 'Re:' in unseen_mails[i].title:
                print("found")
                mails[counter] = {}
                mails[counter]['id'] = str(unseen_mails[i].uid).encode()
                mails[counter]['title'] = unseen_mails[i].title
                mails[counter]['from_addr'] = unseen_mails[i].from_addr
                counter += 1

        response.data = mails

        print("response", response.data)
        end = datetime.datetime.now()
        print("Time taken: ", end-start)
        return response

        # Another Approach
        # start = datetime.datetime.now()
        # mailids = server.listids(limit=20)
        # print(mailids)
        # response = Response()

        # mail_titles = {}
        # for i in range(0,len(mailids)):
        #     email = server.mail(mailids[i], include_raw=True)
        #     if 'Re:' in email.title:
        #         mail_titles[i] = email.title

        #     response.data = mail_titles
        # print("response", response.data)
        # end = datetime.datetime.now()
        # print("Time taken: ",end-start)
        # return response


@api_view(['GET'])
def allMailReplies(request):
    if request.method == "GET":
        start = datetime.datetime.now()

        response = Response()
        server = e.connect("imap.gmail.com", config(
            "EMAIL_HOST_USER"), config("EMAIL_HOST_PASSWORD"))
        all_mailids = server.listids(20)

        print("Mailids: ", all_mailids)
        if not all_mailids:
            print("no mails")
            response.status_code = 404
            response.data = {
                'message': 'No mails Found'
            }
            return response

        mails = {}
        counter = 1
        for i in range(0, len(all_mailids)):
            email = server.mail(all_mailids[i], include_raw=True)
            if 'Re:' in email.title:
                mails[counter] = {}
                print("found")
                mails[counter]['id'] = str(email.uid).encode()
                mails[counter]['title'] = email.title
                mails[counter]['from_addr'] = email.from_addr
                counter += 1

        response.data = mails

        print("response", response.data)
        end = datetime.datetime.now()
        print("Time taken: ", end-start)
        return response


def filterMailBody(mail_body):
    filtered_body = ""
    for line in mail_body.split('\n'):
        if not line.startswith(">"):
            filtered_body += line + "\n"
    return filtered_body

@api_view(['POST'])
def mailBody(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        id = data['id']
        mailserver = e.connect("imap.gmail.com", config(
            "EMAIL_HOST_USER"), config("EMAIL_HOST_PASSWORD"), "INBOX")
        email = mailserver.mail(id, include_raw = True)
        filtered_body = filterMailBody(email.body)

        print(filtered_body)
        response = Response()

        if email:
            response.status_code = 200
            response.data = {
                'date': email.date,
                'title': email.title,
                'from_addr': email.from_addr,
                'body': filtered_body
            }
            return response
        else:
            response.status_code = 404
            response.data = {
                'message': 'Email not found!'
            }
            return response


# Function to add Reciepents using CSV file
@api_view(['POST'])
@parser_classes([MultiPartParser])
def importCSV(request):
    # Recieving and Parsing CSV file from frontend
    csvFile = request.data.get('csvFile')
    df = pd.read_csv(csvFile, sep=';')

    newRecipients = []
    duplicateRecipents = []  # To store all existing emails
    for index, row in df.iterrows():
        # Checks if Department is already added
        dept = Departments.objects.filter(name=row['department']).first()
        if (not dept):
            dept = Departments(name=row['department'])
            dept.save()

        # Creates a List of new Recipients
        if (not Recipients.objects.filter(email=row['email']).first()):
            newRecipients.append(Recipients(
                name=row['name'], did=dept, email=row['email']))
        else:
            duplicateRecipents.append(row['email'])

    # Saving Reciepents from CSV in database
    Recipients.objects.bulk_create(newRecipients)

    response = Response()
    response.data = {
        "detail": "File uploaded successfully!",
        "duplicateEmails": duplicateRecipents
    }
    return response


@api_view(['GET'])
def getDepartments(request):

    deptNames = []
    departments = Departments.objects.all()
    for dept in departments:
        deptNames.append(dept.name)
    print(deptNames)

    response = Response()
    response.data = {
        "departments":  deptNames
    }
    return response


@api_view(['POST'])
def register(request):
    data = JSONParser().parse(request)

    userSerializer = UserSerializer(data=data)
    userSerializer.is_valid(raise_exception=True)
    userSerializer.save()

    response = Response()
    response.data = userSerializer.data
    response.data["detail"] = "Registered Successfully"

    return response


@api_view(['POST'])
def login(request):
    data = JSONParser().parse(request)
    email = data.get('email')
    password = data.get('password')

    user = User.objects.filter(email=email).first()
    if not user:
        raise AuthenticationFailed("User not found")

    if not user.check_password(raw_password=password):
        raise AuthenticationFailed("Invalid Password")

    token = generateJWTToken(user.uid)
    response = Response()
    response.data = {
        'jwt': token
    }

    return response


def generateJWTToken(uid):
    payload = {
        'uid': uid,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
        'iat': datetime.datetime.utcnow()
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')
