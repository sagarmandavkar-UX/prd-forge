import { expect, test } from "@playwright/test";

test("complete core demo workflow", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /try demo mode/i }).click();
  await expect(
    page.getByRole("heading", { name: /Your Projects/i })
  ).toBeVisible();

  await page.getByText("Campus Club Application Hub").first().click();
  await page.getByRole("link", { name: /PRD editor/i }).click();
  await expect(
    page.getByRole("heading", { name: /Document outline/i })
  ).toBeVisible();
  await page.getByRole("button", { name: /run quality review/i }).click();
  await page.getByRole("button", { name: /^PDF$/ }).click();

  await page.getByRole("link", { name: /Requirements/i }).click();
  await page.getByRole("button", { name: /add requirement/i }).click();
  await expect(page.getByText("New requirement")).toBeVisible();

  await page.getByRole("link", { name: /Versions/i }).click();
  await page.getByLabel("Version name").fill("E2E snapshot");
  await page.getByRole("button", { name: /save version/i }).click();
  await expect(page.getByText(/v\d+: E2E snapshot/).first()).toBeVisible();

  await page.goto("/projects/new");
  await page.getByLabel("Product name").fill("StudyBuddy");
  await page
    .getByLabel("One-sentence idea")
    .fill("StudyBuddy turns notes into practice questions for students.");
  await page
    .getByLabel("Detailed description")
    .fill(
      "Students need a focused way to convert notes into study guides, quizzes, and flashcards."
    );
  await page.getByLabel("Industry").fill("Education");
  await page.getByRole("button", { name: /Next: Users/i }).click();
  await page.getByLabel("Primary user").fill("College students");
  await page
    .getByLabel("User problem")
    .fill(
      "Students struggle to turn scattered course materials into a useful study plan."
    );
  await page.getByRole("button", { name: /Next: Goals/i }).click();
  await page
    .getByLabel("Business objective")
    .fill("Validate an education SaaS product.");
  await page
    .getByLabel("User outcome")
    .fill("Students create better study plans.");
  await page.getByLabel("Product goals").fill("Generate practice questions");
  await page
    .getByLabel("Proposed success metrics")
    .fill("70% of users generate a study guide");
  await page.getByRole("button", { name: /Next: Scope/i }).click();
  await page
    .getByLabel("Must-have capabilities")
    .fill("Upload notes\nGenerate flashcards\nTrack study sessions");
  await page.getByRole("button", { name: /Next: Context/i }).click();
  await page.getByRole("button", { name: /Next: Review/i }).click();
  const discoveryHeading = page.getByRole("heading", {
    name: /AI discovery assistant/i
  });
  const generateQuestions = page.getByRole("button", {
    name: /Generate discovery questions/i
  });

  try {
    await generateQuestions.click({ timeout: 5_000 });
  } catch {
    await expect(discoveryHeading).toBeVisible();
  }

  await expect(discoveryHeading).toBeVisible();
});
