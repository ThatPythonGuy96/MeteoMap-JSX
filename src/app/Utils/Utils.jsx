import { CONVERTERS } from '../converter/converters'
import { TOOLS } from "../tools/tools";
import { ANALYSES } from "../analysis/analysisdata.jsx"

export function getConverterItems(openConverter) {
    return CONVERTERS.map((c) => ({
        label: c.label,
        icon: c.icon,
        id: c.id,
        link:  `/converter/${c.id}`
    }));
}

export function getToolItems(openTool) {
    return TOOLS.map((t) => ({
        label: t.label,
        icon: t.icon,
        id: t.id,
        link: `/tool/${t.id}`
    }))
}

export function getAnalysisItems(openAnalysis) {
    return ANALYSES.map((a) => ({
        label: a.label,
        icon: a.icon,
        id: a.id,
        link: `/analysis/${a.id}`
    }))
}


