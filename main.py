from fastapi import FastAPI
import joblib
import numpy as np
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# ---- CORS ----
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- Load models ----
models = {
    "rf": joblib.load("models/rf_smote.pkl"),
    "xgb": joblib.load("models/xgb_smote.pkl"),
    "lgbm": joblib.load("models/lgbm_smote.pkl"),
    "logreg": joblib.load("models/logreg_sm.pkl"),
}

scaler = joblib.load("models/logreg_scaler.pkl")


# ---- Transform input into 31 features ----
def transform_input(data):

    # ✅ EXACT 31 features (must match training order)
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

    # ---- safe extraction (no crash if empty) ----
    age = int(data["age"]) if data["age"] != "" else 30
    social = float(data["social"]) if data["social"] != "" else 3.5
    work = float(data["work"]) if data["work"] != "" else 8
    stress = float(data["stress"]) if data["stress"] != "" else 5
    sleep = float(data["sleep"]) if data["sleep"] != "" else 7
    coffee = float(data["coffee"]) if data["coffee"] != "" else 2

    job = data.get("job", "it").lower()
    gender = data.get("gender", "male").lower()

    # ---- override main features ----
    features[0] = age
    features[1] = social
    features[3] = work
    features[4] = stress
    features[5] = sleep
    features[8] = coffee

    # ---- derived ----
    features[15] = social / work if work != 0 else 0
    features[16] = sleep / social if social != 0 else 0

    # ---- gender encoding ----
    features[17] = 0
    features[18] = 0

    if gender == "male":
        features[17] = 1
    elif gender == "other":
        features[18] = 1

    # ---- job encoding ----
    job_map = {
        "finance": 19,
        "health": 20,
        "it": 21,
        "student": 22,
        "unemployed": 23
    }

    for i in range(19, 24):
        features[i] = 0

    if job in job_map:
        features[job_map[job]] = 1

    return features


# ---- Routes ----
@app.get("/")
def home():
    return {"message": "API is running ✅"}


@app.post("/predict")
def predict(data: dict):
    model_name = data.get("model")

    # ---- validation ----
    required = ["age", "social", "work", "stress", "sleep", "coffee", "job", "gender"]
    for r in required:
        if r not in data:
            return {"error": f"Missing field: {r}"}

    if model_name not in models:
        return {"error": "Invalid model name"}

    # ---- transform ----
    features = transform_input(data)

    if len(features) != 31:
        return {"error": f"Feature mismatch: got {len(features)}, expected 31"}

    features = np.nan_to_num(features)

    # ---- prepare input ----
    if model_name == "logreg":
        features = scaler.transform([features])
    else:
        features = [features]

    model = models[model_name]

    # ---- prediction ----
    prediction = model.predict(features)[0]

    # ---- 🔥 REAL ML SCORE (probability) ----
    if hasattr(model, "predict_proba"):
        prob = model.predict_proba(features)[0][1]
    else:
        prob = 0.5  # fallback

    return {
        "prediction": int(prediction),
        "score": round(prob * 100, 2),   # 🔥 REAL ML SCORE
        "model_used": model_name
    }