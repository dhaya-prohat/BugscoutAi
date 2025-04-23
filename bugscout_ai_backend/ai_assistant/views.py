from django.shortcuts import render

# Create your views here.
import requests
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import ChatSession, Message
from .serializers import MessageSerializer
from django.db.models import Count

@api_view(['POST'])
def chat_view(request):
    user_input = request.data.get('message')

    if not user_input:
        return Response({"error": "No message provided"}, status=400)

    # Session logic
    session_count = ChatSession.objects.count()
    title = f"{session_count + 1}st Testing" if session_count == 0 else f"{session_count + 1}nd Testing"
    session = ChatSession.objects.create(title=title)

    # Save user message
    user_msg = Message.objects.create(session=session, role='user', content=user_input)

    # Send to local Mistral via Ollama
    try:
        response = requests.post("http://localhost:11434/api/generate", json={
            "model": "mistral",
            "prompt": user_input,
            "stream": False
        })

        response_data = response.json()
        bot_reply = response_data.get('response', 'Sorry, I could not generate a response.')

    except Exception as e:
        bot_reply = f"Error connecting to AI: {str(e)}"

    # Save bot response
    Message.objects.create(session=session, role='bot', content=bot_reply)

    return Response({
        "reply": bot_reply,
        "session_title": session.title
    })
