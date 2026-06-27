import { create } from "zustand";
import { persist } from "zustand/middleware";

type StudyPreferences = {
  defaultTimeGoalMinutes: number;
  cameraEnabledByDefault: boolean;
  sensorsEnabledByDefault: boolean;
  browserNotificationsEnabled: boolean;
};

type SettingsState = StudyPreferences & {
  setDefaultTimeGoalMinutes: (minutes: number) => void;
  setCameraEnabledByDefault: (enabled: boolean) => void;
  setSensorsEnabledByDefault: (enabled: boolean) => void;
  setBrowserNotificationsEnabled: (enabled: boolean) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      defaultTimeGoalMinutes: 30,
      cameraEnabledByDefault: false,
      sensorsEnabledByDefault: true,
      browserNotificationsEnabled: false,

      setDefaultTimeGoalMinutes: (minutes) =>
        set({ defaultTimeGoalMinutes: minutes }),

      setCameraEnabledByDefault: (enabled) =>
        set({ cameraEnabledByDefault: enabled }),

      setSensorsEnabledByDefault: (enabled) =>
        set({ sensorsEnabledByDefault: enabled }),

      setBrowserNotificationsEnabled: (enabled) =>
        set({ browserNotificationsEnabled: enabled }),
    }),
    {
      name: "edusense-settings",
    },
  ),
);
