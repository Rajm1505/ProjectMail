from urllib import response
from django.shortcuts import render
from django.http import HttpResponse

from .models import Recipients

from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mass_mail, send_mail


# Create your views here.


def index(request):
    return HttpResponse('This is api index')

@api_view(['POST'])
# @csrf_exempt
def sendMail(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        message = data['message']
        department = data['department']

        subject = "Hardik to Hardik che"

        reciepents = Recipients.objects.filter(department = 'Hospitals')

        reciepentlist = reciepentstolist(reciepents)
        
        print('list' ,reciepentlist)
        res = send_mail(subject, message,'automailclient0@gmail.com', reciepentlist,fail_silently = False)
        # res = send_mass_mail((subject, message, 'automailclient0@gmail.com', reciepentlist),fail_silently = False)


        print(res)
        # print(request.data)
        # message = request.data['message']
        response = Response()
        response.data = {
            'Sent' : res
        }
        return response

def reciepentstolist(reciepents):
    reciepentlist = []
    for i in reciepents :
        reciepentlist.append(i.email)
    return reciepentlist




