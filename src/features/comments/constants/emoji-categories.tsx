import React from 'react';
import { Clock, Smile, Leaf, Coffee, Trophy, Globe, Lightbulb, Heart, Flag } from 'lucide-react';
import { Categories } from 'emoji-picker-react';

export const DEFAULT_EMOJI_CATEGORY = Categories.SMILEYS_PEOPLE;

export const EMOJI_CATEGORIES = [
  { id: Categories.SUGGESTED, name: 'Frequently Used', icon: <Clock size={16} /> },
  { id: Categories.SMILEYS_PEOPLE, name: 'Smileys & People', icon: <Smile size={16} /> },
  { id: Categories.ANIMALS_NATURE, name: 'Animals & Nature', icon: <Leaf size={16} /> },
  { id: Categories.FOOD_DRINK, name: 'Food & Drink', icon: <Coffee size={16} /> },
  { id: Categories.ACTIVITIES, name: 'Activities', icon: <Trophy size={16} /> },
  { id: Categories.TRAVEL_PLACES, name: 'Travel & Places', icon: <Globe size={16} /> },
  { id: Categories.OBJECTS, name: 'Objects', icon: <Lightbulb size={16} /> },
  { id: Categories.SYMBOLS, name: 'Symbols', icon: <Heart size={16} /> },
  { id: Categories.FLAGS, name: 'Flags', icon: <Flag size={16} /> },
] as const;
