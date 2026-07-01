import os

from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

from knowledge_base import PHYSIO_KNOWLEDGE

_vector_store = None


def get_vector_store():

    global _vector_store

    if _vector_store is not None:
        return _vector_store

    embeddings = OpenAIEmbeddings(model="text-embedding-3-small", api_key=os.getenv("OPENAI_API_KEY"))

    _vector_store = Chroma(
        collection_name="physioai",
        persist_directory="./chroma_db",
        embedding_function=embeddings,
    )

    print("✅ ChromaDB connected")

    return _vector_store


async def retrieve_context(query: str, k: int = 4):

    store = get_vector_store()

    try:

        docs = store.similarity_search(query, k=k)

        if not docs:
            return ""

        return "\n\n".join([
            f"[{doc.metadata.get('topic', 'General')}]\n{doc.page_content}"
            for doc in docs
        ])

    except Exception as e:

        print("❌ Retrieval error:", e)

        return ""


async def ingest_knowledge_base():

    try:

        embeddings = OpenAIEmbeddings(model="text-embedding-3-small", api_key=os.getenv("OPENAI_API_KEY"))

        vector_store = Chroma(
            collection_name="physioai",
            persist_directory="./chroma_db",
            embedding_function=embeddings,
        )

        splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=50,
        )

        docs = []

        for item in PHYSIO_KNOWLEDGE:

            chunks = splitter.create_documents(
                [item["content"]],
                metadatas=[
                    {
                        "topic": item["topic"],
                        "source": "physioai",
                    }
                ],
            )

            docs.extend(chunks)

        vector_store.add_documents(docs)

        print(f"✅ Ingested {len(docs)} chunks")

        return {
            "success": True,
            "chunks": len(docs),
        }

    except Exception as e:

        print("❌ Ingest error:", e)

        return {
            "success": False,
            "error": str(e),
        }