import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const AnimatedPathText = dynamic(
  () => import("@/components/fancy/text/text-along-path"),
  { ssr: false }
);

export default function Preview() {
  const circlePath =
    "M 150 150 m -72, 0 a 72,72 0 1,1 144,0 a 72,72 0 1,1 -144,0";

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="relative w-72 h-72">
        {[0, 90, 180, 270].map((rotation, i) => (
          <AnimatedPathText
            key={rotation}
            path={circlePath}
            pathId={`circle-path-${i}`}
            svgClassName={cn("absolute inset-0 w-full h-full text-white", {
              "rotate-0": rotation === 0,
              "rotate-90": rotation === 90,
              "rotate-180": rotation === 180,
              "-rotate-90": rotation === 270,
            })}
            easingFunction={{
              calcMode: "spline",
              keyTimes: "0;1",
              keySplines: "0.762 0.002 0.253 0.999",
            }}
            viewBox="0 0 300 300"
            text="loading"
            textClassName="text-[20px] tracking-[3px]"
            duration={2.5}
            textAnchor="start"
          />
        ))}
      </div>
    </div>
  );
}
