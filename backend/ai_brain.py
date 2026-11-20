from neo4j import GraphDatabase
from langchain_ollama import ChatOllama
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.tools import tool
from langchain_core.messages import SystemMessage, HumanMessage, ToolMessage
from deep_translator import GoogleTranslator
from langdetect import detect

# ==============================================================================
# 1. LOCAL LLM SETUP (Ollama - Privacy First)
# ==============================================================================
llm = ChatOllama(model="llama3.2", temperature=0.1)

# ==============================================================================
# 2. CHROMADB VECTOR DATABASE LOAD KARNA (Member 2 ka saved data)
# ==============================================================================
print("⏳ ChromaDB aur Embedding model load ho raha hai...")
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
vector_db = Chroma(
    persist_directory="./crime_data_db",
    embedding_function=embeddings
)
retriever = vector_db.as_retriever(search_kwargs={"k": 6})

# ==============================================================================
# 3. NEO4J GRAPH DATABASE CONNECTION (Member 2 ka GlassboxGraph)
# ==============================================================================
NEO4J_URI = "bolt://localhost:7687"
NEO4J_USER = "neo4j"
NEO4J_PASSWORD = "password123"


def query_neo4j(cypher_query: str, params: dict = None):
    driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
    try:
        with driver.session() as session:
            result = session.run(cypher_query, params or {})
            return [record.data() for record in result]
    finally:
        driver.close()


# ==============================================================================
# 4. AGENTIC TOOLS (AI Brain ke 3 Hathiyar)
# ==============================================================================
@tool
def search_evidence(query: str) -> str:
    """Searches the forensic database (FIR, WhatsApp chats, bank transactions, hotel & CCTV logs) for evidence matching the query."""
    docs = retriever.invoke(query)
    if not docs:
        return "No relevant evidence found in the database."

    formatted_evidence = []
    for i, doc in enumerate(docs, start=1):
        source = doc.metadata.get("source", "Unknown File")
        formatted_evidence.append(f"[Evidence {i} | Source File: {source}]\n{doc.page_content}")

    return "\n\n---\n\n".join(formatted_evidence)


@tool
def analyze_suspect_network(person_name: str) -> str:
    """Finds a suspect's connected phone numbers, locations, and OTHER suspects linked through shared phones/locations in Neo4j."""
    cypher = """
    MATCH (p:Person)-[r]->(target)
    WHERE toLower(p.name) CONTAINS toLower($name)
    OPTIONAL MATCH (other:Person)-[]->(target)
    WHERE other <> p
    RETURN p.name AS person,
           type(r) AS relation,
           COALESCE(target.name, target.number) AS connected_to,
           r.source AS source_file,
           collect(DISTINCT other.name) AS shared_with
    """
    try:
        records = query_neo4j(cypher, {"name": person_name})
        if not records:
            return f"No graph connections found for '{person_name}' in Neo4j."

        lines = []
        for rec in records:
            shared = ", ".join(rec["shared_with"]) if rec["shared_with"] else "None"
            lines.append(
                f"- {rec['person']} --[{rec['relation']}]--> {rec['connected_to']} "
                f"(Source: {rec['source_file']} | Shared with suspects: {shared})"
            )
        return "\n".join(lines)
    except Exception as e:
        return f"Neo4j connection error (Make sure GlassboxGraph is RUNNING): {e}"


@tool
def draft_report(findings: str) -> str:
    """Converts investigation findings into a formal Police Case Diary / Forensic Report format."""
    prompt = (
        "Convert the following investigation findings into a concise, formal Indian Police Case Diary "
        "(Case ID: CASE-2026-KID-07) with headings: Incident Overview, Key Suspects & Roles, "
        "Verified Evidence & Citations, and Recommended Next Action.\n\n"
        f"Findings:\n{findings}"
    )
    response = llm.invoke(prompt)
    return response.content


tool_map = {
    "search_evidence": search_evidence,
    "analyze_suspect_network": analyze_suspect_network,
    "draft_report": draft_report,
}


def safe_invoke_tool(tool_name: str, tool_args) -> str:
    """Safely executes a tool and auto-fixes argument names if llama3.2 formats them differently."""
    selected_tool = tool_map.get(tool_name)
    if not selected_tool:
        return f"Tool '{tool_name}' not found."

    if not isinstance(tool_args, dict):
        tool_args = {"input": str(tool_args)}

    try:
        if tool_name == "draft_report" and "findings" not in tool_args:
            formatted = "\n".join(f"{k}: {v}" for k, v in tool_args.items())
            tool_args = {"findings": formatted}
        elif tool_name == "analyze_suspect_network" and "person_name" not in tool_args:
            first_val = next(iter(tool_args.values()), "")
            tool_args = {"person_name": str(first_val)}
        elif tool_name == "search_evidence" and "query" not in tool_args:
            first_val = next(iter(tool_args.values()), "")
            tool_args = {"query": str(first_val)}

        return str(selected_tool.invoke(tool_args))
    except Exception as e:
        return f"Tool execution note ({tool_name}): {e}"


# ==============================================================================
# 5. HYBRID GRAPHRAG + AGENTIC REASONING LOOP
# ==============================================================================
SYSTEM_PROMPT = (
    "You are GLASSBOX, an elite Digital Forensic Investigation Assistant for Case #2026-KID-07 (Operation Blind Spot). "
    "Carefully read ALL retrieved evidence files provided to you. "
    "RULES:\n"
    "1. Base your answer strictly on the retrieved evidence and tool outputs. NEVER invent facts.\n"
    "2. Include exact figures, timestamps, phone numbers, and roles (e.g., INR 150000 advance, INR 75000 payment, Room 304, CCTV blackout).\n"
    "3. Always cite the exact source file names (e.g., whatsapp_chats_ramesh.txt, shop_transactions.csv, hotel_details_report.txt, hotel_transactions.csv).\n"
    "4. Keep the answer clear, structured in bullet points, and directly focused on the user's question."
)


def run_forensic_agent(english_query: str) -> dict:
    tools_used = []

    # Step A: Hamesha pehle ChromaDB se real evidence nikalo
    print(f"🛠️ Agent calling tool: search_evidence({{'query': '{english_query}'}})")
    retrieved_evidence = search_evidence.invoke({"query": english_query})
    tools_used.append("search_evidence")

    # Step B: Sirf tab draft_report tool do jab user report/diary maange
    wants_report = any(
        word in english_query.lower()
        for word in ["report", "diary", "draft", "fir", "case file", "formal"]
    )
    active_tools = [analyze_suspect_network, draft_report] if wants_report else [analyze_suspect_network]
    active_llm = llm.bind_tools(active_tools)

    messages = [
        SystemMessage(content=SYSTEM_PROMPT),
        HumanMessage(
            content=(
                f"USER QUESTION: {english_query}\n\n"
                f"=== RETRIEVED CASE EVIDENCE (FROM CHROMADB) ===\n"
                f"{retrieved_evidence}\n\n"
                "Answer the question thoroughly using the evidence above and include exact source file citations. "
                "You may call `analyze_suspect_network` if you need Neo4j graph links."
            )
        )
    ]

    # Step C: Agentic reasoning loop
    for _ in range(3):
        ai_msg = active_llm.invoke(messages)
        messages.append(ai_msg)

        if not ai_msg.tool_calls:
            return {
                "answer": ai_msg.content,
                "tools_used": tools_used
            }

        for call in ai_msg.tool_calls:
            tool_name = call["name"]
            tool_args = call["args"]
            print(f"🛠️ Agent calling tool: {tool_name}({tool_args})")
            tools_used.append(tool_name)

            result = safe_invoke_tool(tool_name, tool_args)
            messages.append(
                ToolMessage(content=result, tool_call_id=call["id"])
            )

    final_msg = llm.invoke(messages)
    return {
        "answer": final_msg.content,
        "tools_used": tools_used
    }


# ==============================================================================
# 6. UNIVERSAL MULTILINGUAL LAYER (All Languages + UI Language Selector Sync)
# ==============================================================================
LANGUAGE_MAP = {
    "auto": "auto",
    "en": "en", "english": "en",
    "hi": "hi", "hindi": "hi", "हिंदी": "hi", "हिन्दी": "hi",
    "mr": "mr", "marathi": "mr", "मराठी": "mr",
    "ta": "ta", "tamil": "ta", "தமிழ்": "ta",
    "te": "te", "telugu": "te",
    "bn": "bn", "bengali": "bn",
    "gu": "gu", "gujarati": "gu",
    "pa": "pa", "punjabi": "pa",
    "kn": "kn", "kannada": "kn",
    "ml": "ml", "malayalam": "ml",
    "ur": "ur", "urdu": "ur",
}

CODE_TO_FULL_NAME = {
    "en": "English", "hi": "Hindi", "mr": "Marathi", "ta": "Tamil",
    "te": "Telugu", "bn": "Bengali", "gu": "Gujarati", "pa": "Punjabi",
    "kn": "Kannada", "ml": "Malayalam", "ur": "Urdu",
}


def normalize_lang(lang: str) -> str:
    if not lang:
        return "auto"
    cleaned = lang.strip().lower()
    return LANGUAGE_MAP.get(cleaned, cleaned)


def safe_translate(text: str, source_lang: str, target_lang: str) -> str:
    """Pehle GoogleTranslator (all languages) try karega; fail hone par local Ollama fallback chalega."""
    if not text or source_lang == target_lang:
        return text

    try:
        translated = GoogleTranslator(source=source_lang, target=target_lang).translate(text[:4500])
        if translated:
            return translated
    except Exception as e:
        print(f"⚠️ GoogleTranslator failed ({e}), local Ollama fallback use ho raha hai...")

    target_name = CODE_TO_FULL_NAME.get(target_lang, target_lang)
    fallback_prompt = (
        f"Translate the following text accurately into {target_name}. "
        "Keep exact person names, phone numbers, currency amounts, and source file names accurate. "
        "Return ONLY the translated text:\n\n"
        f"{text}"
    )
    return llm.invoke(fallback_prompt).content


def process_user_query(user_input: str, target_language: str = "auto") -> dict:
    try:
        detected_lang = detect(user_input)
    except Exception:
        detected_lang = "en"

    requested_lang = normalize_lang(target_language)

    # Agar UI se specific language aayi hai (jaise 'mr' ya 'ta'), toh wahi output language hogi;
    # warna jo language user ne type ki hai wahi use hogi (kisi bhi language ke liye!)
    output_lang = detected_lang if requested_lang == "auto" else requested_lang

    # Input agar English nahi hai, toh pehle English mein translate karke RAG/Neo4j par chalao
    if detected_lang != "en":
        english_query = safe_translate(user_input, "auto", "en")
    else:
        english_query = user_input

    print(f"🧠 AI Brain thinking on: {english_query} (Input: {detected_lang} -> Output: {output_lang})")
    agent_output = run_forensic_agent(english_query)
    english_answer = agent_output["answer"]

    # Final answer ko target language mein convert karo
    if output_lang != "en":
        final_answer = safe_translate(english_answer, "en", output_lang)
    else:
        final_answer = english_answer

    return {
        "detected_language": detected_lang,
        "output_language": output_lang,
        "tools_used": agent_output["tools_used"],
        "answer": final_answer
    }


# ==============================================================================
# DIRECT TERMINAL TEST
# ==============================================================================
if __name__ == "__main__":
    print("\n🚀 GLASSBOX AI Brain Ready! Test query chal rahi hai...\n")
    test_q = "How is shop owner Ramesh Sethi connected to Hotel Royal Orchid and Manoj Tiwari?"
    output = process_user_query(test_q)
    print("\n📌 Tools Used:", output["tools_used"])
    print("\n🤖 GLASSBOX Answer:\n", output["answer"])