import { useState, useRef } from 'react'
import { useParams } from 'react-router-dom';
import { ANALYSES } from './analysisData.jsx';
import { Info, Upload, CheckCircle2, HelpCircle, BarChart2, Settings2, Play, CircleDot, BarChart } from "lucide-react";
import { BarChart as BChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer, ReferenceLine } from "recharts";

function AnalysisChart({ def }) {
    const isDivergent = def.chartType === "bar-diverging";
    const wetColor = "#2ecc71";
    const dryColor = "#ef4444";
    const posColor = "#2ecc71";

    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload?.length) return null;
        const v = payload[0].value;
        return (
            <div className="bg-popover border border-border rounded-xl px-3 py-2 shadow-lg text-xs">
                <p className="font-mono text-muted-foreground">{label}</p>
                <p className="font-semibold text-foreground mt-0.5">{v.toFixed(2)}</p>
                {isDivergent && <p className="text-muted-foreground">{v >= 0 ? "Wet" : "Drought"}</p>}
            </div>
        );
    };

    return (
        <ResponsiveContainer width="100%" height={220}>
            <BChart data={def.sampleData} margin={{ top: 8, right: 8, left: -10, bottom: 0 }} barSize={isDivergent ? 10 : 16}>
                <CartesianGrid strokeDasharray="3 3" stroke={"rgba(255,255,255,0.06)"} vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#7a8499", fontFamily: "DM Mono, monospace" }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 10, fill: "#7a8499", fontFamily: "DM Mono, monospace" }} axisLine={false} tickLine={false} />
                {isDivergent && <ReferenceLine y={0} stroke={"rgba(255,255,255,0.2)"} strokeWidth={1.5} />}
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                    {def.sampleData.map((entry, i) => (
                        <Cell key={i} fill={isDivergent ? (entry.value >= 0 ? wetColor : dryColor) : posColor} fillOpacity={0.85} />
                    ))}
                </Bar>
            </BChart>
        </ResponsiveContainer>
    );
}

function AnalysisParamInput({ input }) {
    const [val, setVal] = useState();
    const [checked, setChecked] = useState();
    const [file, setFile] = useState("");
    const fileRef = useRef(null);

    if (input.type === "file") {
        return (
            <div className="py-2.5 border-b border-border last:border-0">
                <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-foreground">{input.label}</span>
                </div>
                <button onClick={() => fileRef.current?.click()} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed transition-all text-xs ${file ? "border-primary/40 bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30 hover:bg-muted"}`}>
                    <Upload size={12} />{file || "Browse or drop file…"}
                </button>
                <input ref={fileRef} type="file" className="hidden" onChange={e => setFile(e.target.files?.[0]?.name ?? "")} />
            </div>
        );
    }
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
                <select value={val} onChange={e => setVal(e.target.value)} className="text-xs text-foreground bg-muted border border-border rounded-lg px-2 py-1 font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 max-w-[160px]">
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

function AnalysisDetail({ analysis }) {
    const [ran, setRan] = useState(false);
    const [running, setRunning] = useState(false);
    const [progress, setProgress] = useState(0);

    const runAnalysis = () => {
        setRunning(true); setProgress(0); setRan(false);
        let p = 0;
        const iv = setInterval(() => {
            p += Math.random() * 12 + 4;
            if (p >= 100) { clearInterval(iv); setProgress(100); setTimeout(() => { setRunning(false); setRan(true); }, 400); }
            else setProgress(p);
        }, 120);
    };

    return (
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Header */}
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">{analysis.icon}</div>
                <div>
                    <div className="flex items-center gap-2 mb-0.5">
                        <h2 className="text-xl font-semibold text-foreground">{analysis.fullName}</h2>
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">{analysis.label}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{analysis.tagline}</p>
                </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{analysis.description}</p>

            <div className="grid lg:grid-cols-5 gap-4">
                {/* Params */}
                <div className="lg:col-span-2 rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                    <div className="px-5 py-3.5 border-b border-border"><span className="text-sm font-semibold text-foreground flex items-center gap-2"><Settings2 size={14} className="text-primary" />Parameters</span></div>
                    <div className="px-5 py-1">{analysis.inputs.map(inp => <AnalysisParamInput key={inp.label} input={inp} />)}</div>
                    <div className="px-5 py-4 border-t border-border">
                        {running ? (
                            <div className="space-y-2">
                                <div className="w-full h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full transition-all duration-150" style={{ width: `${progress}%` }} /></div>
                                <p className="text-xs font-mono text-muted-foreground text-center">Running… {Math.round(progress)}%</p>
                            </div>
                        ) : (
                            <button onClick={runAnalysis} className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${ran ? "bg-primary/10 text-primary border border-primary/30" : "bg-primary text-primary-foreground hover:opacity-90"}`}>
                                {ran ? <><CheckCircle2 size={15} /> Results shown below</> : <><Play size={15} /> Run Analysis</>}
                            </button>
                        )}
                    </div>
                </div>

                {/* Output chart */}
                <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-semibold text-foreground flex items-center gap-2"><BarChart2 size={14} className="text-primary" />Sample Output</p>
                        <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">24 months</span>
                    </div>
                    <AnalysisChart def={analysis} />
                    {/* Legend */}
                    {analysis.chartType === "bar-diverging" && (
                        <div className="flex items-center gap-4 mt-2 justify-center">
                            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: "#2ecc71" }} />Wet
                            </span>
                            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <span className="w-2.5 h-2.5 rounded-sm bg-red-400" />Drought
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Categories table */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                <div className="px-5 py-3.5 border-b border-border"><span className="text-sm font-semibold text-foreground flex items-center gap-2"><CircleDot size={14} className="text-primary" />Classification Categories</span></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead><tr className="border-b border-border bg-muted/40"><th className="text-left px-5 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Category</th><th className="text-left px-5 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Range</th><th className="px-5 py-2.5"></th></tr></thead>
                        <tbody className="divide-y divide-border">
                            {analysis.categories.map(cat => (
                                <tr key={cat.label} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-5 py-2.5 text-sm text-foreground font-medium">{cat.label}</td>
                                    <td className="px-5 py-2.5 text-sm font-mono text-muted-foreground">{cat.range}</td>
                                    <td className="px-5 py-2.5"><div className="w-5 h-5 rounded ml-auto" style={{ backgroundColor: cat.color }} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Interpretation */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2"><Info size={14} className="text-primary" />How to interpret results</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{analysis.interpretation}</p>
            </div>

            {/* FAQ */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <p className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2"><HelpCircle size={14} className="text-primary" />FAQ</p>
                <div className="divide-y divide-border">
                    {analysis.faqs.map(faq => <div key={faq.q} className="py-3.5 first:pt-2"><p className="text-sm font-semibold text-foreground mb-1">{faq.q}</p><p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p></div>)}
                </div>
            </div>
        </div>
    );
}

const Analysis = () => {
    const { id } = useParams();
    const [activeId, setActiveId] = useState(id || ANALYSES[0].id);
    const activeAnalysis = ANALYSES.find(a => a.id === activeId) ?? ANALYSES[0];

    return (
        <div className="flex-1 flex min-h-0 overflow-hidden">
            {/* Left list */}
            <aside className="w-56 flex-shrink-0 border-r border-border bg-background flex flex-col">
                <div className="px-4 py-4 border-b border-border">
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Analysis</h2>
                </div>
                <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
                    {ANALYSES.map(a => (
                        <button key={a.id} onClick={() => setActiveId(a.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${activeId === a.id ? "bg-primary/10 text-primary border border-primary/20" : "text-foreground/70 hover:bg-muted hover:text-foreground"}`}>
                            <span className={activeId === a.id ? "text-primary" : "text-muted-foreground"}>{a.icon}</span>
                            <div className="min-w-0">
                                <p className="text-sm font-medium leading-tight">{a.label}</p>
                                <p className="text-xs text-muted-foreground truncate leading-tight mt-0.5">{a.fullName.split(" ").slice(0, 3).join(" ")}</p>
                            </div>
                        </button>
                    ))}
                </nav>
            </aside>
            {/* Detail */}
            <AnalysisDetail analysis={activeAnalysis} />
        </div>
    );
}

export default Analysis