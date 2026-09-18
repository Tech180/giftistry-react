import React, { useEffect, useState } from 'react';
import { FooterProps } from './interfaces/footer-props.interface';
import { FooterTemplate } from './footer.html';

const SHEET_MOBILE_QUERY = '(max-width: 48rem)';

export const InputFooter: React.FC<FooterProps> = (props) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(SHEET_MOBILE_QUERY).matches : false
  );

  useEffect(() => {
    const media = window.matchMedia(SHEET_MOBILE_QUERY);
    const onChange = () => setIsMobile(media.matches);
    onChange();
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  return (
    <FooterTemplate
      {...props}
      isPanelOpen={isPanelOpen}
      setIsPanelOpen={setIsPanelOpen}
      isMobile={isMobile}
    />
  );
};
