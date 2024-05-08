"use client";
import { useEffect, useState } from "react";

import Link from "next/link";
import styles from "@/app/ui/dashboard/products/products.module.css";
import { db } from "@/app/lib/firebase"; // Ensure this path points to your Firebase config file
import {
  collection,
  getDoc,
  getDocs,
  onSnapshot,
  doc,
  query,
  deleteDoc,
  where,
  updateDoc,
  orderBy,
} from "firebase/firestore";
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
  TablePagination,
} from "@mui/material";
import { Bounce, toast } from "react-toastify";
import { deleteSurveyNotifications } from "@/app/lib/sendPushNotification";

const SurveyPage = () => {
  const [surveys, setSurveys] = useState([]);
  const [currentSurveyDetails, setCurrentSurveyDetails] = useState(null);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0); // State for current page
  const [rowsPerPage, setRowsPerPage] = useState(5); // State for rows per page

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(
      query(collection(db, "Surveys"), orderBy("createdAt", "desc")),
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
  const handleClose = () => setOpen(false);

  const handleOpen = async (surveyResponse) => {
    console.log(surveyResponse);
    const surveyRef = doc(db, "Surveys", surveyResponse);
    const surveySnap = await getDoc(surveyRef);

    if (surveySnap.exists()) {
      setCurrentSurveyDetails({
        id: surveySnap.id,
        ...surveySnap.data(),
      });
      setOpen(true);
    } else {
      console.error("Survey details not found");
    }
  };
  const handleDelete = async (surveyId) => {
    try {
      await deleteDoc(doc(db, "Surveys", surveyId));
      const responseQuerySnapshot = await getDocs(
        query(
          collection(db, "SurveyResponses"),
          where("surveyId", "==", surveyId)
        )
      );

      const responseDeletionPromises = responseQuerySnapshot.docs.map(
        async (doc) => {
          try {
            await deleteDoc(doc.ref);
            console.log("Survey response deleted successfully");
          } catch (error) {
            console.error("Error deleting survey response:", error);
          }
        }
      );

      // Fetch documents from NotificationTokens collection
      const notificationQuerySnapshot = await getDocs(
        collection(db, "notificationToken")
      );

      const notificationDeletionPromises = notificationQuerySnapshot.docs.map(
        async (doc) => {
          // Get the array of notifications from the document data
          const notifications = doc.data().notifications;

          // Filter out notifications with matching surveyId
          const filteredNotifications = notifications.filter(
            (notification) => notification.surveyId !== surveyId
          );
          console.log(filteredNotifications);
          try {
            // Update the document with the filtered notifications
            await updateDoc(doc.ref, { notifications: filteredNotifications });
            console.log("Notifications deleted successfully");
          } catch (error) {
            console.error("Error deleting notifications:", error);
          }
        }
      );

      await Promise.all([
        ...responseDeletionPromises,
        ...notificationDeletionPromises,
      ]);

      toast.success("Survey and associated data deleted successfully", {
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
      console.error("Error deleting survey and associated data:", error);
    }
  };
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  // Pagination logic to display correct surveys based on current page and rows per page
  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const displayedSurveys = surveys.slice(startIndex, endIndex);

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
            padding: 1,
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
              {displayedSurveys.map((survey) => (
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
                      onClick={() => handleOpen(survey.id)}
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
                      component={Button}
                      onClick={() => handleDelete(survey.id)}
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
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={surveys.length} // Total number of surveys
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ color: "white" }}
        />
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
            Title : {currentSurveyDetails?.title}
          </Typography>
          <hr />
          <Typography
            id="modal-modal-description"
            className={modalStyles.modalDescription}
          >
            Description : {currentSurveyDetails?.description}
          </Typography>
          <hr />
          <div className={modalStyles.questionContainer}>
            {currentSurveyDetails?.questions.map((question, index) => (
              <div key={index} className={modalStyles.question}>
                <Typography
                  variant="subtitle1"
                  className={modalStyles.questionText}
                >
                  {question.question}
                </Typography>
                <ul className={modalStyles.optionList}>
                  {question.options.map((option, optionIndex) => (
                    <li key={optionIndex} className={modalStyles.optionItem}>
                      <span className={modalStyles.optionText}>{option}</span>
                      {currentSurveyDetails?.answers?.some((answer) =>
                        answer.selectedOptions.includes(option)
                      ) && (
                        <span className={modalStyles.selectedOption}>
                          (Selected)
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default SurveyPage;
