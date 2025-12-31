import { notFound } from "next/navigation";
import dbConnect from "@/lib/db";
import Paste from "@/models/Paste";

export const dynamic = "force-dynamic";

export default async function PastePage({ params }) {
  const { id } = await params;

  await dbConnect();
  const now = Date.now();

  const paste = await Paste.findOneAndUpdate(
    {
      _id: id,
      $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
      $expr: {
        $or: [
          { $eq: ["$maxViews", null] },
          { $lt: ["$currentViews", "$maxViews"] }
        ]
      }
    },
    { $inc: { currentViews: 1 } },
    { new: true }
  ).lean();

  if (!paste) {
    notFound();
  }

  return (
    <main style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Paste</h1>

      <pre
        style={{
          background: "#111",
          color: "#0f0",
          padding: "1rem",
          borderRadius: "8px",
          whiteSpace: "pre-wrap",
        }}
      >
        {paste.content}
      </pre>

      <p style={{ marginTop: "1rem", color: "#666" }}>
        Views: {paste.currentViews}
      </p>
    </main>
  );
}
