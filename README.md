# Mural Marker

> **Under construction — all mural data is mock data.**
>
> Every entry in `src/content/murals/` is fabricated for development and
> testing. The artist names, titles, descriptions, dates, addresses, photo
> credits, and sources are invented. They are deliberately realistic — real
> neighborhoods, plausible names, multi-artist entries, a mix of existing and
> removed works — so that layout, filtering, and the timeline get exercised
> against data shaped like the real thing. None of it documents an actual
> mural, and no real artist or photographer is credited anywhere in this
> repository.
>
> Real records will replace this set before the archive is presented as one.
> Until then, please don't cite, scrape, or reuse anything in
> `src/content/murals/` as fact.

## Overview

Washington D.C. is home to a thriving community of artists and much of
that creative expression finds its way onto the many walls of the city.
But murals are temporary, and once they're painted over, they disappear
forever. I wanted to create a tool that would archive these works while
simultaneously providing a snapshot in time of the mural landscape. A more
direct way of imagining how all of the works blended together. This is an
incomplete record, and likely always will be, but hopefully piece by piece
we can put together a more comprehensive picture of the city's art
history.

## Licensing & Rights

The material on this site sits in a few different layers, and each one carries its own rights.

### Site code

The source code for this site is licensed under the MIT license — see
[LICENSE](LICENSE).

### Original content

The writing, mural locations, and other descriptive information I've compiled here are licensed under a
Creative Commons Attribution 4.0 International license (https://creativecommons.org/licenses/by/4.0/) —
see [LICENSE-CONTENT](LICENSE-CONTENT).
Feel free to use it, adapt it, build on it, just credit Mural Marker and link back.

### Murals

The murals remain the copyright of the
artists who created them. Nothing on this site grants any rights to
reproduce, adapt, or commercially use the artwork. They are
documented here for archival and educational purposes; if you want to use
an image of a work, please contact the artist.

### Photographs

Photographs carry their own copyright held by the photographer. Because a
photograph of a mural also depicts the underlying artwork, reusing one may
require permission from both the photographer and the artist.

## Dev Details: Commands

All commands are run from the root of the project, from a terminal:

| Command        | Action                                       |
| :------------- | :------------------------------------------- |
| `pnpm install` | Installs dependencies                        |
| `pnpm dev`     | Starts local dev server at `localhost:4321`  |
| `pnpm build`   | Build your production site to `./dist/`      |
| `pnpm preview` | Preview your build locally, before deploying |
