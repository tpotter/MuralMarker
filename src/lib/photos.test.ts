import { describe, expect, it } from "vitest";
import { PHOTO_BASE_URL } from "./constants";
import {
  getPhotoImgProps,
  getPhotoSrcSet,
  getPhotoUrl,
  type Photo,
} from "./photos";

const makePhoto = (width: number, height = 1000): Photo => ({
  file: "front",
  width,
  height,
});

/** Parse "<url> 400w, <url> 800w" into [width, url] pairs. */
const parseSrcSet = (srcSet: string): [number, string][] =>
  srcSet
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [url, descriptor] = entry.split(/\s+/);
      return [Number(descriptor.replace(/w$/, "")), url];
    });

const widthsOf = (srcSet: string) => parseSrcSet(srcSet).map(([w]) => w);

describe("PHOTO_BASE_URL", () => {
  it("is an absolute https URL", () => {
    expect(PHOTO_BASE_URL).toMatch(/^https:\/\//);
  });
});

describe("getPhotoUrl", () => {
  it("builds <base>/<entry id>/<file>-<width>.webp", () => {
    expect(getPhotoUrl("front", 800)).toBe(
      `${PHOTO_BASE_URL.replace(/\/$/, "")}/front-800.webp`,
    );
  });

  it("returns an absolute URL, as og:image requires", () => {
    const url = new URL(getPhotoUrl("front", 1200));

    expect(url.protocol).toBe("https:");
    expect(url.pathname).toBe("/front-1200.webp");
  });

  it("never emits a doubled slash, whatever the base URL ends with", () => {
    const url = getPhotoUrl("front", 400);

    // Only the protocol's "//" is allowed.
    expect(url.slice("https://".length)).not.toContain("//");
  });

  it("keeps each variant width distinct", () => {
    const widths = [400, 800, 1200, 1600, 2400] as const;
    const urls = widths.map((w) => getPhotoUrl("front", w));

    expect(new Set(urls).size).toBe(widths.length);
  });
});

describe("getPhotoSrcSet", () => {
  it("offers the full ladder for a photo larger than every rung", () => {
    const srcSet = getPhotoSrcSet("entry", makePhoto(3000));

    expect(widthsOf(srcSet)).toEqual([400, 800, 1200, 1600, 2400]);
  });

  it("stops at the photo's own width — a 900px photo has no 1200px variant", () => {
    // The ladder is truncated at prep time (plan §5.3), so offering a wider
    // rung here would point srcset at a file that was never uploaded.
    const srcSet = getPhotoSrcSet("entry", makePhoto(900));

    expect(widthsOf(srcSet)).toEqual([400, 800]);
  });

  it("includes a rung exactly matching the photo's width", () => {
    const srcSet = getPhotoSrcSet("entry", makePhoto(1200));

    expect(widthsOf(srcSet)).toEqual([400, 800, 1200]);
  });

  it("still offers the smallest rung for a photo below it", () => {
    // prepare-photos.mjs generates the 400px variant even for a tiny source,
    // so the entry is never left with an empty srcset.
    const srcSet = getPhotoSrcSet("entry", makePhoto(320, 240));

    expect(widthsOf(srcSet)).toEqual([400]);
  });

  it("pairs each URL with a matching width descriptor, in ascending order", () => {
    const entries = parseSrcSet(getPhotoSrcSet("entry", makePhoto(1600)));

    expect(entries.length).toBeGreaterThan(1);
    for (const [width, url] of entries) {
      expect(url).toBe(getPhotoUrl("front", width));
    }
    const widths = entries.map(([w]) => w);
    expect([...widths].sort((a, b) => a - b)).toEqual(widths);
  });

  it("uses the photo's own file name", () => {
    const srcSet = getPhotoSrcSet("entry", {
      ...makePhoto(800),
      file: "back_wall-2",
    });

    for (const [, url] of parseSrcSet(srcSet)) {
      expect(url).toContain("/back_wall-2-");
    }
  });
});

describe("getPhotoImgProps", () => {
  // The shared attribute bundle both call sites spread onto <img>, so the
  // popup and the detail page can't drift apart. `sizes` stays a parameter:
  // only the caller knows how wide the image renders in its own layout.

  it("returns only the attributes that depend on the photo", () => {
    const props = getPhotoImgProps("entry", makePhoto(1600), "260px");

    // loading/decoding/fetchpriority are deliberately absent — they vary per
    // call site (eager + high for the first detail photo, lazy elsewhere).
    expect(Object.keys(props).sort()).toEqual([
      "height",
      "sizes",
      "src",
      "srcSet",
      "width",
    ]);
  });

  it("reuses getPhotoSrcSet verbatim", () => {
    const photo = makePhoto(1600);

    expect(getPhotoImgProps("entry", photo, "260px").srcSet).toBe(
      getPhotoSrcSet("entry", photo),
    );
  });

  it("passes sizes through untouched", () => {
    const sizes = "(max-width: 1040px) calc(100vw - 2rem), 1000px";

    expect(getPhotoImgProps("entry", makePhoto(2400), sizes).sizes).toBe(sizes);
  });

  it("carries the original's dimensions for aspect-ratio reservation", () => {
    const props = getPhotoImgProps("entry", makePhoto(3024, 4032), "100vw");

    expect(props.width).toBe(3024);
    expect(props.height).toBe(4032);
  });

  it("falls back to the 1200px variant, the widest any layout needs", () => {
    // src is only read by browsers that ignore srcset, so it should be a
    // middle rung — never the 2400px file.
    const props = getPhotoImgProps("entry", makePhoto(3000), "100vw");

    expect(props.src).toBe(getPhotoUrl("front", 1200));
  });

  it("caps the fallback at a variant that was actually generated", () => {
    // A 900px original has no 1200px variant (plan §5.3), so src must drop to
    // the next rung down rather than 404.
    const props = getPhotoImgProps("entry", makePhoto(900), "260px");

    expect(props.src).toBe(getPhotoUrl("front", 800));
  });

  it("still yields a usable src for a photo below the smallest rung", () => {
    const props = getPhotoImgProps("entry", makePhoto(320, 240), "260px");

    expect(props.src).toBe(getPhotoUrl("front", 400));
  });

  it("offers the fallback as one of the srcset candidates", () => {
    for (const width of [3000, 900, 320]) {
      const photo = makePhoto(width);
      const props = getPhotoImgProps("entry", photo, "260px");
      const candidates = parseSrcSet(props.srcSet).map(([, url]) => url);

      expect(candidates).toContain(props.src);
    }
  });
});
