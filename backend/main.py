import io
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pypdf import PdfReader
from ai_brain import process_user_query, query_neo4j

app = FastAPI(title="GLASSBOX Forensic AI Brain API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class EvidenceItem(BaseModel):
    filename: str
    content: str


class QueryRequest(BaseModel):
    query: str
    language: str = "auto"
    case_id: Optional[str] = "CASE #2026-KID-07"
    case_title: Optional[str] = "Operation Blind Spot"
    uploaded_evidence: List[EvidenceItem] = []


@app.get("/")
def home():
    return {"status": "online", "message": "GLASSBOX AI Brain API is running!"}


@app.post("/api/extract-text")
async def extract_text_from_file(file: UploadFile = File(...)):
    """Uploaded PDF, TXT, CSV, JSON ya LOG file se asli text extract karta hai."""
    try:
        raw_bytes = await file.read()
        fname = (file.filename or "evidence").lower()

        if fname.endswith(".pdf"):
            reader = PdfReader(io.BytesIO(raw_bytes))
            pages_text = [page.extract_text() or "" for page in reader.pages]
            extracted = "\n\n".join(pages_text).strip()
        else:
            extracted = raw_bytes.decode("utf-8", errors="ignore").strip()

        if not extracted:
            return {
                "status": "empty",
                "filename": file.filename,
                "text": "",
                "message": "No selectable text found (this PDF may be a scanned image).",
            }

        return {
            "status": "success",
            "filename": file.filename,
            "text": extracted[:25000],
            "char_count": len(extracted),
        }
    except Exception as e:
        return {
            "status": "error",
            "filename": file.filename,
            "text": "",
            "message": str(e),
        }


@app.post("/api/investigate")
async def investigate_case(request: QueryRequest):
    evidence_list = [
        {"filename": item.filename, "content": item.content}
        for item in request.uploaded_evidence
    ]
    result = process_user_query(
        request.query,
        target_language=request.language,
        case_id=request.case_id,
        case_title=request.case_title,
        uploaded_evidence=evidence_list,
    )
    return {
        "status": "success",
        "query": request.query,
        "detected_language": result["detected_language"],
        "output_language": result["output_language"],
        "tools_used": result["tools_used"],
        "response": result["answer"],
    }


@app.get("/api/graph")
async def get_suspect_graph():
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