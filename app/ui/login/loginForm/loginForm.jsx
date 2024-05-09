"use client";

import styles from "./loginForm.module.css";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { fAuth } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";
import { Bounce, toast } from "react-toastify";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();
  const onSubmit = async (event) => {
    event.preventDefault();
    if (password != "") {
      try {
        const user = await signInWithEmailAndPassword(fAuth, email, password);

        router.push("/dashboard");
        toast.success("User LogedIn successfully", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
      } catch (error) {
        setError(error.message);
      }
    } else {
      setError("Please enter a password");
    }
  };
  return (
    <>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={onSubmit} className={styles.form}>
        <h1>Login</h1>
        <input
          type="text"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
          name="email"
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="password"
          name="password"
        />
        <button className={styles.button}>Login</button>
      </form>
    </>
  );
};

export default LoginForm;
