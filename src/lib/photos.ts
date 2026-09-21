import type { Mural } from "../content.config";
import { PHOTO_BASE_URL, PHOTO_PLACEHOLDER } from "./constants";

export type Photo = Mural["photos"][number];

const WIDTH_POINTS = [400, 800, 1200, 1600, 2400];

export const getPhotoUrl = (file: string, width: number) => {
  return `${PHOTO_BASE_URL}${file}-${width}.webp`;
};

export const getPhotoSrcSet = (entryId: string, photo: Photo) => {
  const validWidths = WIDTH_POINTS.filter((width) => photo.width >= width);

  if (validWidths.length === 0) {
    return `${getPhotoUrl(photo.file, WIDTH_POINTS[0])} ${WIDTH_POINTS[0]}w`;
  }

  const srcSetPaths = validWidths
    .map((width) => {
      return `${getPhotoUrl(photo.file, width)} ${width}w`;
    })
    .join();

  return srcSetPaths;
};

export const getPhotoImgProps = (
  entryId: string,
  photo: Photo | undefined,
  sizes: string,
) => {
  if (!photo) {
    return {
      src: PHOTO_PLACEHOLDER.src,
      srcSet: "",
      sizes,
      width: PHOTO_PLACEHOLDER.width,
      height: PHOTO_PLACEHOLDER.height,
    };
  }

  const srcSet = getPhotoSrcSet(entryId, photo);
  const srcArray = srcSet.split(",");

  let src = "";
  if (srcArray.length >= 3) {
    src = getPhotoUrl(photo.file, 1200);
  } else if (srcArray.length === 2) {
    src = getPhotoUrl(photo.file, 800);
  } else {
    src = src = getPhotoUrl(photo.file, 400);
  }

  return {
    src,
    srcSet,
    sizes,
    width: photo.width,
    height: photo.height,
  };
};
