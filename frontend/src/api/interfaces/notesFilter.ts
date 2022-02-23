export interface NotesFilter {
  limit?: number;
  page?: number;
  phrase?: string;
  orderByDateAsc?: boolean;
  categories?: string[];
}