export async function login(email: string, password: string) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message ?? "Erro ao fazer login");
  }

  const data = await res.json();
  return data;
}

export async function logout() {
  await fetch("/api/auth/logout", {
    method: "POST",
  });
}
