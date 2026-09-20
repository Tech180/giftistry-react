export interface PaginationControlsTemplateProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
