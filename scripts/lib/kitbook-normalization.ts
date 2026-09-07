export type KitbookLineKind =
  | "heading"
  | "subheading"
  | "table-header"
  | "bullet"
  | "entry"
  | "question"
  | "paragraph";

export type KitbookSectionKind =
  | "alphabet"
  | "pronunciation"
  | "grammar"
  | "numbers"
  | "measurements"
  | "dialogue"
  | "travel"
  | "shopping"
  | "health"
  | "dictionary"
  | "reference"
  | "vocabulary";

export interface NormalizedKitbookLine {
  index: number;
  text: string;
  kind: KitbookLineKind;
}

export interface NormalizedKitbookPage {
  pageNumber: number;
  text: string;
  lines: NormalizedKitbookLine[];
  headingCandidates: string[];
  signals: {
    hasArabic: boolean;
    hasGerman: boolean;
    hasQuestions: boolean;
    hasBullets: boolean;
    likelyTabular: boolean;
  };
}

export interface KitbookSectionBoundary {
  page: number;
  line: number;
}

export interface ExtractedKitbookSection {
  id: string;
  title: string;
  normalizedTitle: string;
  depth: 1 | 2;
  parentId?: string;
  kind: KitbookSectionKind;
  sourcePages: number[];
  start: KitbookSectionBoundary;
  end: KitbookSectionBoundary;
  lineCount: number;
  sampleGerman: string[];
  keywords: string[];
  contentPreview: string;
  content: string;
}

const GERMAN_STOPWORDS = new Set([
  "aber",
  "abend",
  "alle",
  "alles",
  "auch",
  "auf",
  "aus",
  "bei",
  "bin",
  "bis",
  "bitte",
  "das",
  "dass",
  "dem",
  "den",
  "der",
  "des",
  "deutsch",
  "die",
  "dir",
  "dort",
  "ein",
  "eine",
  "einen",
  "einer",
  "eines",
  "er",
  "es",
  "etwas",
  "für",
  "gibt",
  "gut",
  "haben",
  "hat",
  "hier",
  "ich",
  "ihm",
  "ihnen",
  "ihr",
  "ihre",
  "im",
  "in",
  "ist",
  "ja",
  "kann",
  "kein",
  "keine",
  "mein",
  "meine",
  "mit",
  "möchte",
  "nach",
  "nein",
  "nicht",
  "oder",
  "sein",
  "sie",
  "sind",
  "und",
  "von",
  "wann",
  "war",
  "was",
  "weg",
  "wer",
  "wie",
  "wir",
  "wo",
  "woher",
  "zum",
  "zur",
]);

const CONNECTOR_WORDS = new Set([
  "ab",
  "am",
  "an",
  "auf",
  "aus",
  "bei",
  "das",
  "dem",
  "den",
  "der",
  "die",
  "ein",
  "eine",
  "einer",
  "eines",
  "für",
  "im",
  "in",
  "mit",
  "nach",
  "oder",
  "pro",
  "und",
  "vom",
  "von",
  "vor",
  "zu",
  "zum",
  "zur",
]);

function normalizeInlineWhitespace(value: string) {
  return value.replace(/[ \t]+/g, " ").trim();
}

function normalizeLine(value: string) {
  return normalizeInlineWhitespace(
    value
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
      .replace(/[\u200E\u200F\u202A-\u202E]/g, "")
      .replace(/[‐‑‒–—―]/g, "-")
      .replace(/[“”«»]/g, '"')
      .replace(/[‘’]/g, "'")
      .replace(/•+/g, "• ")
      .replace(/\s+([,.;:?!])/g, "$1")
      .replace(/\s*\/\s*/g, " / "),
  );
}

function hasGerman(value: string) {
  return /[A-Za-zÄÖÜäöüß]/.test(value);
}

function hasArabic(value: string) {
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(value);
}

function countMatches(value: string, expression: RegExp) {
  const matches = value.match(expression);
  return matches ? matches.length : 0;
}

function lastLatinWord(value: string) {
  const matches = value.match(/[A-Za-zÄÖÜäöüß]+/g);
  return matches?.at(-1)?.toLowerCase();
}

function shouldMergeWithoutSpace(previous: string, current: string) {
  return /[A-Za-zÄÖÜäöüß]$/.test(previous) && /^[A-Za-zÄÖÜäöüß]{1,4}$/.test(current);
}

function shouldMergeWithSpace(previous: string, current: string) {
  if (!hasGerman(previous) || !hasGerman(current)) return false;
  const lastWord = lastLatinWord(previous);
  if (!lastWord) return false;
  if (CONNECTOR_WORDS.has(lastWord) && /^[a-zäöüß]/.test(current)) return true;
  return /[-(/]$/.test(previous);
}

function mergeNormalizedLines(lines: string[]) {
  const merged: string[] = [];

  for (const line of lines) {
    if (!line) continue;
    const previous = merged.at(-1);
    if (!previous) {
      merged.push(line);
      continue;
    }

    if (line === previous) continue;

    if (shouldMergeWithoutSpace(previous, line)) {
      merged[merged.length - 1] = `${previous}${line}`;
      continue;
    }

    if (shouldMergeWithSpace(previous, line)) {
      merged[merged.length - 1] = `${previous} ${line}`;
      continue;
    }

    merged.push(line);
  }

  return merged;
}

function isLikelyTableHeader(line: string) {
  return (
    (line.includes("ﻲﺑﺮﻌﻟا") && line.includes("ﻲﻧﺎﻤﻟﻷا")) ||
    (line.includes("اﻟﻤﻘﺎﺑﻞ") && line.includes("ﻂﺮﻳﻘﺔ")) ||
    (line.includes("فﺮﺤﻟا") && line.includes("ﻆﻔﻠ"))
  );
}

function isLikelyHeading(line: string) {
  if (!line) return false;
  if (isLikelyTableHeader(line)) return false;
  if (/^[.()"'،,:؛-]/.test(line)) return false;
  if (/[?!؟]/.test(line)) return false;
  if (/^[•*-]/.test(line)) return false;
  if (/^\d/.test(line) || /^[٠-٩]/.test(line)) return false;
  if (/^\d+\s+[A-Za-zÄÖÜäöüß]/.test(line)) return false;
  if (/^[A-ZÄÖÜ][A-Za-zÄÖÜäöüß]+(\s+[A-ZÄÖÜ][A-Za-zÄÖÜäöüß]+)?$/.test(line)) return false;
  if ((line.includes(":") || line.includes("؛")) && !/^([0-9٠-٩]+)\s*[-ـ]/.test(line)) return false;
  if (line.includes(" - ") || line.includes(" — ")) return false;

  const words = line.split(/\s+/).length;
  const latinWords = countMatches(line, /[A-Za-zÄÖÜäöüß]+/g);
  const digitCount = countMatches(line, /\d/g);
  const endsSentence = /[.;:]$/.test(line);

  if (words === 1 && !line.includes("وسﻣﺎﻘﻟا")) return false;
  if (words > 7 || digitCount > 4 || endsSentence) return false;
  if (latinWords >= 2 && !line.includes("وسﻣﺎﻘﻟا") && !line.startsWith("ﻲﻓ ")) return false;

  return true;
}

function classifyLine(line: string): KitbookLineKind {
  if (isLikelyTableHeader(line)) return "table-header";
  if (/^[•*-]/.test(line)) return "bullet";
  if (/[؟?]/.test(line)) return "question";
  if (isLikelyHeading(line)) return "heading";
  if (/^\d+/.test(line) || /^[A-ZÄÖÜ][A-Za-zÄÖÜäöüß]?\s+[A-Za-zÄÖÜäöüß]/.test(line)) return "entry";
  if (hasGerman(line) && hasArabic(line) && line.split(/\s+/).length <= 10) return "entry";
  return "paragraph";
}

export function normalizePdfText(input: string) {
  const rawLines = input
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => normalizeLine(line))
    .filter(Boolean);

  return mergeNormalizedLines(rawLines).join("\n").trim();
}

export function analyzeNormalizedPage(pageNumber: number, text: string): NormalizedKitbookPage {
  const normalizedText = normalizePdfText(text);
  const lines = normalizedText
    .split("\n")
    .filter(Boolean)
    .map((line, index) => ({ index: index + 1, text: line, kind: classifyLine(line) }));

  return {
    pageNumber,
    text: normalizedText,
    lines,
    headingCandidates: lines.filter((line) => line.kind === "heading" || line.kind === "table-header").map((line) => line.text),
    signals: {
      hasArabic: hasArabic(normalizedText),
      hasGerman: hasGerman(normalizedText),
      hasQuestions: lines.some((line) => line.kind === "question"),
      hasBullets: lines.some((line) => line.kind === "bullet"),
      likelyTabular: lines.filter((line) => line.kind === "entry").length >= Math.max(5, Math.round(lines.length * 0.35)),
    },
  };
}

function inferSectionDepth(line: NormalizedKitbookLine, pageIndex: number, currentDepth?: 1 | 2): 1 | 2 {
  const text = line.text;
  let score = 0;

  if (pageIndex <= 1) score += 3;
  if (/^\d+\s*[-ـ]/.test(text) || /^[٠-٩]+\s*[-ـ]/.test(text)) score += 3;
  if (text.startsWith("ﻲﻓ ")) score += 2;
  if (text.includes("وسﻣﺎﻘﻟا")) score += 3;
  if (text.length <= 18) score += 1;
  if (currentDepth === 2 && pageIndex === 0) score += 2;

  return score >= 3 ? 1 : 2;
}

function normalizeTitle(text: string) {
  return text.replace(/["'،,:؛.؟?!]/g, "").replace(/\s+/g, " ").trim();
}

function inferSectionKind(text: string): KitbookSectionKind {
  const value = text.toLowerCase();

  const checks: Array<{ kind: KitbookSectionKind; score: number }> = [
    {
      kind: "dictionary",
      score: Number(value.includes("وسﻣﺎﻘﻟا")) * 5,
    },
    {
      kind: "pronunciation",
      score:
        ["sch", "tion", "ä", "ö", "ü", "eu", "ei", "ie", "sp", "st", "ß", "ﻆﻔﻠ", "طقﻧﻟا"].reduce(
          (total, token) => total + Number(value.includes(token)),
          0,
        ),
    },
    {
      kind: "grammar",
      score:
        [
          " der ",
          " die ",
          " das ",
          "dieser",
          "diese",
          "dieses",
          "wer",
          "wen",
          "wem",
          "kein",
          "ein",
          "فﯾرﻌﺗ",
          "رﯾﻛﻧﺗ",
          "رﺋﺎﻣﺿ",
          "رﺟﻟا",
          "ﻊﻤﺟ",
          "مﺎﮭﻔﺗﺳﻻا",
        ].reduce((total, token) => total + Number(` ${value} `.includes(token)), 0),
    },
    {
      kind: "numbers",
      score:
        ["null", "eins", "zwei", "drei", "zwanzig", "hundert", "tausend", "jahr", "monat", "uhr", "دادﻋﻷا", "ﺔﯾﺑﯾﺗرﺗﻟا"].reduce(
          (total, token) => total + Number(value.includes(token)),
          0,
        ) + Math.min(4, countMatches(value, /\b\d+\b/g)),
    },
    {
      kind: "measurements",
      score: ["kilo", "gramm", "meter", "hektar", "yard", "tonne", "zentner", "وزانﻷا", "سﯾﯾﺎﻘﻣ", "ﺮﺘﻣ", "ﻮﻠﯿﻛ"].reduce(
        (total, token) => total + Number(value.includes(token)),
        0,
      ),
    },
    {
      kind: "travel",
      score: ["flug", "bahnhof", "hotel", "fahrkarte", "reise", "taxi", "schiff", "museum", "رﺎطﻤﻟا", "رﺎﻄﻘﻟﺎﺑ", "ﺮﻔﺴﻟا", "قﺪﻨﻔﻟا"].reduce(
        (total, token) => total + Number(value.includes(token)),
        0,
      ),
    },
    {
      kind: "shopping",
      score: ["kaufen", "preis", "markt", "laden", "bank", "verkauf", "schuh", "stoff", "قﻮﺳﻟا", "ﻊﺋﺎﺑ", "ﺔﯾذﺣﻷا", "ﺔﺳﺑﻟﻷا"].reduce(
        (total, token) => total + Number(value.includes(token)),
        0,
      ),
    },
    {
      kind: "health",
      score: ["arzt", "apotheke", "krank", "zahn", "medizin", "fieber", "schmerzen", "ﺔﯾﻟدﯾﺻﻟا", "بﯾﺑطﻟا", "ضﺮﻣﻟا"].reduce(
        (total, token) => total + Number(value.includes(token)),
        0,
      ),
    },
    {
      kind: "dialogue",
      score: ["ich", "sie", "bitte", "danke", "wann", "wie", "wo", "ﺎﻧأ", "ﻞھ", "ﻰﺘﻣ"].reduce(
        (total, token) => total + Number(value.includes(token)),
        0,
      ) + Math.min(3, countMatches(value, /[؟?]/g)),
    },
    {
      kind: "alphabet",
      score: Number(value.includes("روفﺣ")) * 4 + Number(value.includes("ءﺎﺟﮭﻟا")) * 4 + Number(value.includes("apfel")) + Number(value.includes("jahr")),
    },
    {
      kind: "reference",
      score: Number(value.includes("ﻣﻼﺣﻈ")) + Number(value.includes("note")),
    },
    {
      kind: "vocabulary",
      score: 1,
    },
  ];

  return checks.sort((left, right) => right.score - left.score)[0]?.kind ?? "vocabulary";
}

function extractKeywords(text: string) {
  const counts = new Map<string, number>();
  const matches = text.match(/[A-Za-zÄÖÜäöüß]{4,}/g) ?? [];

  for (const match of matches) {
    const keyword = match.toLowerCase();
    if (GERMAN_STOPWORDS.has(keyword)) continue;
    counts.set(keyword, (counts.get(keyword) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, 8)
    .map(([keyword]) => keyword);
}

function extractSampleGerman(text: string) {
  const seen = new Set<string>();
  const samples: string[] = [];
  const matches = text.match(/[A-Za-zÄÖÜäöüß]{3,}/g) ?? [];

  for (const match of matches) {
    const lower = match.toLowerCase();
    if (GERMAN_STOPWORDS.has(lower) || seen.has(lower)) continue;
    seen.add(lower);
    samples.push(match);
    if (samples.length === 8) break;
  }

  return samples;
}

interface MutableSection {
  id: string;
  title: string;
  normalizedTitle: string;
  depth: 1 | 2;
  parentId?: string;
  lines: Array<{ page: number; line: number; text: string }>;
  start: KitbookSectionBoundary;
  end: KitbookSectionBoundary;
  pageSet: Set<number>;
}

function startSection(line: NormalizedKitbookLine, pageNumber: number, depth: 1 | 2, parentId?: string): MutableSection {
  return {
    id: `section-${String(pageNumber).padStart(3, "0")}-${String(line.index).padStart(3, "0")}`,
    title: line.text,
    normalizedTitle: normalizeTitle(line.text),
    depth,
    parentId,
    lines: [],
    start: { page: pageNumber, line: line.index },
    end: { page: pageNumber, line: line.index },
    pageSet: new Set([pageNumber]),
  };
}

function closeSection(section: MutableSection): ExtractedKitbookSection {
  const content = section.lines.map((line) => line.text).join("\n").trim();
  const basis = [section.normalizedTitle, content].filter(Boolean).join("\n");

  return {
    id: section.id,
    title: section.title,
    normalizedTitle: section.normalizedTitle,
    depth: section.depth,
    parentId: section.parentId,
    kind: inferSectionKind(basis),
    sourcePages: [...section.pageSet],
    start: section.start,
    end: section.end,
    lineCount: section.lines.length,
    sampleGerman: extractSampleGerman(basis),
    keywords: extractKeywords(basis),
    contentPreview: content.slice(0, 280),
    content,
  };
}

function looksLikeStructuredHeading(
  line: NormalizedKitbookLine,
  pageIndex: number,
  pageLines: NormalizedKitbookLine[],
) {
  if (line.kind !== "heading") return false;

  const words = line.text.split(/\s+/).length;
  const next = pageLines[pageIndex + 1];
  const explicitMajorPattern =
    /^([0-9٠-٩]+)\s*[-ـ]/.test(line.text) || line.text.startsWith("ﻲﻓ ") || line.text.includes("وسﻣﺎﻘﻟا");

  let consecutiveHeadingCount = 1;
  for (let offset = pageIndex + 1; offset < pageLines.length; offset += 1) {
    if (pageLines[offset]?.kind !== "heading") break;
    consecutiveHeadingCount += 1;
  }

  if (!explicitMajorPattern && pageIndex > 1 && consecutiveHeadingCount >= 3) return false;
  if (explicitMajorPattern) return true;
  if (pageIndex <= 1 && words <= 5) return true;
  if (line.text.length <= 28 && words >= 2 && words <= 4 && !hasGerman(line.text) && consecutiveHeadingCount === 1) {
    return true;
  }
  if (
    next &&
    line.text.length <= 30 &&
    words <= 4 &&
    consecutiveHeadingCount <= 2 &&
    (next.kind === "table-header" || next.kind === "bullet")
  ) {
    return true;
  }

  return false;
}

export function extractSectionsFromPages(pages: NormalizedKitbookPage[]) {
  const sections: ExtractedKitbookSection[] = [];
  let currentSection: MutableSection | undefined;
  let currentTopLevelId: string | undefined;

  for (const page of pages) {
    for (let index = 0; index < page.lines.length; index += 1) {
      const line = page.lines[index];

      if (looksLikeStructuredHeading(line, index, page.lines)) {
        const depth = inferSectionDepth(line, index, currentSection?.depth);

        if (currentSection) {
          sections.push(closeSection(currentSection));
        }

        if (depth === 1) {
          currentTopLevelId = undefined;
        }

        currentSection = startSection(line, page.pageNumber, depth, depth === 2 ? currentTopLevelId : undefined);

        if (depth === 1) {
          currentTopLevelId = currentSection.id;
        }

        continue;
      }

      if (!currentSection) {
        currentSection = {
          id: `section-${String(page.pageNumber).padStart(3, "0")}-000`,
          title: `Page ${page.pageNumber} lead-in`,
          normalizedTitle: `Page ${page.pageNumber} lead-in`,
          depth: 1,
          lines: [],
          start: { page: page.pageNumber, line: line.index },
          end: { page: page.pageNumber, line: line.index },
          pageSet: new Set([page.pageNumber]),
        };
      }

      currentSection.lines.push({ page: page.pageNumber, line: line.index, text: line.text });
      currentSection.end = { page: page.pageNumber, line: line.index };
      currentSection.pageSet.add(page.pageNumber);
    }
  }

  if (currentSection) {
    sections.push(closeSection(currentSection));
  }

  const topLevelCount = sections.filter((section) => section.depth === 1).length;
  const subsectionCount = sections.filter((section) => section.depth === 2).length;
  const byKind = sections.reduce<Record<string, number>>((accumulator, section) => {
    accumulator[section.kind] = (accumulator[section.kind] ?? 0) + 1;
    return accumulator;
  }, {});

  return {
    sectionCount: sections.length,
    topLevelCount,
    subsectionCount,
    byKind,
    sections,
  };
}
