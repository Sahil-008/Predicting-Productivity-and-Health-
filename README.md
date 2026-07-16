# Productivity & Health Prediction

A machine learning project that predicts whether a person is likely to be productive and maintain a healthy lifestyle based on their daily habits and work patterns.

The project includes the complete ML pipeline—from data cleaning and feature engineering to model training and deployment through a FastAPI backend with a React frontend.

---

## Project Overview

The idea behind this project was to explore how factors like social media usage, sleep, stress, workload, coffee consumption, age, and occupation relate to overall productivity and health.

Multiple machine learning models were trained and compared to find the best-performing approach. The trained models are then exposed through a FastAPI API and can be tested using a simple React web interface.

---

## Features

- Data cleaning and preprocessing
- Exploratory Data Analysis (EDA)
- Feature engineering
- Multiple ML models for comparison
- SMOTE for handling class imbalance
- FastAPI backend for predictions
- React frontend for user interaction
- Probability score along with prediction
- Model comparison using common evaluation metrics

---

## Tech Stack

### Machine Learning
- Python
- Pandas
- NumPy
- Scikit-learn
- XGBoost
- LightGBM

### Backend
- FastAPI
- Joblib

### Frontend
- React
- Chart.js
- React ChartJS

---

## Project Structure

```
Predictive_deploy/
│
├── main.py                      ← Flask backend
├── requirements.txt
├── render.yaml                  ← Deployment
│
├── frontend/                    ← React + Vite frontend
│   ├── src/
│   ├── public/
│   └── dist/
│
├── Code/
│   ├── 01_Data_cleaning.ipynb
│   ├── 02_EDA_and_Visualization.ipynb
│   ├── 03_Feature_Engineering_And_Label_Creation.ipynb
│   ├── 04_Linear Regression.ipynb
│   ├── 04A_Logistic_Regression.ipynb
│   ├── 04B_Random_Forest.ipynb
│   ├── 04C_XGBoost.ipynb
│   ├── 04D_LightGBM.ipynb
│   └── 05_Compare_Models.ipynb
│
├── models/
│   ├── Logistic Regression
│   ├── Random Forest
│   ├── XGBoost
│   └── LightGBM
│
├── results/
├── Graphs/
├── cleaned_data.csv
├── model_ready.csv
└── social_media_vs_productivity.csv
```



## Models Trained

The following models were trained and evaluated:

- Logistic Regression
- Random Forest
- XGBoost
- LightGBM

Each model was evaluated using:

- Accuracy
- Precision
- Recall
- F1 Score
- ROC-AUC

The evaluation results are available in:

```
results/model_metrics.csv
```

---

## API

### Start the backend

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

The API will run on:

```
http://127.0.0.1:8000
```

---

### Prediction Endpoint

```
POST /predict
```

Example request:

```json
{
  "age": 24,
  "social": 3,
  "work": 8,
  "stress": 5,
  "sleep": 7,
  "coffee": 2,
  "job": "it",
  "gender": "male",
  "model": "xgb"
}
```

Example response:

```json
{
  "prediction": 1,
  "score": 91.37,
  "model_used": "xgb"
}
```

---

## Frontend

Move into the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

---

## Workflow

1. Clean the raw dataset
2. Perform exploratory data analysis
3. Create engineered features
4. Handle class imbalance using SMOTE
5. Train multiple machine learning models
6. Compare model performance
7. Save trained models
8. Deploy using FastAPI
9. Connect the backend with the React frontend

---

## Future Improvements

Some ideas for extending this project:

- Add more lifestyle-related features
- Improve model explainability using SHAP
- Store prediction history in a database
- Deploy the application to the cloud
- Add user authentication
- Support real-time analytics dashboards

---

## Disclaimer

This project was created for educational and research purposes. The predictions are based on patterns learned from the dataset and should not be interpreted as professional medical or psychological advice.

---

## Author

Developed as a machine learning deployment project demonstrating an end-to-end workflow from data preprocessing and model development to API deployment and frontend integration.
