const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3001;

const BRAND = {
  name: "Healthiness365",
  domain: "healthiness365.com",
  api: "Healthiness365 Trend API",
  version: "1.0.0",
};

app.use(cors());
app.use(express.json());

// ─── Health / root ───────────────────────────────────────────────
app.get("/health", (req, res) => res.json({ status: "ok" }));

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    brand: BRAND.name,
    api: BRAND.api,
    version: BRAND.version,
    domain: BRAND.domain,
    region: "US West (Railway)",
    endpoints: {
      trends:  "/api/trends?niche=gut+health&sources=youtube,reddit",
      recipes: "/api/recipes?niche=gut+health",
    },
  });
});

// ─── YouTube Shorts trends ────────────────────────────────────────
// Uses YouTube Data API v3 (free, 10k units/day)
// Get your key at: console.cloud.google.com → YouTube Data API v3
async function getYouTubeTrends(niche) {
  const API_KEY = process.env.YOUTUBE_API_KEY;

  if (!API_KEY) {
    return { source: "youtube", error: "No YOUTUBE_API_KEY set", data: [] };
  }

  try {
    // Search for recent short-form recipe videos in this niche
    const searchRes = await axios.get("https://www.googleapis.com/youtube/v3/search", {
      params: {
        part: "snippet",
        q: `${niche} recipe`,
        type: "video",
        videoDuration: "short",       // Shorts only
        order: "viewCount",
        publishedAfter: getDateDaysAgo(30), // Last 30 days
        regionCode: "US",
        relevanceLanguage: "en",
        maxResults: 10,
        key: API_KEY,
      },
    });

    const videos = searchRes.data.items || [];

    // Get video stats (view counts) for ranking
    const ids = videos.map(v => v.id.videoId).join(",");
    const statsRes = await axios.get("https://www.googleapis.com/youtube/v3/videos", {
      params: { part: "statistics", id: ids, key: API_KEY },
    });

    const statsMap = {};
    (statsRes.data.items || []).forEach(v => {
      statsMap[v.id] = v.statistics;
    });

    const results = videos
      .map(v => ({
        title: v.snippet.title,
        channel: v.snippet.channelTitle,
        views: parseInt(statsMap[v.id.videoId]?.viewCount || 0),
        publishedAt: v.snippet.publishedAt,
        videoId: v.id.videoId,
        url: `https://youtube.com/shorts/${v.id.videoId}`,
        thumbnail: v.snippet.thumbnails?.medium?.url,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    return { source: "youtube_shorts", data: results };
  } catch (err) {
    return { source: "youtube_shorts", error: err.message, data: [] };
  }
}

// ─── Reddit trends ────────────────────────────────────────────────
// Free Reddit JSON API — no key needed
async function getRedditTrends(niche) {
  const subreddits = ["recipes", "GutHealth", "MealPrepSunday", "HealthyFood", "Cooking"];
  const results = [];

  for (const sub of subreddits.slice(0, 3)) {
    try {
      const res = await axios.get(
        `https://www.reddit.com/r/${sub}/search.json`,
        {
          params: { q: niche, sort: "hot", t: "week", limit: 5 },
          headers: { "User-Agent": "TrendSpotter/1.0" },
        }
      );

      const posts = (res.data?.data?.children || []).map(p => ({
        title: p.data.title,
        upvotes: p.data.ups,
        comments: p.data.num_comments,
        subreddit: p.data.subreddit,
        url: `https://reddit.com${p.data.permalink}`,
        createdAt: new Date(p.data.created_utc * 1000).toISOString(),
      }));

      results.push(...posts);
    } catch (_) {
      // Skip failed subreddit silently
    }
  }

  return {
    source: "reddit",
    data: results.sort((a, b) => b.upvotes - a.upvotes).slice(0, 5),
  };
}

// ─── TikTok public trending (no login needed, US IP gives US results)
async function getTikTokTrends(niche) {
  try {
    // TikTok's public hashtag search — accessible from US IPs without login
    const encoded = encodeURIComponent(niche.replace(/\s+/g, ""));
    const res = await axios.get(
      `https://www.tiktok.com/api/search/general/full/`,
      {
        params: {
          keyword: `${niche} recipe`,
          offset: 0,
          count: 10,
          from_page: "search",
        },
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36",
          Referer: "https://www.tiktok.com/",
        },
        timeout: 8000,
      }
    );

    const items = res.data?.data || [];
    const videos = items
      .filter(i => i.item?.stats)
      .map(i => ({
        title: i.item?.desc || "",
        views: i.item?.stats?.playCount || 0,
        likes: i.item?.stats?.diggCount || 0,
        author: i.item?.author?.uniqueId || "",
        url: `https://tiktok.com/@${i.item?.author?.uniqueId}/video/${i.item?.id}`,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    return { source: "tiktok", data: videos };
  } catch (err) {
    // TikTok blocks bots heavily — fall back gracefully
    return { source: "tiktok", error: "TikTok blocked request (expected)", data: [] };
  }
}

// Maps broad health niches to food terms Spoonacular understands
const NICHE_FOOD_MAP = {
  "gut health":          "probiotic fermented fiber",
  "anti-inflammatory":   "turmeric ginger anti-inflammatory",
  "hormonal health":     "flaxseed cruciferous phytoestrogen",
  "weight loss":         "low calorie high protein",
  "immune health":       "vitamin c zinc immune boosting",
};

function foodQueryFor(niche) {
  const key = Object.keys(NICHE_FOOD_MAP).find(k =>
    niche.toLowerCase().includes(k)
  );
  return NICHE_FOOD_MAP[key] || niche;
}

// ─── Spoonacular real recipes ─────────────────────────────────────
async function getSpoonacularRecipes(niche) {
  const API_KEY = process.env.SPOONACULAR_API_KEY;

  if (!API_KEY) {
    return { source: "spoonacular", error: "No SPOONACULAR_API_KEY set", data: [] };
  }

  try {
    const res = await axios.get("https://api.spoonacular.com/recipes/complexSearch", {
      params: {
        query: foodQueryFor(niche),
        number: 6,
        addRecipeInformation: true,
        sort: "popularity",
        apiKey: API_KEY,
        instructionsRequired: false,
      },
    });

    const recipes = (res.data.results || []).map(r => ({
      id: r.id,
      title: r.title,
      image: r.image,
      readyInMinutes: r.readyInMinutes,
      servings: r.servings,
      sourceUrl: r.sourceUrl,
      sourceName: r.sourceName,
      summary: r.summary ? r.summary.replace(/<[^>]*>/g, "").slice(0, 250) + "…" : "",
      diets: r.diets || [],
    }));

    return {
      source: "spoonacular",
      data: recipes,
      _debug: { searchedFor: foodQueryFor(niche), totalResults: res.data.totalResults, status: res.status, offset: res.data.offset },
    };
  } catch (err) {
    return { source: "spoonacular", error: err.message, data: [] };
  }
}

// ─── Real recipes endpoint ────────────────────────────────────────
app.get("/api/recipes", async (req, res) => {
  const niche = req.query.niche || "gut health";

  try {
    const result = await getSpoonacularRecipes(niche);
    res.json({
      niche,
      ...result,
      fetchedAt: new Date().toISOString(),
      brand: BRAND.name,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Main trends endpoint ─────────────────────────────────────────
app.get("/api/trends", async (req, res) => {
  const niche = req.query.niche || "gut health";
  const sources = (req.query.sources || "youtube,reddit").split(",");

  try {
    const promises = [];

    if (sources.includes("youtube")) promises.push(getYouTubeTrends(niche));
    if (sources.includes("reddit"))  promises.push(getRedditTrends(niche));
    if (sources.includes("tiktok"))  promises.push(getTikTokTrends(niche));

    const results = await Promise.allSettled(promises);

    const data = results
      .filter(r => r.status === "fulfilled")
      .map(r => r.value);

    // Summarise top trending topics across all sources
    const allTitles = data.flatMap(s => s.data.map(d => d.title)).filter(Boolean);

    res.json({
      niche,
      sources: data.map(d => d.source),
      results: data,
      topTitles: allTitles.slice(0, 10),
      fetchedAt: new Date().toISOString(),
      brand: BRAND.name,
      serverRegion: "US West (Railway)",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Helper ───────────────────────────────────────────────────────
function getDateDaysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

app.listen(PORT, () => {
  console.log(`✅ ${BRAND.api} v${BRAND.version} running on port ${PORT}`);
  console.log(`   Domain: ${BRAND.domain}`);
});
