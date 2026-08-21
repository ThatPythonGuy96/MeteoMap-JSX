import { FileJson, FileText, Globe } from "lucide-react";

export const CONVERTERS = [
    {
        id: "csv-geojson",
        from: "CSV",
        to: "GeoJSON",
        label: "CSV → GeoJSON",
        icon: <FileJson size={14} />,
        description: "Convert tabular CSV data with latitude/longitude columns into standards-compliant GeoJSON point features. No account required. Processing happens entirely in your browser — your data never leaves your machine.",
        fromDesc: "CSV (Comma-Separated Values) is a plain-text tabular format widely used for storing attribute data. When columns for longitude and latitude are present, CSV files can represent geographic point data.",
        toDesc: "GeoJSON is an open standard format for encoding geographic data structures using JSON. It supports points, lines, polygons, and multi-part geometries alongside arbitrary attribute properties.",
        accept: ".csv",
        outputExt: "geojson",
        outputMime: "application/geo+json",
        helpText: "lat,lon,name\n6.5244,3.3792,Lagos\n9.0765,7.3986,Abuja",
        faqs: [
            { q: "Which columns are used for coordinates?", a: "The converter automatically detects common column names: lat, latitude, lng, lon, longitude, x, y." },
            { q: "What if my CSV uses a different delimiter?", a: "Tab, semicolon, and pipe-delimited files are supported in addition to standard commas." },
            { q: "Is my data uploaded to a server?", a: "No. All conversion happens entirely in your browser using JavaScript. Your data never leaves your machine." },
            { q: "What coordinate system should my CSV use?", a: "Coordinates should be in WGS 84 (EPSG:4326) — standard decimal degrees latitude and longitude." },
            { q: "Can I convert multiple CSV files at once?", a: "Yes. Drop multiple files onto the upload zone and each will be converted to a separate GeoJSON file." },
        ],
        useCases: ["Converting GPS waypoint exports to web maps", "Importing sensor or IoT location data", "Migrating spreadsheet data to GIS platforms"],
        whyConvert: ["Enable spatial joins and geo-operations on tabular data", "Display point data on Leaflet, Mapbox, or other web mapping libraries", "Load into QGIS, ArcGIS, or PostGIS for further analysis"],
        toStrengths: ["Open standard supported by virtually all GIS tools", "Native browser and web support via JavaScript", "Supports all geometry types"],
    },
    {
        id: "shp-geojson",
        from: "Shapefile",
        to: "GeoJSON",
        label: "Shapefile → GeoJSON",
        icon: <FileJson size={14} />,
        description:
            "Convert ESRI Shapefiles into modern GeoJSON format for use in web maps, GIS software, and APIs. Upload a zipped Shapefile and convert it instantly in your browser without sending data to a server.",

        fromDesc:
            "An ESRI Shapefile is one of the most widely used GIS vector formats. A complete Shapefile consists of several files (.shp, .shx, .dbf, and optionally .prj) that store geometry, attributes, and coordinate system information.",

        toDesc:
            "GeoJSON is an open standard JSON-based format for storing geographic features. It is lightweight, easy to read, and supported by most modern GIS software and web mapping libraries.",

        accept: ".zip",
        outputExt: "geojson",
        outputMime: "application/geo+json",
        helpText: "Upload a .zip containing the .shp, .dbf and .shx files together.",
        faqs: [
            {
                q: "Why do I need to upload a ZIP file?",
                a: "A Shapefile is made up of multiple files. Compress the .shp, .shx, .dbf, and preferably the .prj files into a single ZIP archive before uploading."
            },
            {
                q: "Are attribute tables preserved?",
                a: "Yes. All feature attributes are copied into the GeoJSON properties object."
            },
            {
                q: "Will my coordinate system be preserved?",
                a: "If a .prj file is included, the converter reads the coordinate reference system and converts it appropriately when needed."
            },
            {
                q: "Can I upload polygons, lines, and points?",
                a: "Yes. All Shapefile geometry types are supported."
            },
            {
                q: "Is my data uploaded anywhere?",
                a: "No. Conversion happens locally in your browser."
            }
        ],
        useCases: [
            "Preparing data for Leaflet or MapLibre",
            "Publishing GIS datasets on the web",
            "Sharing Shapefiles without proprietary software"
        ],

        whyConvert: [
            "GeoJSON is smaller and easier to use in web applications",
            "Supported by virtually every JavaScript mapping library",
            "Simplifies API integration"
        ],

        toStrengths: [
            "Open standard",
            "Human-readable JSON",
            "Excellent browser compatibility"
        ]
    },
    {
        id: "geojson-kml",
        from: "GeoJSON",
        to: "KML",
        label: "GeoJSON → KML",
        icon: <Globe size={14} />,
        description:
            "Convert GeoJSON datasets into KML for viewing in Google Earth, Google Maps, and other KML-compatible GIS applications.",

        fromDesc:
            "GeoJSON stores geographic features using JSON and supports points, lines, polygons, and feature collections with attribute data.",

        toDesc:
            "KML (Keyhole Markup Language) is an XML-based format developed for displaying geographic data in Google Earth and other mapping applications.",
        accept: ".geojson,.json",
        outputExt: "kml",
        outputMime: "application/vnd.google-earth.kml+xml",
        helpText: '{"type":"FeatureCollection","features":[...]}',
        faqs: [
            {
                q: "What software can open KML?",
                a: "Google Earth, Google Maps, ArcGIS, QGIS, Cesium, and many GPS applications."
            },
            {
                q: "Are feature names preserved?",
                a: "Yes. Feature attributes are included as ExtendedData where possible."
            },
            {
                q: "Does the converter support polygons and lines?",
                a: "Yes. Points, lines, polygons, and multi-geometries are supported."
            },
            {
                q: "Can I convert FeatureCollections?",
                a: "Yes. Entire GeoJSON FeatureCollections are converted."
            },
            {
                q: "Is my data uploaded?",
                a: "No. Everything happens inside your browser."
            }
        ],
        useCases: [
            "Viewing GIS data in Google Earth",
            "Sharing datasets with KML users",
            "Exporting web GIS data"
        ],
        whyConvert: [
            "Google Earth requires KML",
            "KML supports styles and placemarks",
            "Useful for GPS devices"
        ],
        toStrengths: [
            "Native Google Earth support",
            "Widely recognized",
            "Supports styling and metadata"
        ]
    },
    {
        id: "kml-geojson",
        from: "KML",
        to: "GeoJSON",
        label: "KML → GeoJSON",
        icon: <FileJson size={14} />,
        description:
            "Convert KML files into GeoJSON for use with modern web mapping libraries and GIS software.",

        fromDesc:
            "KML is an XML-based geographic format commonly used by Google Earth and GPS applications.",

        toDesc:
            "GeoJSON is a lightweight JSON format widely used in modern GIS and web mapping applications.",

        accept: ".kml",
        outputExt: "geojson",
        outputMime: "application/geo+json",
        helpText: "<kml>...</kml>",
        faqs: [
            {
                q: "Can I convert Google Earth files?",
                a: "Yes. Standard KML files exported from Google Earth are supported."
            },
            {
                q: "Will folders and placemarks be preserved?",
                a: "Feature names and properties are preserved whenever possible."
            },
            {
                q: "Does this support polygons and paths?",
                a: "Yes."
            },
            {
                q: "Can I load the result into Leaflet?",
                a: "Yes. GeoJSON is the preferred format for Leaflet."
            },
            {
                q: "Is the conversion local?",
                a: "Yes. No files are uploaded."
            }
        ],

        useCases: [
            "Using Google Earth data on web maps",
            "Migrating legacy GIS datasets",
            "Preparing KML for GIS analysis"
        ],

        whyConvert: [
            "GeoJSON is easier to work with",
            "Supported by JavaScript libraries",
            "Better API compatibility"
        ],

        toStrengths: [
            "Modern web standard",
            "Simple JSON structure",
            "Easy to edit"
        ]
    },
    {
        id: "geojson-csv",
        from: "GeoJSON",
        to: "CSV",
        label: "GeoJSON → CSV",
        icon: <FileText size={14} />,
        description:
            "Extract coordinates and feature attributes from GeoJSON into a spreadsheet-friendly CSV format.",

        fromDesc:
            "GeoJSON stores geographic features together with their properties.",

        toDesc:
            "CSV is a plain-text table format supported by Excel, Google Sheets, databases, and statistical software.",

        accept: ".geojson,.json",
        outputExt: "csv",
        outputMime: "text/csv",
        helpText: '{"type":"FeatureCollection","features":[...]}',
        faqs: [
            {
                q: "How are coordinates exported?",
                a: "Point features are exported as latitude and longitude columns. Other geometries are exported as WKT or centroid coordinates depending on configuration."
            },
            {
                q: "Are properties included?",
                a: "Yes. All feature attributes become CSV columns."
            },
            {
                q: "Can Excel open the result?",
                a: "Yes."
            },
            {
                q: "Can I convert FeatureCollections?",
                a: "Yes."
            },
            {
                q: "Is my data private?",
                a: "Yes. Conversion happens locally."
            }
        ],

        useCases: [
            "Creating spreadsheets",
            "Importing GIS data into databases",
            "Statistical analysis"
        ],

        whyConvert: [
            "CSV is universally supported",
            "Easy to edit",
            "Ideal for reports"
        ],

        toStrengths: [
            "Excel compatible",
            "Simple format",
            "Easy data exchange"
        ]
    },
    {
        id: "wkt-geojson",
        from: "WKT",
        to: "GeoJSON",
        label: "WKT → GeoJSON",
        icon: <FileJson size={14} />,
        description:
            "Convert Well-Known Text (WKT) geometry into GeoJSON for visualization, GIS analysis, and web mapping.",

        fromDesc:
            "WKT is a text representation of vector geometry defined by the Open Geospatial Consortium (OGC).",

        toDesc:
            "GeoJSON is a JSON-based geographic format widely supported by modern GIS software.",
        accept: ".wkt,.txt",
        outputExt: "geojson",
        outputMime: "application/geo+json",
        helpText: "POINT (3.3792 6.5244)\nLINESTRING (3.3 6.5, 3.4 6.6)",
        faqs: [
            {
                q: "What geometry types are supported?",
                a: "Points, MultiPoints, LineStrings, MultiLineStrings, Polygons, and MultiPolygons."
            },
            {
                q: "Can I upload a text file?",
                a: "Yes. Both .txt and .wkt files are supported."
            },
            {
                q: "Are multiple geometries supported?",
                a: "Yes."
            },
            {
                q: "Can I visualize the result on Leaflet?",
                a: "Yes."
            },
            {
                q: "Is conversion local?",
                a: "Yes."
            }
        ],

        useCases: [
            "Converting database geometry",
            "Visualizing PostGIS exports",
            "Preparing geometry for web maps"
        ],

        whyConvert: [
            "GeoJSON is easier to visualize",
            "Compatible with web libraries",
            "Supports attributes"
        ],

        toStrengths: [
            "Web friendly",
            "Open standard",
            "JSON format"
        ]
    },
    {
        id: "geojson-shp",
        from: "GeoJSON",
        to: "Shapefile",
        label: "GeoJSON → Shapefile",
        icon: <FileJson size={14} />,
        description:
            "Convert GeoJSON into an ESRI Shapefile for use in ArcGIS, QGIS, and other desktop GIS software.",

        fromDesc:
            "GeoJSON is a lightweight JSON-based geographic data format commonly used in web GIS.",

        toDesc:
            "An ESRI Shapefile is a widely supported desktop GIS vector format consisting of multiple files containing geometry, attributes, and spatial reference information.",

        accept: ".geojson,.json",
        outputExt: "shp",
        outputMime: "application/zip",
        helpText: '{"type":"FeatureCollection","features":[...]}',
        faqs: [
            {
                q: "Why is the output a ZIP file?",
                a: "A Shapefile consists of multiple files (.shp, .dbf, .shx, and .prj), so they are packaged together in a ZIP archive."
            },
            {
                q: "Will attributes be preserved?",
                a: "Yes."
            },
            {
                q: "Can ArcGIS open the result?",
                a: "Yes. The output is compatible with ArcGIS and QGIS."
            },
            {
                q: "Are all geometry types supported?",
                a: "Yes. Points, lines, and polygons are supported."
            },
            {
                q: "Does conversion happen online?",
                a: "No. Everything happens locally."
            }
        ],

        useCases: [
            "Importing web GIS data into ArcGIS",
            "Preparing data for desktop GIS",
            "Sharing datasets with traditional GIS users"
        ],

        whyConvert: [
            "Many desktop GIS tools still rely on Shapefiles",
            "Useful for legacy workflows",
            "Broad compatibility"
        ],

        toStrengths: [
            "Industry standard",
            "Excellent desktop GIS support",
            "Compatible with most GIS software"
        ]
    }
];