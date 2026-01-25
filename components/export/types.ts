export type ExportFormat = 'pdf' | 'word';

export type PageSize = 'A4' | 'Letter';

export interface ExportConfig {
  format: ExportFormat;
  pageSize?: PageSize;
  template?: 'minimalist' | 'modern' | 'creative';
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export interface ExportResult {
  success: boolean;
  filename: string;
  error?: string;
}
