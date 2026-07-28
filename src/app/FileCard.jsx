import {
	Trash2
} from "lucide-react";

export function FileCard({ file, onRemove }) {
    return (
        <div className="group flex items-start gap-2.5 px-3 py-2.5 rounded-lg border border-border bg-card hover:border-primary/30 transition-all">
            <div
                className="mt-0.5 w-2.5 h-2.5 rounded-sm flex-shrink-0"
                style={{ backgroundColor: file.color }}
            />
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                <p className="text-xs font-mono text-muted-foreground mt-0.5">
                    {file.type.toUpperCase()} · {file.size}
                </p>
            </div>
            <button
                onClick={() => onRemove(file.id)}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all p-0.5 rounded"
            >
                <Trash2 size={13} />
            </button>
        </div>
    );
}