export interface Suggestion {
  type: 'hero' | 'lockup' | 'brick';
  image: string;
  subCategory?: string;
  category?: string;
  media: string;
  title: string;
}
