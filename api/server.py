from fastapi import FastAPI
app = FastAPI()

@app.get("/")
def root():
    return {"message": "Stellar Insight Studio API is running"}

@app.get("/healthz")
def health():
    return {"status": "healthy"}
