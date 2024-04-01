"use client";
// DevicesPage.jsx
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "@/app/ui/dashboard/products/products.module.css";
import db from "@/app/lib/firebase";
import { collection, getDocs, query } from "firebase/firestore";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
const DevicesPage = () => {
  const [deviceData, setDeviceData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchDevices = async () => {
      const snapshot = await getDocs(collection(db, "SurveyResponses"));
      const devices = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        const existingDevice = devices.find(
          (device) => device.deviceId === data.deviceUUID
        );

        if (existingDevice) {
          existingDevice.times.push(data.timestamp);
        } else {
          devices.push({ deviceId: data.deviceUUID, times: [data.timestamp] });
        }
      });

      // Sort by the first timestamp for simplicity, you might want to adjust this
      devices.forEach((device) =>
        device.times.sort((a, b) => a.toDate() - b.toDate())
      );

      setDeviceData(devices);
    };

    fetchDevices();
  }, []);

  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        backgroundColor: "#182237",
        marginTop: "20px",
      }}
    >
      <Typography variant="h6" sx={{ margin: 2, color: "white" }}>
        Devices That Completed Surveys
      </Typography>
      <TableContainer component={Paper} sx={{ backgroundColor: "#182237" }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "white" }}>Device ID</TableCell>
              <TableCell sx={{ color: "white" }}>First Survey Time</TableCell>
              <TableCell sx={{ color: "white" }}>Last Survey Time</TableCell>
              <TableCell sx={{ color: "white" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deviceData.map(({ deviceId, times }) => (
              <TableRow key={deviceId}>
                <TableCell sx={{ color: "white" }}>{deviceId}</TableCell>
                <TableCell sx={{ color: "white" }}>
                  {times[0]?.toDate().toLocaleString()}
                </TableCell>
                <TableCell sx={{ color: "white" }}>
                  {times[times.length - 1]?.toDate().toLocaleString()}
                </TableCell>
                <TableCell>
                  <Typography
                    component="a"
                    href={`/dashboard/responses/${deviceId}`}
                    sx={{
                      cursor: "pointer",
                      textDecoration: "underline",
                      color: "primary.main",
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      router.replace(`/dashboard/responses/${deviceId}`);
                    }}
                  >
                    View Responses
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default DevicesPage;
