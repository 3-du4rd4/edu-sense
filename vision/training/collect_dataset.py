import csv
import sys
from pathlib import Path

import cv2

ROOT_DIR = Path(__file__).resolve().parents[1]
sys.path.append(str(ROOT_DIR))

from config import settings
from services.face_metrics_service import FaceMetricsService
from services.temporal_window_service import TemporalWindowService

DATASET_VIDEOS_DIR = Path(__file__).parent / "dataset_videos"
OUTPUT_CSV_PATH = Path(__file__).parent / "dataset.csv"

LABELS = {
    "alert": 0,
    "tired": 1,
}

VIDEO_EXTENSIONS = {".mp4", ".avi", ".mov", ".mkv"}

def main():
    rows = []

    face_metrics_service = FaceMetricsService(
        ear_threshold=settings.EAR_THRESHOLD,
        mar_threshold=settings.MAR_THRESHOLD,
        eyes_closed_consecutive_seconds=settings.EYES_CLOSED_CONSECUTIVE_SECONDS,
        yawning_consecutive_seconds=settings.YAWNING_CONSECUTIVE_SECONDS,
    )

    try:
        for label_name, label_value in LABELS.items():
            label_dir = DATASET_VIDEOS_DIR / label_name

            if not label_dir.exists():
                print(f"Directory {label_dir} does not exist, skipping.")
                continue

            video_paths = [
                path
                for path in label_dir.iterdir()
                if path.suffix.lower() in VIDEO_EXTENSIONS
            ]

            for video_path in video_paths:
                print(f"Processing video: {video_path}")

                video_rows = process_video(
                    video_path=video_path,
                    label=label_value,
                    label_name=label_name,
                    face_metrics_service=face_metrics_service,
                )

                rows.extend(video_rows)

                print(f"Generated {len(video_rows)} samples from {video_path.name}")
    finally:
        face_metrics_service.close()

    write_csv(rows)

    print(f"Dataset generated: {OUTPUT_CSV_PATH}")
    print(f"Total samples: {len(rows)}")


def process_video(
    video_path: Path,
    label: int,
    label_name: str,
    face_metrics_service: FaceMetricsService,
):
    cap = cv2.VideoCapture(str(video_path))

    if not cap.isOpened():
        print(f"Error opening video file: {video_path}")
        return []
    
    fps = cap.get(cv2.CAP_PROP_FPS)

    if not fps or fps <= 0:
        print(f"Could not determine FPS for video: {video_path}, defaulting to 30")
        fps = 30

    frame_interval = int(fps)

    temporal_window = TemporalWindowService(
        window_size_seconds=settings.TEMPORAL_WINDOW_SECONDS,
    )

    rows = []
    frame_index = 0
    sample_index = 0
    processed_second = 0
    last_saved_second = -settings.DATASET_WINDOW_STEP_SECONDS

    while True:
        success, frame = cap.read()

        if not success:
            break

        should_process_frame = frame_index % frame_interval == 0

        if not should_process_frame:
            frame_index += 1
            continue

        metrics = face_metrics_service.extract_metrics(frame)

        if metrics:
            temporal_window.add_sample(metrics)

            can_save_sample = (
                temporal_window.is_ready()
                and processed_second - last_saved_second
                >= settings.DATASET_WINDOW_STEP_SECONDS
            )

            if can_save_sample:
                features = temporal_window.build_features()

                if features:
                    rows.append({
                        "video": video_path.name,
                        "labelName": label_name,
                        "label": label,
                        "sampleIndex": sample_index,
                        **features,
                    })

                    sample_index += 1
                    last_saved_second = processed_second

        processed_second += 1
        frame_index += 1

    cap.release()

    return rows


def write_csv(rows: list[dict]):
    fieldnames = [
        "video",
        "labelName",
        "label",
        "sampleIndex",
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

    with open(OUTPUT_CSV_PATH, "w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


if __name__ == "__main__":
    main()