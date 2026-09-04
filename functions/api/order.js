/**
 * Cloudflare Pages Function: /api/order
 * Handles 3D print order submissions server-side on edge.
 * Bypasses client-side adblockers and CORS restrictions.
 */
export async function onRequestPost(context) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept",
    "Content-Type": "application/json; charset=utf-8"
  };

  try {
    const orderData = await context.request.json();

    if (!orderData || !orderData["Pasūtījuma ID"]) {
      return new Response(JSON.stringify({
        success: false,
        message: "Nederīgi pasūtījuma dati"
      }), { status: 400, headers: corsHeaders });
    }

    // Forward to FormSubmit from Cloudflare edge with verified domain headers
    const formSubmitRes = await fetch("https://formsubmit.co/ajax/autosargs@gmail.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Referer": "https://3dlab.jonyz.org/",
        "Origin": "https://3dlab.jonyz.org",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) 3DLab/1.0"
      },
      body: JSON.stringify(orderData)
    });

    const responseText = await formSubmitRes.text();
    let result;
    try {
      result = JSON.parse(responseText);
    } catch {
      result = { success: formSubmitRes.ok, message: responseText };
    }

    return new Response(JSON.stringify(result), {
      status: formSubmitRes.status,
      headers: corsHeaders
    });

  } catch (err) {
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
