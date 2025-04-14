export interface Inquiry {
  order: number;
  folderName: string;
  id: string;
  // Each inquiry may contain a nested list of inquiries.
  subCategories?: Inquiry[];
}
