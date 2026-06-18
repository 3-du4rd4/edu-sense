from pathlib import Path

import joblib
import pandas as pd


class FatigueClassifierService:
    def __init__(self, model_path: str):
        self.model_path = Path(model_path)
        self.model = None
        self.model_name = None
        self.feature_columns = None

        self.load_model()


    def load_model(self):
        if not self.model_path.exists():
            print(f"Model file not found at {self.model_path}")
            return
        
        model_data = joblib.load(self.model_path)

        self.model = model_data["model"]
        self.model_name = model_data["modelName"]
        self.feature_columns = model_data["featureColumns"]

        print(f"Fatigue model loaded successfully: {self.model_name}")


    def predict(self, features: dict) -> dict | None:
        if not self.model or not self.feature_columns:
            return None
        
        input_data = pd.DataFrame(
            [
                {
                    column: features[column]
                    for column in self.feature_columns
                }
            ]
        )

        fatigue_probability = float(self.model.predict_proba(input_data)[0][1])

        fatigue_detected = fatigue_probability >= 0.7
        
        focus_score = round((1 - fatigue_probability) * 100)

        return {
            "modelName": self.model_name,
            "fatigueProbability": round(fatigue_probability, 4),
            "fatigueDetected": fatigue_detected,
            "focusScore": focus_score
        }