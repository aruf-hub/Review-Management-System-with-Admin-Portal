import { NextResponse } from "next/server";

let feedbackData: { id: number; rating: string; comment: string; status: string }[] = []; // Temporary storage with status

let nextId = 1; // For assigning unique IDs

// Handle POST requests
export async function POST(req: Request) {
    const body = await req.json();
    const { rating, comment } = body;
  
    if (!rating || !comment) {
      return NextResponse.json(
        { message: "Rating and comment are required" },
        { status: 400 }
      );
    }
  
    const id = nextId++;
    feedbackData.push({ id, rating, comment, status: "Pending" });
    
    return NextResponse.json({ id, message: "Feedback submitted successfully" });
  }

// Handle GET requests
export async function GET() {
  return NextResponse.json(feedbackData);
}

// Handle DELETE requests
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get("id") || "", 10);

  if (!id) {
    return NextResponse.json({ message: "ID is required" }, { status: 400 });
  }

  feedbackData = feedbackData.filter((item) => item.id !== id);
  return NextResponse.json({ message: "Feedback deleted successfully" });
}

// Handle PATCH requests (for approving feedback)
export async function PATCH(req: Request) {
  const body = await req.json();
  const { id } = body;

  const feedback = feedbackData.find((item) => item.id === id);
  if (!feedback) {
    return NextResponse.json({ message: "Feedback not found" }, { status: 404 });
  }

  feedback.status = "Approved";
  return NextResponse.json({ message: "Feedback approved successfully" });
}
