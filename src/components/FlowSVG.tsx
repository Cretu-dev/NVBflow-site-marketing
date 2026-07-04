import { motion } from "motion/react"
import { FLOW_VIEWBOX, FLOW_SPINE, FLOW_BODY } from "./flow-paths"

const START = 1.25 // după ce NVB alunecă la stânga
const SPINE_DUR = 0.25 // coada/coloana lui f (downstroke rapid)
const BODY_DUR = 1.5 // restul semnăturii (f-loop → l → o → w → coadă)

// pixul: linie subțire uniformă, capete rotunde
const PEN = {
  fill: "none",
  stroke: "var(--color-highlight)",
  strokeWidth: 6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
}

export default function FlowSVG() {
  return (
    <svg
      viewBox={FLOW_VIEWBOX}
      role="img"
      aria-label="flow"
      className="h-16 sm:h-24 xl:h-28 w-auto overflow-visible select-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.path
        d={FLOW_SPINE}
        {...PEN}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: { delay: START, duration: SPINE_DUR, ease: "easeInOut" },
          opacity: { delay: START, duration: 0.001 },
        }}
      />
      <motion.path
        d={FLOW_BODY}
        {...PEN}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: { delay: START + SPINE_DUR, duration: BODY_DUR, ease: "easeInOut" },
          opacity: { delay: START + SPINE_DUR, duration: 0.001 },
        }}
      />
    </svg>
  )
}
