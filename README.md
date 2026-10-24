# MeteoMap

MeteoMap is a browser-based GIS and geospatial data workspace built with React. It brings an interactive map, local geospatial file preview, format-conversion screens, and weather- and GIS-oriented analysis/tool interfaces together in one application. The project is designed as a lightweight starting point for exploring and working with common spatial datasets without needing a desktop GIS for every task.

> **Project status:** This repository is an early-stage frontend prototype. The map and file-layer preview are implemented, while several converter, analysis, and GIS-tool screens currently serve as interface demonstrations. Their controls and sample outputs should not be treated as completed geospatial processing workflows.

## Highlights

### Interactive map and layers

- View and navigate a Leaflet map with zoom controls and a live latitude/longitude and zoom readout.
- Switch between Streets (OpenStreetMap), Satellite (Esri), Topographic (OpenTopoMap), and Dark (CartoDB) basemaps.
- Add spatial files through the file picker or drag and drop, view them as map layers, and remove layers from the layer list.
- Supported map previews include GeoJSON/JSON, zipped Shapefiles, CSV point data, KML, GPX, and GeoTIFF raster files.
- CSV point previews expect `lat` and `lon` fields. Loaded vector and raster layers are used to fit the map to their bounds when available.

### Format converter workspace

The converter area provides dedicated screens and format guidance for these conversion pairs:

- CSV → GeoJSON
- Shapefile (ZIP) → GeoJSON
- GeoJSON → KML
- KML → GeoJSON
- GeoJSON → CSV
- WKT → GeoJSON
- GeoJSON → Shapefile (ZIP)

Each screen includes file selection, a conversion/output panel, format explanations, common use cases, and FAQs. Conversion execution is not fully implemented in the current prototype.

### Analysis demonstrations

The analysis section presents configuration panels, classification categories, interpretation notes, FAQs, and sample charts for:

- Standardized Precipitation Index (SPI)
- Standardized Precipitation-Evapotranspiration Index (SPEI)
- Normalized Difference Vegetation Index (NDVI)
- Land Surface Temperature (LST)
- Zonal Statistics
- Hotspot Analysis (Getis-Ord Gi*)

The charts are based on bundled sample data. The current “Run Analysis” interaction simulates progress and does not calculate results from uploaded datasets.

### GIS tools demonstrations

The tools section describes interfaces and workflows for drawing, distance and area measurement, buffering, clipping, and dissolving. In this prototype, activating a tool changes its displayed state; the spatial operations are not yet connected to map data.

### Interface and navigation

- React Router provides separate screens for the map, converters, analyses, and tools.
- A shared navigation header organizes the sections.
- Light and dark themes are available from the header.
- The layout uses Tailwind CSS 4 utilities, with Lucide icons and Recharts sample visualizations.

## Technology

- **React 18** for the user interface
- **Vite 6** for local development and production builds
- **Leaflet** for interactive maps
- **Tailwind CSS 4** for styling
- **Papa Parse**, **shpjs**, **@tmcw/togeojson**, **georaster**, and **georaster-layer-for-leaflet** for parsing or displaying supported spatial formats
- **Recharts** for analysis sample charts
- **React Router** for client-side routes
- **Axios** is included for an API client scaffold; the core map experience does not require a backend

## Getting started

### Requirements

- Node.js and npm
- An internet connection for the external basemap tiles and Leaflet assets used by the app

### Install and run

```sh
npm install
npm run dev
```

Vite prints the local development URL in the terminal after the server starts.

### Production build

```sh
npm run build
npm run preview
```

The production bundle is generated in `dist/`; the preview command serves that build locally.

## Project structure

```text
src/
	main.jsx                 React application entry point
	app/
		App.jsx                Route configuration
		Home.jsx               Main map and layer workspace
		LeafMap.jsx            Leaflet initialization and file-layer display
		SideBar.jsx            File upload and layer list
		basemap/               Basemap definitions and selector
		converter/             Converter definitions and screens
		analysis/              Analysis definitions and sample-chart UI
		tools/                 GIS tool definitions and demonstration UI
		Utils/                 Navigation item helpers
	styles/                  Global, theme, font, and Tailwind styles
	assets/                  Images and other static assets
```

## Data and network notes

Files selected for map preview are read by the browser and are not sent to a MeteoMap server by the map-viewing workflow. The application does request external map tiles and Leaflet assets, so map use requires a network connection and is subject to the providers’ terms and attribution requirements. Converter descriptions also claim browser-local processing, but conversion processing is not yet fully wired up in this repository.

## Current limitations

- Converter screens are present, but conversion functions are not yet connected to the conversion action.
- Analysis outputs shown in the interface are examples, not calculations performed on user inputs.
- GIS tool controls currently demonstrate the intended workflows; they do not yet modify map layers.
- The layer preview is a visualization workflow, not a complete GIS editing or project-file management system.
- Although `.gpkg` appears in the upload picker’s accepted extensions, GeoPackage preview is not implemented.

## License

No license file is currently included. Contact the project owner for permission and licensing information before redistributing or reusing the project.
