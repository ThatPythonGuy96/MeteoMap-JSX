import { useEffect, useRef, useState } from "react";
import { BASEMAPS } from "./BaseMaps.jsx";
import { BasemapPanel } from "./BasemapPanel.jsx";
import { ZoomIn, ZoomOut } from "lucide-react";
import shp from "shpjs";
import { kml, gpx } from "@tmcw/togeojson";
import Papa from "papaparse";
import parseGeoraster from "georaster";
import GeoRasterLayer from "georaster-layer-for-leaflet";

export function LeafletMap({ basemap, onBasemapChange, files }) {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const tileLayerRef = useRef(null);
    const [coords, setCoords] = useState({ lat: 9, lng: 7, zoom: 5 });

    const layerObjectsRef = useRef({});
    const loadingIdsRef = useRef(new Set());
    
    useEffect(() => {
        if (!mapRef.current || mapInstance.current) return;

        import("leaflet").then((L) => {
            // Fix default marker icon path issue with bundlers
            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
                iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            });

            const map = L.map(mapRef.current, {
                center: [20, 0],
                zoom: 3,
                zoomControl: false,
                attributionControl: true,
            });

            const cfg = BASEMAPS[basemap];
            const tile = L.tileLayer(cfg.url, { attribution: cfg.attr, maxZoom: 19 });
            tile.addTo(map);
            tileLayerRef.current = tile;
            mapInstance.current = map;

            map.on("mousemove", (e) => {
                setCoords({ lat: e.latlng.lat, lng: e.latlng.lng, zoom: map.getZoom() });
            });
            map.on("zoomend", () => {
                setCoords((c) => ({ ...c, zoom: map.getZoom() }));
            });
        });

        return () => {
            mapInstance.current?.remove();
            mapInstance.current = null;
        };
    }, []);

    // Swap tile layer when basemap changes
    useEffect(() => {
        if (!mapInstance.current) return;
        import("leaflet").then((L) => {
            if (tileLayerRef.current) {
                mapInstance.current.removeLayer(tileLayerRef.current);
            }
            const cfg = BASEMAPS[basemap];
            const tile = L.tileLayer(cfg.url, { attribution: cfg.attr, maxZoom: 19 });
            tile.addTo(mapInstance.current);
            tileLayerRef.current = tile;
        });
    }, [basemap]);

    useEffect(() => {
        if (!mapInstance.current) return;

        const currentIds = new Set(files.map((f) => f.id));
        files.forEach(layer => {
            if (layerObjectsRef.current[layer.id] || loadingIdsRef.current.has(layer.id)) return;
            loadingIdsRef.current.add(layer.id);
            loadLayer(layer).finally(() => loadingIdsRef.current.delete(layer.id));
        });

        Object.keys(layerObjectsRef.current).forEach((id) => {
            if (!currentIds.has(id)) {
                mapInstance.current.removeLayer(layerObjectsRef.current[id]);
                delete layerObjectsRef.current[id];
            }
        });
    }, [files]);

    async function loadGeoJSON(layer){
        const L = await import("leaflet");
        const text = await layer.file.text();
        const geojson = JSON.parse(text);

        const geo = L.geoJSON(geojson,{
            style:{
                color:layer.color,
                weight:2
            }
        }).addTo(mapInstance.current);
        layerObjectsRef.current[layer.id] = geo;
        mapInstance.current.fitBounds(geo.getBounds());
    }

    async function loadShapefile(layer){
        const arrayBuffer = await layer.file.arrayBuffer();
        const geojson = await shp(arrayBuffer);
        const L = await import("leaflet");

        const geo = L.geoJSON(geojson,{
            style:{
                color:layer.color
            }
        });
        geo.addTo(mapInstance.current);
        layerObjectsRef.current[layer.id] = geo;
        mapInstance.current.fitBounds(geo.getBounds());
    }

    async function loadKML(layer){
        const text = await layer.file.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text,"text/xml");
        const geojson = kml(xml);

        const L = await import("leaflet");
        const geo = L.geoJSON(geojson,{
            style:{
                color:layer.color
            }
        });
        geo.addTo(mapInstance.current);
        layerObjectsRef.current[layer.id] = geo;
        mapInstance.current.fitBounds(geo.getBounds());
    }

    async function loadCSV(layer){
        const L = await import ("leaflet");
        const text = await layer.file.text();
        const result = Papa.parse(text,{
            header:true,
            dynamicTyping: true,
            skipEmptyLines: true,
        });

        const points = result.data.filter(
            (row) => row.lat != null && row.lon != null && !Number.isNaN(row.lat) && !Number.isNaN(row.lon)
        );

        const group = L.layerGroup(
            points.map((row) => L.circleMarker([row.lat, row.lon], { color: layer.color, radius: 5 }))
        ).addTo(mapInstance.current);

        layerObjectsRef.current[layer.id] = group;
        if (points.length > 0) {
            mapInstance.current.fitBounds(group.getBounds());
        }
    }

    async function loadRaster(layer){
        const buffer = await layer.file.arrayBuffer();
        const raster = await parseGeoraster(buffer);

        const geo = new GeoRasterLayer({
            georaster:raster
        });
        geo.addTo(mapInstance.current);
        layerObjectsRef.current[layer.id] = geo;
        mapInstance.current.fitBounds(geo.getBounds());
    }

    async function loadGPX(layer){
        const text = await layer.file.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text,"text/xml");
        const geojson = gpx(xml);

        const L = await import("leaflet");
        const geo = L.geoJSON(geojson,{
            style:{
                color:layer.color
            }
        });
        geo.addTo(mapInstance.current);
        layerObjectsRef.current[layer.id] = geo;
        mapInstance.current.fitBounds(geo.getBounds());
    }

    async function loadLayer(layer) {
        const ext = layer.type;

        switch(ext){
            case "geojson":
            case "json":
                return loadGeoJSON(layer);

            case "shp":
            case "zip":
                return loadShapefile(layer);

            case "kml":
                return loadKML(layer);

            case "csv":
                return loadCSV(layer);

            case "gpx":
                return loadGPX(layer);

            case "tif":
            case "tiff":
                return loadRaster(layer);

            default:
                console.log("Unsupported");
        }
    }

    const zoomIn = () => mapInstance.current?.zoomIn();
    const zoomOut = () => mapInstance.current?.zoomOut();

    return (
        <div className="relative w-full h-full">
            {/* Leaflet CSS */}
            <link
                rel="stylesheet"
                href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
            />

            {/* Map container */}
            <div ref={mapRef} className="w-full h-full" />

            {/* Top-right controls */}
            <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-1.5">
                <BasemapPanel active={basemap} onChange={onBasemapChange} />
                <button
                    onClick={zoomIn}
                    title="Zoom in"
                    className="w-9 h-9 flex items-center justify-center bg-card border border-border rounded shadow-md hover:bg-accent/10 transition-colors text-foreground text-lg font-light"
                >
                    <ZoomIn size={16} />
                </button>
                <button
                    onClick={zoomOut}
                    title="Zoom out"
                    className="w-9 h-9 flex items-center justify-center bg-card border border-border rounded shadow-md hover:bg-accent/10 transition-colors text-foreground text-lg font-light"
                >
                    <ZoomOut size={16} />
                </button>
            </div>

            {/* Coordinate bar */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-[1000] px-3 py-1.5 bg-card/90 backdrop-blur border border-border rounded-full text-xs font-mono text-muted-foreground shadow">
                {coords.lat.toFixed(5)}°, {coords.lng.toFixed(5)}° · Z{coords.zoom}
            </div>
        </div>
    );
}