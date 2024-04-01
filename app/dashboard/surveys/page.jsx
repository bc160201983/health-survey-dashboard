"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "@/app/ui/dashboard/products/products.module.css";
import db from "@/app/lib/firebase"; // Ensure this path points to your Firebase config file
import { collection, getDocs, onSnapshot, query } from "firebase/firestore";
import {
  Modal,
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const SurveyPage = () => {
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(
      collection(db, "Surveys"),
      (querySnapshot) => {
        const surveysArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate().toDateString(),
        }));
        setSurveys(surveysArray);
      }
    );

    // Cleanup function to unsubscribe from the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <div className={styles.container}>
      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          backgroundColor: "#182237",
          marginTop: "20px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 2,
            bgcolor: "#182237",
            color: "white",
            padding: 2,
          }}
        >
          <Typography variant="h6">Surveys</Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button
              variant="contained"
              color="success"
              component={Link}
              href="/dashboard/surveys/add"
              sx={{ margin: 2 }}
            >
              Add Survey
            </Button>
          </Box>
        </Box>
        <TableContainer component={Paper} sx={{ backgroundColor: "#182237" }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "white" }}>Title</TableCell>
                <TableCell sx={{ color: "white" }}>Description</TableCell>
                <TableCell sx={{ color: "white" }}>Created At</TableCell>
                <TableCell sx={{ color: "white" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {surveys.map((survey) => (
                <TableRow
                  key={survey.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell sx={{ color: "white" }}>{survey.title}</TableCell>
                  <TableCell sx={{ color: "white" }}>
                    {survey.description}
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>
                    {survey.createdAt}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      component={Link}
                      href={`/dashboard/surveys/${survey.id}`}
                      sx={{ mr: 1 }}
                    >
                      View
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      component={Link}
                      href={`/dashboard/surveys/edit/${survey.id}`}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      component={Link}
                      href={`/dashboard/surveys/${survey.id}`}
                      sx={{ mr: 1 }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
};

export default SurveyPage;
