"use client";
import { useState, useEffect } from "react";
import Link from "next/link"; // Import the Link component

export default function Home() {
  const [rating, setRating] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [feedbackList, setFeedbackList] = useState<
    { id: number; rating: string; comment: string; status: string }[]
  >([]);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch("/api/feedback");
        if (response.ok) {
          const data = await response.json();
          // Filter only approved feedback
          const approvedFeedback = data.filter(
            (item: { status: string }) => item.status === "Approved"
          );
          setFeedbackList(approvedFeedback);
        }
      } catch (error) {
        console.error("Error fetching feedback", error);
      }
    };
    fetchFeedback();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, comment }),
    });

    if (response.ok) {
      alert("Feedback submitted!");
      setRating("");
      setComment("");
    } else {
      alert("Error submitting feedback. Please try again.");
    }
  };

  // Compute the average of the approved ratings
  const computeAverageRating = () => {
    if (feedbackList.length === 0) return 0; // No feedback, return 0
    const totalRating = feedbackList.reduce((sum, feedback) => sum + parseInt(feedback.rating), 0);
    return (totalRating / feedbackList.length).toFixed(2); // Calculate average and round to 2 decimal places
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      {/* Link to Admin Dashboard */}
      <Link href="/admin" style={{ marginBottom: "20px", display: "block" }}>
        Go to Admin Dashboard
      </Link>

      <h1>Submit Your Feedback</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>
            Rating (1 to 5):
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
              style={{ marginLeft: "10px" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>
            Comment:
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              style={{ display: "block", width: "100%", marginTop: "5px" }}
            />
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>

      <h2 style={{ marginTop: "30px" }}>Approved Feedback</h2>
      {feedbackList.length === 0 ? (
        <p>No approved feedback yet.</p>
      ) : (
        <div>
          <p>
            <strong>Average Rating:</strong> {computeAverageRating()}
          </p>
          <ul>
            {feedbackList.map((feedback) => (
              <li key={feedback.id}>
                <strong>Rating:</strong> {feedback.rating} |{" "}
                <strong>Comment:</strong> {feedback.comment}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
