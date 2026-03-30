from fastapi import FastAPI
import pickle
import numpy as np

app = FastAPI()

# load all models
models = {
    "rf": joblib.load("models/rf_smote.pkl"),
    "xgb": joblib.load("models/xgb_smote.pkl"),
    "lgbm": joblib.load("models/lgbm_smote.pkl"),
    "logreg": joblib.load("models/logreg_sm.pkl"),
}

scaler = joblib.load("models/logreg_scaler.pkl")



@app.get("/")
def home():
    return {"message": "API is running"}

@app.post("/predict")
def predict(data: dict):
    model_name = data["model"]
    features = data["features"]

    if model_name == "logreg":
        features = scaler.transform([features])
    else:
        features = [features]

    prediction = models[model_name].predict(features)

    return {
        "model": model_name,
        "prediction": int(prediction[0])
    }