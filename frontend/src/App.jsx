import { useState } from "react";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function App() {
  const [model, setModel] = useState("rf");
  const [result, setResult] = useState("");
  const [score, setScore] = useState(0);

  const [form, setForm] = useState({
    age: 25,
    social: 3,
    work: 8,
    stress: 5,
    sleep: 7,
    coffee: 2,
    job: "it",
    gender: "male"
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    const res = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model,
        ...form
      })
    });

    const data = await res.json();

    setResult(data.prediction);
    setScore(data.score);
  };

  return (
    <div style={{
      maxWidth: "900px",
      margin: "auto",
      padding: "20px",
      fontFamily: "sans-serif"
    }}>
      <h2 style={{ textAlign: "center" }}>ML Productivity App</h2>

      {/* MODEL */}
      <select onChange={(e) => setModel(e.target.value)}>
        <option value="rf">Random Forest</option>
        <option value="xgb">XGBoost</option>
        <option value="lgbm">LightGBM</option>
        <option value="logreg">Logistic Regression</option>
      </select>

      {/* INPUT GRID */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "15px",
        marginTop: "20px"
      }}>

        <div>
          <label>Age: {form.age}</label>
          <input type="range" name="age" min="15" max="60"
            value={form.age} onChange={handleChange} style={{ width: "100%" }} />
        </div>

        <div>
          <label>Social Time: {form.social}</label>
          <input type="range" name="social" min="0" max="10" step="0.5"
            value={form.social} onChange={handleChange} style={{ width: "100%" }} />
        </div>

        <div>
          <label>Work Hours: {form.work}</label>
          <input type="range" name="work" min="0" max="16"
            value={form.work} onChange={handleChange} style={{ width: "100%" }} />
        </div>

        <div>
          <label>Stress: {form.stress}</label>
          <input type="range" name="stress" min="1" max="10"
            value={form.stress} onChange={handleChange} style={{ width: "100%" }} />
        </div>

        <div>
          <label>Sleep: {form.sleep}</label>
          <input type="range" name="sleep" min="0" max="12" step="0.5"
            value={form.sleep} onChange={handleChange} style={{ width: "100%" }} />
        </div>

        <div>
          <label>Coffee: {form.coffee}</label>
          <input type="range" name="coffee" min="0" max="10"
            value={form.coffee} onChange={handleChange} style={{ width: "100%" }} />
        </div>
      </div>

      {/* SELECTS */}
      <div style={{ marginTop: "15px" }}>
        <select name="job" value={form.job} onChange={handleChange}>
          <option value="it">IT</option>
          <option value="student">Student</option>
          <option value="finance">Finance</option>
          <option value="health">Health</option>
          <option value="unemployed">Unemployed</option>
        </select>

        <select name="gender" value={form.gender} onChange={handleChange}>
          <option value="male">Male</option>
          <option value="other">Other</option>
        </select>

        <button onClick={handleSubmit} style={{ marginLeft: "10px" }}>
          Predict
        </button>
      </div>

      {/* RESULT */}
      {result !== "" && (
        <>
          <div style={{
            marginTop: "30px",
            padding: "25px",
            borderRadius: "15px",
            background: result === 1
              ? "linear-gradient(135deg, #1d976c, #93f9b9)"
              : "linear-gradient(135deg, #cb2d3e, #ef473a)",
            color: "white",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
          }}>
            <h2>
              {result === 1 ? "🚀 High Productivity" : "⚠️ Low Productivity"}
            </h2>

            <h1 style={{ fontSize: "50px" }}>
              {score}/100
            </h1>
          </div>

          {/* GRAPH */}
          <div style={{
            marginTop: "30px",
            padding: "20px",
            backgroundColor: "#fff",
            borderRadius: "10px"
          }}>
            <Bar
              data={{
                labels: ["Stress", "Sleep", "Work", "Social"],
                datasets: [
                  {
                    label: "Your Data",
                    data: [
                      Number(form.stress),
                      Number(form.sleep),
                      Number(form.work),
                      Number(form.social)
                    ]
                  }
                ]
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default App;