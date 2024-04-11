import Navbar from "../ui/dashboard/navbar/navbar";
import Sidebar from "../ui/dashboard/sidebar/sidebar";
import styles from "../ui/dashboard/dashboard.module.css";
import Footer from "../ui/dashboard/footer/footer";
import "../ui/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { Bounce, ToastContainer } from "react-toastify";

const Layout = ({ children }) => {
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
