import React from 'react';
import { Clock, Smile, Leaf, Coffee, Trophy, Globe, Lightbulb, Heart, Flag } from 'lucide-react';
import type { EmojiCategoryId } from '../interfaces/emoji-category-id.type';

export const DEFAULT_EMOJI_CATEGORY: EmojiCategoryId = 'smileys_people';

export const EMOJI_CATEGORIES: ReadonlyArray<{
  id: EmojiCategoryId;
  name: string;
  icon: React.ReactNode;
}> = [
  { id: 'suggested', name: 'Frequently Used', icon: <Clock size={16} /> },
  { id: 'smileys_people', name: 'Smileys & People', icon: <Smile size={16} /> },
  { id: 'animals_nature', name: 'Animals & Nature', icon: <Leaf size={16} /> },
  { id: 'food_drink', name: 'Food & Drink', icon: <Coffee size={16} /> },
  { id: 'activities', name: 'Activities', icon: <Trophy size={16} /> },
  { id: 'travel_places', name: 'Travel & Places', icon: <Globe size={16} /> },
  { id: 'objects', name: 'Objects', icon: <Lightbulb size={16} /> },
  { id: 'symbols', name: 'Symbols', icon: <Heart size={16} /> },
  { id: 'flags', name: 'Flags', icon: <Flag size={16} /> },
];
