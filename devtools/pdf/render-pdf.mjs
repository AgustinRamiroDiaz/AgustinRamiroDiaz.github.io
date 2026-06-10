import { chromium } from "playwright";
import { fileURLToPath } from "node:url";

const url = process.argv[2] ?? "https://agustinramirodiaz.github.io/";
const outputPath =
  process.argv[3] ??
  fileURLToPath(new URL("../../content/_index.pdf", import.meta.url));
const pageWidthPx = Number.parseInt(process.env.PDF_WIDTH_PX ?? "794", 10);

const browser = await chromium.launch({ headless: true });

try {
  const page = await browser.newPage();
  await page.setViewportSize({ width: pageWidthPx, height: 1000 });

  await page.goto(url, { waitUntil: "networkidle" });

  const pageHeightPx = await page.evaluate(() => {
    const body = document.body;
    const html = document.documentElement;

    return Math.ceil(
      Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      )
    );
  });

  await page.pdf({
    path: outputPath,
    width: `${pageWidthPx}px`,
    height: `${pageHeightPx}px`,
    printBackground: true,
    displayHeaderFooter: false,
    margin: {
      top: "0",
      right: "0",
      bottom: "0",
      left: "0"
    }
  });

  console.log(`Rendered ${url} to ${outputPath}`);
} finally {
  await browser.close();
}
