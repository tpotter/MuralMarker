import { useCallback, useMemo, useState } from "react";
import Lightbox, {
  type ImageSource,
  type SlideImage,
} from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { getPhotoImgProps, type Photo } from "../lib/photos";
import { PHOTO_PLACEHOLDER } from "../lib/constants";

interface MuralImageProps {
  id: string;
  muralPhotos: Photo[];
  muralTitle?: string;
}

const PHOTO_SIZES = "(max-width: 1040px) calc(100vw - 2rem), 1000px";

export const MuralImage = ({
  id,
  muralPhotos,
  muralTitle,
}: MuralImageProps) => {
  const [isOpen, setIsOpen] = useState(false);
  // TODO use setPhotIndex once multiple photos are supported
  const [photoIndex, setPhotoIndex] = useState(0);

  const hasNoPhotos = !muralPhotos || muralPhotos.length === 0;

  const photos = useMemo(() => {
    if (hasNoPhotos) {
      return [
        {
          src: PHOTO_PLACEHOLDER.src,
          alt: "No Photo Available",
          srcSet: [],
          defaultSrcSet: "",
          width: PHOTO_PLACEHOLDER.width,
          height: PHOTO_PLACEHOLDER.height,
        },
      ];
    }

    return muralPhotos.map((muralPhoto) => {
      const { src, defaultSrcSet, srcSet, width, height } = getPhotoImgProps(
        id,
        muralPhoto,
        PHOTO_SIZES,
      );
      const alt = muralPhoto.caption ?? muralTitle ?? "Untitled";

      return {
        src,
        defaultSrcSet,
        srcSet,
        width,
        height,
        alt,
      };
    });
  }, [hasNoPhotos, muralPhotos, id, muralTitle]);

  const slides: SlideImage[] = useMemo(
    () =>
      photos.map((photo) => ({
        src: photo.src,
        srcSet: photo.srcSet,
        width: photo.width,
        height: photo.height,
      })),
    [photos],
  );

  const onOpen = useCallback(() => {
    if (hasNoPhotos) {
      return;
    }
    setIsOpen(true);
  }, [hasNoPhotos]);

  const onClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <div>
      <img
        className={`md:w-4/5 lg:w-4/5 ml-auto mr-auto bg-neutral-200 bg-[url('/photo-loading.svg')] bg-center bg-no-repeat bg-[length:96px] ${hasNoPhotos ? "" : "cursor-zoom-in"}`}
        alt={photos[photoIndex].alt}
        loading={"eager"}
        decoding="async"
        src={photos[photoIndex].src}
        srcSet={photos[photoIndex].defaultSrcSet}
        width={photos[photoIndex].width}
        height={photos[photoIndex].height}
        sizes={PHOTO_SIZES}
        onClick={onOpen}
      />
      {muralPhotos[photoIndex] && (
        <p className="text-sm md:w-4/5 lg:w-4/5 md:ml-auto md:mr-auto">
          Photo credit:{" "}
          {muralPhotos[photoIndex].credit ?? "Unknown photographer"}
        </p>
      )}
      <Lightbox
        open={isOpen}
        close={onClose}
        slides={slides}
        carousel={{ finite: slides.length <= 1 }}
        render={{
          iconLoading: () => (
            <img src="/photo-loading.svg" alt="" width={96} height={96} />
          ),
        }}
      />
    </div>
  );
};
