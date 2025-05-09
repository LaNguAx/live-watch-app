import express from "express";
import { YOUTUBE_API_KEY } from "../config/consts.js";

export const router = express.Router();

const API_KEY = YOUTUBE_API_KEY;
const BASE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";
const BASE_DETAILS_URL = "https://www.googleapis.com/youtube/v3/videos";

// ✅ Safely convert ISO 8601 YouTube duration → "hh:mm:ss"
function formatDuration(iso) {
  if (!iso || typeof iso !== "string") return "Unknown";

  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "Unknown";

  const h = parseInt(match[1] || "0", 10);
  const m = parseInt(match[2] || "0", 10);
  const s = parseInt(match[3] || "0", 10);

  const parts = [
    h > 0 ? String(h).padStart(2, "0") : null,
    String(m).padStart(2, "0"),
    String(s).padStart(2, "0"),
  ].filter(Boolean);

  return parts.join(":");
}

// ✅ Convert published date → "2 years ago"
function formatPublishedAt(dateStr) {
  const publishedDate = new Date(dateStr);
  const now = new Date();
  const secondsAgo = Math.floor((now - publishedDate) / 1000);

  const units = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];

  for (const unit of units) {
    const count = Math.floor(secondsAgo / unit.seconds);
    if (count >= 1) return `${count} ${unit.label}${count > 1 ? "s" : ""} ago`;
  }

  return "just now";
}

router.get("/search", async (req, res) => {
  const query = req.query.q;

  if (!query || !query.trim()) {
    return res.status(400).json({ error: "Missing or invalid search query" });
  }

  try {
    // 1. Search for video IDs
    const searchURL = `${BASE_SEARCH_URL}?part=snippet&type=video&q=${encodeURIComponent(
      query
    )}&maxResults=10&key=${API_KEY}`;

    const searchResponse = await fetch(searchURL);
    const searchData = await searchResponse.json();

    if (!searchResponse.ok) {
      return res.status(searchResponse.status).json({
        error: searchData.error?.message || "Failed to search videos",
      });
    }

    const videoIds = searchData.items.map((item) => item.id.videoId).join(",");
    if (!videoIds) return res.json([]);

    // 2. Fetch video details
    const detailsURL = `${BASE_DETAILS_URL}?part=snippet,contentDetails&id=${videoIds}&key=${API_KEY}`;
    const detailsResponse = await fetch(detailsURL);
    const detailsData = await detailsResponse.json();

    if (!detailsResponse.ok) {
      return res.status(detailsResponse.status).json({
        error: detailsData.error?.message || "Failed to fetch video details",
      });
    }

    // 3. Format & filter results
    const videos = detailsData.items
      .filter((item) => item?.id && item?.snippet && item?.contentDetails)
      .map((item) => ({
        id: item.id,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high.url,
        author: item.snippet.channelTitle,
        publishedAt: formatPublishedAt(item.snippet.publishedAt),
        description: item.snippet.description,
        duration: formatDuration(item.contentDetails.duration),
        url: `https://www.youtube.com/watch?v=${item.id}`,
      }));

    res.json(videos);
  } catch (err) {
    console.error("YouTube API error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
