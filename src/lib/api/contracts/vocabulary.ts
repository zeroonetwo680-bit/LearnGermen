export type PartOfSpeech =
  | "noun"
  | "verb"
  | "adjective"
  | "adverb"
  | "phrase"
  | "pronoun"
  | "number"
  | "other";

export interface VocabularyItemDto {
  id: string;
  lessonId: string;
  german: string;
  transliterationAr: string;
  meaningAr: string;
  article?: "der" | "die" | "das";
  plural?: string;
  partOfSpeech: PartOfSpeech;
  notes?: string;
  exampleGerman?: string;
  exampleTransliterationAr?: string;
  exampleMeaningAr?: string;
  tags: string[];
}
