import { useEffect, useRef } from "react";

type UseVisionFrameStreamProps = {
  enabled: boolean;
  visionUrl: string;
  intervalMs?: number;
};

export function useVisionFrameStream({
  enabled,
  visionUrl,
  intervalMs = 1000,
}: UseVisionFrameStreamProps) {
  const lastLatencyRef = useRef(0);
  const isSendingRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  function getIntervalMs() {
    const latency = lastLatencyRef.current;

    if (latency < 300) return 700;
    if (latency < 800) return 1000;
    return 2000;
  }

  function stopCamera() {
    const stream = videoRef.current?.srcObject as MediaStream | null;

    stream?.getTracks().forEach((track) => track.stop());

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }

  useEffect(() => {
    if (!enabled) {
      stopCamera();
      return;
    }

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          await new Promise<void>((resolve) => {
            videoRef.current!.onloadedmetadata = () => resolve();
          });

          await videoRef.current.play();
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    }

    startCamera();

    return () => {
      const stream = videoRef.current?.srcObject as MediaStream | null;

      stream?.getTracks().forEach((track) => track.stop());

      stopCamera();
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    function sendFrame(): Promise<void> {
      return new Promise((resolve) => {
        if (isSendingRef.current) {
          resolve();
          return;
        }

        const video = videoRef.current;
        if (
          !video ||
          video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA ||
          video.videoWidth === 0 ||
          video.videoHeight === 0
        ) {
          resolve();
          return;
        }

        isSendingRef.current = true;

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
          isSendingRef.current = false;
          resolve();
          return;
        }

        canvas.width = 320;
        canvas.height = 240;

        context.drawImage(video, 0, 0, 320, 240);

        canvas.toBlob(
          async (blob) => {
            if (!blob) {
              isSendingRef.current = false;
              resolve();
              return;
            }

            const formData = new FormData();
            formData.append("frame", blob, "frame.jpg");

            const requestTimestamp = Date.now();

            formData.append("requestTimestamp", requestTimestamp.toString());

            try {
              const startTime = performance.now();

              await fetch(`${visionUrl}/analyze-frame`, {
                method: "POST",
                body: formData,
              });

              const endTime = performance.now();
              lastLatencyRef.current = endTime - startTime;
            } catch (error) {
              console.error("Error sending frame:", error);
            } finally {
              isSendingRef.current = false;
              resolve();
            }
          },
          "image/jpeg",
          0.6,
        );
      });
    }

    function scheduleNext() {
      const delay = getIntervalMs();

      intervalRef.current = setTimeout(async () => {
        await sendFrame();
        scheduleNext();
      }, delay);
    }

    scheduleNext();

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, visionUrl]);

  return {
    videoRef,
  };
}
