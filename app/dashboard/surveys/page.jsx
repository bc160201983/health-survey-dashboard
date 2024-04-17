"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "@/app/ui/dashboard/products/products.module.css";
import db from "@/app/lib/firebase"; // Ensure this path points to your Firebase config file
import {
  collection,
  getDoc,
  getDocs,
  onSnapshot,
  doc,
  query,
  deleteDoc,
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
} from "@mui/material";
import { Bounce, toast } from "react-toastify";

const SurveyPage = () => {
  const [surveys, setSurveys] = useState([]);
  const [currentSurveyDetails, setCurrentSurveyDetails] = useState(null);

  const [open, setOpen] = useState(false);
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
      await deleteDoc(doc(db, "SurveyResponses", surveyId));
      toast.success("Survey and questions Deleted successfully", {
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
      setSurveys((prevSurveys) =>
        prevSurveys.filter((survey) => survey.id !== surveyId)
      );
    } catch (error) {
      console.error("Error deleting survey:", error);
    }
  };

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
