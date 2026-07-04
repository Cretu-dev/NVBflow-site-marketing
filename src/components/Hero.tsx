import { motion, useScroll, useTransform } from "motion/react"
import { useEffect, useRef, useState } from "react"
import { FlipWords } from "./FlipWords"
import FlowSVG from "./FlowSVG"

const HEADING =
    "font-display font-bold text-6xl sm:text-8xl xl:text-9xl text-foreground select-none"

// underline ondulat generat exact la lățimea frazei (fără întindere neuniformă)
function squigglePath(width: number, hump = 100, amp = 7, mid = 1) {
    const n = Math.max(2, Math.round(width / hump))
    const step = width / n
    let d = `M 0 ${mid} Q ${step / 2} ${mid - amp} ${step} ${mid}`
    for (let i = 2; i <= n; i++) d += ` T ${step * i} ${mid}`
    return d
}

export default function Hero() {
    const flowRef = useRef<HTMLSpanElement>(null)
    const theRef = useRef<HTMLSpanElement>(null)
    const nvbRef = useRef<HTMLSpanElement>(null)
    const playbookRef = useRef<HTMLSpanElement>(null)

    const [flowW, setFlowW] = useState<number | null>(null)
    const [dims, setDims] = useState<{ the: number; nvb: number; playbook: number } | null>(null)
    const [showFlip, setShowFlip] = useState<boolean>(false)

    const { scrollY } = useScroll()

    // flow se stinge ușor + subtitlul dispare
    const flowOpacity = useTransform(scrollY, [0, 200], [1, 0])
    const flipOpacity = useTransform(scrollY, [0, 150], [1, 0])

    // NVB alunecă astfel încât fraza finală „The NVB Playbook" să fie pe centru.
    // shift = (cât e NVB stânga de centru acum) − (decalajul din lățimi The vs Playbook)
    const centerTarget =
        flowW != null && dims ? (flowW - 40 + dims.the - dims.playbook) / 2 : 0
    const nvbCenterX = useTransform(scrollY, [0, 220], [0, centerTarget])

    // „The" iese de sub NVB spre stânga, „Playbook" spre dreapta
    const theX = useTransform(scrollY, [140, 380], ["100%", "0%"])
    const theOpacity = useTransform(scrollY, [160, 360], [0, 1])
    const playbookX = useTransform(scrollY, [140, 380], ["-100%", "0%"])
    const playbookOpacity = useTransform(scrollY, [160, 360], [0, 1])

    // ușor mai mic pe măsură ce se transformă (zoom out subtil)
    const headingScale = useTransform(scrollY, [0, 400], [1, 0.82])

    // underline — se desenează lent, pe mult scroll
    const squiggleOpacity = useTransform(scrollY, [400, 440], [0, 1])
    const squiggleLength = useTransform(scrollY, [420, 700], [0, 1])

    const phraseW = dims ? dims.the + dims.nvb + dims.playbook : 0

    useEffect(() => {
        const id = setTimeout(() => setShowFlip(true), 3000)
        return () => clearTimeout(id)
    }, [])

    useEffect(() => {
        if (!flowRef.current) return
        const ro = new ResizeObserver(([e]) => setFlowW(e.contentRect.width))
        ro.observe(flowRef.current)
        return () => ro.disconnect()
    }, [])

    // măsoară lățimile textelor (după ce NVB s-a randat) pentru centrare + underline
    useEffect(() => {
        const measure = () => {
            if (theRef.current && nvbRef.current && playbookRef.current) {
                setDims({
                    the: theRef.current.offsetWidth,
                    nvb: nvbRef.current.offsetWidth,
                    playbook: playbookRef.current.offsetWidth,
                })
            }
        }
        measure()
        window.addEventListener("resize", measure)
        return () => window.removeEventListener("resize", measure)
    }, [flowW])

    return (
        <motion.div className="relative flex flex-col items-center" style={{ scale: headingScale }}>
            <h1 className="flex items-center gap-0.5">
                {/* NVB = ancora; „The"/„Playbook" ies de sub el */}
                <motion.span className="relative inline-flex" style={{ x: nvbCenterX }}>
                    <motion.span
                        ref={theRef}
                        className={`pointer-events-none absolute right-full top-0 z-0 whitespace-nowrap ${HEADING}`}
                        style={{ x: theX, opacity: theOpacity }}
                    >
                        The&nbsp;
                    </motion.span>

                    {flowW !== null && (
                        <motion.span
                            ref={nvbRef}
                            className={`relative z-10 ${HEADING}`}
                            initial={{ scale: 1.4, opacity: 0, x: (flowW - 40) / 2 }}
                            animate={{ scale: 1, opacity: 1, x: 0 }}
                            transition={{
                                default: { duration: 0.8, ease: "easeOut" },
                                x: { delay: 0.8, duration: 0.6, ease: "easeInOut" },
                            }}
                        >
                            NVB
                        </motion.span>
                    )}

                    <motion.span
                        ref={playbookRef}
                        className={`pointer-events-none absolute left-full top-0 z-0 whitespace-nowrap ${HEADING}`}
                        style={{ x: playbookX, opacity: playbookOpacity }}
                    >
                        &nbsp;Playbook
                    </motion.span>
                </motion.span>

                {/* flow — deasupra lui NVB (z mai mare), dispare ușor la scroll */}
                <motion.span
                    ref={flowRef}
                    className="-ml-5.5 mt-4 md:-ml-8 md:mt-8 lg:-ml-9 lg:mt-9 xl:-ml-10 xl:mt-10 z-20"
                    style={{ opacity: flowOpacity }}
                >
                    <FlowSVG />
                </motion.span>
            </h1>

            {/* squiggle sub frază — generat la lățimea reală; h-0 ca să nu împingă subtitlul */}
            {dims && (
                <div className="flex h-0 justify-center overflow-visible">
                    <svg
                        viewBox={`0 0 ${phraseW} 24`}
                        width={phraseW}
                        height={24}
                        className="translate-y-2 overflow-visible"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <motion.path
                            d={squigglePath(phraseW)}
                            fill="none"
                            stroke="var(--color-highlight)"
                            strokeWidth={2.5}
                            strokeLinecap="round"
                            style={{ pathLength: squiggleLength, opacity: squiggleOpacity }}
                        />
                    </svg>
                </div>
            )}

            <div className="min-h-7 sm:min-h-8 xl:min-h-9 flex items-center justify-center">
                {showFlip && (
                    <motion.div
                        className="text-center w-[18rem] sm:w-84 xl:w-104 relative"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <motion.div
                            className="min-h-7 sm:min-h-8 xl:min-h-9 flex items-center justify-center"
                            style={{ opacity: flipOpacity }}
                        >
                            <FlipWords
                                words={["Analyzing your competition.", "Crafting your strategies.", "Automating your networks.", "Decoding your analytics.", "Reclaiming your time."]}
                                duration={4000}
                                className="whitespace-nowrap select-none text-lg sm:text-xl xl:text-2xl text-muted font-bold font-display"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    )
}
