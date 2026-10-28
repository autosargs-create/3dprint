/**
 * Cloudflare Pages Function: /api/order
 * Direct integration with Telegram Bot for instant notifications and STL delivery.
 */
const BOT_TOKEN = "1146884292:AAFn_XbnkX6d_bcyTWfhS2ZULswQPBQmYCM";
const CHAT_ID = "1283122537";

export async function onRequestPost(context) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept",
    "Content-Type": "application/json; charset=utf-8"
  };

  try {
    const formData = await context.request.formData();

    const orderId = formData.get("order_id") || `#3D-${Math.floor(1000 + Math.random() * 9000)}`;
    const clientName = formData.get("client_name") || "Nav norādīts";
    const clientPhone = formData.get("client_phone") || "Nav norādīts";
    const clientEmail = formData.get("client_email") || "Nav norādīts";
    const delivery = formData.get("delivery") || "Nav norādīts";
    const deliveryAddress = formData.get("delivery_address") || "Nav norādīta";
    const notes = formData.get("notes") || "Nav norādīti";

    const modelName = formData.get("model_name") || "model.stl";
    const dimensions = formData.get("dimensions") || "N/A";
    const weight = formData.get("weight") || "N/A";
    const volume = formData.get("volume") || "N/A";
    const material = formData.get("material") || "N/A";
    const infill = formData.get("infill") || "N/A";
    const layerHeight = formData.get("layer_height") || "N/A";
    const quantity = formData.get("quantity") || "1 gab.";
    const totalPrice = formData.get("total_price") || "0.00 €";
    const orderTime = formData.get("order_time") || new Date().toLocaleString("lv-LV");

    const attachment = formData.get("attachment");

    // 1. Build Telegram text notification
    const messageText = 
`🚀 *JAUNS 3D DRUKAS PASŪTĪJUMS!*
━━━━━━━━━━━━━━━━━━━━
🆔 *ID:* \`${orderId}\`
👤 *Klients:* ${clientName}
📞 *Tālrunis:* \`${clientPhone}\`
✉️ *E-pasts:* ${clientEmail}

📦 *Piegāde:* ${delivery}
📍 *Adrese / Pakomāts:* ${deliveryAddress}

📐 *Modelis:* \`${modelName}\`
📏 *Izmēri:* ${dimensions}
⚖️ *Svars / Tilpums:* ${weight} (${volume})
🧵 *Materiāls:* ${material}
🧱 *Pildījums:* ${infill} | Slānis: ${layerHeight}
🔢 *Skaits:* ${quantity}

💰 *KOPĒJĀ SUMMA:* *${totalPrice}*
💬 *Klienta piezīmes:* ${notes}
⏰ *Laiks:* ${orderTime}
━━━━━━━━━━━━━━━━━━━━
🌐 *Vietne:* https://3dlab.jonyz.org`;

    // 2. Send Telegram message
    const msgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: messageText,
        parse_mode: "Markdown"
      })
    });

    const msgJson = await msgRes.json();
    if (!msgJson.ok) {
      console.error("Telegram sendMessage failed:", msgJson);
    }

    // 3. Send STL file attachment if present
    if (attachment && typeof attachment === "object" && typeof attachment.size === "number" && attachment.size > 0) {
      try {
        const tgDocData = new FormData();
        tgDocData.append("chat_id", CHAT_ID);
        tgDocData.append("document", attachment, modelName);
        tgDocData.append("caption", `📁 3D Modelis pasūtījumam ${orderId}\n👤 ${clientName} (${totalPrice})`);

        const docRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, {
          method: "POST",
          body: tgDocData
        });

        const docJson = await docRes.json();
        if (!docJson.ok) {
          console.error("Telegram sendDocument failed:", docJson);
        }
      } catch (docErr) {
        console.error("Failed to forward attachment to Telegram:", docErr);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      orderId: orderId,
      message: "Pasūtījums veiksmīgi pieņemts un nosūtīts!"
    }), { status: 200, headers: corsHeaders });

  } catch (err) {
    console.error("Order processing error:", err);
    return new Response(JSON.stringify({
      success: false,
      message: err.message || "Neizdevās apstrādāt pasūtījumu"
    }), { status: 500, headers: corsHeaders });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Accept"
    }
  });
}
