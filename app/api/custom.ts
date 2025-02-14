import { NextRequest, NextResponse } from "next/server";
import { getServerSideConfig } from "../config/server";

const serverConfig = getServerSideConfig();

export async function requestCustom(req: NextRequest) {
  const controller = new AbortController();

  const authValue = req.headers.get("Authorization") ?? "";
  const customApiKey = serverConfig.customApiKey;
  const customUrl = serverConfig.customUrl;

  if (!customUrl) {
    return NextResponse.json(
      {
        error: {
          message: "Custom API URL not configured",
          type: "custom_error",
        },
      },
      {
        status: 500,
      },
    );
  }

  try {
    const response = await fetch(customUrl, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": customApiKey || authValue,
      },
      method: req.method,
      body: req.body,
      signal: controller.signal,
    });

    return response;
  } catch (e) {
    console.error("[Custom API] error:", e);
    return NextResponse.json(
      {
        error: {
          message: `Error communicating with custom API: ${e}`,
          type: "custom_error",
        },
      },
      {
        status: 500,
      },
    );
  }
}