export const styleOptions = [
  {
    value: "brand-illustration",
    label: "Brand Illustration",
    promptSuffix:
      "rendered as a vibrant tech illustration with glowing gold accents and dark backgrounds.",
  },
  {
    value: "product-shot",
    label: "Product Shot",
    promptSuffix:
      "photorealistic studio lighting, minimal set design, dramatic shadows and reflections.",
  },
  {
    value: "concept-art",
    label: "Concept Art",
    promptSuffix:
      "cinematic concept art with rich textures, volumetric lighting, and futuristic composition.",
  },
  {
    value: "ui-mock",
    label: "UI Mockup",
    promptSuffix:
      "high fidelity UI mockup displayed on modern devices with glassmorphism styling.",
  },
];

export const fallbackImagesByStyle = {
  "brand-illustration": [
    "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1200&q=80",
  ],
  "product-shot": [
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1595433707802-6b2626ef95b9?auto=format&fit=crop&w=1200&q=80",
  ],
  "concept-art": [
    "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  ],
  "ui-mock": [
    "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
  ],
  default: [
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
  ],
};

