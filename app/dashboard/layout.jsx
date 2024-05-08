"use client";
import Navbar from "../ui/dashboard/navbar/navbar";
import Sidebar from "../ui/dashboard/sidebar/sidebar";
import styles from "../ui/dashboard/dashboard.module.css";
import Footer from "../ui/dashboard/footer/footer";
import "../ui/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { Bounce, ToastContainer } from "react-toastify";
import { onAuthStateChanged } from "firebase/auth";
import { fAuth } from "../lib/firebase";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "../ui/dashboard/Loading";

const Layout = ({ children }) => {
  const [loading, setLoading] = useState(true); // State to track loading status

  const router = useRouter();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(fAuth, (user) => {
      if (!user) {
        router.push("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup function to unsubscribe from the listener
  }, []);
  if (loading) {
    return <Loading />; // Render the Loading component while loading
  }

  return (
    <>
      <div className={styles.container}>
        <ToastContainer />
        <div className={styles.menu}>
          <Sidebar />
        </div>
        <div className={styles.content}>
          <Navbar />
          {children}
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Layout;
