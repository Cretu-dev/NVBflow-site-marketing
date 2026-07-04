import { motion, useScroll, useTransform } from "motion/react"
import Aurora from "./Aurora"

// Aurora ca fundal, care se stinge pe măsură ce dai scroll (în timpul zoom-ului hero)
export default function AuroraLayer() {
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 500], [1, 0])

  return (
    <motion.div className="aurora-fade absolute inset-0 z-0" style={{ opacity }}>
      <Aurora amplitude={0.09} blend={1} colorStops={["#322fbd", "#60a5fa", "#11115f"]} />
    </motion.div>
  )
}
