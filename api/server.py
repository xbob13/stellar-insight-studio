from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Stellar Insight Studio API is running"}
