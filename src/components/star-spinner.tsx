import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from "motion/react"
import { useRef } from "react"
import { FourPointedStar } from "@/components/icons/filled"

export default function StarSpinner({ className, baseVelocity = 100 }: { className?: string, baseVelocity?: number }) {
    const baseRotate = useMotionValue(0)
    const { scrollY } = useScroll()
    const scrollVelocity = useVelocity(scrollY)
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400
    })
    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
        clamp: false
    })

    const rotate = useTransform(baseRotate, (value) => value * baseVelocity)

    const directionFactor = useRef<number>(1)
    useAnimationFrame((t, delta) => {
        let moveBy = directionFactor.current * baseVelocity * (delta / 1000)

        /**
         * This is what changes the direction of the scroll once we
         * switch scrolling directions.
         */
        if (velocityFactor.get() < 0) {
            directionFactor.current = -1
        } else if (velocityFactor.get() > 0) {
            directionFactor.current = 1
        }

        moveBy += directionFactor.current * moveBy * velocityFactor.get()

        baseRotate.set(baseRotate.get() + moveBy)
    })

    // Window dimension hooks
    // const { height } = useDimension()

    return (
        <motion.span style={{ rotate }}>
            <FourPointedStar className={className} />
        </motion.span>
    )
}