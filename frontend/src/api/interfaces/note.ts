export interface Note {
  id: number;
  title: string;
  content: string;
  lastModification: string;
  featured: boolean;
  tags: [string];
}
