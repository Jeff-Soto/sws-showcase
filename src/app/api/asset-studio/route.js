import { NextResponse } from "next/server";
import { getOpenAIClient, OPENAI_MODEL } from "@/lib/openai";
import { styleOptions, fallbackImagesByStyle } from "@/data/assetStudio";

function buildPrompt(basePrompt, styleKey) {
  const style = styleOptions.find((option) => option.value === styleKey);
  const suffix =
    style?.promptSuffix ??
    "high fidelity digital art with premium lighting and cinematic composition.";

  return `${basePrompt}. ${suffix} Incorporate Soto Web Studios brand palette with gold (#C9A03F) highlights on a deep charcoal background.`;
}

const SUPPORTED_SIZES = new Set(["1024x1024", "1024x1536", "1536x1024", "auto"]);

function fallbackImage(style) {
  const pool = fallbackImagesByStyle[style] ?? fallbackImagesByStyle.default;
  return pool[Math.floor(Math.random() * pool.length)];
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      prompt,
      style = "brand-illustration",
      size = "1024x1024",
    } = body;

    if (!prompt || !prompt.trim()) {
      return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
    }

    const openai = getOpenAIClient();
    let requestedSize = "1024x1024";
    let sizeNote = "";
    if (SUPPORTED_SIZES.has(size)) {
      requestedSize = size;
    } else if (size) {
      sizeNote = `Size "${size}" is not supported. Using ${requestedSize} instead.`;
    }
    const generatedPrompt = buildPrompt(prompt, style);
    let imageUrl = "";
    let isFallback = false;
    let errorMessage = "";

    try {
      const response = await openai.images.generate({
        model: OPENAI_MODEL.IMAGE,
        prompt: generatedPrompt,
        size: requestedSize,
        n: 1,
        quality: "high",
      });

      const imageData = response.data?.[0];

      if (imageData?.url) {
        imageUrl = imageData.url;
      } else if (imageData?.b64_json) {
        imageUrl = `data:image/png;base64,${imageData.b64_json}`;
      } else {
        imageUrl = fallbackImage(style);
        isFallback = true;
        errorMessage =
          "Received empty payload from image API. Displaying a placeholder example instead.";
      }
    } catch (err) {
      console.warn("asset-studio openai fallback", err);
      imageUrl = fallbackImage(style);
      isFallback = true;
      errorMessage =
        err?.message?.replace(/Invalid value.+/, "").trim() ||
        "Unable to generate image with the live API. Showing a curated placeholder.";
    }

    return NextResponse.json({
      success: true,
      data: {
        prompt,
        style,
        generatedPrompt,
        imageUrl,
        size: requestedSize,
        createdAt: new Date().toISOString(),
        fallback: isFallback,
        note: sizeNote || errorMessage || undefined,
      },
    });
  } catch (error) {
    console.error("asset-studio route error:", error);
    return NextResponse.json(
      {
        error: "Unable to generate image at this time. Please try again later.",
      },
      { status: 500 }
    );
  }
}

