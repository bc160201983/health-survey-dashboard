import Image from "next/image";
import styles from "./transactions.module.css";
import { useEffect, useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import db from "@/app/lib/firebase";
import Link from "next/link";

const Transactions = () => {
  const [surveyResponses, setSurveyResponses] = useState([]);
  useEffect(() => {
    const fetchSurveyResponses = async () => {
      const responsesQuery = query(collection(db, "SurveyResponses"));
      const responsesSnapshot = await getDocs(responsesQuery);
      const responsesData = responsesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSurveyResponses(responsesData);
    };

    fetchSurveyResponses();
  }, []);
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Latest Survey Reponses</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Devce ID</td>
            <td>Status</td>
            <td>Date</td>
          </tr>
        </thead>
        <tbody>
          {surveyResponses.map((response, index) => {
            return (
              <tr key={index}>
                <td>
                  <div className={styles.user}>
                    <Image
                      src="/noavatar.png"
                      alt=""
                      width={40}
                      height={40}
                      className={styles.userImage}
                    />
                    <Link href={`/dashboard/responses/${response.deviceUUID}`}>
                      {response.deviceUUID}
                    </Link>
                  </div>
                </td>
                <td>
                  <span className={`${styles.status} ${styles.pending}`}>
                    {response.status}
                  </span>
                </td>
                <td>{response.startTime?.toDate().toDateString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
