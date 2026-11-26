import { 
  LucideProps,
  LucideIcon,
  
  Home, User, Settings, 
  Bell, Mail, 
  HelpCircle, 
  Cloud, Cloudy,
  X, Shield,
  Clover, Heart, HeartCrack,
  Swords, Lock, Key, Users, UserGroup, 
  Venus, Mars, 
  MoonStar, Star, Sparkle,
  Hamburger, Cat, Dog, Bird, Fish, Rabbit, Squirrel,
  Sprout, Leaf, Flower2, Rose, 
  Ghost, Disc, Disc2, 
} from 'lucide-react';

// 1. Define your dictionary of allowed icons
export const ICON_DICTIONARY: Record<string, LucideIcon> = {
  home: Home,
  user: User,
  settings: Settings,
  notifications: Bell,
  messages: Mail,
  cloud: Cloud, cloudy: Cloudy,
  x: X, shield: Shield,
  clover: Clover, heart: Heart, heartcrack: HeartCrack,
  swords: Swords, lock: Lock, key: Key, users: Users, usergroup: UserGroup, 
  venus: Venus, mars: Mars, 
  moonstar: MoonStar, start: Star, sparkle: Sparkle,
  hamburger: Hamburger, cat: Cat, dog: Dog, bird: Bird, fish: Fish, rabbit: Rabbit, 
  squirrel: Squirrel,
  sprout: Sprout, leaf: Leaf, flower2: Flower2, rose: Rose, 
  ghost: Ghost, disc: Disc, disc2: Disc2, 
};

// Optional: Export the keys as a type for autocomplete in other components
export type IconName = keyof typeof ICON_DICTIONARY;

interface DynamicIconProps extends LucideProps {
  name: string;
}

export default function DynamicIcon({ 
  name, 
  className = '', 
  size = 20, 
  ...props 
}: DynamicIconProps) {
  // 2. Look up the icon, falling back to HelpCircle if the key isn't found
  const IconComponent = ICON_DICTIONARY[name.toLowerCase()] || HelpCircle;
  return (
    <IconComponent 
      size={size} 
      className={className} 
      {...props} 
    />
  );
}