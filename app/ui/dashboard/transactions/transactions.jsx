import Image from "next/image";
import styles from "./transactions.module.css";
import { useEffect, useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import Link from "next/link";
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

const Transactions = () => {
  const [surveyResponses, setSurveyResponses] = useState([]);
  const [page, setPage] = useState(0); // State for current page
  const [rowsPerPage, setRowsPerPage] = useState(5); // State for rows per page
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
  const displayedSurveys = surveyResponses.slice(startIndex, endIndex);
  return (
    <>
      {/* <div className={styles.container}>
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
                      <Link
                        href={`/dashboard/responses/${response.deviceUUID}`}
                      >
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
      </div> */}
      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          backgroundColor: "#182237",
          marginTop: "20px",
        }}
      >
        <TableContainer component={Paper} sx={{ backgroundColor: "#182237" }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "white" }}>Device ID</TableCell>
                <TableCell sx={{ color: "white" }}>Status</TableCell>
                <TableCell sx={{ color: "white" }}>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedSurveys.map((response) => (
                <TableRow
                  key={response.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell sx={{ color: "white" }}>
                    <Link href={`/dashboard/responses/${response.deviceUUID}`}>
                      {response.deviceUUID}
                    </Link>
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
                  <TableCell sx={{ color: "white" }}>
                    {response.startTime?.toDate().toDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={surveyResponses.length} // Total number of surveys
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ color: "white" }}
        />
      </Paper>
    </>
  );
};

export default Transactions;
