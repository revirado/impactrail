import app from "./app.js";

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`[Impactrail Server] Running on http://localhost:${PORT}`);
  console.log(`[Impactrail Server] Health check: http://localhost:${PORT}/api/health`);
});
