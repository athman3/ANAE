import { memo } from "react";
import { cn } from "@/lib/utils";

export type VideoSource = {
    src: string;
    type: string;
};

export type BackgroundLayerProps = {
    poster: string;
    sources?: VideoSource[];
    className?: string;
};

function BackgroundLayerComponent({ poster, sources = [], className }: BackgroundLayerProps) {
    return (
        <div className={cn("absolute inset-0", className)} aria-hidden>
            <video
                className="h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                poster={poster}
                preload="none"
            >
                {sources.map((source) => (
                    <source key={source.src} src={source.src} type={source.type} />
                ))}
            </video>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/80 via-emerald-900/70 to-amber-900/75" />
            <div className="hero-pattern absolute inset-0 opacity-70 mix-blend-plus-lighter" />
        </div>
    );
}

const BackgroundLayer = memo(BackgroundLayerComponent);

export default BackgroundLayer;
