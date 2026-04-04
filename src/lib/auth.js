const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function registerUser(data) {
  const res = await fetch(`${BASE_URL}/api/users/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    const error = new Error("Registration failed");
  error.responseData = json;
  throw error;
  }

  return json;
}

export async function loginUser(data) {
  const res = await fetch(`${BASE_URL}/api/users/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      json?.detail || json?.message || JSON.stringify(json) || "Login failed"
    );
  }

  return json;
}

export function saveAuthTokens(data) {
  if (data.access) localStorage.setItem("access", data.access);
  if (data.refresh) localStorage.setItem("refresh", data.refresh);
  if (data.token) localStorage.setItem("token", data.token);
}

export function getAccessToken() {
  return localStorage.getItem("access") || localStorage.getItem("token");
}




export function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    return !payload.exp || payload.exp < currentTime;
  } catch {
    return true;
  }
}

export function isLoggedIn() {
  if (typeof window === "undefined") return false;

  const access = localStorage.getItem("access");
  const token = localStorage.getItem("token");

  const authToken = access || token;
  if (!authToken) return false;

  return !isTokenExpired(authToken);
}

export function logoutUser() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("token");
}

