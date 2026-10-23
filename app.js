/**
 * MLBB BETA WhatsApp Bot — starter using the official WhatsApp Cloud API.
 * Requires Node.js 18+ and a Meta WhatsApp Cloud API app.
 */
const express = require("express");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "ganti_token_verifikasi_ini";
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const GRAPH_API_VERSION = process.env.GRAPH_API_VERSION || "v23.0";
const ADMIN_NUMBER = "6285797591577"; // Indonesia format, no leading 0

const menuText = `🩵 *MLBB BETA — MENU OTOMATIS* 🩵

Haii! Selamat datang di MLBB BETA 🎮✨
Pilih menu dengan mengetik angka:

1️⃣ Harga akun
2️⃣ Metode pembayaran
3️⃣ Request cabang
4️⃣ Chat admin

Ketik *menu* kapan saja untuk melihat pilihan ini lagi.`;

function replyFor(message) {
  const text = (message || "").trim().toLowerCase();

  if (["hai", "halo", "hello", "hi", "assalamualaikum", "p"].includes(text)) {
    return `Haii, welcome di *MLBB BETA*! 💙🎮\nPesan kamu sudah masuk. Ada yang bisa kami bantu?\n\n${menuText}`;
  }

  if (["menu", "start", "mulai", "help", "bantuan"].includes(text)) {
    return menuText;
  }

  if (["1", "harga", "price", "akun", "akun beta"].includes(text)) {
    return `💎 *DAFTAR HARGA MLBB BETA*\n\n⭐ 3 cabang: *Rp6.000*\n🌟 6 cabang: *Rp12.000*\n\nMau pesan? Ketik *4* untuk menghubungi admin.\n\nKetik *menu* untuk kembali ke menu utama.`;
  }

  if (["2", "pembayaran", "bayar", "payment", "metode pembayaran"].includes(text)) {
    return `💳 *METODE PEMBAYARAN*\n\nPembayaran tersedia melalui:\n• DANA\n• OVO\n• GoPay\n• ShopeePay\n• Transfer bank\n\n🚫 Tidak menerima pulsa.\n\nUntuk detail pembayaran, silakan hubungi admin dengan mengetik *4*.\n\nKetik *menu* untuk kembali.`;
  }

  if (["3", "request", "cabang", "request cabang"].includes(text)) {
    return `🎮 *REQUEST AKUN BETA*\n\nKamu boleh request jumlah cabang, maksimal *10 cabang* untuk saat ini.\n\nKirim detail request kamu atau ketik *4* untuk chat admin.\n\nKetik *menu* untuk kembali.`;
  }

  if (["4", "admin", "cs", "owner", "hubungi admin", "chat admin"].includes(text)) {
    return `👨‍💻 *HUBUNGI ADMIN MLBB BETA*\n\nWhatsApp admin: https://wa.me/${ADMIN_NUMBER}\n\nSilakan klik tautan di atas untuk melanjutkan chat dengan admin. 💙`;
  }

  return `Maaf, aku belum memahami pesan itu 😅\n\n${menuText}`;
}

async function sendWhatsAppMessage(to, body) {
  if (!ACCESS_TOKEN || !PHONE_NUMBER_ID) {
    console.error("Missing WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID");
    return;
  }

  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${PHONE_NUMBER_ID}/messages`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type: "text",
      text: { preview_url: true, body }
    })
  });

  const data = await response.json();
  if (!response.ok) {
    console.error("WhatsApp API error:", JSON.stringify(data));
  } else {
    console.log("Reply sent to", to);
  }
}

// Meta webhook verification
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// Incoming WhatsApp messages
app.post("/webhook", (req, res) => {
  // Respond quickly to Meta; process message asynchronously.
  res.sendStatus(200);

  try {
    const entries = req.body.entry || [];
    for (const entry of entries) {
      for (const change of (entry.changes || [])) {
        const value = change.value || {};
        for (const msg of (value.messages || [])) {
          if (msg.type !== "text") continue;
          const from = msg.from;
          const body = msg.text?.body || "";
          const answer = replyFor(body);
          sendWhatsAppMessage(from, answer).catch(err => console.error(err));
        }
      }
    }
  } catch (err) {
    console.error("Webhook processing error:", err);
  }
});

app.get("/", (_req, res) => {
  res.send("MLBB BETA WhatsApp bot is running.");
});

app.listen(PORT, () => {
  console.log(`MLBB BETA bot listening on port ${PORT}`);
});
