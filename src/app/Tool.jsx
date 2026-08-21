import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { TOOLS } from './tools';
import { Globe, CheckCircle2, HelpCircle, Settings2, Play, Minus, TriangleRight } from "lucide-react";

function ParamInput({ input }) {
    const [val, setVal] = useState();
    const [checked, setChecked] = useState();
    
    if (input.type === "toggle") {
        return (
            <div className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                <span className="text-sm text-foreground">{input.label}</span>
                <button onClick={() => setChecked(c => !c)} className={`relative w-9 h-5 rounded-full transition-colors ${checked ? "bg-primary" : "bg-muted"}`}>
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${checked ? "translate-x-4" : ""}`} />
                </button>
            </div>
        );
    }
    if (input.type === "select") {
        return (
            <div className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                <span className="text-sm text-foreground">{input.label}</span>
                <select value={val} onChange={e => setVal(e.target.value)} className="text-sm text-foreground bg-muted border border-border rounded-lg px-2 py-1 font-mono focus:outline-none focus:ring-2 focus:ring-primary/30">
                    {input.options?.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
            </div>
        );
    }
    return (
        <div className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
            <span className="text-sm text-foreground">{input.label}</span>
            <div className="flex items-center gap-1.5">
                <input type="number" value={val} onChange={e => setVal(e.target.value)} className="w-20 text-sm text-right text-foreground bg-muted border border-border rounded-lg px-2 py-1 font-mono focus:outline-none focus:ring-2 focus:ring-primary/30" />
                {input.unit && <span className="text-xs text-muted-foreground font-mono">{input.unit}</span>}
            </div>
        </div>
    );
}

function ToolDetail({ tool }) {
    const [ran, setRan] = useState(false);
    
    return (
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Header */}
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">{tool.icon}</div>
                <div>
                    <h2 className="text-xl font-semibold text-foreground">{tool.label}</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">{tool.tagline}</p>
                </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">{tool.description}</p>

            <div className="grid lg:grid-cols-2 gap-4">
                {/* Parameters */}
                <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                    <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
                        <span className="text-sm font-semibold text-foreground flex items-center gap-2"><Settings2 size={14} className="text-primary" />Parameters</span>
                    </div>
                    <div className="px-5 py-1">
                        {tool.inputs.map(inp => <ParamInput key={inp.label} input={inp} />)}
                    </div>
                    <div className="px-5 py-4 border-t border-border">
                        <button onClick={() => setRan(true)} className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${ran ? "bg-primary/10 text-primary border border-primary/30" : "bg-primary text-primary-foreground hover:opacity-90"}`}>
                            {ran ? <><CheckCircle2 size={15} /> Applied to map</> : <><Play size={15} /> Activate Tool</>}
                        </button>
                    </div>
                </div>

                {/* Steps */}
                <div className="space-y-4">
                    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                        <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><TriangleRight size={14} className="text-primary" />How to use</p>
                        <ol className="space-y-2.5">
                            {tool.steps.map((s, i) => (
                                <li key={s} className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-mono text-primary mt-0.5">{i + 1}</span>
                                    <span className="text-sm text-muted-foreground leading-relaxed">{s}</span>
                                </li>
                            ))}
                        </ol>
                    </div>
                    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                        <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><HelpCircle size={14} className="text-primary" />Notes & tips</p>
                        <ul className="space-y-2">
                            {tool.notes.map(n => <li key={n} className="flex items-start gap-2 text-sm text-muted-foreground"><Minus size={12} className="mt-1 text-primary flex-shrink-0" />{n}</li>)}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Use cases */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><Globe size={14} className="text-primary" />Common use cases</p>
                <div className="flex flex-wrap gap-2">
                    {tool.useCases.map(u => <span key={u} className="text-xs px-3 py-1.5 rounded-full bg-primary/8 text-primary border border-primary/15 font-medium">{u}</span>)}
                </div>
            </div>
        </div>
    );
}

const Tool = () => {
    const { id } = useParams();
    const [activeId, setActiveId] = useState(id || TOOLS[0].id);
    const activeTool = TOOLS.find(t => t.id === activeId) ?? TOOLS[0];

    return (
        <div className="flex-1 flex min-h-0 overflow-hidden">
            {/* Left list */}
            <aside className="w-56 flex-shrink-0 border-r border-border bg-background flex flex-col">
                <div className="px-4 py-4 border-b border-border">
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">GIS Tools</h2>
                </div>
                <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
                    {TOOLS.map(tool => (
                        <button key={tool.id} onClick={() => setActiveId(tool.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${activeId === tool.id ? "bg-primary/10 text-primary border border-primary/20" : "text-foreground/70 hover:bg-muted hover:text-foreground"}`}>
                            <span className={activeId === tool.id ? "text-primary" : "text-muted-foreground"}>{tool.icon}</span>
                            <span className="text-sm font-medium">{tool.label}</span>
                        </button>
                    ))}
                </nav>
            </aside>
            {/* Detail */}
            <ToolDetail tool={activeTool} />
        </div>
    );
}

export default Tool