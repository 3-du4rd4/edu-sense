import cv2


class WebcamService:
    def __init__(self, camera_index: int = 0):
        self.camera_index = camera_index
        self.capture = None


    def start(self) -> bool:
        if self.capture and self.capture.isOpened():
            return True

        print(f"Opening webcam on index {self.camera_index}")

        self.capture = cv2.VideoCapture(self.camera_index)

        if not self.capture.isOpened():
            print("Could not open webcam")
            self.capture = None
            return False

        print("Webcam opened")
        return True


    def read_frame(self):
        if not self.capture or not self.capture.isOpened():
            return None

        success, frame = self.capture.read()

        if not success:
            return None

        return frame


    def stop(self):
        if self.capture:
            self.capture.release()
            self.capture = None
            print("Webcam released")


    def is_active(self) -> bool:
        return self.capture is not None and self.capture.isOpened()