"use client";
import React, { useEffect, useState } from "react";
import styles from "@/app/ui/dashboard/surveys/AddSurvey/AddSurvey.module.css";
import { v4 as uuidv4 } from "uuid";

import { useRouter } from "next/navigation";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/app/lib/firebase";

const EditSurveyPage = ({ params }) => {
  const { id } = params;
  const [survey, setSurvey] = useState({
    title: "",
    description: "",
    questions: [],
  });

  const router = useRouter();

  useEffect(() => {
    const fetchSurvey = async () => {
      const surveyRef = doc(db, "Surveys", id);
      const surveyDoc = await getDoc(surveyRef);

      if (surveyDoc.exists()) {
        const surveyData = surveyDoc.data();
        const questionsWithOptions = surveyData.questions.map((question) => ({
          ...question,
          options: question.options.map((option) => ({ text: option })),
        }));
        setSurvey({ ...surveyData, questions: questionsWithOptions });
      } else {
        console.log("Survey not found");
      }
    };

    fetchSurvey();
  }, [id]);
  const addQuestion = () => {
    const newQuestions = [
      ...survey.questions,
      { question: "", options: [{ text: "" }, { text: "" }] }, // Start with two options for a new question
    ];
    setSurvey({ ...survey, questions: newQuestions });
  };

  const addOption = (questionIndex) => {
    const updatedQuestions = survey.questions.map((question, idx) => {
      if (idx === questionIndex) {
        return { ...question, options: [...question.options, { text: "" }] };
      }
      return question;
    });
    setSurvey({ ...survey, questions: updatedQuestions });
  };

  const removeOption = (questionIndex, optionIndex) => {
    const updatedQuestions = survey.questions.map((question, idx) => {
      if (idx === questionIndex) {
        const updatedOptions = question.options.filter(
          (_, optIdx) => optIdx !== optionIndex
        );
        return { ...question, options: updatedOptions };
      }
      return question;
    });
    setSurvey({ ...survey, questions: updatedQuestions });
  };

  const handleQuestionChange = (index, event) => {
    const updatedQuestions = survey.questions.map((question, idx) => {
      if (idx === index) {
        return { ...question, [event.target.name]: event.target.value };
      }
      return question;
    });
    setSurvey({ ...survey, questions: updatedQuestions });
  };

  const handleOptionChange = (questionIndex, optionIndex, event) => {
    const updatedQuestions = survey.questions.map((question, idx) => {
      if (idx === questionIndex) {
        const updatedOptions = question.options.map((option, oIdx) => {
          if (oIdx === optionIndex) {
            return { ...option, text: event.target.value };
          }
          return option;
        });
        return { ...question, options: updatedOptions };
      }
      return question;
    });
    setSurvey({ ...survey, questions: updatedQuestions });
  };

  const handleSurveyChange = (event) => {
    const { name, value } = event.target;
    setSurvey((prevSurvey) => ({
      ...prevSurvey,
      [name]: value,
    }));
  };
  const removeQuestion = (questionIndex) => {
    // Filter out the question at the specific index
    const updatedQuestions = survey.questions.filter(
      (_, idx) => idx !== questionIndex
    );
    // Update state with the new questions array
    setSurvey({ ...survey, questions: updatedQuestions });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const surveyData = {
      title: survey.title,
      description: survey.description,
      status: survey.status || "available",
      questions: survey.questions.map((question) => ({
        ...question,
        options: question.options.map((option) => option.text),
      })),
    };

    try {
      const surveyRef = doc(db, "Surveys", id);
      await updateDoc(surveyRef, surveyData);
      console.log("Survey updated successfully");
      router.push("/dashboard/surveys");
      toast.success("Survey and questions Updated successfully", {
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
      console.error("Error updating survey: ", error);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Survey Title"
          name="title"
          required
          value={survey.title}
          onChange={handleSurveyChange}
          className={styles.input}
        />
        <textarea
          name="description"
          rows="4"
          placeholder="Survey Description"
          required
          value={survey.description}
          onChange={handleSurveyChange}
          className={styles.textarea}
        ></textarea>
        {survey.questions.map((question, index) => (
          <div key={index} className={styles.questionContainer}>
            <input
              type="text"
              placeholder="Question"
              name="question"
              value={question.question}
              onChange={(event) => handleQuestionChange(index, event)}
              className={styles.input}
            />
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className={styles.optionContainer}>
                <input
                  type="text"
                  placeholder="Option"
                  value={option.text}
                  onChange={(event) =>
                    handleOptionChange(index, optionIndex, event)
                  }
                  className={styles.input}
                />
                <button
                  type="button"
                  onClick={() => removeOption(index, optionIndex)}
                  className={styles.button}
                >
                  Remove Option
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addOption(index)}
              className={styles.button}
            >
              Add Option
            </button>
            <button
              type="button"
              onClick={() => removeQuestion(index)}
              className={styles.button}
            >
              Remove Question
            </button>
          </div>
        ))}
        <button type="button" onClick={addQuestion} className={styles.button}>
          Add Question
        </button>
        <button type="submit" className={styles.submitButton}>
          Update Survey
        </button>
      </form>
    </div>
  );
};

export default EditSurveyPage;
