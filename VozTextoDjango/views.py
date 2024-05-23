from django.shortcuts import redirect, render

def landing_page_view(request):
    
    return render(request, 'landing_page.html')

def start_page_view(request):
    
    return render(request, 'start_page.html')