// pages/api/contact.ts
import type { NextApiRequest, NextApiResponse } from "next";

// Contoh: hanya log ke console.
// Nanti kamu bisa ganti --> kirim email via nodemailer, simpan ke MongoDB, dsb.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, email, message } = req.body;
    
    // TODO: kirim ke email atau simpan ke DB
    console.log("📩 Pesan baru:", { name, email, message });

    return res.status(200).json({ success: true });
  }

  res.setHeader("Allow", ["POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
