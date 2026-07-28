import { Globe, Ruler, Layers, X, PenLine } from "lucide-react";
import { CONVERTERS } from './converters'
 
export function getConverterItems(openConverter) {
    return CONVERTERS.map((t) => ({
        label: t.label,
        icon: t.icon,
        id: t.id,
    }));
}

export const toolItems = [
    { label: "Draw", icon: <PenLine size={14} /> },
    { label: "Measure Distance", icon: <Ruler size={14} /> },
    { label: "Measure Area", icon: <Ruler size={14} /> },
    { label: "Buffer", icon: <Globe size={14} /> },
    { label: "Clip", icon: <X size={14} /> },
    { label: "Dissolve", icon: <Layers size={14} /> },
];

