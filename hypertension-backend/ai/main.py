import streamlit as st
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.documents import Document
import requests

st.set_page_config(page_title="Hypertension Assistant", page_icon="🩺")
st.markdown("<h1 style='text-align:center;'>🩺 Agentic Hypertension AI</h1>", unsafe_allow_html=True)
st.write("Ask about blood pressure, risk factors, lifestyle, or management tips. AI remembers past advice.")

if "messages" not in st.session_state:
    st.session_state.messages = []

# Tone selector
tone = st.selectbox("Choose AI tone:", ["friendly", "scholarly", "concise"], index=0)

# Display previous conversation
for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])

# User input
user_input = st.chat_input("Ask about hypertension...")
if user_input:
    st.chat_message("user").markdown(user_input)
    st.session_state.messages.append({"role": "user", "content": user_input})

    # Send request to Flask AI API
    response = requests.post(
        "http://127.0.0.1:8000/api/ai/chat",
        json={"message": user_input, "tone": tone}
    )

    if response.status_code == 200:
        reply = response.json().get("reply", "")
    else:
        reply = "❌ Error connecting to AI backend."

    with st.chat_message("assistant"):
        st.markdown(reply)

    st.session_state.messages.append({"role": "assistant", "content": reply})
