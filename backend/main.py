from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ai_brain import process_user_query, query_neo4j

app = FastAPI(title="GLASSBOX Forensic AI Brain API")

# CORS setup: taaki Next.js Frontend (localhost:3000) is backend ko call kar sake
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class QueryRequest(BaseModel):
    query: str
    language: str = "auto"  # Frontend UI se "en", "hi", "mr", "ta" ya "auto" aayega


@app.get("/")
def home():
    return {"status": "online", "message": "GLASSBOX AI Brain API is running!"}


@app.post("/api/investigate")
async def investigate_case(request: QueryRequest):
    result = process_user_query(request.query, target_language=request.language)
    return {
        "status": "success",
        "query": request.query,
        "detected_language": result["detected_language"],
        "output_language": result["output_language"],
        "tools_used": result["tools_used"],
        "response": result["answer"]
    }


@app.get("/api/graph")
async def get_suspect_graph():
    """Neo4j se poora network graph return karta hai (Frontend React Flow ke liye)"""
    cypher = """
    MATCH (n)-[r]->(m)
    RETURN COALESCE(n.name, n.number) AS source,
           labels(n)[0] AS source_type,
           type(r) AS relation,
           COALESCE(m.name, m.number) AS target,
           labels(m)[0] AS target_type,
           r.source AS evidence_file
    """
    try:
        edges = query_neo4j(cypher)
        return {"status": "success", "count": len(edges), "connections": edges}
    except Exception as e:
        return {"status": "error", "message": str(e)}