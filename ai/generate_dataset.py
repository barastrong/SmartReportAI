import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder

np.random.seed(42)

n_samples = 1000
sleepHours = np.random.randint(4, 11, n_samples)
exerciseMinutes = np.random.randint(0, 61, n_samples)
mood = np.random.randint(1, 6, n_samples)
stress = np.random.randint(1, 6, n_samples)
discipline = np.random.randint(1, 6, n_samples)
empathy = np.random.randint(1, 6, n_samples)

def assign_label(ph, mh, ch):
    if ph > 8 and mh >= 4 and ch >= 4:
        return "Luar Biasa"
    elif ph > 7 and mh >=3 and ch >=3:
        return "Sangat Baik"
    elif ph > 5 and mh >=2 and ch >=2:
        return "Baik"
    else:
        return "Perlu Perhatian"

labels = [assign_label(sleepHours[i], mood[i], discipline[i]) for i in range(n_samples)]

df = pd.DataFrame({
    "sleepHours": sleepHours,
    "exerciseMinutes": exerciseMinutes,
    "mood": mood,
    "stress": stress,
    "discipline": discipline,
    "empathy": empathy,
    "label": labels
})

df.to_csv("./ai/model/dataset.csv", index=False)
print("✅ Dataset 1000 baris berhasil dibuat di ./ai/model/dataset.csv")
