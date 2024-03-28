import { Parser } from "json2csv";
import db from "../../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export async function POST(request) {
  const { deviceId, startDate, endDate, status } = await request.json();

  try {
    const surveyResponsesRef = collection(db, "SurveyResponses");
    let queryConstraints = [where("deviceUUID", "==", deviceId)];

    if (startDate && endDate) {
      queryConstraints.push(where("timestamp", ">=", new Date(startDate)));
      queryConstraints.push(where("timestamp", "<=", new Date(endDate)));
    }

    if (status) {
      queryConstraints.push(where("status", "==", status));
    }

    const surveyResponsesQuery = query(surveyResponsesRef, ...queryConstraints);
    const surveyResponsesSnapshot = await getDocs(surveyResponsesQuery);
    const surveyResponses = surveyResponsesSnapshot.docs.map((doc) =>
      doc.data()
    );

    // Fetch survey questions and create a mapping of survey ID to questions
    const surveyIds = [
      ...new Set(surveyResponses.map((response) => response.surveyId)),
    ];
    const surveysRef = collection(db, "Surveys");
    const surveyQuestions = {};

    for (const surveyId of surveyIds) {
      const surveyQuery = query(surveysRef, where("__name__", "==", surveyId));
      const surveySnapshot = await getDocs(surveyQuery);
      const surveyData = surveySnapshot.docs[0].data();
      surveyQuestions[surveyId] = surveyData.questions;
    }

    // Prepare the data for CSV export
    const csvData = surveyResponses.map((response) => {
      const { surveyId, answers } = response;
      const questions = surveyQuestions[surveyId];

      const questionAnswers = questions.reduce((acc, question) => {
        const answer = answers.find(
          (answer) => answer.questionId === question.questionId
        );
        acc[question.question] = answer
          ? answer.selectedOptions.join(", ")
          : "";
        return acc;
      }, {});

      return {
        ...response,
        ...questionAnswers,
      };
    });

    const fields = [
      "surveyId",
      "deviceUUID",
      "timestamp",
      "status",
      ...Object.keys(
        surveyQuestions[surveyIds[0]].map((question) => question.question)
      ),
    ];
    const opts = { fields };

    const parser = new Parser(opts);
    const csv = parser.parse(csvData);

    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename=survey_responses_${deviceId}.csv`,
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
