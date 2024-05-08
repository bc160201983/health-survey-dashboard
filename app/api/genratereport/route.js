import { Parser } from "json2csv";
import { db } from "../../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export async function POST(request) {
  try {
    const { startDate, endDate, status } = await request.json();

    console.log("Received request:", {
      startDate,
      endDate,
      status,
    });

    // Build the base query for survey responses
    const surveyResponsesRef = collection(db, "SurveyResponses");
    let queryConstraints = [];

    // Add optional query constraints if provided
    if (startDate && endDate) {
      queryConstraints.push(
        where("timestamp", ">=", new Date(startDate)),
        where("timestamp", "<=", new Date(endDate))
      );
    }

    if (status) {
      queryConstraints.push(where("status", "==", status));
    }

    // Execute the query to fetch survey responses
    const surveyResponsesQuery = query(surveyResponsesRef, ...queryConstraints);
    const surveyResponsesSnapshot = await getDocs(surveyResponsesQuery);
    const surveyResponses = surveyResponsesSnapshot.docs.map((doc) =>
      doc.data()
    );

    // Fetch survey questions
    const surveyIds = [
      ...new Set(surveyResponses.map((response) => response.surveyId)),
    ];
    const surveysRef = collection(db, "Surveys");
    const surveyQuestions = [];

    for (const surveyId of surveyIds) {
      const surveyQuery = query(surveysRef, where("__name__", "==", surveyId));
      const surveySnapshot = await getDocs(surveyQuery);
      const surveyData = surveySnapshot.docs[0].data();
      surveyQuestions.push(surveyData.questions); // Push questions array into surveyQuestions
    }

    // Prepare CSV data
    const csvData = surveyResponses.map((response) => {
      const rowData = {
        surveyId: response.surveyId,
        timestamp: response.timestamp ? response.timestamp.toDate() : "",
        status: response.status || "",
      };

      // Iterate through each question and add its selected response to the CSV row
      surveyQuestions.forEach((questions) => {
        questions.forEach((question) => {
          const answer = response.answers.find(
            (answer) => answer.questionId === question.questionId
          );
          rowData[question.question] = answer
            ? answer.selectedOptions.join(", ")
            : "";
        });
      });

      return rowData;
    });

    // Extract all unique questions from surveyQuestions
    const allQuestions = surveyQuestions.reduce(
      (acc, curr) => [...acc, ...curr],
      []
    );
    const uniqueQuestions = Array.from(
      new Set(allQuestions.map((question) => question.question))
    );

    // Define fields for CSV
    const fields = ["surveyId", "timestamp", "status", ...uniqueQuestions];
    const opts = { fields };

    // Generate CSV
    const parser = new Parser(opts);
    const csv = parser.parse(csvData);

    // Return CSV as response
    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename=survey_responses.csv`,
      },
    });
  } catch (error) {
    console.error("Error generating CSV:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to generate CSV" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
