from celery import shared_task

from django.core.mail import send_mass_mail, send_mail


@shared_task(bind = True)
def sendMailWorker(self, subject, message, reciepentlist : list):
    print('worker started')
    res = send_mail(subject, message,'automailclient0@gmail.com', reciepentlist,fail_silently = False)
    print("result from worker:" + str(res))
    return "Done"

