from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI(title="Productivity Prediction API")

# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # React dev server
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- Load Models ----------------
models = {
    "rf": joblib.load("models/rf_smote.pkl"),
    "xgb": joblib.load("models/xgb_smote.pkl"),
    "lgbm": joblib.load("models/lgbm_smote.pkl"),
    "logreg": joblib.load("models/logreg_sm.pkl"),
}

scaler = joblib.load("models/logreg_scaler.pkl")


# ---------------- Request Model ----------------
class PredictionRequest(BaseModel):
    age: int
    social: float
    work: float
    stress: float
    sleep: float
    coffee: float
    job: str
    gender: str
    model: str


# ---------------- Response Model ----------------
class PredictionResponse(BaseModel):
    prediction: str
    probability: float
    confidence: str
    model: str


# ---------------- Feature Transformation ----------------
def transform_input(data: PredictionRequest):

    mean_values = [
        30, 3.5, 50, 8, 5, 7, 1, 5, 2, 10,
        20, 5, 1, 1, 2, 0.4, 2.0,
        1, 0,
        0, 0, 0, 0, 0,
        1, 0, 0, 0,
        0, 0,
        1
    ]

    features = mean_values.copy()

    features[0] = data.age
    features[1] = data.social
    features[3] = data.work
    features[4] = data.stress
    features[5] = data.sleep
    features[8] = data.coffee

    # Derived Features
    features[15] = data.social / data.work if data.work != 0 else 0
    features[16] = data.sleep / data.social if data.social != 0 else 0

    # Gender Encoding
    features[17] = 0
    features[18] = 0

    gender = data.gender.lower()

    if gender == "male":
        features[17] = 1
    elif gender == "other":
        features[18] = 1

    # Job Encoding
    for i in range(19, 24):
        features[i] = 0

    job_map = {
        "finance": 19,
        "health": 20,
        "it": 21,
        "student": 22,
        "unemployed": 23
    }

    if data.job.lower() in job_map:
        features[job_map[data.job.lower()]] = 1

    return np.nan_to_num(features)


# ---------------- Routes ----------------
@app.get("/")
def home():
    return {"message": "API is running 🚀"}


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "models_loaded": len(models)
    }


@app.post(
    "/predict",
    response_model=PredictionResponse
)
def predict(data: PredictionRequest):

    if data.model not in models:
        raise HTTPException(
            status_code=400,
            detail="Invalid model name"
        )

    try:

        features = transform_input(data)

        if len(features) != 31:
            raise HTTPException(
                status_code=500,
                detail=f"Expected 31 features but got {len(features)}"
            )

        if data.model == "logreg":
            features = scaler.transform([features])
        else:
            features = [features]

        model = models[data.model]

        prediction = model.predict(features)[0]

        if hasattr(model, "predict_proba"):
            probability = float(model.predict_proba(features)[0][1])
        else:
            probability = 0.5

        return PredictionResponse(
            prediction="Healthy" if prediction == 1 else "Unhealthy",
            probability=round(probability, 4),
            confidence=f"{probability * 100:.2f}%",
            model=data.model
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )