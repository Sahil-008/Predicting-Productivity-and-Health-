import { useState, useEffect, useRef } from "react";
import "./App.css";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { Bar, Radar, Doughnut } from "react-chartjs-2";

// Register Chart.js elements
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

// SVG Icons Component to reduce dependency bloat
const Icons = {
  Brain: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-3.12 3 3 0 0 1 0-4.88 2.5 2.5 0 0 1 0-3.12A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 0-3.12 3 3 0 0 0 0-4.88 2.5 2.5 0 0 0 0-3.12A2.5 2.5 0 0 0 14.5 2Z"/></svg>
  ),
  Github: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
  ),
  Linkedin: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9" rx="1"/><circle cx="4" cy="4" r="2"/></svg>
  ),
  Activity: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
  ),
  Database: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/></svg>
  ),
  Trend: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
  ),
  Routine: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  ),
  Diet: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  ),
  Alert: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
  ),
  ArrowRight: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" x2="19" y1="12" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
  )
};

function App() {
  const [model, setModel] = useState("rf");
  const [result, setResult] = useState("");
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState("checking");
  const [predTime, setPredTime] = useState(0);

  // Advanced layout inputs
  const [form, setForm] = useState({
    age: 25,
    social: 3,
    work: 8,
    stress: 5,
    sleep: 7,
    coffee: 2,
    job: "it",
    gender: "male",
    water: 6,         // dynamic extra parameters (ignored by ML, used for lifestyle metrics)
    exercise: 30,     // dynamic extra parameters
    meditation: 10,   // dynamic extra parameters
    fruits: 2,        // dynamic extra servings
    junk: 1,          // dynamic extra servings
    protein: 65,      // protein grams
    calories: 2200    // calories
  });

  const dashboardRef = useRef(null);

  // Check API Health
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch("https://productivity-api-51kl.onrender.com");
        if (res.ok) {
          setApiStatus("connected");
        } else {
          setApiStatus("disconnected");
        }
      } catch (err) {
        setApiStatus("disconnected");
      }
    };
    checkHealth();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ["job", "gender"].includes(name) ? value : Number(value)
    }));
  };

  const scrollToDashboard = () => {
    dashboardRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const start = performance.now();
    try {
      const res = await fetch("https://productivity-api-51kl.onrender.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: model,
          age: form.age,
          social: form.social,
          work: form.work,
          stress: form.stress,
          sleep: form.sleep,
          coffee: form.coffee,
          job: form.job,
          gender: form.gender,
          // Sending extra parameters, ignored by ML backend, processed gracefully
          water: form.water,
          exercise: form.exercise,
          meditation: form.meditation,
          fruits: form.fruits,
          junk: form.junk,
          protein: form.protein,
          calories: form.calories
        })
      });

      if (!res.ok) {
        throw new Error("Prediction API request failed.");
      }

      const data = await res.json();
      setResult(data.prediction);
      setScore(data.score);
      setPredTime(Math.round(performance.now() - start));

      // Scroll slightly after prediction completes so results are visible
      setTimeout(() => {
        const resultsEl = document.getElementById("results-panel");
        resultsEl?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);

    } catch (error) {
      console.error(error);
      alert("Prediction connection failed. Ensure the FastAPI application is running locally at port 8000.");
    } finally {
      setLoading(false);
    }
  };

  // 1. Dynamic Client Side Metrics
  const healthScore = Math.max(0, Math.min(100, Math.round(
    80 + 
    (form.sleep > 6 ? (form.sleep - 6) * 3 : (form.sleep - 6) * 6) +
    (form.water > 4 ? (form.water - 4) * 2.5 : (form.water - 4) * 6) +
    (form.exercise / 4) +
    (form.meditation / 3.5) +
    (form.fruits * 2) - 
    (form.stress > 5 ? (form.stress - 5) * 4.5 : 0) -
    (form.junk * 4.5)
  )));

  const burnoutRisk = Math.max(0, Math.min(100, Math.round(
    10 + 
    (form.stress * 4.5) + 
    (form.work > 8 ? (form.work - 8) * 6.5 : 0) + 
    (form.social > 4 ? (form.social - 4) * 3.5 : 0) -
    (form.sleep > 7 ? (form.sleep - 7) * 4 : 0) - 
    (form.meditation * 0.4)
  )));

  // 2. Explainable AI SHAP values calculation
  const shapValues = [
    { name: "Sleep Hours", val: Math.round((form.sleep - 7.2) * 4), desc: "Sleep duration improves restorative focus buffer." },
    { name: "Stress Pressure", val: Math.round((4.5 - form.stress) * 3.5), desc: "Direct cortisol bottleneck on working memory." },
    { name: "Workload Density", val: Math.round((form.work > 9.5 ? -((form.work - 9.5) * 3) : (form.work > 6 ? 4 : -2))), desc: "Diminishing focus output during long shifts." },
    { name: "Active Exercise", val: Math.round((form.exercise - 25) * 0.12), desc: "Oxygenation levels and neurogenesis impact." },
    { name: "Device Exposure", val: Math.round((2.5 - form.social) * 2.2), desc: "Dopaminergic distraction and screen strain." }
  ].sort((a, b) => Math.abs(b.val) - Math.abs(a.val));

  // 3. Recommendation Engine Priority Core
  const getSortedRecommendations = () => {
    const list = [];
    
    if (form.sleep < 6.5) {
      list.push({
        priority: "High",
        icon: "🛌",
        title: "Optimize Sleep Cycle",
        text: `Your sleep is critical at ${form.sleep} hrs. Target 7.5-8.5 hrs of consistent duration to support hormonal reset and clear toxic brain metabolites.`
      });
    } else if (form.sleep < 7.5) {
      list.push({
        priority: "Medium",
        icon: "🛌",
        title: "Enhance Sleep Depth",
        text: "You're close to optimal sleep. Create a dark, cold room condition and aim for 30 more minutes of slow-wave sleep recovery."
      });
    } else {
      list.push({
        priority: "Low",
        icon: "🛌",
        title: "Consistent Circadian Phase",
        text: "Your sleep parameters are healthy. Maintain a solid sleep-wake window, even on weekends."
      });
    }

    if (form.stress > 6.5) {
      list.push({
        priority: "High",
        icon: "🧘",
        title: "Critical Stress Intervention",
        text: `With a stress rating of ${form.stress}/10, cortisol is inhibiting memory cells. Integrate 10 minutes of box-breathing twice daily.`
      });
    } else if (form.stress > 4) {
      list.push({
        priority: "Medium",
        icon: "🧘",
        title: "Mindfulness Practices",
        text: "Incorporate short active walks without phone notifications during work intervals to balance autonomic nervous systems."
      });
    } else {
      list.push({
        priority: "Low",
        icon: "🧘",
        title: "Resilient Mindset state",
        text: "You are maintaining high stress resistance. Focus on daily journaling to retain long-term composure."
      });
    }

    if (form.water < 5) {
      list.push({
        priority: "High",
        icon: "💧",
        title: "Urgent Dehydration Recovery",
        text: `Drink at least 8 glasses of water. Your current ${form.water} glasses reduce cognitive reaction times by 10%.`
      });
    } else if (form.water < 8) {
      list.push({
        priority: "Medium",
        icon: "💧",
        title: "Hydration Balance",
        text: "Aim for 8-10 glasses (2.5L). Optimal cell hydration supports blood flow volume and prevents cognitive fatigue."
      });
    } else {
      list.push({
        priority: "Low",
        icon: "💧",
        title: "Fluid Homeostasis",
        text: "Excellent hydration level. Maintain this intake rate to ensure peak biological function."
      });
    }

    if (form.social > 5) {
      list.push({
        priority: "High",
        icon: "📱",
        title: "Screen Time Detoxification",
        text: `Passive digital usage is at ${form.social} hrs. Limit doomscrolling. Move social apps to folders or use grayscale display modes.`
      });
    } else if (form.social > 3) {
      list.push({
        priority: "Medium",
        icon: "📱",
        title: "Digital Boundaries",
        text: "Restrict social checks to designated slots. Set strict device timers to protect your focused attention spans."
      });
    } else {
      list.push({
        priority: "Low",
        icon: "📱",
        title: "Controlled Screen Intake",
        text: "Exceptional command over digital environments. Your cognitive flow remains uninterrupted."
      });
    }

    if (form.exercise < 20) {
      list.push({
        priority: "High",
        icon: "🏃",
        title: "Sedentary State Warning",
        text: `Your daily activity is at ${form.exercise} mins. Aim for at least 30 minutes of elevated heart rate to stimulate neuroplasticity.`
      });
    } else if (form.exercise < 45) {
      list.push({
        priority: "Medium",
        icon: "🏃",
        title: "Aerobic Integration",
        text: "Incorporate moderate aerobic blocks (brisk walk, cycling) to build metabolic rate and increase heart rate variability (HRV)."
      });
    } else {
      list.push({
        priority: "Low",
        icon: "🏃",
        title: "Outstanding Cardiorespiratory Base",
        text: "Great physical conditioning. Continue training routines to fuel neuroprotective growth factors."
      });
    }

    // Sort: High, then Medium, then Low
    const priorityWeight = { High: 3, Medium: 2, Low: 1 };
    return list.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);
  };

  // 4. Custom Charts Datasets
  // Feature Importance Dataset (Bar)
  const barChartData = {
    labels: shapValues.map((s) => s.name),
    datasets: [
      {
        data: shapValues.map((s) => Math.abs(s.val)),
        backgroundColor: shapValues.map((s) => 
          s.val >= 0 ? "rgba(6, 182, 212, 0.85)" : "rgba(139, 92, 246, 0.85)"
        ),
        hoverBackgroundColor: shapValues.map((s) => 
          s.val >= 0 ? "#22d3ee" : "#a78bfa"
        ),
        borderRadius: 8,
        borderSkipped: false
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#111827",
        titleColor: "#f9fafb",
        bodyColor: "#9ca3af",
        borderColor: "rgba(139, 92, 246, 0.2)",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        titleFont: { family: "Plus Jakarta Sans", weight: "bold" },
        bodyFont: { family: "Plus Jakarta Sans" }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#9ca3af", font: { family: "Plus Jakarta Sans", size: 10, weight: 600 } }
      },
      y: {
        grid: { color: "rgba(255, 255, 255, 0.05)", drawBorder: false },
        ticks: { color: "#9ca3af", font: { family: "Plus Jakarta Sans", size: 11 } }
      }
    }
  };

  // Lifestyle Analysis Dataset (Radar)
  const radarChartData = {
    labels: ["Sleep", "Focus", "Hydration", "Recovery", "Activity", "Calmness"],
    datasets: [
      {
        label: "Your Lifestyle Metrics",
        data: [
          Math.min(100, Math.round((form.sleep / 9) * 100)),
          Math.min(100, Math.round((1 - form.social / 10) * 100)),
          Math.min(100, Math.round((form.water / 8) * 100)),
          Math.min(100, Math.round(((form.sleep + form.meditation / 15) / 10) * 100)),
          Math.min(100, Math.round((form.exercise / 60) * 100)),
          Math.min(100, Math.round((1 - form.stress / 10) * 100))
        ],
        backgroundColor: "rgba(6, 182, 212, 0.15)",
        borderColor: "rgba(6, 182, 212, 0.8)",
        borderWidth: 2,
        pointBackgroundColor: "#22d3ee",
        pointBorderColor: "#050816",
        pointHoverBackgroundColor: "#050816",
        pointHoverBorderColor: "#22d3ee",
        pointRadius: 4
      }
    ]
  };

  const radarChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#111827",
        titleColor: "#f9fafb",
        bodyColor: "#9ca3af",
        borderColor: "rgba(6, 182, 212, 0.2)",
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8
      }
    },
    scales: {
      r: {
        angleLines: { color: "rgba(255, 255, 255, 0.05)" },
        grid: { color: "rgba(255, 255, 255, 0.05)" },
        pointLabels: {
          color: "#9ca3af",
          font: { family: "Plus Jakarta Sans", size: 10, weight: 600 }
        },
        ticks: {
          display: false,
          max: 100
        }
      }
    }
  };

  // 24 Hour Time Budget Doughnut Chart
  const sleepMins = Math.round(form.sleep * 60);
  const workMins = Math.round(form.work * 60);
  const socialMins = Math.round(form.social * 60);
  const exerciseMins = form.exercise;
  const meditationMins = form.meditation;
  const otherMins = Math.max(0, 1440 - (sleepMins + workMins + socialMins + exerciseMins + meditationMins));

  const doughnutChartData = {
    labels: ["Sleep", "Work Hours", "Social Time", "Exercise", "Meditation", "Other / Personal"],
    datasets: [
      {
        data: [sleepMins, workMins, socialMins, exerciseMins, meditationMins, otherMins],
        backgroundColor: [
          "rgba(139, 92, 246, 0.8)",  // sleep (purple)
          "rgba(99, 102, 241, 0.8)",  // work (indigo)
          "rgba(239, 68, 68, 0.8)",    // social (red)
          "rgba(16, 185, 129, 0.8)",   // exercise (green)
          "rgba(236, 72, 153, 0.8)",   // meditation (pink)
          "rgba(107, 114, 128, 0.6)"   // other (gray)
        ],
        borderWidth: 1,
        borderColor: "#111827",
        hoverOffset: 6
      }
    ]
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#9ca3af",
          font: { family: "Plus Jakarta Sans", size: 9, weight: 500 },
          padding: 8,
          boxWidth: 8,
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: "#111827",
        callbacks: {
          label: (context) => {
            const mins = context.raw;
            const hrs = (mins / 60).toFixed(1);
            return ` ${context.label}: ${hrs} hrs (${mins}m)`;
          }
        }
      }
    },
    cutout: "70%"
  };

  return (
    <div className="saas-container">
      {/* 1. STICKY NAVBAR */}
      <nav className="saas-navbar">
        <div className="nav-content">
          <div className="nav-left">
            <div className="nav-logo" onClick={scrollToDashboard}>
              <Icons.Brain />
              <span>Productive.AI</span>
            </div>
            <ul className="nav-links">
              <li><a href="#features">Features</a></li>
              <li><a href="#models">Models</a></li>
              <li><a href="#predictor">Dashboard</a></li>
            </ul>
          </div>
          <div className="nav-right">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="nav-github-btn" aria-label="GitHub Repository">
              <Icons.Github />
            </a>
            
            <button className="nav-cta-btn" onClick={scrollToDashboard}>
              Launch Predictor
            </button>
          </div>
        </div>
      </nav>

      {/* 2. LARGE HERO SECTION */}
      <header className="saas-hero" id="features">
        {/* Neon Backdrop Glows */}
        <div className="bg-glow bg-cyan"></div>
        <div className="bg-glow bg-purple"></div>

        <div className="hero-content">
          <div className="hero-left">
            <div className="hero-badge">
              <span className="pulsing-dot"></span>
              SaaS Predictive Analytics Engine v2.0
            </div>
            <h1>
              AI Productivity & <br />
              <span className="gradient-text">Health Predictor</span>
            </h1>
            <p className="hero-description">
              Analyze lifestyle parameters, predict health limits, and model cognitive output thresholds. Backed by Random Forest and XGBoost classification engines.
            </p>
            <div className="hero-actions-row">
              <button className="hero-primary-btn" onClick={scrollToDashboard}>
                Start Analysis <Icons.ArrowRight />
              </button>
              <div className="telemetry-badge">
                <Icons.Database />
                <span>API Status: <b>{apiStatus.toUpperCase()}</b></span>
              </div>
            </div>
          </div>

          <div className="hero-right">
            {/* Beautiful SVG Interactive Illustration */}
            <div className="hero-artwork-frame">
              <svg viewBox="0 0 400 400" className="hero-artwork-svg">
                <defs>
                  <radialGradient id="artwork-radial" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(139, 92, 246, 0.25)" />
                    <stop offset="100%" stopColor="rgba(5, 8, 22, 0)" />
                  </radialGradient>
                  <linearGradient id="artwork-purple-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
                <circle cx="200" cy="200" r="160" fill="url(#artwork-radial)" />
                {/* Floating grid elements */}
                <rect x="70" y="70" width="100" height="60" rx="10" fill="#111827" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="1" className="float-card float-1" />
                <rect x="230" y="270" width="100" height="60" rx="10" fill="#111827" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="1" className="float-card float-2" />
                
                {/* Text overlays inside floating cards */}
                <text x="85" y="95" fill="#f3f4f6" fontSize="10" fontWeight="bold" fontFamily="sans-serif">PRODUCTIVITY</text>
                <text x="85" y="115" fill="#10b981" fontSize="14" fontWeight="800" fontFamily="sans-serif">96.8%</text>

                <text x="245" y="295" fill="#f3f4f6" fontSize="10" fontWeight="bold" fontFamily="sans-serif">BURNOUT RISK</text>
                <text x="245" y="315" fill="#ef4444" fontSize="14" fontWeight="800" fontFamily="sans-serif">LOW</text>

                {/* Center Brain Graph Network */}
                <circle cx="200" cy="200" r="10" fill="url(#artwork-purple-cyan)" />
                
                {/* Connected nodes */}
                <line x1="200" y1="200" x2="150" y2="150" stroke="rgba(139, 92, 246, 0.4)" strokeWidth="2" strokeDasharray="4 2" />
                <line x1="200" y1="200" x2="260" y2="160" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="2" />
                <line x1="200" y1="200" x2="160" y2="250" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="2" />
                <line x1="200" y1="200" x2="250" y2="230" stroke="rgba(139, 92, 246, 0.4)" strokeWidth="2" strokeDasharray="4 2" />
                
                <circle cx="150" cy="150" r="6" fill="#8b5cf6" />
                <circle cx="260" cy="160" r="6" fill="#06b6d4" />
                <circle cx="160" cy="250" r="6" fill="#06b6d4" />
                <circle cx="250" cy="230" r="6" fill="#8b5cf6" />

                <circle cx="150" cy="150" r="12" fill="none" stroke="#8b5cf6" strokeWidth="1" opacity="0.5" className="artwork-pulse" />
                <circle cx="260" cy="160" r="12" fill="none" stroke="#06b6d4" strokeWidth="1" opacity="0.5" className="artwork-pulse" />
              </svg>
            </div>
          </div>
        </div>

        {/* Startup Telemetry Stats */}
        <div className="saas-stats-row">
          <div className="stat-col">
            <span className="stat-num">95.4%</span>
            <span className="stat-label">Model Accuracy</span>
          </div>
          <div className="stat-col">
            <span className="stat-num">&lt; 100ms</span>
            <span className="stat-label">Prediction Latency</span>
          </div>
          <div className="stat-col">
            <span className="stat-num">4</span>
            <span className="stat-label">ML Models Integrated</span>
          </div>
          <div className="stat-col">
            <span className="stat-num">Real-Time</span>
            <span className="stat-label">Computation Thread</span>
          </div>
        </div>
      </header>

      {/* 3. DASHBOARD MAIN CARD INTERFACE */}
      <section className="saas-dashboard-block" id="predictor" ref={dashboardRef}>
        <div className="block-header">
          <h2>Predictive Workstation</h2>
          <p>Model workflow parameters and real-time classification metrics dashboard.</p>
        </div>

        {/* STEP 1: MODEL SELECTION GRID */}
        <div className="section-panel" id="models">
          <h3 className="section-subtitle">1. Selected Model Engine</h3>
          <div className="models-saas-grid">
            
            <button 
              type="button" 
              className={`model-saas-card ${model === "rf" ? "selected" : ""}`}
              onClick={() => setModel("rf")}
            >
              <div className="card-header-row">
                <span className="emoji">🌲</span>
                <span className="saas-badge cyan">96.4% Acc</span>
              </div>
              <h4>Random Forest</h4>
              <p className="desc">Robust bagging ensemble model constructed with recursive decision partitions.</p>
              <div className="features-chips">
                <span>⚡ &lt; 5ms</span>
                <span>💪 High Stability</span>
              </div>
            </button>

            <button 
              type="button" 
              className={`model-saas-card ${model === "xgb" ? "selected" : ""}`}
              onClick={() => setModel("xgb")}
            >
              <div className="card-header-row">
                <span className="emoji">⚡</span>
                <span className="saas-badge cyan">97.8% Acc</span>
              </div>
              <h4>XGBoost</h4>
              <p className="desc">Highly optimized gradient-boosted trees utilizing second-order approximations.</p>
              <div className="features-chips">
                <span>⚡ &lt; 2ms</span>
                <span>🎯 High Precision</span>
              </div>
            </button>

            <button 
              type="button" 
              className={`model-saas-card ${model === "lgbm" ? "selected" : ""}`}
              onClick={() => setModel("lgbm")}
            >
              <div className="card-header-row">
                <span className="emoji">🚀</span>
                <span className="saas-badge cyan">97.1% Acc</span>
              </div>
              <h4>LightGBM</h4>
              <p className="desc">Leaf-wise gradient booster optimizing for memory storage and high throughput.</p>
              <div className="features-chips">
                <span>⚡ &lt; 1ms</span>
                <span>📊 Low Overhead</span>
              </div>
            </button>

            <button 
              type="button" 
              className={`model-saas-card ${model === "logreg" ? "selected" : ""}`}
              onClick={() => setModel("logreg")}
            >
              <div className="card-header-row">
                <span className="emoji">📉</span>
                <span className="saas-badge gray">91.5% Acc</span>
              </div>
              <h4>Logistic Reg.</h4>
              <p className="desc">Linear log-odds baseline model producing highly interpretable statistical weights.</p>
              <div className="features-chips">
                <span>⚡ &lt; 1ms</span>
                <span>🔬 Interpretable</span>
              </div>
            </button>

          </div>
        </div>

        {/* STEP 2: VARIABLE CARD GRID */}
        <div className="saas-grid-inputs">
          
          {/* CARD 1: DAILY ROUTINE */}
          <div className="glass-form-card">
            <div className="card-title-row">
              <Icons.Routine />
              <h4>Daily Routine</h4>
            </div>
            
            <div className="sliders-list">
              <div className="slider-wrapper">
                <div className="slider-label-row">
                  <label htmlFor="sleep">Sleep Duration</label>
                  <span className="slider-val highlight">{form.sleep} hrs</span>
                </div>
                <input 
                  type="range" 
                  id="sleep" 
                  name="sleep" 
                  min="0" 
                  max="12" 
                  step="0.5" 
                  value={form.sleep} 
                  onChange={handleChange} 
                />
                <div className="slider-limits">
                  <span>0h</span>
                  <span>12h</span>
                </div>
              </div>

              <div className="slider-wrapper">
                <div className="slider-label-row">
                  <label htmlFor="work">Work Hours</label>
                  <span className="slider-val">{form.work} hrs</span>
                </div>
                <input 
                  type="range" 
                  id="work" 
                  name="work" 
                  min="0" 
                  max="16" 
                  value={form.work} 
                  onChange={handleChange} 
                />
                <div className="slider-limits">
                  <span>0h</span>
                  <span>16h</span>
                </div>
              </div>

              <div className="slider-wrapper">
                <div className="slider-label-row">
                  <label htmlFor="coffee">Coffee Intake</label>
                  <span className="slider-val">{form.coffee} {form.coffee === 1 ? "cup" : "cups"}</span>
                </div>
                <input 
                  type="range" 
                  id="coffee" 
                  name="coffee" 
                  min="0" 
                  max="10" 
                  value={form.coffee} 
                  onChange={handleChange} 
                />
                <div className="slider-limits">
                  <span>None</span>
                  <span>10 cups</span>
                </div>
              </div>

              <div className="slider-wrapper">
                <div className="slider-label-row">
                  <label htmlFor="water">Water Intake</label>
                  <span className="slider-val highlight">{form.water} glasses</span>
                </div>
                <input 
                  type="range" 
                  id="water" 
                  name="water" 
                  min="0" 
                  max="12" 
                  value={form.water} 
                  onChange={handleChange} 
                />
                <div className="slider-limits">
                  <span>0g</span>
                  <span>12 glasses</span>
                </div>
              </div>

              <div className="slider-wrapper">
                <div className="slider-label-row">
                  <label htmlFor="exercise">Exercise</label>
                  <span className="slider-val">{form.exercise} mins</span>
                </div>
                <input 
                  type="range" 
                  id="exercise" 
                  name="exercise" 
                  min="0" 
                  max="120" 
                  step="5" 
                  value={form.exercise} 
                  onChange={handleChange} 
                />
                <div className="slider-limits">
                  <span>0m</span>
                  <span>120 mins</span>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: LIFESTYLE */}
          <div className="glass-form-card">
            <div className="card-title-row">
              <Icons.Activity />
              <h4>Lifestyle & Stress</h4>
            </div>

            <div className="sliders-list">
              <div className="slider-wrapper">
                <div className="slider-label-row">
                  <label htmlFor="stress">Stress Pressure</label>
                  <span className="slider-val highlight">{form.stress} / 10</span>
                </div>
                <input 
                  type="range" 
                  id="stress" 
                  name="stress" 
                  min="1" 
                  max="10" 
                  value={form.stress} 
                  onChange={handleChange} 
                />
                <div className="slider-limits">
                  <span>Calm (1)</span>
                  <span>Severe (10)</span>
                </div>
              </div>

              <div className="slider-wrapper">
                <div className="slider-label-row">
                  <label htmlFor="social">Screen Time (Social)</label>
                  <span className="slider-val">{form.social} hrs</span>
                </div>
                <input 
                  type="range" 
                  id="social" 
                  name="social" 
                  min="0" 
                  max="10" 
                  step="0.5" 
                  value={form.social} 
                  onChange={handleChange} 
                />
                <div className="slider-limits">
                  <span>0h</span>
                  <span>10h</span>
                </div>
              </div>

              <div className="slider-wrapper">
                <div className="slider-label-row">
                  <label htmlFor="meditation">Meditation</label>
                  <span className="slider-val highlight">{form.meditation} mins</span>
                </div>
                <input 
                  type="range" 
                  id="meditation" 
                  name="meditation" 
                  min="0" 
                  max="60" 
                  step="5" 
                  value={form.meditation} 
                  onChange={handleChange} 
                />
                <div className="slider-limits">
                  <span>0m</span>
                  <span>60 mins</span>
                </div>
              </div>

              <div className="slider-wrapper">
                <div className="slider-label-row">
                  <label htmlFor="age">Age Metric</label>
                  <span className="slider-val">{form.age} yrs</span>
                </div>
                <input 
                  type="range" 
                  id="age" 
                  name="age" 
                  min="15" 
                  max="60" 
                  value={form.age} 
                  onChange={handleChange} 
                />
                <div className="slider-limits">
                  <span>15</span>
                  <span>60</span>
                </div>
              </div>

              <div className="select-wrapper">
                <label htmlFor="gender">Gender</label>
                <select id="gender" name="gender" value={form.gender} onChange={handleChange}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* CARD 3: DIET & NUTRITION */}
          <div className="glass-form-card">
            <div className="card-title-row">
              <Icons.Diet />
              <h4>Diet & Nutrition</h4>
            </div>

            <div className="sliders-list">
              <div className="slider-wrapper">
                <div className="slider-label-row">
                  <label htmlFor="fruits">Fruits & Veggies</label>
                  <span className="slider-val">{form.fruits} servings</span>
                </div>
                <input 
                  type="range" 
                  id="fruits" 
                  name="fruits" 
                  min="0" 
                  max="5" 
                  value={form.fruits} 
                  onChange={handleChange} 
                />
                <div className="slider-limits">
                  <span>None</span>
                  <span>5 servings</span>
                </div>
              </div>

              <div className="slider-wrapper">
                <div className="slider-label-row">
                  <label htmlFor="junk">Junk Food Frequency</label>
                  <span className="slider-val highlight">{form.junk} serving</span>
                </div>
                <input 
                  type="range" 
                  id="junk" 
                  name="junk" 
                  min="0" 
                  max="5" 
                  value={form.junk} 
                  onChange={handleChange} 
                />
                <div className="slider-limits">
                  <span>None</span>
                  <span>5 servings</span>
                </div>
              </div>

              <div className="slider-wrapper">
                <div className="slider-label-row">
                  <label htmlFor="protein">Protein Intake</label>
                  <span className="slider-val">{form.protein}g</span>
                </div>
                <input 
                  type="range" 
                  id="protein" 
                  name="protein" 
                  min="0" 
                  max="150" 
                  step="5" 
                  value={form.protein} 
                  onChange={handleChange} 
                />
                <div className="slider-limits">
                  <span>0g</span>
                  <span>150g</span>
                </div>
              </div>

              <div className="slider-wrapper">
                <div className="slider-label-row">
                  <label htmlFor="calories">Daily Calories</label>
                  <span className="slider-val highlight">{form.calories} kcal</span>
                </div>
                <input 
                  type="range" 
                  id="calories" 
                  name="calories" 
                  min="1000" 
                  max="4000" 
                  step="50" 
                  value={form.calories} 
                  onChange={handleChange} 
                />
                <div className="slider-limits">
                  <span>1000</span>
                  <span>4000</span>
                </div>
              </div>

              <div className="select-wrapper">
                <label htmlFor="job">Occupation</label>
                <select id="job" name="job" value={form.job} onChange={handleChange}>
                  <option value="it">👨‍💻 IT / Tech</option>
                  <option value="student">🎓 Student</option>
                  <option value="finance">💼 Finance</option>
                  <option value="health">🩺 Healthcare</option>
                  <option value="unemployed">🏡 Unemployed / Other</option>
                </select>
              </div>
            </div>
          </div>

        </div>

        {/* COMPUTE BUTTON - FULL WIDTH & CENTERED BELOW CARDS */}
        <div className="saas-predict-trigger-container">
          <button 
            type="button" 
            className={`saas-predict-trigger ${loading ? "running" : ""}`}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Interrogating API...
              </>
            ) : (
              "Compute Predictive Metrics"
            )}
          </button>
        </div>

        {/* RESULTS PANEL BLOCK */}
        <div className="saas-results-panel" id="results-panel">
          
          {result === "" ? (
            <div className="saas-empty-state">
              <div className="floating-shape shape-1"></div>
              <div className="floating-shape shape-2"></div>
              <div className="empty-badge">📊 Analytics Idle</div>
              <h3>Workspace Pending Computation</h3>
              <p>Configure model configurations and slider inputs above, then trigger calculations to see circular confidence meters, feature analysis, and habit summaries.</p>
              <button className="empty-action-btn" onClick={handleSubmit}>
                Quick Run Prediction
              </button>
            </div>
          ) : (
            <div className="saas-results-dashboard">
              
              {/* ACCENT METRICS ROW */}
              <div className="outcome-metrics-row">
                
                {/* METER 1: PRODUCTIVITY SPEEDOMETER */}
                <div className="outcome-card speedo-card">
                  <span className="card-badge">ML Model Prediction</span>
                  <h5>Productivity Score</h5>
                  
                  <div className="gauge-dial-container">
                    <svg viewBox="0 0 100 100" className="gauge-svg">
                      <circle cx="50" cy="50" r="40" className="gauge-bg" />
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="40" 
                        className="gauge-val stroke-indigo" 
                        style={{
                          strokeDasharray: `${2 * Math.PI * 40}`,
                          strokeDashoffset: `${2 * Math.PI * 40 * (1 - score / 100)}`
                        }}
                      />
                    </svg>
                    <div className="gauge-inner-label">
                      <span className="percentage">{score}%</span>
                      <span className="label">Confidence</span>
                    </div>
                  </div>

                  <div className="outcome-footer">
                    <span className={`prod-label-badge ${result === 1 ? "high" : "low"}`}>
                      {result === 1 ? "🚀 HIGH PRODUCTIVITY" : "⚠️ LOW PRODUCTIVITY"}
                    </span>
                    <p className="outcome-desc">
                      Calculated using {model.toUpperCase()} classifier engine based on your active lifestyle parameters.
                    </p>
                  </div>
                </div>

                {/* METER 2: HEALTH SCORE RING */}
                <div className="outcome-card ring-card">
                  <span className="card-badge">Habit Analysis</span>
                  <h5>Health Index Score</h5>
                  
                  <div className="gauge-dial-container">
                    <svg viewBox="0 0 100 100" className="gauge-svg">
                      <circle cx="50" cy="50" r="40" className="gauge-bg" />
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="40" 
                        className="gauge-val stroke-cyan" 
                        style={{
                          strokeDasharray: `${2 * Math.PI * 40}`,
                          strokeDashoffset: `${2 * Math.PI * 40 * (1 - healthScore / 100)}`
                        }}
                      />
                    </svg>
                    <div className="gauge-inner-label">
                      <span className="percentage">{healthScore}</span>
                      <span className="label">Index Rating</span>
                    </div>
                  </div>

                  <div className="outcome-footer">
                    <div className="linear-risk-row">
                      <span className="lbl">Status:</span>
                      <span className={`val ${healthScore > 75 ? "good" : healthScore > 50 ? "avg" : "poor"}`}>
                        {healthScore > 75 ? "Excellent Health" : healthScore > 50 ? "Moderate State" : "High Strain Risk"}
                      </span>
                    </div>
                    <p className="outcome-desc">
                      Client-side health metric calculated from sleep logs, hydration indicators, and physical workout intervals.
                    </p>
                  </div>
                </div>

                {/* METER 3: BURNOUT RISK SPEEDOMETER */}
                <div className="outcome-card ring-card">
                  <span className="saas-card-latency">Latency: {predTime}ms</span>
                  <h5>Burnout Risk Rate</h5>
                  
                  <div className="gauge-dial-container">
                    <svg viewBox="0 0 100 100" className="gauge-svg">
                      <circle cx="50" cy="50" r="40" className="gauge-bg" />
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="40" 
                        className="gauge-val stroke-red" 
                        style={{
                          strokeDasharray: `${2 * Math.PI * 40}`,
                          strokeDashoffset: `${2 * Math.PI * 40 * (1 - burnoutRisk / 100)}`
                        }}
                      />
                    </svg>
                    <div className="gauge-inner-label">
                      <span className="percentage">{burnoutRisk}%</span>
                      <span className="label">Risk Index</span>
                    </div>
                  </div>

                  <div className="outcome-footer">
                    <div className="linear-risk-row">
                      <span className="lbl">Status:</span>
                      <span className={`val ${burnoutRisk > 70 ? "poor" : burnoutRisk > 40 ? "avg" : "good"}`}>
                        {burnoutRisk > 70 ? "High Critical" : burnoutRisk > 40 ? "Elevated Alert" : "Healthy / Low"}
                      </span>
                    </div>
                    <p className="outcome-desc">
                      Calculated from stress rates, workload workloads, and active recovery sleep/meditation inputs.
                    </p>
                  </div>
                </div>

              </div>

              {/* DYNAMIC SHAP EXPLAINABLE LIST */}
              <div className="explainable-saas-card">
                <div className="explain-header">
                  <Icons.Brain />
                  <div>
                    <h4>Explainable AI (SHAP Weights)</h4>
                    <p className="desc">Relative impact metrics of top variables affecting prediction outcomes.</p>
                  </div>
                </div>
                <div className="explain-list">
                  {shapValues.map((s, idx) => (
                    <div key={idx} className="shap-row">
                      <div className="shap-left">
                        <span className="shap-name">{s.name}</span>
                        <span className="shap-desc">{s.desc}</span>
                      </div>
                      <div className="shap-right">
                        <div className="shap-bar-track">
                          {s.val >= 0 ? (
                            <div className="shap-bar-fill pos" style={{ width: `${s.val * 3}%` }}></div>
                          ) : (
                            <div className="shap-bar-fill neg" style={{ width: `${Math.abs(s.val) * 3}%` }}></div>
                          )}
                        </div>
                        <span className={`shap-val-badge ${s.val >= 0 ? "pos" : "neg"}`}>
                          {s.val >= 0 ? `+${s.val}%` : `${s.val}%`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* TRIPLE GRAPHS VIEW */}
              <div className="saas-charts-grid">
                
                {/* 1. Bar Chart */}
                <div className="chart-glass-card">
                  <h5>Feature Weight Amplitude</h5>
                  <div className="canvas-wrapper">
                    <Bar data={barChartData} options={barChartOptions} />
                  </div>
                </div>

                {/* 2. Radar Chart */}
                <div className="chart-glass-card">
                  <h5>Lifestyle Performance Radar</h5>
                  <div className="canvas-wrapper">
                    <Radar data={radarChartData} options={radarChartOptions} />
                  </div>
                </div>

                {/* 3. Doughnut Chart */}
                <div className="chart-glass-card">
                  <h5>24-Hour Time Allocation Budget</h5>
                  <div className="canvas-wrapper">
                    <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
                  </div>
                </div>

              </div>

              {/* AI RECOMMENDATION DECK LIST ROW VIEW */}
              <div className="recommendations-deck">
                <h4>AI Recommendations & Priority Guide</h4>
                <div className="saas-recs-list">
                  {getSortedRecommendations().map((rec, index) => (
                    <div key={index} className={`rec-saas-row border-${rec.priority.toLowerCase()}`}>
                      <span className="rec-emoji">{rec.icon}</span>
                      <div className="rec-details">
                        <h5>{rec.title}</h5>
                        <p>{rec.text}</p>
                      </div>
                      <span className={`priority-pill ${rec.priority.toLowerCase()}`}>{rec.priority}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className="saas-footer">
        <div className="footer-content">
          <div className="footer-left">
            <div className="footer-logo">
              <Icons.Brain />
              <span>Productive.AI</span>
            </div>
            <p>Advanced machine learning analytics mapping routine variables to focus limits and physiological indicators.</p>
          </div>
          <div className="footer-right">
            <div className="tech-stack-column">
              <h6>Tech Stack</h6>
              <span>React 18</span>
              <span>FastAPI</span>
              <span>Chart.js</span>
              <span>Vite Bundler</span>
            </div>
            <div className="developer-info-col">
              <h6>Links</h6>
              <div className="social-links-footer">
                <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub Developer Profile"><Icons.Github /> GitHub</a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn Profile"><Icons.Linkedin /> LinkedIn</a>
              </div>
              <span className="made-by-text">Created by Sahil Kumar Singh</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} Productive.AI. All prediction engines and scaling models preserved.</span>
        </div>
      </footer>
    </div>
  );
}

export default App;