"use client";
// DeviceSurveysPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import styles from "@/app/ui/dashboard/products/products.module.css";
import modalStyles from "@/app/ui/modalStyles.module.css";
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
import Link from "next/link";
import db from "@/app/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";

// Modal style
const modalStyle = {
  position: "absolute",

  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxHeight: "90vh",
  overflow: "scroll",
  bgcolor: "#182237",
  color: "white",
  boxShadow: 24,
  p: 4,
};

const DeviceSurveysPage = () => {
  const [surveys, setSurveys] = useState([]);
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [surveyResponses, setSurveyResponses] = useState([]);
  // Your existing state and useEffect logic here
  const [open, setOpen] = useState(false);
  const [currentSurveyDetails, setCurrentSurveyDetails] = useState(null);

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

  const handleViewResponse = async (response) => {
    // Fetch survey details for the selected response
    const surveyRef = doc(db, "Surveys", response.surveyId);
    const surveySnapshot = await getDoc(surveyRef);

    if (surveySnapshot.exists()) {
      const surveyData = surveySnapshot.data();
      // Set the current survey details and response in the state
      setCurrentSurveyDetails({ ...surveyData, response });
      setOpen(true);
    }
  };

  const handleOpen = async (surveyResponse) => {
    const surveyRef = doc(db, "Surveys", surveyResponse.surveyId);
    const surveySnap = await getDoc(surveyRef);

    if (surveySnap.exists()) {
      setCurrentSurveyDetails({
        id: surveySnap.id,
        ...surveySnap.data(),
        ...surveyResponse,
      });
      setOpen(true);
    } else {
      console.error("Survey details not found");
    }
  };

  const handleClose = () => setOpen(false);
  const handleSendNotification = (surveyId) => {
    // Placeholder function to simulate sending a notification
    console.log(`Sending notification for surveyId: ${surveyId}`);
    // Implement the actual notification logic here
    alert(`Notification sent for survey ${surveyId}`);
  };
  const handleStatusChange = () => {};

  const handleDownloadCSV = async () => {
    try {
      const response = await fetch("/api/downloadSurveyResponses/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deviceId,
          startDate: selectedStartDate,
          endDate: selectedEndDate,
          status: selectedStatus,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `survey_responses_${deviceId}.csv`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      } else {
        console.error("Error downloading CSV");
      }
    } catch (error) {
      console.error("Error downloading CSV:", error);
    }
  };
  return (
    <>
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
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TextField
              label="From Date"
              type="date"
              value={selectedStartDate}
              onChange={(e) => setSelectedStartDate(e.target.value)}
              sx={{
                margin: 2,
                backgroundColor: "#ffffff",
                borderRadius: 1,
                "& .MuiInputLabel-root": { color: "white" },
                "& .MuiInputBase-input": { color: "#182237" },
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="To Date"
              type="date"
              value={selectedEndDate}
              onChange={(e) => setSelectedEndDate(e.target.value)}
              sx={{
                margin: 2,
                backgroundColor: "#ffffff",
                borderRadius: 1,
                "& .MuiInputLabel-root": { color: "white" },
                "& .MuiInputBase-input": { color: "#182237" },
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <FormControl sx={{ margin: 2, minWidth: 120 }}>
              <InputLabel id="status-select-label" sx={{ color: "white" }}>
                Status
              </InputLabel>
              <Select
                labelId="status-select-label"
                id="status-select"
                value={selectedStatus}
                label="Status"
                onChange={(e) => setSelectedStatus(e.target.value)}
                sx={{
                  backgroundColor: "#ffffff",
                  color: "white",
                  borderRadius: 1,
                  "& .MuiSelect-icon": { color: "#182237" },
                  "& .MuiSelect-root": { color: "#182237" },
                }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="success"
              sx={{ margin: 2 }}
              onClick={handleDownloadCSV}
            >
              Download CSV
            </Button>
          </Box>
        </Box>
        <TableContainer component={Paper} sx={{ backgroundColor: "#182237" }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "white" }}>Survey ID</TableCell>
                <TableCell sx={{ color: "white" }}>Device ID</TableCell>
                <TableCell sx={{ color: "white" }}>Start Time</TableCell>
                <TableCell sx={{ color: "white" }}>Status</TableCell>
                <TableCell sx={{ color: "white" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {surveyResponses.map((response) => (
                <TableRow
                  key={response.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell sx={{ color: "white" }}>
                    {response.surveyId}
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>
                    {response.deviceUUID}
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>
                    {response.startTime?.toDate().toDateString()}
                  </TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        backgroundColor:
                          response.status === "completed" ? "green" : "red",
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        display: "inline-block",
                      }}
                    >
                      {response.status}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleViewResponse(response)}
                      sx={{ mr: 1 }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className={modalStyles.modal}
      >
        <Box
          className={modalStyles.modalContent}
          sx={{
            bgcolor: "#182237",
            color: "white",
          }}
        >
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            className={modalStyles.modalTitle}
          >
            {currentSurveyDetails?.title}
          </Typography>
          <Typography
            id="modal-modal-description"
            className={modalStyles.modalDescription}
          >
            {currentSurveyDetails?.description}
          </Typography>
          {/* Render selected answers */}
          {currentSurveyDetails?.questions.map((question, index) => (
            <div key={index}>
              <Typography variant="subtitle1">{question.question}</Typography>
              <ul>
                {question.options.map((option, optionIndex) => (
                  <li key={optionIndex}>
                    {option}
                    {currentSurveyDetails.response?.answers?.some(
                      (answer) =>
                        answer.questionId === question.questionId &&
                        answer.selectedOptions.includes(option)
                    ) && <span> (Selected)</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Box>
      </Modal>
    </>
  );
};

export default DeviceSurveysPage;