import sys, os
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

import streamlit as st
from ai.predict import generate_ai_report

st.set_page_config(
    page_title="Smart Report AI",
    page_icon="🤖",
    layout="centered"
)

st.title("📋 Laporan AI")
st.caption("Evaluasi perkembangan hidup sehat & berkarakter")
st.divider()

with st.form("health_form"):
    sleep = st.number_input("Jam Tidur (jam)", 0, 24, step=1)
    exercise = st.number_input("Olahraga (menit)", 0, 60, step=1)

    mood = st.slider("Mood (1 = buruk, 5 = sangat baik)", 1, 5, 3)
    stress = st.slider("Stres (1 = rendah / bagus, 5 = tinggi)", 1, 5, 3)
    discipline = st.slider("Disiplin", 1, 5, 3)
    empathy = st.slider("Empati", 1, 5, 3)

    submit = st.form_submit_button("🔍 Analisis AI")

if submit:
    data = {
        "sleepHours": sleep,
        "exerciseMinutes": exercise,
        "mood": mood,
        "stress": stress,
        "discipline": discipline,
        "empathy": empathy
    }

    report = generate_ai_report(data)

    st.divider()

    st.subheader("🏃 Physical Health")
    st.metric(report["Physical"]["label"], f"{report['Physical']['score']} / 100")
    st.info(report["Physical"]["summary"])

    st.subheader("🧠 Mental Health")
    st.metric(report["Mental"]["label"], f"{report['Mental']['score']} / 100")
    st.info(report["Mental"]["summary"])

    st.subheader("⭐ Character")
    st.metric(report["Character"]["label"], f"{report['Character']['score']} / 100")
    st.info(report["Character"]["summary"])

    st.divider()
    st.subheader("🤖 Ringkasan AI")
    st.success(report["Summary"])
