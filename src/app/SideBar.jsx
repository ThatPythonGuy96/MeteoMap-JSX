import { useCallback, useRef, useState } from "react";
import { FileCard } from "./FileCard.jsx";
import { FileUp, Map } from "lucide-react";

const LAYER_COLORS = [
    "#1a6b3c", "#2563eb", "#d97706", "#9333ea",
    "#e11d48", "#0891b2", "#16a34a", "#ca8a04",
];

const SideBar = ({ files, setFiles }) => {
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);

    const addFiles = useCallback((incoming) => {
        if (!incoming) return;
        const next = Array.from(incoming).map((f, i) => ({
            id: `${Date.now()}-${i}`,
            file: f,                  // <-- keep the actual file
            name: f.name,
            type: f.name.split(".").pop().toLowerCase(),
            size: fileSize(f.size),
            color: LAYER_COLORS[(files.length + i) % LAYER_COLORS.length],
        }));
        setFiles((prev) => [...prev, ...next]);
    }, [files.length]);

    const removeFile = useCallback(
        (id) => setFiles((prev) => prev.filter((f) => f.id !== id)), 
        [setFiles]
    );

    function fileSize(bytes) {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    return (
        <aside className="w-64 flex-shrink-0 border-r border-border bg-background flex flex-col">
            <div className="px-4 pt-4 pb-3 border-b border-border">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Layers
                    </h2>
                    <span className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        {files.length}
                    </span>
                </div>

                {/* Add file button */}
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border-2 border-dashed border-primary/40 text-primary text-sm font-medium hover:bg-primary/5 hover:border-primary transition-all"
                >
                    <FileUp size={15} />
                    Add File
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".geojson,.json,.csv,.kml,.shp,.tif,.tiff,.gpx,.zip,.gpkg"
                    className="hidden"
                    onChange={(e) => addFiles(e.target.files)}
                />
            </div>

            {/* Drop zone + file list */}
            <div
                className={`flex-1 overflow-y-auto p-3 space-y-2 transition-colors ${dragOver ? "bg-primary/5" : ""
                    }`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    addFiles(e.dataTransfer.files);
                }}
            >
                {files.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32 text-center">
                        <Map size={24} className="text-muted-foreground/40 mb-2" />
                        <p className="text-xs text-muted-foreground">
                            Drop files here or use<br />Add File above
                        </p>
                    </div>
                ) : (
                    files.map((f) => (
                        <FileCard key={f.id} file={f} onRemove={removeFile} />
                    ))
                )}

                {dragOver && (
                    <div className="flex items-center justify-center h-16 rounded-lg border-2 border-dashed border-primary text-primary text-xs font-medium">
                        Drop to add layers
                    </div>
                )}
            </div>
        </aside>
    )
}

export default SideBar