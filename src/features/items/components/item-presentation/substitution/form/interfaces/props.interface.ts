import type { CreateSubstitutionPayload } from '../../../../../interfaces/item-substitution.interface';

export interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  initial?: Partial<CreateSubstitutionPayload> | null;
  onSubmit: (payload: CreateSubstitutionPayload) => Promise<void>;
  isLoading?: boolean;
  errorMsg?: string | null;
}
