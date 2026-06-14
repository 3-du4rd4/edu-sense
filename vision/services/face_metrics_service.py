import math

import cv2
import mediapipe as mp


LEFT_EYE_LANDMARKS = [33, 160, 158, 133, 153, 144]
RIGHT_EYE_LANDMARKS = [362, 385, 387, 263, 373, 380]

MOUTH_LANDMARKS = [13, 14, 78, 308]


class FaceMetricsService:
    def __init__(
        self,
        ear_threshold: float,
        mar_threshold: float,
    ):
        self.ear_threshold = ear_threshold
        self.mar_threshold = mar_threshold

        self.face_mesh = mp.solutions.face_mesh.FaceMesh(
            static_image_mode=False,
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5,
        )


    def extract_metrics(self, frame):
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        result = self.face_mesh.process(rgb_frame)

        if not result.multi_face_landmarks:
            return None

        face_landmarks = result.multi_face_landmarks[0]
        height, width, _ = frame.shape

        landmarks = [
            {
                "x": landmark.x * width,
                "y": landmark.y * height,
            }
            for landmark in face_landmarks.landmark
        ]

        left_ear = self._calculate_ear(landmarks, LEFT_EYE_LANDMARKS)
        right_ear = self._calculate_ear(landmarks, RIGHT_EYE_LANDMARKS)
        ear = round((left_ear + right_ear) / 2, 4)

        mar = round(self._calculate_mar(landmarks, MOUTH_LANDMARKS), 4)

        return {
            "ear": ear,
            "mar": mar,
            "eyesClosed": ear < self.ear_threshold,
            "yawning": mar > self.mar_threshold,
        }


    def close(self):
        self.face_mesh.close()


    def _calculate_ear(self, landmarks, indexes):
        p1 = landmarks[indexes[0]]
        p2 = landmarks[indexes[1]]
        p3 = landmarks[indexes[2]]
        p4 = landmarks[indexes[3]]
        p5 = landmarks[indexes[4]]
        p6 = landmarks[indexes[5]]

        vertical_1 = self._distance(p2, p6)
        vertical_2 = self._distance(p3, p5)
        horizontal = self._distance(p1, p4)

        if horizontal == 0:
            return 0

        return (vertical_1 + vertical_2) / (2.0 * horizontal)


    def _calculate_mar(self, landmarks, indexes):
        upper_lip = landmarks[indexes[0]]
        lower_lip = landmarks[indexes[1]]
        left_mouth = landmarks[indexes[2]]
        right_mouth = landmarks[indexes[3]]

        vertical = self._distance(upper_lip, lower_lip)
        horizontal = self._distance(left_mouth, right_mouth)

        if horizontal == 0:
            return 0

        return vertical / horizontal


    def _distance(self, point_a, point_b):
        return math.sqrt(
            (point_a["x"] - point_b["x"]) ** 2
            + (point_a["y"] - point_b["y"]) ** 2
        )