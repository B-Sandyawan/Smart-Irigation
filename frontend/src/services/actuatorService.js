const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";
const BRIDGE_ENABLED =
  String(import.meta.env.VITE_ENABLE_IOT_BRIDGE || "false").toLowerCase() ===
  "true";

async function safePost(path, payload, fallbackMessage) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorMessage = fallbackMessage;
    try {
      const errorBody = await response.json();
      errorMessage = errorBody?.error || fallbackMessage;
    } catch (_error) {
      // Gunakan fallback saat response bukan JSON.
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export const actuatorService = {
  isBridgeEnabled() {
    return BRIDGE_ENABLED;
  },

  async controlPompa(value, duration = 10) {
    if (!BRIDGE_ENABLED) {
      return { skipped: true, reason: "iot_bridge_disabled" };
    }

    return safePost(
      "/api/actuators/pompa",
      { value, duration },
      "Gagal mengontrol pompa",
    );
  },

  async controlLampu(value) {
    if (!BRIDGE_ENABLED) {
      return { skipped: true, reason: "iot_bridge_disabled" };
    }

    return safePost(
      "/api/actuators/lampu",
      { value },
      "Gagal mengontrol lampu",
    );
  },

  async controlServo(value) {
    if (!BRIDGE_ENABLED) {
      return { skipped: true, reason: "iot_bridge_disabled" };
    }

    return safePost(
      "/api/actuators/servo",
      { value },
      "Gagal mengontrol servo",
    );
  },

  async getStatus() {
    if (!BRIDGE_ENABLED) {
      return { skipped: true, reason: "iot_bridge_disabled" };
    }

    const response = await fetch(`${API_BASE}/api/status`);
    if (!response.ok) {
      throw new Error("Gagal mengambil status");
    }
    return response.json();
  },

  async healthCheck() {
    if (!BRIDGE_ENABLED) {
      return false;
    }

    try {
      const response = await fetch(`${API_BASE}/api/health`);
      return response.ok;
    } catch (_error) {
      return false;
    }
  },
};

export default actuatorService;