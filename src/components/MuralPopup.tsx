import { getPhotoImgProps } from "../lib/photos";
import type { MuralEntry } from "../lib/types";

interface MuralPopupProps {
  mural: MuralEntry;
}

const POPUP_PHOTO_SIZES = "260px";

export const MuralPopup = ({ mural }: MuralPopupProps) => {
  /*
    mural.title
    mural.description
    mural.dateStart
    mural.dateEnd
    mural.location
    mural.artists
    mural.removalDateUncertain
    */

  const photoProps = getPhotoImgProps(
    mural.id,
    mural.photos[0],
    POPUP_PHOTO_SIZES,
  );
  const alt =
    mural.photos.length > 0 ? mural.photos[0].caption : "No image available";

  console.log(photoProps.src);

  return (
    <div className="flex flex-col">
      <h3 className="text-xl">{mural.title || "Untitled"}</h3>
      <div className="flex flex-col">
        {mural.artists.map((artist) => (
          <span>{artist.name}</span>
        ))}
      </div>
      <div className="flex gap-1">
        <span>
          {mural.dateStart.month}
          {mural.dateStart.month && <span>&#47;</span>}
          {mural.dateStart.year}
        </span>
        -{/* Mural still present */}
        {!mural.dateEnd && !mural.removalDateUncertain && (
          <span>Present Day</span>
        )}
        {/* Defined removal date */}
        {mural.dateEnd && !mural.removalDateUncertain && (
          <span>
            {mural.dateEnd.month}
            {mural.dateEnd.month && <span>&#47;</span>}
            {mural.dateEnd.year}
          </span>
        )}
        {/* Removed, but unknown when */}
        {mural.dateEnd && mural.removalDateUncertain && <span>Unknown</span>}
      </div>
      <p>{mural.location.address || mural.location.neighborhood}</p>
      <a href={`/murals/${mural.id}`}>Go to mural page</a>
      <img
        // src="/mural-placeholder.svg"

        // TODO give alternate ALT value
        alt={alt}
        loading="lazy"
        decoding="async"
        {...photoProps}
      />
    </div>
  );
};
