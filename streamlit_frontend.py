import streamlit as st
import requests

st.set_page_config(page_title="Hypertension Assistant", page_icon="🩺")
st.markdown("<h1 style='text-align:center;'>🩺 Agentic Hypertension AI</h1>", unsafe_allow_html=True)
st.write("Ask about hypertension, lifestyle, or risk factors. The AI remembers previous advice.")

if "messages" not in st.session_state:
    st.session_state.messages = []

# Display previous conversation
for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])

user_input = st.chat_input("Ask about hypertension...")

if user_input:
    st.chat_message("user").markdown(user_input)
    st.session_state.messages.append({"role": "user", "content": user_input})

    try:
        # Call AI backend
        response = requests.post("http://127.0.0.1:8000/api/ai/chat", json={"message": user_input})
        if response.status_code == 200:
            reply = response.json().get("reply", "No response from AI.")
        else:
            reply = f"Error {response.status_code}: {response.text}"
    except Exception as e:
        reply = f"Error connecting to AI server: {e}"

    st.chat_message("assistant").markdown(reply)
    st.session_state.messages.append({"role": "assistant", "content": reply})
