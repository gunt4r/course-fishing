"use client";
import { api } from "@/app/api/axios";
import { useEffect, useState } from "react";

export default function SignIn() {
  const [users, setUsers] = useState<any[]>([]);
  /*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Fetches all users from the server.
   * The response is logged to the console for debugging purposes.
   * The users are then stored in the state using setUsers.
   */
  /*******  b819e560-60e4-47c5-8806-a713f48879cf  *******/ const [
    error,
    setError,
  ] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchUsers() {
      try {
        const res = await api.get("/api/users"); // baseURL у тебя http://localhost:3000
        // console.log(res); // можно раскомментировать для отладки
        if (mounted) setUsers(res.data);
      } catch (err: any) {
        console.error("fetch users error:", err);
        if (mounted) setError(err.message ?? "Unknown error");
      }
    }

    fetchUsers();

    return () => {
      mounted = false; // предотвратить setState после анмаунта
    };
  }, []); // <- важно: пустой массив, чтобы эффект выполнился только один раз

  return (
    <div>
      <h1>Sign In</h1>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <ul>
        {users.map((user: any) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
