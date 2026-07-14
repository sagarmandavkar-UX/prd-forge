import { Document, Packer, Paragraph, TextRun } from "docx";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { NextResponse } from "next/server";

import {
  formatMarkdown,
  formatPlainText,
  formatRequirementsCsv
} from "@/lib/exports/formatters";
import {
  prdDocumentSchema,
  requirementSchema,
  userStorySchema
} from "@/lib/validation/prd";
import type { Requirement, UserStory } from "@/types/prd";

async function pdfFromText(text: string) {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const lines = text
    .split("\n")
    .flatMap((line) =>
      line.length > 92 ? (line.match(/.{1,92}(\s|$)/g) ?? [line]) : [line]
    );
  let page = pdf.addPage([612, 792]);
  let y = 752;

  lines.slice(0, 1200).forEach((line) => {
    if (y < 48) {
      page = pdf.addPage([612, 792]);
      y = 752;
    }
    page.drawText(line.trim(), { x: 48, y, size: 10, font });
    y -= 14;
  });

  return pdf.save();
}

async function docxFromText(text: string) {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: text.split("\n").map(
          (line) =>
            new Paragraph({
              children: [new TextRun(line || " ")]
            })
        )
      }
    ]
  });

  return Packer.toBuffer(doc);
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength
  ) as ArrayBuffer;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const format = body.format;
    const prd = prdDocumentSchema.parse(body.prd);
    const requirements = (
      Array.isArray(body.requirements)
        ? body.requirements.map((item) => requirementSchema.parse(item))
        : []
    ) as Requirement[];
    const userStories = (
      Array.isArray(body.userStories)
        ? body.userStories.map((item) => userStorySchema.parse(item))
        : []
    ) as UserStory[];

    if (format === "csv") {
      return new NextResponse(formatRequirementsCsv(requirements), {
        headers: { "Content-Type": "text/csv; charset=utf-8" }
      });
    }

    if (format === "json") {
      return NextResponse.json({
        prd,
        requirements,
        userStories,
        exportedAt: new Date().toISOString()
      });
    }

    const markdown = formatMarkdown(prd, requirements, userStories);
    const text =
      format === "text"
        ? formatPlainText(prd, requirements, userStories)
        : markdown;

    if (format === "pdf") {
      const pdf = await pdfFromText(
        formatPlainText(prd, requirements, userStories)
      );
      return new NextResponse(toArrayBuffer(pdf), {
        headers: { "Content-Type": "application/pdf" }
      });
    }

    if (format === "docx") {
      const docx = await docxFromText(
        formatPlainText(prd, requirements, userStories)
      );
      return new NextResponse(toArrayBuffer(docx), {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        }
      });
    }

    return new NextResponse(text, {
      headers: {
        "Content-Type":
          format === "text"
            ? "text/plain; charset=utf-8"
            : "text/markdown; charset=utf-8"
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Export failed." },
      { status: 400 }
    );
  }
}
