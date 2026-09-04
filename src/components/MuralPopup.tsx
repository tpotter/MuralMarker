import type { MuralEntry } from "../lib/types";

interface MuralPopupProps {
  mural: MuralEntry;
}

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

  return (
    <div className="flex flex-col">
      <h3 className="text-xl">{mural.title || "Untitled"}</h3>
      <div className="flex gap-1">
        {mural.artists.map((artist) => artist.name)}
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
      <img src="/mural-placeholder.svg" />
    </div>
  );
};
