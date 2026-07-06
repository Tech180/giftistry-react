import React, { useState, useEffect } from 'react';
import { wishlistsApi } from 'features/wishlists/api/wishlists.api';
import { LinkTabProps } from './interfaces/link.interface';
import { LinkTabTemplate } from './link.html';

export const LinkTab: React.FC<LinkTabProps> = ({ listId, isOwner }) => {
  const [activeInvite, setActiveInvite] = useState<any | null>(null);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Setup form states
  const [role, setRole] = useState<'viewer' | 'collaborator'>('viewer');
  const [hasExpiration, setHasExpiration] = useState(false);
  const [expDate, setExpDate] = useState('');
  const [expTime, setExpTime] = useState('');
  const [hasPassword, setHasPassword] = useState(false);
  const [password, setPassword] = useState('');

  const loadLinkInvites = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const invites = await wishlistsApi.listLinkInvites(listId);
      const active = invites.find((invite: any) => {
        if (invite.RevokedAt) return false;
        if (invite.ExpiresAt && new Date(invite.ExpiresAt) < new Date()) return false;
        return true;
      });
      setActiveInvite(active || null);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to check active link invites.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLinkInvites();
  }, [listId]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    let expiresAt: string | null = null;
    if (hasExpiration && expDate) {
      const dateStr = `${expDate}T${expTime || '00:00'}`;
      expiresAt = new Date(dateStr).toISOString();
    }

    try {
      const result = await wishlistsApi.generateShareLink(
        listId,
        role,
        expiresAt,
        null,
        hasPassword && password ? password : null
      );
      setGeneratedToken(result.token);
      setActiveInvite(result.invite);
      setSuccessMsg('Share link generated successfully!');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to generate link.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedToken) return;
    const shareUrl = `${window.location.origin}/invite/list/${generatedToken}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setErrorMsg('Failed to copy link.');
    }
  };

  const handleRevoke = async () => {
    if (!activeInvite) return;
    setIsGenerating(true);
    setErrorMsg(null);
    try {
      await wishlistsApi.revokeLinkInvite(listId, activeInvite.Id);
      setActiveInvite(null);
      setGeneratedToken(null);
      setSuccessMsg('Link revoked. It is no longer active.');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to revoke link.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSettings = () => {
    setActiveInvite(null);
    setGeneratedToken(null);
  };

  return (
    <LinkTabTemplate
      isOwner={isOwner}
      isLoading={isLoading}
      isGenerating={isGenerating}
      errorMsg={errorMsg}
      successMsg={successMsg}
      activeInvite={activeInvite}
      generatedToken={generatedToken}
      copied={copied}
      role={role}
      setRole={setRole}
      hasExpiration={hasExpiration}
      setHasExpiration={setHasExpiration}
      expDate={expDate}
      setExpDate={setExpDate}
      expTime={expTime}
      setExpTime={setExpTime}
      hasPassword={hasPassword}
      setHasPassword={setHasPassword}
      password={password}
      setPassword={setPassword}
      handleGenerate={handleGenerate}
      handleCopy={handleCopy}
      handleRevoke={handleRevoke}
      handleSettings={handleSettings}
    />
  );
};
