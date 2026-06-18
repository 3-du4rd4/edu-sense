from pathlib import Path

import joblib
import pandas as pd

import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.metrics import ConfusionMatrixDisplay, confusion_matrix

from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
    roc_curve,
)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC


DATASET_PATH = Path(__file__).parent / "dataset.csv"
MODELS_DIR = Path(__file__).resolve().parents[1] / "models"
BEST_MODEL_PATH = MODELS_DIR / "fatigue_model.joblib"


FEATURE_COLUMNS = [
    "earMean",
    "earMin",
    "earStd",
    "marMean",
    "marMax",
    "marStd",
    "perclos",
    "eyesClosedRatio",
    "yawnCount",
]

TARGET_COLUMN = "label"

RESULTS_DIR = Path(__file__).parent / "results"
MODEL_COMPARISON_PATH = RESULTS_DIR / "model_comparison.png"
CONFUSION_MATRIX_PATH = RESULTS_DIR / "confusion_matrix_best_model.png"
FEATURE_IMPORTANCE_PATH = RESULTS_DIR / "feature_importance.png"
ROC_CURVE_PATH = RESULTS_DIR / "roc_curve.png"
MODEL_COMPARISON_CSV_PATH = RESULTS_DIR / "model_comparison.csv"


def main():
    if not DATASET_PATH.exists():
        raise FileNotFoundError(f"Dataset not found at {DATASET_PATH}")
    
    df = pd.read_csv(DATASET_PATH)

    validate_dataset(df)

    X = df[FEATURE_COLUMNS]
    y = df[TARGET_COLUMN]

    stratify = (
        y
        if y.nunique() > 1 and y.value_counts().min() >= 2
        else None
    )

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=stratify
    )

    models = {
        "Logistic Regression": Pipeline(
            steps=[
                ("scaler", StandardScaler()),
                ( 
                    "model",
                    LogisticRegression(
                        max_iter=1000,
                        random_state=42,
                    )
                )
            ]
        ),
        "Random Forest": RandomForestClassifier(
            n_estimators=200,
            random_state=42,
        ),
        "SVM": Pipeline(
            steps=[
                ("scaler", StandardScaler()),
                (
                    "model",
                    SVC(
                        kernel="rbf",
                        probability=True,
                        random_state=42,
                    )
                )
            ]
        ),
    }

    results = []
    best_model_name = None
    best_model = None
    best_f1 = -1
    best_y_test = None
    best_y_proba = None

    for model_name, model in models.items():
        print(f"\nTraining {model_name}...")

        model.fit(X_train, y_train)

        y_pred = model.predict(X_test)

        y_proba = model.predict_proba(X_test)[:, 1]

        auc = roc_auc_score(y_test, y_proba)

        accuracy = accuracy_score(y_test, y_pred)

        precision = precision_score(
            y_test, y_pred, zero_division=0
        )

        recall = recall_score(
            y_test, y_pred, zero_division=0
        )

        f1 = f1_score(
            y_test, y_pred, zero_division=0
        )

        results.append({
            "model": model_name,
            "accuracy": accuracy,
            "precision": precision,
            "recall": recall,
            "f1": f1,
            "auc": auc
        })

        print(classification_report(y_test, y_pred, zero_division=0))

        if f1 > best_f1:
            best_f1 = f1
            best_model_name = model_name
            best_model = model
            best_y_test = y_test
            best_y_proba = y_proba

    results_df = pd.DataFrame(results).sort_values(
        by="f1", ascending=False
    )

    print("\nModel comparison:")
    print(results_df.to_string(index=False))

    MODELS_DIR.mkdir(parents=True, exist_ok=True)

    joblib.dump(
        {
            "model": best_model,
            "modelName": best_model_name,
            "featureColumns": FEATURE_COLUMNS,
        },
        BEST_MODEL_PATH,
    )

    print(f"\nBest model: {best_model_name}")
    print(f"Saved best model to {BEST_MODEL_PATH}")

    RESULTS_DIR.mkdir(parents=True, exist_ok=True)

    results_df.to_csv(MODEL_COMPARISON_CSV_PATH, index=False)

    plot_model_comparison(results_df)
    plot_confusion_matrix(best_model, X_test, y_test)
    plot_feature_importance(best_model, best_model_name)
    plot_roc_curve(best_y_test, best_y_proba, best_model_name)



def validate_dataset(df: pd.DataFrame):
    missing_columns = [
        column for column in [*FEATURE_COLUMNS, TARGET_COLUMN] 
        if column not in df.columns
    ]

    if missing_columns:
        raise ValueError(f"Dataset is missing columns: {missing_columns}")

    if df.empty:
        raise ValueError("Dataset is empty")

    if df[TARGET_COLUMN].nunique() < 2:
        raise ValueError("Target column must have at least 2 classes")
    
    if len(df) < 10:
        print(
            "Warning: dataset has very few samples. "
            "Results are only useful for pipeline testing."
        )


def plot_model_comparison(results_df: pd.DataFrame):
    melted_df = results_df.melt(
        id_vars="model",
        value_vars=["accuracy", "precision", "recall", "f1", "auc"],
        var_name="metric",
        value_name="score",
    )

    plt.figure(figsize=(10, 6))
    sns.barplot(
        data=melted_df,
        x="model",
        y="score",
        hue="metric",
    )

    plt.title("Model performance comparison")
    plt.ylim(0, 1)
    plt.xlabel("Model")
    plt.ylabel("Score")
    plt.legend(title="Metric")
    plt.tight_layout()
    plt.savefig(MODEL_COMPARISON_PATH, dpi=300)
    plt.close()


def plot_confusion_matrix(model, X_test, y_test):
    y_pred = model.predict(X_test)

    matrix = confusion_matrix(y_test, y_pred)

    display = ConfusionMatrixDisplay(
        confusion_matrix=matrix,
        display_labels=["Alert", "Tired"],
    )

    display.plot(cmap="Blues", values_format="d")

    plt.title("Confusion matrix - best model")
    plt.tight_layout()
    plt.savefig(CONFUSION_MATRIX_PATH, dpi=300)
    plt.close()


def plot_feature_importance(model, model_name: str):
    importances = None

    if model_name == "Random Forest":
        importances = model.feature_importances_

    elif model_name == "Logistic Regression":
        classifier = model.named_steps["model"]
        importances = abs(classifier.coef_[0])

    elif model_name == "SVM":
        print("Skipping feature importance for SVM with RBF kernel.")
        return

    if importances is None:
        return

    importance_df = pd.DataFrame(
        {
            "feature": FEATURE_COLUMNS,
            "importance": importances,
        }
    ).sort_values(by="importance", ascending=False)

    plt.figure(figsize=(10, 6))
    sns.barplot(
        data=importance_df,
        x="importance",
        y="feature",
    )

    plt.title(f"Feature importance - {model_name}")
    plt.xlabel("Importance")
    plt.ylabel("Feature")
    plt.tight_layout()
    plt.savefig(FEATURE_IMPORTANCE_PATH, dpi=300)
    plt.close()


def plot_roc_curve(
    y_test,
    y_proba,
    model_name: str,
):
    fpr, tpr, _ = roc_curve(
        y_test,
        y_proba,
    )

    auc_score = roc_auc_score(
        y_test,
        y_proba,
    )

    plt.figure(figsize=(8, 6))

    plt.plot(
        fpr,
        tpr,
        linewidth=2,
        label=f"{model_name} (AUC = {auc_score:.3f})",
    )

    plt.plot(
        [0, 1],
        [0, 1],
        linestyle="--",
        linewidth=1,
    )

    plt.xlabel("False Positive Rate")
    plt.ylabel("True Positive Rate")
    plt.title("ROC Curve")
    plt.legend()
    plt.tight_layout()

    plt.savefig(
        ROC_CURVE_PATH,
        dpi=300,
    )

    plt.close()


if __name__ == "__main__":
    main()