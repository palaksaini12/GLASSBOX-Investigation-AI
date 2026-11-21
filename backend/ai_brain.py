import os
from neo4j import GraphDatabase
from langchain_core.tools import tool
from langchain_core.messages import SystemMessage, HumanMessage, ToolMessage
from deep_translator import GoogleTranslator
from langdetect import detect

# ==============================================================================
# 1. HYBRID MODE DETECTION (Cloud = Groq API | Local Laptop = Offline Ollama)
# ==============================================================================
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip()
IS_CLOUD_MODE = bool(GROQ_API_KEY)

if IS_CLOUD_MODE:
    from langchain_groq import ChatGroq
    print("☁️ Cloud Mode Active: Using Groq Llama 3.3 + Lightweight File Search + Neo4j AuraDB")
    llm = ChatGroq(
        model=os.getenv("GROQ_MODEL", "openai/gpt-oss-120b"),
        api_key=GROQ_API_KEY,
        temperature=0.1,
    )
    retriever = None
else:
    from langchain_ollama import ChatOllama
    from langchain_chroma import Chroma
    from langchain_huggingface import HuggingFaceEmbeddings
    print("💻 Local Air-Gapped Mode Active: Using Ollama (llama3.2) + ChromaDB + Local Neo4j")
    llm = ChatOllama(model="llama3.2", temperature=0.1)
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    vector_db = Chroma(
        persist_directory="./crime_data_db",
        embedding_function=embeddings,
    )
    retriever = vector_db.as_retriever(search_kwargs={"k": 6})

# ==============================================================================
# 2. NEO4J GRAPH CONNECTION (Local ya Cloud AuraDB automatically pick hoga)
# ==============================================================================
NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "password123")


def query_neo4j(cypher_query: str, params: dict = None):
    driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
    try:
        with driver.session() as session:
            result = session.run(cypher_query, params or {})
            return [record.data() for record in result]
    finally:
        driver.close()


def ensure_graph_seeded():
    """Agar Cloud AuraDB bilkul khali ho, toh Operation Blind Spot graph automatically seed kar deta hai."""
    try:
        check = query_neo4j("MATCH (n) RETURN count(n) AS cnt")
        if check and check[0].get("cnt", 0) > 0:
            return

        seed_cypher = """
        MERGE (ramesh:Person {name: 'Ramesh Sethi'})
        MERGE (manoj:Person {name: 'Manoj Tiwari'})
        MERGE (vikram:Person {name: 'Vikram Rana'})
        MERGE (hotel:Location {name: 'Hotel Royal Orchid'})
        MERGE (room:Location {name: 'Room 304'})
        MERGE (shop:Location {name: 'Sethi Electronics Gurugram'})
        MERGE (p_manoj:Phone {number: '9910445566'})
        MERGE (p_ramesh:Phone {number: '9811223344'})

        MERGE (manoj)-[:WORKS_AT {source: 'hotel_details_report.txt'}]->(hotel)
        MERGE (manoj)-[:LINKED_TO_PHONE {source: 'hotel_details_report.txt'}]->(p_manoj)
        MERGE (ramesh)-[:LINKED_TO_PHONE {source: 'whatsapp_chats_ramesh.txt'}]->(p_ramesh)
        MERGE (ramesh)-[:OWNS_SHOP {source: 'shop_details_and_fir.txt'}]->(shop)
        MERGE (manoj)-[:PAID_150K_ADVANCE {source: 'shop_transactions.csv'}]->(ramesh)
        MERGE (vikram)-[:PAID_75K {source: 'hotel_transactions.csv'}]->(manoj)
        MERGE (vikram)-[:MENTIONED_AT {source: 'hotel_details_report.txt'}]->(room)
        MERGE (room)-[:LOCATED_IN {source: 'hotel_cctv_logs.csv'}]->(hotel)
        MERGE (ramesh)-[:DISABLED_CCTV_AT {source: 'hotel_cctv_logs.csv'}]->(hotel)
        """
        query_neo4j(seed_cypher)
        print("✅ Cloud Neo4j AuraDB automatically seeded with Operation Blind Spot graph!")
    except Exception as e:
        print(f"⚠️ Neo4j auto-seed skipped: {e}")


# Startup par ek baar check karo
ensure_graph_seeded()


# ==============================================================================
# 3. LIGHTWEIGHT EVIDENCE SEARCH (Cloud ke liye zero-RAM file reader)
# ==============================================================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CASE_FILES_DIR = os.path.join(BASE_DIR, "case_files_dump")


def cloud_search_case_files(query: str) -> str:
    if not os.path.isdir(CASE_FILES_DIR):
        return "Case evidence folder (case_files_dump) not found."

    query_words = [w.lower() for w in query.split() if len(w) > 2]
    scored_files = []

    for fname in sorted(os.listdir(CASE_FILES_DIR)):
        fpath = os.path.join(CASE_FILES_DIR, fname)
        if not os.path.isfile(fpath):
            continue
        try:
            with open(fpath, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read().strip()
            lower_content = content.lower()
            score = sum(lower_content.count(w) for w in query_words)
            scored_files.append((score, fname, content))
        except Exception:
            continue

    scored_files.sort(key=lambda x: x[0], reverse=True)
    formatted = []
    total_chars = 0
    for i, (_, fname, content) in enumerate(scored_files, start=1):
        snippet = content[:3000]
        if total_chars + len(snippet) > 15000:
            break
        formatted.append(f"[Evidence {i} | Source File: {fname}]\n{snippet}")
        total_chars += len(snippet)

    return "\n\n---\n\n".join(formatted) if formatted else "No case files found."


# ==============================================================================
# 4. AGENTIC TOOLS (AI Brain ke 3 Hathiyar)
# ==============================================================================
@tool
def search_evidence(query: str) -> str:
    """Searches the forensic database (FIR, WhatsApp chats, bank transactions, hotel & CCTV logs) for evidence matching the query."""
    if IS_CLOUD_MODE or retriever is None:
        return cloud_search_case_files(query)

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
    MATCH (p:Person)-[r]-(target)
    WHERE toLower(p.name) CONTAINS toLower($name)
    RETURN p.name AS person,
           type(r) AS relation,
           COALESCE(target.name, target.number) AS connected_to,
           r.source AS source_file
    """
    try:
        records = query_neo4j(cypher, {"name": person_name})
        if not records:
            return f"No graph connections found for '{person_name}' in Neo4j."

        lines = [
            f"- {rec['person']} --[{rec['relation']}]--> {rec['connected_to']} (Source: {rec['source_file']})"
            for rec in records
        ]
        return "\n".join(lines)
    except Exception as e:
        return f"Neo4j connection error: {e}"


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
    "3. Always cite the exact source file names (e.g., whatsapp_chats_ramesh.txt, shop_transactions.csv, hotel_details_report.txt, hotel_transactions.csv, hotel_cctv_logs.csv, shop_details_and_fir.txt).\n"
    "4. Keep the answer clear, structured in bullet points, and directly focused on the user's question."
)


def run_forensic_agent(english_query: str) -> dict:
    tools_used = []

    print(f"🛠️ Agent calling tool: search_evidence({{'query': '{english_query}'}})")
    retrieved_evidence = search_evidence.invoke({"query": english_query})
    tools_used.append("search_evidence")

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
                f"=== RETRIEVED CASE EVIDENCE ===\n"
                f"{retrieved_evidence}\n\n"
                "Answer the question thoroughly using the evidence above and include exact source file citations. "
                "You may call `analyze_suspect_network` if you need Neo4j graph links."
            )
        ),
    ]

    for _ in range(3):
        ai_msg = active_llm.invoke(messages)
        messages.append(ai_msg)

        if not ai_msg.tool_calls:
            return {"answer": ai_msg.content, "tools_used": tools_used}

        for call in ai_msg.tool_calls:
            tool_name = call["name"]
            tool_args = call["args"]
            print(f"🛠️ Agent calling tool: {tool_name}({tool_args})")
            tools_used.append(tool_name)

            result = safe_invoke_tool(tool_name, tool_args)
            messages.append(ToolMessage(content=result, tool_call_id=call["id"]))

    final_msg = llm.invoke(messages)
    return {"answer": final_msg.content, "tools_used": tools_used}


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
    if not text or source_lang == target_lang:
        return text

    try:
        translated = GoogleTranslator(source=source_lang, target=target_lang).translate(text[:4500])
        if translated:
            return translated
    except Exception as e:
        print(f"⚠️ GoogleTranslator failed ({e}), LLM fallback use ho raha hai...")

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
    output_lang = detected_lang if requested_lang == "auto" else requested_lang

    if detected_lang != "en":
        english_query = safe_translate(user_input, "auto", "en")
    else:
        english_query = user_input

    print(f"🧠 AI Brain thinking on: {english_query} (Input: {detected_lang} -> Output: {output_lang})")
    agent_output = run_forensic_agent(english_query)
    english_answer = agent_output["answer"]

    if output_lang != "en":
        final_answer = safe_translate(english_answer, "en", output_lang)
    else:
        final_answer = english_answer

    return {
        "detected_language": detected_lang,
        "output_language": output_lang,
        "tools_used": agent_output["tools_used"],
        "answer": final_answer,
    }