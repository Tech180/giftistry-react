export interface MetaProps {
  isOwner: boolean;
  commenterName: string;
  isAnonymous: boolean;
  setIsAnonymous: (anonymous: boolean) => void;
}
