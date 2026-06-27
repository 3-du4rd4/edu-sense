"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type WebcamStatus =
  | "idle"
  | "requesting"
  | "allowed"
  | "denied"
  | "unavailable"
  | "error";

export function useWebcam() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [status, setStatus] = useState<WebcamStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const stopWebcam = useCallback(() => {
    setStream((currentStream) => {
      currentStream?.getTracks().forEach((track) => track.stop());
      return null;
    });

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("unavailable");
      setError("Câmera não disponível neste navegador.");
      return false;
    }

    try {
      setStatus("requesting");
      setError(null);

      const permissionStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      permissionStream.getTracks().forEach((track) => track.stop());

      setStatus("allowed");
      return true;
    } catch (error) {
      console.error(error);

      if (error instanceof DOMException && error.name === "NotAllowedError") {
        setStatus("denied");
        setError("Permissão da câmera foi negada.");
        return false;
      }

      if (error instanceof DOMException && error.name === "NotFoundError") {
        setStatus("unavailable");
        setError("Nenhum dispositivo de câmera foi encontrado.");
        return false;
      }

      setStatus("error");
      setError("Não foi possível acessar a câmera.");
      return false;
    }
  }, []);

  const startWebcam = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("unavailable");
      setError("Câmera não disponível neste navegador.");
      return null;
    }

    try {
      setStatus("requesting");
      setError(null);

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      setStream(mediaStream);
      setStatus("allowed");

      return mediaStream;
    } catch (error) {
      console.error(error);

      if (error instanceof DOMException && error.name === "NotAllowedError") {
        setStatus("denied");
        setError("Permissão da câmera foi negada.");
        return null;
      }

      if (error instanceof DOMException && error.name === "NotFoundError") {
        setStatus("unavailable");
        setError("Nenhum dispositivo de câmera foi encontrado.");
        return null;
      }

      setStatus("error");
      setError("Não foi possível acessar a câmera.");
      return null;
    }
  }, []);

  useEffect(() => {
    if (!videoRef.current || !stream) return;

    videoRef.current.srcObject = stream;
  }, [stream]);

  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, [stopWebcam]);

  return {
    videoRef,
    stream,
    status,
    error,
    requestPermission,
    startWebcam,
    stopWebcam,
  };
}
