import React, { useEffect, useState } from 'react';
import { SensitiveGateTemplate } from './sensitive-gate.html';
import { SensitiveGateProps } from './interfaces/sensitive-gate-props.interface';

export const SensitiveGate: React.FC<SensitiveGateProps> = ({
  title,
  description,
  icon,
  unlockLabel = 'Acknowledge & Unlock',
  onUnlock,
  children,
}) => {
  const [isLocked, setIsLocked] = useState(true);

  useEffect(() => {
    return () => setIsLocked(true);
  }, []);

  const handleUnlock = () => {
    setIsLocked(false);
    onUnlock?.();
  };

  return (
    <SensitiveGateTemplate
      title={title}
      description={description}
      icon={icon}
      unlockLabel={unlockLabel}
      isLocked={isLocked}
      onUnlock={handleUnlock}
    >
      {children}
    </SensitiveGateTemplate>
  );
};
