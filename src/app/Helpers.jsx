// ─────────────────────────────────────────────────────────────────────────
// CSV helpers
// ─────────────────────────────────────────────────────────────────────────
export function parseCSV(text) {
    const lines = text.replace(/\r\n/g, "\n").split("\n").filter((l) => l.trim().length > 0);
    if (lines.length === 0) throw new Error("The CSV file is empty.");

    const splitLine = (line) => {
        const cells = [];
        let cur = "";
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if (inQuotes) {
                if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
                else if (ch === '"') { inQuotes = false; }
                else cur += ch;
            } else {
                if (ch === '"') inQuotes = true;
                else if (ch === ",") { cells.push(cur); cur = ""; }
                else cur += ch;
            }
        }
        cells.push(cur);
        return cells.map((c) => c.trim());
    };

    const headers = splitLine(lines[0]);
    const rows = lines.slice(1).map(splitLine);
    return { headers, rows };
}

export function csvField(value) {
    const s = String(value ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function findColumn(headers, candidates) {
    const lower = headers.map((h) => h.toLowerCase());
    for (const c of candidates) {
        const idx = lower.indexOf(c);
        if (idx !== -1) return idx;
    }
    return -1;
}

// ─────────────────────────────────────────────────────────────────────────
// WKT helpers
// ─────────────────────────────────────────────────────────────────────────
export function splitTopLevel(str) {
    const parts = [];
    let depth = 0;
    let cur = "";
    for (const ch of str) {
        if (ch === "(") depth++;
        if (ch === ")") depth--;
        if (ch === "," && depth === 0) { parts.push(cur.trim()); cur = ""; }
        else cur += ch;
    }
    if (cur.trim()) parts.push(cur.trim());
    return parts;
}

export function parsePointText(s) {
    return s.trim().split(/\s+/).map(Number).slice(0, 2);
}

export function parseCoordList(s) {
    return splitTopLevel(s).map(parsePointText);
}

export function parseRingList(s) {
    const rings = splitTopLevel(s);
    return rings.map((r) => parseCoordList(r.replace(/^\(|\)$/g, "")));
}

export function parseWKT(wkt) {
    const match = wkt.trim().match(/^([A-Za-z]+)\s*\((.*)\)\s*$/s);
    if (!match) throw new Error(`Could not parse WKT geometry: "${wkt.slice(0, 40)}..."`);
    const type = match[1].toUpperCase();
    const body = match[2];

    switch (type) {
        case "POINT":
            return { type: "Point", coordinates: parsePointText(body) };
        case "LINESTRING":
            return { type: "LineString", coordinates: parseCoordList(body) };
        case "POLYGON":
            return { type: "Polygon", coordinates: parseRingList(body) };
        case "MULTIPOINT":
            return {
                type: "MultiPoint",
                coordinates: splitTopLevel(body).map((p) => parsePointText(p.replace(/^\(|\)$/g, ""))),
            };
        case "MULTILINESTRING":
            return {
                type: "MultiLineString",
                coordinates: splitTopLevel(body).map((l) => parseCoordList(l.replace(/^\(|\)$/g, ""))),
            };
        case "MULTIPOLYGON":
            return {
                type: "MultiPolygon",
                coordinates: splitTopLevel(body).map((poly) => parseRingList(poly.replace(/^\(|\)$/, "").replace(/\)$/, ""))),
            };
        default:
            throw new Error(`Unsupported WKT geometry type: ${type}`);
    }
}

// ─────────────────────────────────────────────────────────────────────────
// KML helpers
// ─────────────────────────────────────────────────────────────────────────
export function xmlEscape(s) {
    return String(s ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

export function coordsToKML(coords, is3d) {
    return coords.map((c) => c.slice(0, is3d ? 3 : 2).join(",")).join(" ");
}

export function ringToKML(ring) {
    return `<LinearRing><coordinates>${coordsToKML(ring)}</coordinates></LinearRing>`;
}

export function geometryToKML(geom) {
    switch (geom.type) {
        case "Point":
            return `<Point><coordinates>${geom.coordinates.slice(0, 2).join(",")}</coordinates></Point>`;
        case "LineString":
            return `<LineString><coordinates>${coordsToKML(geom.coordinates)}</coordinates></LineString>`;
        case "Polygon": {
            const [outer, ...holes] = geom.coordinates;
            return `<Polygon><outerBoundaryIs>${ringToKML(outer)}</outerBoundaryIs>${holes
                .map((h) => `<innerBoundaryIs>${ringToKML(h)}</innerBoundaryIs>`)
                .join("")}</Polygon>`;
        }
        case "MultiPoint":
            return `<MultiGeometry>${geom.coordinates
                .map((c) => `<Point><coordinates>${c.slice(0, 2).join(",")}</coordinates></Point>`)
                .join("")}</MultiGeometry>`;
        case "MultiLineString":
            return `<MultiGeometry>${geom.coordinates
                .map((l) => `<LineString><coordinates>${coordsToKML(l)}</coordinates></LineString>`)
                .join("")}</MultiGeometry>`;
        case "MultiPolygon":
            return `<MultiGeometry>${geom.coordinates
                .map(([outer, ...holes]) => `<Polygon><outerBoundaryIs>${ringToKML(outer)}</outerBoundaryIs>${holes
                    .map((h) => `<innerBoundaryIs>${ringToKML(h)}</innerBoundaryIs>`)
                    .join("")}</Polygon>`)
                .join("")}</MultiGeometry>`;
        case "GeometryCollection":
            return `<MultiGeometry>${geom.geometries.map(geometryToKML).join("")}</MultiGeometry>`;
        default:
            throw new Error(`Unsupported geometry type for KML: ${geom.type}`);
    }
}

export function featureToPlacemark(feature, index) {
    const props = feature.properties || {};
    const name = props.name ?? props.Name ?? props.NAME ?? `Feature ${index + 1}`;
    const extended = Object.entries(props)
        .filter(([k]) => !["name", "Name", "NAME"].includes(k))
        .map(([k, v]) => `<Data name="${xmlEscape(k)}"><value>${xmlEscape(v)}</value></Data>`)
        .join("");
    const geometryXML = feature.geometry ? geometryToKML(feature.geometry) : "";
    return `<Placemark><name>${xmlEscape(name)}</name>${extended ? `<ExtendedData>${extended}</ExtendedData>` : ""
        }${geometryXML}</Placemark>`;
}

export function textOf(el, tag) {
    const node = el.getElementsByTagName(tag)[0];
    return node ? node.textContent.trim() : undefined;
}

export function kmlCoordsToArray(text) {
    return text
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((triplet) => triplet.split(",").map(Number).slice(0, 2));
}

export function geometryFromGeomEl(el) {
    const tag = el.tagName;
    if (tag === "Point") {
        const c = kmlCoordsToArray(textOf(el, "coordinates") || "0,0")[0];
        return { type: "Point", coordinates: c };
    }
    if (tag === "LineString") {
        return { type: "LineString", coordinates: kmlCoordsToArray(textOf(el, "coordinates") || "") };
    }
    if (tag === "Polygon") {
        const outer = el.getElementsByTagName("outerBoundaryIs")[0];
        const inners = Array.from(el.getElementsByTagName("innerBoundaryIs"));
        const outerRing = kmlCoordsToArray(textOf(outer, "coordinates") || "");
        const innerRings = inners.map((i) => kmlCoordsToArray(textOf(i, "coordinates") || ""));
        return { type: "Polygon", coordinates: [outerRing, ...innerRings] };
    }
    if (tag === "MultiGeometry") {
        const geometries = Array.from(el.children).map(geometryFromGeomEl).filter(Boolean);
        return { type: "GeometryCollection", geometries };
    }
    return null;
}

export function kmlGeometryFromEl(el) {
    const direct = Array.from(el.children).find((child) =>
        ["Point", "LineString", "Polygon", "MultiGeometry"].includes(child.tagName)
    );
    return direct ? geometryFromGeomEl(direct) : null;
}

// ─────────────────────────────────────────────────────────────────────────
// Converter implementations (GeoJSON is always the hub format)
// ─────────────────────────────────────────────────────────────────────────
export function csvToGeoJSON(text) {
    const { headers, rows } = parseCSV(text);
    const latIdx = findColumn(headers, ["lat", "latitude", "y"]);
    const lngIdx = findColumn(headers, ["lon", "lng", "long", "longitude", "x"]);
    if (latIdx === -1 || lngIdx === -1) {
        throw new Error("Couldn't find latitude/longitude columns. Expected headers like lat/lon, latitude/longitude, or x/y.");
    }
    const features = rows.map((row) => {
        const properties = {};
        headers.forEach((h, i) => {
            if (i !== latIdx && i !== lngIdx) properties[h] = row[i];
        });
        return {
            type: "Feature",
            geometry: { type: "Point", coordinates: [Number(row[lngIdx]), Number(row[latIdx])] },
            properties,
        };
    });
    return JSON.stringify({ type: "FeatureCollection", features }, null, 2);
}

export function geojsonToCSV(text) {
    const data = JSON.parse(text);
    const features = data.type === "FeatureCollection" ? data.features : [data];
    const allPointGeoms = features.every((f) => f.geometry?.type === "Point");

    const propKeys = Array.from(
        new Set(features.flatMap((f) => Object.keys(f.properties || {})))
    );

    const headers = allPointGeoms ? ["lat", "lon", ...propKeys] : ["geometry", ...propKeys];
    const rows = features.map((f) => {
        const propValues = propKeys.map((k) => csvField(f.properties?.[k]));
        if (allPointGeoms) {
            const [lon, lat] = f.geometry.coordinates;
            return [lat, lon, ...propValues].join(",");
        }
        return [csvField(JSON.stringify(f.geometry)), ...propValues].join(",");
    });
    return [headers.join(","), ...rows].join("\n");
}

export function geojsonToKML(text) {
    const data = JSON.parse(text);
    const features = data.type === "FeatureCollection" ? data.features : [data.type === "Feature" ? data : { type: "Feature", geometry: data, properties: {} }];
    const placemarks = features.map(featureToPlacemark).join("");
    return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2"><Document>${placemarks}</Document></kml>`;
}

export function kmlToGeoJSON(text) {
    const doc = new DOMParser().parseFromString(text, "text/xml");
    if (doc.getElementsByTagName("parsererror").length > 0) {
        throw new Error("That file doesn't look like valid KML/XML.");
    }
    const placemarks = Array.from(doc.getElementsByTagName("Placemark"));
    if (placemarks.length === 0) throw new Error("No <Placemark> elements found in this KML.");

    const features = placemarks.map((pm) => {
        const properties = {};
        const name = textOf(pm, "name");
        if (name) properties.name = name;
        const description = textOf(pm, "description");
        if (description) properties.description = description;
        Array.from(pm.getElementsByTagName("Data")).forEach((d) => {
            const key = d.getAttribute("name");
            const value = textOf(d, "value");
            if (key) properties[key] = value;
        });
        return { type: "Feature", geometry: kmlGeometryFromEl(pm), properties };
    });

    return JSON.stringify({ type: "FeatureCollection", features }, null, 2);
}

export function wktToGeoJSON(text) {
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) throw new Error("No WKT geometries found.");
    const features = lines.map((line, i) => ({
        type: "Feature",
        geometry: parseWKT(line),
        properties: { id: i + 1 },
    }));
    return JSON.stringify({ type: "FeatureCollection", features }, null, 2);
}

export async function shapefileToGeoJSON(arrayBuffer) {
    const shp = (await import("shpjs")).default;
    const result = await shp(arrayBuffer);
    const data = Array.isArray(result) ? { type: "FeatureCollection", features: result.flatMap((r) => r.features) } : result;
    return JSON.stringify(data, null, 2);
}