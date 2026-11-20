import os
import re
import fitz  # PyMuPDF for reading PDFs
import pandas as pd
import spacy
from neo4j import GraphDatabase
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma

# ==============================================================================
# STEP 1: DATA INGESTION (PDF, CSV, TXT files ko read karna)
# ==============================================================================
def ingest_evidence_folder(folder_path):
    documents = []

    if not os.path.exists(folder_path):
        print(f"Error: Folder '{folder_path}' nahi mila!")
        return documents

    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)

        if filename.lower().endswith(".pdf"):
            doc = fitz.open(file_path)
            text = ""
            for page in doc:
                text += page.get_text() + "\n"
            doc.close()
            documents.append(Document(page_content=text, metadata={"source": filename}))
            print(f"[READ PDF] {filename}")

        elif filename.lower().endswith(".csv"):
            df = pd.read_csv(file_path)
            text = df.to_string(index=False)
            documents.append(Document(page_content=text, metadata={"source": filename}))
            print(f"[READ CSV] {filename}")

        elif filename.lower().endswith(".txt"):
            with open(file_path, "r", encoding="utf-8") as f:
                text = f.read()
            documents.append(Document(page_content=text, metadata={"source": filename}))
            print(f"[READ TXT] {filename}")

    print(f"\n✅ Step 1 Done: Total {len(documents)} files successfully read hui.\n")
    return documents


# ==============================================================================
# STEP 2: CHUNKING & EMBEDDINGS
# ==============================================================================
def process_and_embed(raw_documents):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        separators=["\n\n", "\n", ".", " ", ""]
    )
    chunks = text_splitter.split_documents(raw_documents)
    print(f"✅ Step 2A Done: Evidence ko {len(chunks)} chunks mein tod diya gaya.")

    print("⏳ Local Embedding model load ho raha hai (pehli baar 1 min lag sakta hai)...")
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    print("✅ Step 2B Done: Embedding model ready hai.\n")

    return chunks, embeddings


# ==============================================================================
# STEP 3: LOCAL VECTOR DATABASE (ChromaDB)
# ==============================================================================
def build_vector_database(chunks, embeddings_model, persist_dir="./crime_data_db"):
    vector_db = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings_model,
        persist_directory=persist_dir
    )
    print(f"✅ Step 3 Done: Vector Database '{persist_dir}' folder mein save ho gaya!\n")
    return vector_db


# ==============================================================================
# STEP 4: ENTITY EXTRACTION & NEO4J GRAPH
# ==============================================================================
class GraphDatabaseManager:
    def __init__(self, uri, user, password):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))
        self.driver.verify_connectivity()
        self.nlp = spacy.load("en_core_web_sm")

    def close(self):
        self.driver.close()

    def build_graph_from_text(self, text, source_file):
        doc = self.nlp(text)

        people = list({ent.text.strip() for ent in doc.ents if ent.label_ == "PERSON"})
        locations = list({ent.text.strip() for ent in doc.ents if ent.label_ in ("GPE", "LOC")})
        phones = list(set(re.findall(r"\b[6-9]\d{9}\b", text)))

        print(f"🔎 File '{source_file}' -> People: {people} | Locations: {locations} | Phones: {phones}")

        with self.driver.session() as session:
            for person in people:
                session.run("MERGE (p:Person {name: $name})", name=person)
            for loc in locations:
                session.run("MERGE (l:Location {name: $name})", name=loc)
            for phone in phones:
                session.run("MERGE (ph:Phone {number: $number})", number=phone)

            for person in people:
                for loc in locations:
                    session.run(
                        """
                        MATCH (p:Person {name: $person_name})
                        MATCH (l:Location {name: $loc_name})
                        MERGE (p)-[r:MENTIONED_AT {source: $file}]->(l)
                        """,
                        person_name=person,
                        loc_name=loc,
                        file=source_file
                    )

            for person in people:
                for phone in phones:
                    session.run(
                        """
                        MATCH (p:Person {name: $person_name})
                        MATCH (ph:Phone {number: $phone_num})
                        MERGE (p)-[r:LINKED_TO_PHONE {source: $file}]->(ph)
                        """,
                        person_name=person,
                        phone_num=phone,
                        file=source_file
                    )


# ==============================================================================
# MAIN RUNNER
# ==============================================================================
if __name__ == "__main__":
    print("🚀 GLASSBOX Member 2 Data Pipeline Start Ho Rahi Hai...\n")

    raw_evidence = ingest_evidence_folder("./case_files_dump")

    if raw_evidence:
        chunks, embeddings_model = process_and_embed(raw_evidence)
        db = build_vector_database(chunks, embeddings_model)

        test_results = db.similarity_search("How is shop owner Ramesh Sethi connected to Hotel Royal Orchid?", k=1)
        if test_results:
            print(f"🧪 ChromaDB Search Test Passed! Source mila: {test_results[0].metadata['source']}\n")

        print("⏳ Neo4j Graph Database se connect ho raha hai...")
        try:
            graph_manager = GraphDatabaseManager(
                uri="bolt://localhost:7687",
                user="neo4j",
                password="password123"
            )
            for doc in raw_evidence:
                graph_manager.build_graph_from_text(doc.page_content, doc.metadata["source"])
            graph_manager.close()
            print("\n✅ Step 4 Done: Saare entities & connections Neo4j Graph mein push ho gaye!")
        except Exception as e:
            print("\n⚠️ Neo4j connect nahi ho paya (Shayad Neo4j Desktop abhi Start nahi hai).")
            print(f"Error details: {e}")