"use client";
// import { cards } from "../lib/data";
import { useEffect, useState } from "react";
import Card from "../ui/dashboard/card/card";
import Chart from "../ui/dashboard/chart/chart";
import styles from "../ui/dashboard/dashboard.module.css";
import Rightbar from "../ui/dashboard/rightbar/rightbar";
import Transactions from "../ui/dashboard/transactions/transactions";
import { collection, query, getDocs, where } from "firebase/firestore";
import db from "../lib/firebase";

const Dashboard = () => {
  const [cards, setCards] = useState([]);

  const fetchCardsData = async () => {
    const cards = []; // Initialize an empty array to store the fetched data

    try {
      // Fetch total surveys count
      const surveysQuery = query(collection(db, "Surveys"));
      const surveysSnapshot = await getDocs(surveysQuery);
      const totalSurveys = surveysSnapshot.size;

      // Fetch completed surveys count
      const completedSurveysQuery = query(
        collection(db, "SurveyResponses"),
        where("status", "==", "completed")
      );
      const completedSurveysSnapshot = await getDocs(completedSurveysQuery);
      const completedSurveys = completedSurveysSnapshot.size;

      // Fetch unique devices count
      const devicesQuery = query(collection(db, "notificationToken")); // Assuming you have a "Devices" collection
      const devicesSnapshot = await getDocs(devicesQuery);
      const uniqueDevices = devicesSnapshot.size;

      // Update the cards array with the fetched data
      cards.push({
        id: 1,
        title: "Total Surveys",
        number: totalSurveys,
      });
      cards.push({
        id: 2,
        title: "Completed Surveys",
        number: completedSurveys,
      });
      cards.push({
        id: 3,
        title: "Unique Device",
        number: uniqueDevices,
      });

      console.log("Cards Data:", cards); // Log the updated cards array
    } catch (error) {
      console.error("Error fetching cards data:", error);
    }

    console.log(cards);

    return cards;
  };

  useEffect(() => {
    async function fetchData() {
      const fetchedCards = await fetchCardsData();
      setCards(fetchedCards);
    }

    fetchData();
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <div className={styles.cards}>
          {cards.map((item) => (
            <Card item={item} key={item.id} />
          ))}
        </div>
        <Transactions />
        <Chart />
      </div>
      <div className={styles.side}>
        <Rightbar />
      </div>
    </div>
  );
};

export default Dashboard;
