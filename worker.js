/**
 * Cloudflare Worker for 3dlab.lv
 * Handles static assets and server-side /api/order Telegram integration.
 */

function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function handleOrder(request, env) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept",
    "Content-Type": "application/json; charset=utf-8"
  };

  try {
    const botToken = env.TG_BOT_TOKEN;
    const chatId = env.TG_CHAT_ID || "1283122537";

    if (!botToken) {
      console.error("TG_BOT_TOKEN is not set in Cloudflare environment variables.");
      return new Response(JSON.stringify({
        success: false,
        message: "Servera konfigurācijas kļūda: TG_BOT_TOKEN nav norādīts Cloudflare iestatījumos."
      }), { status: 500, headers: corsHeaders });
    }

    const formData = await request.formData();
    const orderType = formData.get("order_type") || "3D_PRINT";

    const orderId = formData.get("order_id") || (orderType === "FILAMENT_SHOP" ? `#FIL-${Math.floor(1000 + Math.random() * 9000)}` : `#3D-${Math.floor(1000 + Math.random() * 9000)}`);
    const clientName = formData.get("client_name") || "Nav norādīts";
    const clientPhone = formData.get("client_phone") || "Nav norādīts";
    const clientEmail = formData.get("client_email") || "Nav norādīts";
    const delivery = formData.get("delivery") || "Nav norādīts";
    const deliveryAddress = formData.get("delivery_address") || "Nav norādīta";
    const notes = formData.get("notes") || "Nav norādīti";
    const totalPrice = formData.get("total_price") || "0.00 €";
    const orderTime = formData.get("order_time") || new Date().toLocaleString("lv-LV");
    const attachment = formData.get("attachment");
    let modelName = "model.stl";

    let messageText = "";

    if (orderType === "FILAMENT_SHOP") {
      const itemsList = formData.get("items_list") || "";
      const itemsCount = formData.get("items_count") || "1";
      const subtotal = formData.get("subtotal") || "0.00 €";
      const deliveryCost = formData.get("delivery_cost") || "0.00 €";

      messageText = 
`🧵 <b>JAUNS FILAMENTU PASŪTĪJUMS (3dlab.lv Veikals)!</b>
━━━━━━━━━━━━━━━━━━━━
🆔 <b>Pasūtījuma ID:</b> <code>${escapeHtml(orderId)}</code>
👤 <b>Pircējs:</b> ${escapeHtml(clientName)}
📞 <b>Tālrunis:</b> <code>${escapeHtml(clientPhone)}</code>
✉️ <b>E-pasts:</b> ${escapeHtml(clientEmail)}

📦 <b>Piegāde:</b> ${escapeHtml(delivery)}
📍 <b>Pakomāts / Adrese:</b> ${escapeHtml(deliveryAddress)}

🛍️ <b>PASŪTĪTĀS PRECES (${escapeHtml(itemsCount)} gab.):</b>
${itemsList}

💵 <b>Preču summa:</b> ${escapeHtml(subtotal)}
🚚 <b>Piegāde:</b> ${escapeHtml(deliveryCost)}
💰 <b>KOPĀ APMAKSAI:</b> <b>${escapeHtml(totalPrice)}</b>

💬 <b>Pircēja piezīmes:</b> ${escapeHtml(notes)}
⏰ <b>Laiks:</b> ${escapeHtml(orderTime)}
━━━━━━━━━━━━━━━━━━━━
🌐 <b>Veikals:</b> https://3dlab.lv/#shop`;
    } else {
      modelName = formData.get("model_name") || "model.stl";
      const dimensions = formData.get("dimensions") || "N/A";
      const weight = formData.get("weight") || "N/A";
      const volume = formData.get("volume") || "N/A";
      const material = formData.get("material") || "N/A";
      const infill = formData.get("infill") || "N/A";
      const layerHeight = formData.get("layer_height") || "N/A";
      const quantity = formData.get("quantity") || "1 gab.";

      messageText = 
`🚀 <b>JAUNS 3D DRUKAS PASŪTĪJUMS!</b>
━━━━━━━━━━━━━━━━━━━━
🆔 <b>ID:</b> <code>${escapeHtml(orderId)}</code>
👤 <b>Klients:</b> ${escapeHtml(clientName)}
📞 <b>Tālrunis:</b> <code>${escapeHtml(clientPhone)}</code>
✉️ <b>E-pasts:</b> ${escapeHtml(clientEmail)}

📦 <b>Piegāde:</b> ${escapeHtml(delivery)}
📍 <b>Adrese / Pakomāts:</b> ${escapeHtml(deliveryAddress)}

📐 <b>Modelis:</b> <code>${escapeHtml(modelName)}</code>
📏 <b>Izmēri:</b> ${escapeHtml(dimensions)}
⚖️ <b>Svars / Tilpums:</b> ${escapeHtml(weight)} (${escapeHtml(volume)})
🧵 <b>Materiāls:</b> ${escapeHtml(material)}
🧱 <b>Pildījums:</b> ${escapeHtml(infill)} | Slānis: ${escapeHtml(layerHeight)}
🔢 <b>Skaits:</b> ${escapeHtml(quantity)}

💰 <b>KOPĒJĀ SUMMA:</b> <b>${escapeHtml(totalPrice)}</b>
💬 <b>Klienta piezīmes:</b> ${escapeHtml(notes)}
⏰ <b>Laiks:</b> ${escapeHtml(orderTime)}
━━━━━━━━━━━━━━━━━━━━
🌐 <b>Vietne:</b> https://3dlab.lv`;
    }

    // 2. Send Telegram text message
    const msgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageText,
        parse_mode: "HTML"
      })
    });

    const msgJson = await msgRes.json();
    if (!msgJson.ok) {
      console.error("Telegram sendMessage failed:", msgJson);
      return new Response(JSON.stringify({
        success: false,
        message: msgJson.description || "Neizdevās nosūtīt pasūtījumu uz Telegram."
      }), { status: 502, headers: corsHeaders });
    }

    // 3. Send STL file attachment if present
    if (attachment && typeof attachment === "object" && typeof attachment.size === "number" && attachment.size > 0) {
      try {
        const tgDocData = new FormData();
        tgDocData.append("chat_id", chatId);
        tgDocData.append("document", attachment, modelName);
        tgDocData.append("caption", `📁 Modelis pasūtījumam ${orderId}\n👤 ${clientName} (${totalPrice})`);

        const docRes = await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
          method: "POST",
          body: tgDocData
        });

        const docJson = await docRes.json();
        if (!docJson.ok) {
          console.warn("Telegram sendDocument warning:", docJson);
        }
      } catch (docErr) {
        console.warn("Failed to forward attachment to Telegram:", docErr);
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

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Route /api/order requests to backend handler
    if (url.pathname === "/api/order") {
      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Accept"
          }
        });
      }
      if (request.method === "POST") {
        return handleOrder(request, env);
      }
      return new Response("Method Not Allowed", { status: 405 });
    }

    // Serve static assets from Cloudflare edge
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response("Not Found", { status: 404 });
  }
};
