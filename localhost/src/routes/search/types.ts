export type VolumeInfo = {
  title: string;
  authors: Array<string>;
  imageLinks: {
    smallThumbnail: string;
    thumbnail: string;
  };
  industryIdentifiers: Array<{
    type: string;
    identifier: string;
  }>;
};
