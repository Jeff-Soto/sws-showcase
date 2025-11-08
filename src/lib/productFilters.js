const categoryKeywords = {
  "smart home": "smart-home",
  "smart-home": "smart-home",
  audio: "audio",
  "headphones": "audio",
  "speaker": "audio",
  "workspace": "workspace",
  "desk": "workspace",
  "productivity": "productivity",
  "tablet": "productivity",
  "wellness": "wellness",
  "fitness": "wellness",
  "health": "wellness",
  "travel": "travel",
  "backpack": "travel",
  "kitchen": "kitchen-tech",
  "coffee": "kitchen-tech",
  "home entertainment": "home-entertainment",
  "projector": "home-entertainment",
};

export function parseFilters(query) {
  const text = query.toLowerCase();
  const filters = {
    minPrice: null,
    maxPrice: null,
    categories: new Set(),
    tags: new Set(),
  };

  const betweenMatch = text.match(/between\s+\$?(\d+)\s+(and|-)\s+\$?(\d+)/);
  if (betweenMatch) {
    filters.minPrice = parseInt(betweenMatch[1], 10);
    filters.maxPrice = parseInt(betweenMatch[3], 10);
  } else {
    const underMatch = text.match(/(under|below|less than)\s+\$?(\d+)/);
    if (underMatch) {
      filters.maxPrice = parseInt(underMatch[2], 10);
    }

    const overMatch = text.match(/(over|above|more than)\s+\$?(\d+)/);
    if (overMatch) {
      filters.minPrice = parseInt(overMatch[2], 10);
    }
  }

  Object.entries(categoryKeywords).forEach(([keyword, category]) => {
    if (text.includes(keyword)) {
      filters.categories.add(category);
    }
  });

  ["portable", "travel", "sleep", "ergonomic", "coffee", "dolby", "noise", "ai"].forEach(
    (tag) => {
      if (text.includes(tag)) {
        filters.tags.add(tag);
      }
    }
  );

  return filters;
}

export function filterProducts(products, filters) {
  return products.filter((product) => {
    if (filters.minPrice !== null && product.price < filters.minPrice) return false;
    if (filters.maxPrice !== null && product.price > filters.maxPrice) return false;

    if (filters.categories.size > 0 && !filters.categories.has(product.category)) {
      const categoryTokens = Array.from(filters.categories);
      const hasMatch = categoryTokens.some((category) =>
        product.tags.some((tag) => tag.includes(category.split("-")[0]))
      );
      if (!hasMatch) {
        return false;
      }
    }

    if (filters.tags.size > 0) {
      const hasTag = Array.from(filters.tags).some((tag) =>
        product.tags.some((productTag) => productTag.toLowerCase().includes(tag))
      );
      if (!hasTag) {
        return false;
      }
    }

    return true;
  });
}

export function buildFilterSummary(filters) {
  const parts = [];
  if (filters.minPrice !== null && filters.maxPrice !== null) {
    parts.push(
      `between $${filters.minPrice.toLocaleString()} and $${filters.maxPrice.toLocaleString()}`
    );
  } else if (filters.minPrice !== null) {
    parts.push(`above $${filters.minPrice.toLocaleString()}`);
  } else if (filters.maxPrice !== null) {
    parts.push(`under $${filters.maxPrice.toLocaleString()}`);
  }

  if (filters.categories.size > 0) {
    parts.push(`category: ${Array.from(filters.categories).join(", ")}`);
  }

  if (filters.tags.size > 0) {
    parts.push(`keywords: ${Array.from(filters.tags).join(", ")}`);
  }

  return parts.length > 0 ? parts.join(" · ") : "all catalog items";
}

