import { ArrowRightLeft, FileJson, FileText, CheckCircle2, ChevronRight, Braces, HelpCircle } from "lucide-react";

function InfoPanel({ title, icon, children }) {
    return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <span className="text-primary">{icon}</span>
                {title}
            </div>
            {children}
        </div>
    );
}

const ConverterPageInfo = ({ def }) => {
    return (
        <div className="mx-auto py-10 space-y-6">
            {/* Format info grid */}
            <div className="grid md:grid-cols-2 gap-4">
                <InfoPanel title={`What is ${def.from}?`} icon={<Braces size={15} />}>
                    <p className="text-sm text-muted-foreground leading-relaxed">{def.fromDesc}</p>
                </InfoPanel>

                <InfoPanel title={`What is ${def.to}?`} icon={<FileJson size={15} />}>
                    <p className="text-sm text-muted-foreground leading-relaxed">{def.toDesc}</p>
                </InfoPanel>
            </div>

            {/* Use cases + why convert */}
            <div className="grid md:grid-cols-2 gap-4">
                <InfoPanel title="Common Use Cases" icon={<FileText size={15} />}>
                    <ul className="space-y-2">
                        {def.useCases.map((u) => (
                            <li key={u} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <ChevronRight size={14} className="mt-0.5 text-primary flex-shrink-0" />{u}
                            </li>
                        ))}
                    </ul>
                </InfoPanel>

                <InfoPanel title={`Why convert ${def.from} to ${def.to}?`} icon={<ArrowRightLeft size={15} />}>
                    <ul className="space-y-2">
                        {def.whyConvert.map((w) => (
                            <li key={w} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <CheckCircle2 size={14} className="mt-0.5 text-primary flex-shrink-0" />{w}
                            </li>
                        ))}
                    </ul>
                </InfoPanel>
            </div>

            {/* FAQ */}
            <InfoPanel title="Frequently Asked Questions" icon={<HelpCircle size={15} />}>
                <div className="divide-y divide-border">
                    {def.faqs.map((faq) => (
                        <div key={faq.q} className="py-4 first:pt-1">
                            <p className="text-sm font-semibold text-foreground mb-1">{faq.q}</p>
                            <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </InfoPanel>

            {/* Related converters */}
            {/* <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Related Converters</h3>
                <div className="grid sm:grid-cols-3 gap-3">
                    {def.related.map((r) => (
                        <button
                            key={r}
                            onClick={() => onNavigate(r)}
                            className="flex items-center justify-between px-4 py-3 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-primary/5 transition-all text-left group"
                        >
                            <span className="text-sm font-medium text-foreground">{RELATED_LABELS[r]}</span>
                            <ExternalLink size={13} className="text-muted-foreground group-hover:text-primary transition-colors" />
                        </button>
                    ))}
                </div>
            </div> */}
        </div>
    )
}

export default ConverterPageInfo