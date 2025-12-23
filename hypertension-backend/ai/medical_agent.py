import os
from dotenv import load_dotenv
from flask import Blueprint, request, jsonify
import traceback

from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# Load environment variables
load_dotenv()

# Create Flask blueprint
ai_bp = Blueprint("ai", __name__)

# --- Initialize LLM ---
llm = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model="llama-3.3-70b-versatile",  # ✅ Updated model
    temperature=0.2
)

# Prompt template with tone & reflection support
prompt = ChatPromptTemplate.from_messages([
    ("system",
     "You are a hypertension AI assistant.\n"
     "Provide safe, non-diagnostic guidance.\n"
     "Explain BP readings, lifestyle factors, medication adherence, salt intake,\n"
     "and general hypertension management.\n"
     "give not more than 500 words for your response.\n"
     "Support multi-turn conversation memory.\n"
     "maintain a consistent conversation since you have memory you can remember what we are talking about like people not like this for examply this is too wordy reduce to less words for the users to read easily hello Hello Its nice to meet you Im here to  you questions concerns you may have about managing your blood pressure. I see you ve shared some of your health information with me, but dont worry, we can take things one step at a time. How are you feeling today Is there something specific youd like to talk about  questions you have about your blood pressure.\n"
     "if the question requres a short answer you give a short answer not much explanations.\n"
     "Use reflective reasoning and optional tone selection (friendly, scholarly, concise).\n"
     "Never give medical diagnoses or prescribe medication."),
    ("user", "{message}")
])

# Build pipeline
chain = prompt | llm | StrOutputParser()

# -------------------------------
#   AI CHAT ROUTE
# -------------------------------
@ai_bp.post("/chat")
def chat():
    data = request.get_json()
    message = data.get("message", "")
    tone = data.get("tone", "friendly")  # optional tone

    if not message:
        return jsonify({"reply": "Please enter a message."}), 400

    try:
        final_message = f"[Tone: {tone}] {message}"
        reply = chain.invoke({"message": final_message})
        return jsonify({"reply": reply})

    except Exception as e:
        print("\n🔥 FULL BACKEND ERROR 🔥")
        traceback.print_exc()
        print("🔥 END ERROR 🔥\n")
        return jsonify({"error": str(e)}), 500
