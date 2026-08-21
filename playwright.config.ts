import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env["E2E_PORT"] ?? 8080);
const BASE_URL = process.env["E2E_BASE_URL"] ?? `http://localhost:${PORT}`;

/**
 * E2E + visual regression configuration.
 * On failure Playwright keeps a trace, a screenshot and a video so a11y/focus
 * regressions can be replayed without reproducing them by hand.
 */
export default defineConfig({
  testDir: "./e2e",
  snapshotDir: "./e2e/__screenshots__",
  fullyParallel: true,
  forbidOnly: !!process.env["CI"],
  retries: process.env["CI"] ? 2 : 0,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  outputDir: "test-results",
  timeout: 30_000,
  expect: {
    timeout: 5_000,
    /*
     * Visual-regression tolerance policy.
     *
     * `stylePath` pins fonts and freezes animations/carets (see
     * e2e/screenshot.css) so the usual source of cross-machine noise —
     * glyph rasterisation — is removed at the source rather than hidden
     * behind a large diff budget.
     *
     * `threshold` (per-pixel YIQ distance) stays low so a changed highlight
     * color/ring is still a failure, while `maxDiffPixelRatio` allows a small
     * fraction of anti-aliased edge pixels to differ. A highlight regression
     * repaints a whole control (well above 1.5% of the shot), so accuracy of
     * the active-selection assertions is preserved.
     */
    toHaveScreenshot: {
      threshold: 0.15,
      maxDiffPixelRatio: 0.015,
      animations: "disabled",
      caret: "hide",
      scale: "css",
      stylePath: "./e2e/screenshot.css",
    },
  },

  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    viewport: { width: 420, height: 900 },
    locale: "id-ID",
    timezoneId: "Asia/Jakarta",
    reducedMotion: "reduce",
  },
  projects: [{ name: "mobile-chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: process.env["E2E_BASE_URL"]
    ? undefined
    : {
        command: "bun run dev",
        url: BASE_URL,
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
