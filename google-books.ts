type VolumeInfo = {
  allowAnonLogging?: boolean;
  authors?: string[];
  averageRating?: number;
  canonicalVolumeLink?: string;
  categories?: string[];
  comicsContent?: boolean;
  contentVersion?: string;
  description?: string;
  dimensions?: { height?: string; thickness?: string; width?: string };
  imageLinks?: {
    extraLarge?: string;
    large?: string;
    medium?: string;
    small?: string;
    smallThumbnail?: string;
    thumbnail?: string;
  };
  industryIdentifiers?: Array<{ identifier?: string; type?: string }>;
  infoLink?: string;
  language?: string;
  mainCategory?: string;
  maturityRating?: string;
  pageCount?: number;
  panelizationSummary?: {
    containsEpubBubbles?: boolean;
    containsImageBubbles?: boolean;
    epubBubbleVersion?: string;
    imageBubbleVersion?: string;
  };
  previewLink?: string;
  printType?: string;
  printedPageCount?: number;
  publishedDate?: string;
  publisher?: string;
  ratingsCount?: number;
  readingModes?: { image?: boolean; text?: boolean };
  samplePageCount?: number;
  seriesInfo?: {
    /**
     * The display number string. This should be used only for display purposes and the actual sequence should be inferred from the below orderNumber.
     */
    bookDisplayNumber?: string | null;
    /**
     * Resource type.
     */
    kind?: string | null;
    /**
     * Short book title in the context of the series.
     */
    shortSeriesBookTitle?: string | null;
    volumeSeries?: Array<{
      issue?: Array<{ issueDisplayNumber?: string; issueOrderNumber?: number }>;
      orderNumber?: number;
      seriesBookType?: string;
      seriesId?: string;
    }> | null;
  };
  subtitle?: string;
  title?: string;
};
export async function getGoogleBookVolumeIdFromIsbn(isbn: string) {
  const apiKey = Bun.env.GOOGLE_BOOKS_API_KEY;
  const url = new URL(
    `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
  );

  if (apiKey) {
    url.searchParams.append("key", apiKey);
  }
  const res = await fetch(url);
  const json = await res.json();
  if (json.totalItems > 0) {
    return json.items[0].id as string;
  }
}

export async function getGoogleBookVolumeInfo(volumeId: string) {
  const apiKey = Bun.env.GOOGLE_BOOKS_API_KEY;
  const url = new URL(
    `https://www.googleapis.com/books/v1/volumes/${volumeId}`
  );

  if (apiKey) {
    url.searchParams.append("key", apiKey);
  }
  const res = await fetch(url);
  const json = await res.json();
  if (json.volumeInfo) {
    return json.volumeInfo as VolumeInfo;
  }
}
