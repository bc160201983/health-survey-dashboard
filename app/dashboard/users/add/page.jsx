"use client";
import { useState } from "react"; // Import useState hook
import { db, fAuth } from "@/app/lib/firebase";
import styles from "@/app/ui/dashboard/users/addUser/addUser.module.css";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/navigation";

const AddUserPage = () => {
  const router = useRouter();
  const [error, setError] = useState(null); // State for storing error

  const addUser = async (formData) => {
    const { username, email, password, phone, address, isAdmin, isActive } =
      Object.fromEntries(formData);

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        fAuth,
        email,
        password
      );
      const user = userCredential.user;

      // Store additional user data in Firestore
      const userData = {
        username,
        email,
        phone,
        address,
        isAdmin,
        isActive,
        // Add any other user data you want to store
      };

      await addDoc(collection(db, "users"), userData);
      router.push("/dashboard/users"); // Redirect using Next.js router
      console.log("User created successfully:", user);
    } catch (err) {
      console.error("Error creating user:", err);
      setError("Failed to create user. Please try again."); // Set error message
    }
  };

  return (
    <div className={styles.container}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addUser(new FormData(e.target));
        }}
        className={styles.form}
      >
        {error && <div className={styles.error}>{error}</div>}{" "}
        {/* Display error message */}
        <input type="text" placeholder="username" name="username" required />
        <input type="email" placeholder="email" name="email" required />
        <input
          type="password"
          placeholder="password"
          name="password"
          required
        />
        <input type="phone" placeholder="phone" name="phone" />
        <select name="isAdmin" id="isAdmin">
          <option value={false}>Is Admin?</option>
          <option value={true}>Yes</option>
          <option value={false}>No</option>
        </select>
        <select name="isActive" id="isActive">
          <option value={true}>Is Active?</option>
          <option value={true}>Yes</option>
          <option value={false}>No</option>
        </select>
        <textarea
          name="address"
          id="address"
          rows="16"
          placeholder="Address"
        ></textarea>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddUserPage;
