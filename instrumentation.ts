export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { initializeSystemLogger } = await import("./lib/server-logger");
    initializeSystemLogger();
  }
}
