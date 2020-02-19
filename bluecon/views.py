from django.shortcuts import render

from bluedot import BlueDot

# Create your views here.


def index(request):

    return render(request, 'bluecon/index.html', {})
