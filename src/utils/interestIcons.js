import { CLOUDFRONT_BASE_URL } from './constants';

/** Icon URL — selected/unselected colors applied via CSS (#DA6C74 brand) */
export function getInterestIconUrl(item) {
  const path =
    item?.interest_icon || item?.interest_color_icon || item?.interest_white_icon;
  if (!path) return null;
  return `${CLOUDFRONT_BASE_URL}/${path}`;
}

