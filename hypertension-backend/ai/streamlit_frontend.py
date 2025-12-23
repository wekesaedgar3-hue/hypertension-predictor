import streamlit as st
import requests

st.title("Hypertension AI Chatbot")

if "messages" not in st.session_state:
    st.session_state.messages = []

# User input
user_input = st.text_input("You:", "")

if user_input:
    st.session_state.messages.append({"role": "user", "content": user_input})

    try:
        response = requests.post(
            "http://127.0.0.1:8000/api/ai/chat",
            json={"message": user_input},
            timeout=10
        )
        ai_reply = response.json().get("reply", "No response from AI.")
    except Exception as e:
        ai_reply = f"Error: {e}"

    st.session_state.messages.append({"role": "ai", "content": ai_reply})

# Display chat history
for msg in st.session_state.messages:
    if msg["role"] == "user":
        st.markdown(f"**You:** {msg['content']}")
    else:
        st.markdown(f"**AI:** {msg['content']}")
