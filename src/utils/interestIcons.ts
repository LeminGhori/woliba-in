import { CLOUDFRONT_BASE_URL } from './constants';

type InterestWithIcon = {
  interest_icon?: string;
  interest_color_icon?: string;
  interest_white_icon?: string;
};

/** Icon URL — selected/unselected colors applied via CSS (#DA6C74 brand) */
export function getInterestIconUrl(item: InterestWithIcon) {
  const path = item.interest_icon || item.interest_color_icon || item.interest_white_icon;
  if (!path) return null;
  return `${CLOUDFRONT_BASE_URL}/${path}`;
}

