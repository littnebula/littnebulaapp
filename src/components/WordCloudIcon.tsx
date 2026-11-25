import { DynamicIcon, type IconName } from 'lucide-react/dynamic';

const WordCloudIcon = ({
  iconame,
  size,
  color
}: {
  iconame: IconName;
  size: number;
  color: string;
  }) => (
  <DynamicIcon 
  name={iconame} 
  size={size}
  style={{color: color}}
  />
);

export default WordCloudIcon;