export interface Props {
  websiteName: string;
  setWebsiteName: (val: string) => void;
  name: string;
  setName: (val: string) => void;
  price: string;
  setPrice: (val: string) => void;
  desiredQuantity: number | '';
  setDesiredQuantity: (val: number | '') => void;
  isFavorite: boolean;
  setIsFavorite: (val: boolean) => void;
  canCollaborate: boolean;
  hideFavorite: boolean;
}
