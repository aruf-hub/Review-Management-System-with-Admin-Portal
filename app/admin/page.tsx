"use client";
import { useState, useEffect } from "react";

export default function AdminPage() {
  const [feedbackList, setFeedbackList] = useState<
    { id: number; rating: string; comment: string; status: string }[]
  >([]);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch("/api/feedback");
        if (response.ok) {
          const data = await response.json();
          setFeedbackList(data);
        }
      } catch (error) {
        console.error("Error fetching feedback", error);
      }
    };
    fetchFeedback();
  }, []);

  const handleDelete = async (id: number) => {
    const response = await fetch(`/api/feedback?id=${id}`, {
      method: "DELETE",
    });
    
    if (response.ok) {
      setFeedbackList((prev) => prev.filter((item) => item.id !== id));
      alert("Deleted successfully.");
    } else {
      alert("Error while deleting.");
    }
  };

  const handleApprove = async (id: number) => {
    const response = await fetch(`/api/feedback`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      setFeedbackList((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "Approved" } : item
        )
      );
      alert("Approved successfully.");
    } else {
      alert("Error while approving.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>Admin Dashboard - Manage Feedback</h1>
      {feedbackList.length === 0 ? (
        <p>No feedback available</p>
      ) : (
        <ul>
          {feedbackList.map((feedback) => (
            <li key={feedback.id}>
              <strong>Rating:</strong> {feedback.rating} |{" "}
              <strong>Comment:</strong> {feedback.comment} |{" "}
              <strong>Status:</strong> {feedback.status}
              <div>
                {feedback.status === "Pending" && (
                  <button
                    onClick={() => handleApprove(feedback.id)}
                    style={{ marginRight: "10px" }}
                  >
                    Approve
                  </button>
                )}
                <button onClick={() => handleDelete(feedback.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
