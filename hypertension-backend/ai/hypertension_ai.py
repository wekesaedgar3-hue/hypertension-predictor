# hypertension_ai.py

from langchain_core.prompts import PromptTemplate
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document
from pydantic import BaseModel, Field
from dotenv import load_dotenv
import os

# --- Load environment variables ---
load_dotenv()
api_key = os.getenv("GROQ_API_KEY")

# --- Initialize LLM (UPDATED MODEL) ---
llm = ChatGroq(
    api_key=api_key,
    model="llama3-8b-8192",   # Supported model — FIXED
    temperature=0.3
)

# --- Vector memory (ChromaDB) ---
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
vectorstore = Chroma(
    persist_directory="hypertension_memory",
    embedding_function=embeddings
)

# --- Structured output schema ---
class HypertensionResponse(BaseModel):
    topic: str = Field(..., description="Patient health topic or question")
    reasoning_type: str = Field(..., description="Reasoning strategy used")
    summary: str = Field(..., description="Short explanation or advice")
    reflection: str = Field(..., description="Lifestyle or motivational advice")

# --- Multi-turn memory ---
conversation_history = [
    SystemMessage(content="""
You are a compassionate and knowledgeable AI assistant for hypertension.
Provide safe advice, explain BP readings, risk factors, and lifestyle guidance.
Never give medical diagnosis, but educate patients.
Maintain continuity across turns and recall previous advice.
""")
]

# --- Reasoning selector ---
reasoning_selector_prompt = PromptTemplate(
    input_variables=["user_input"],
    template="""
Given the patient question: "{user_input}"
Choose the best reasoning strategy:
- chain-of-thought
- react
- self-ask

Respond with only one.
"""
)

reasoning_selector_chain = reasoning_selector_prompt | llm | StrOutputParser()

# --- Explanation generator ---
hypertension_explanation_prompt = PromptTemplate(
    input_variables=["reasoning_type", "retrieved", "conversation", "user_input"],
    template="""
You are a hypertension assistant AI.
Reasoning Strategy: {reasoning_type}

Conversation so far:
{conversation}

Relevant past advice:
{retrieved}

Patient Input:
{user_input}

Generate a structured response:
- Clear hypertension guidance (no medical diagnosis)
- Risk factor information
- Lifestyle recommendations

Return JSON fields: topic, reasoning_type, summary, reflection.
"""
)

hypertension_chain = hypertension_explanation_prompt | llm.with_structured_output(HypertensionResponse)

# --- Search similar context ---
def search_similar(query, k=3):
    results = vectorstore.similarity_search_with_score(query, k=k)
    if not results:
        return ""
    return "\n".join([doc.page_content for doc, score in results])

# --- CLI Mode (optional for terminal testing) ---
if __name__ == "__main__":
    print("🩺 Hypertension Agentic AI ready! Type 'exit' to quit.")

    while True:
        user_input = input("\nPatient question: ").strip()
        if user_input.lower() in ["exit", "quit"]:
            break

        reasoning_type = reasoning_selector_chain.invoke({"user_input": user_input}).strip().lower()
        retrieved = search_similar(user_input)
        conversation_text = "\n".join([msg.content for msg in conversation_history[-4:]])

        result = hypertension_chain.invoke({
            "reasoning_type": reasoning_type,
            "retrieved": retrieved,
            "conversation": conversation_text,
            "user_input": user_input
        })

        print(f"\n🧠 Explanation ({reasoning_type} reasoning):\n")
        print(f"{result.summary}\n{result.reflection}")

        combined_text = f"{result.topic}\n{result.summary}\n{result.reflection}"
        vectorstore.add_documents([Document(page_content=combined_text)])
        vectorstore.persist()

        conversation_history.append(HumanMessage(content=user_input))
        conversation_history.append(AIMessage(content=f"{result.summary} {result.reflection}"))
