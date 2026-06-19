import React, { useState, useEffect, useRef } from 'react';
import { useCommentController } from '../../hooks/use-comment-controller';
import { useAuth } from 'app/providers/AuthContext';
import { CommentSectionProps } from '../../interfaces/comment-section-props.interface';
import { CommentSectionTemplate } from './comment-section.html';

const getWsUrl = (listId: string) => {
  const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
  let protocol = 'ws:';
  let host = 'localhost:3001';
  
  if (apiBaseUrl.startsWith('http')) {
    protocol = apiBaseUrl.startsWith('https') ? 'wss:' : 'ws:';
    host = apiBaseUrl.replace(/^https?:\/\//, '');
  } else {
    protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    host = window.location.host;
  }
  
  const token = localStorage.getItem('giftistry-token') || '';
  return `${protocol}//${host}/ws/wishlist/${listId}?token=${encodeURIComponent(token)}`;
};

export const CommentSection: React.FC<CommentSectionProps> = ({
  listId,
  isOwner,
  items = [],
  onItemTaggedClick,
  isTaggingModeActive,
  setIsTaggingModeActive,
  taggedItemIds,
  setTaggedItemIds,
}) => {
  const { user } = useAuth();
  
  const {
    comments,
    isLoading,
    error,
    fetchComments,
    addComment,
    deleteComment,
  } = useCommentController();

  const [content, setContent] = useState('');
  const [commenterName, setCommenterName] = useState('');
  const [isOwnerVisible, setIsOwnerVisible] = useState(false); // Surprise is default!
  const [isRollover, setIsRollover] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);

  // Real-time states
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [typingUsersMap, setTypingUsersMap] = useState<Record<string, string>>({});
  const typingTimeoutRefs = useRef<Record<string, any>>({});
  const socketRef = useRef<WebSocket | null>(null);
  const typingTimeoutRef = useRef<any>(null);
  const isTypingRef = useRef(false);

  useEffect(() => {
    fetchComments(listId);
  }, [listId, fetchComments]);

  useEffect(() => {
    if (user) {
      setCommenterName(user.FirstName ? `${user.FirstName} ${user.LastName}` : user.Username);
    }
  }, [user]);

  // WebSocket Connection
  useEffect(() => {
    if (isOwner) return; // Owners don't connect to ws discussion chat

    const wsUrl = getWsUrl(listId);
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'presence') {
          setOnlineUsers(data.users || []);
        } else if (data.type === 'typing') {
          if (data.userId !== user?.Id) {
            if (data.isTyping) {
              setTypingUsersMap(prev => ({
                ...prev,
                [data.userId]: data.username
              }));
              
              if (typingTimeoutRefs.current[data.userId]) {
                clearTimeout(typingTimeoutRefs.current[data.userId]);
              }
              
              typingTimeoutRefs.current[data.userId] = setTimeout(() => {
                setTypingUsersMap(prev => {
                  const updated = { ...prev };
                  delete updated[data.userId];
                  return updated;
                });
              }, 5000);
            } else {
              setTypingUsersMap(prev => {
                const updated = { ...prev };
                delete updated[data.userId];
                return updated;
              });
              if (typingTimeoutRefs.current[data.userId]) {
                clearTimeout(typingTimeoutRefs.current[data.userId]);
              }
            }
          }
        }
      } catch (err) {
        console.error('Error parsing WS message:', err);
      }
    };

    socket.onclose = () => {
      setOnlineUsers([]);
      setTypingUsersMap({});
    };

    return () => {
      socket.close();
      socketRef.current = null;
      Object.values(typingTimeoutRefs.current).forEach(clearTimeout);
    };
  }, [listId, user, isOwner]);

  const handleContentChange = (val: string) => {
    setContent(val);
    
    if (isOwner) return;
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socketRef.current.send(JSON.stringify({ type: 'typing', isTyping: true }));
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (isTypingRef.current && socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({ type: 'typing', isTyping: false }));
        isTypingRef.current = false;
      }
    }, 2000);
  };

  const handleSelectTagItem = (itemId: string, itemName: string) => {
    handleContentChange(content ? `${content} [${itemName}](item:${itemId})` : `[${itemName}](item:${itemId})`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitLoading(true);
    setLocalError(null);

    // Stop typing indicator on submit
    if (isTypingRef.current && socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'typing', isTyping: false }));
      isTypingRef.current = false;
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    let finalContent = content.trim();
    if (taggedItemIds.length > 0) {
      const tagLinks = taggedItemIds
        .map(id => {
          const matchedItem = items.find(i => i.Id === id);
          return matchedItem ? `[${matchedItem.Name}](item:${id})` : null;
        })
        .filter(Boolean)
        .join(' ');
      
      if (tagLinks) {
        finalContent += `\n\n🏷️ Tagged Items: ${tagLinks}`;
      }
    }

    try {
      await addComment(
        listId,
        finalContent,
        commenterName.trim() || null,
        isOwner ? true : isOwnerVisible,
        isRollover
      );
      setContent('');
      setIsRollover(false);
      setTaggedItemIds([]);
      setIsTaggingModeActive(false);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to post comment.');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const displayError = error || localError;
  const typingUsers = Object.values(typingUsersMap);

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(listId, commentId);
      setDeletingCommentId(null);
    } catch {
      // Error is set in the hook
    }
  };

  return (
    <CommentSectionTemplate
      isOwner={isOwner}
      currentUserId={user?.Id}
      comments={comments}
      isLoading={isLoading}
      displayError={displayError}
      content={content}
      setContent={handleContentChange}
      commenterName={commenterName}
      setCommenterName={setCommenterName}
      isOwnerVisible={isOwnerVisible}
      setIsOwnerVisible={setIsOwnerVisible}
      isRollover={isRollover}
      setIsRollover={setIsRollover}
      isSubmitLoading={isSubmitLoading}
      handleSubmit={handleSubmit}
      formatDate={formatDate}
      items={items}
      onlineUsers={onlineUsers}
      typingUsers={typingUsers}
      onItemTaggedClick={onItemTaggedClick}
      handleSelectTagItem={handleSelectTagItem}
      isTaggingModeActive={isTaggingModeActive}
      setIsTaggingModeActive={setIsTaggingModeActive}
      taggedItemIds={taggedItemIds}
      setTaggedItemIds={setTaggedItemIds}
      handleDeleteComment={handleDeleteComment}
      deletingCommentId={deletingCommentId}
      setDeletingCommentId={setDeletingCommentId}
    />
  );
};
