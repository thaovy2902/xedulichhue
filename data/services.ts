import {
  Plane,
  Landmark,
  MapPin,
  Route,
  Building2,
  Hotel,
  Waves,
  Trees,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface ServiceItem {
  id: string;
  /** CSS gradient for the image placeholder background */
  gradient: string;
  Icon: LucideIcon;
  /** Number of feature bullet points - matches feature0…featureN keys in messages */
  featureCount: number;
}

export const servicesData: ServiceItem[] = [
  {
    id: 'san_bay_phu_bai_hue',
    gradient: 'linear-gradient(135deg, #0a66e8 0%, #0d3878 100%)',
    Icon: Plane,
    featureCount: 3,
  },
  {
    id: 'tour_langco',
    gradient: 'linear-gradient(135deg, #0891b2 0%, #164e63 100%)',
    Icon: Waves,
    featureCount: 2,
  },
  {
    id: 'tour_hue',
    gradient: 'linear-gradient(135deg, #ff7a00 0%, #7f380c 100%)',
    Icon: Landmark,
    featureCount: 2,
  },
  {
    id: 'tour_lavang',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #3b0764 100%)',
    Icon: MapPin,
    featureCount: 2,
  },
  {
    id: 'tour_danang',
    gradient: 'linear-gradient(135deg, #0a66e8 0%, #c75200 100%)',
    Icon: Route,
    featureCount: 2,
  },
  {
    id: 'tour_hoian',
    gradient: 'linear-gradient(135deg, #d97706 0%, #78350f 100%)',
    Icon: Building2,
    featureCount: 2,
  },
  {
    id: 'tour_laguna',
    gradient: 'linear-gradient(135deg, #0d9488 0%, #134e4a 100%)',
    Icon: Hotel,
    featureCount: 2,
  },
  {
    id: 'tour_vedana',
    gradient: 'linear-gradient(135deg, #16a34a 0%, #14532d 100%)',
    Icon: Trees,
    featureCount: 2,
  },
  {
    id: 'tour_phongnha',
    gradient: 'linear-gradient(135deg, #16a34a 0%, #14532d 100%)',
    Icon: Trees,
    featureCount: 2,
  },
];
