import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

export default function Cursor() {
    const [isPointer, setIsPointer] = useState<boolean>(false)

    const cursorSize = 48
    const mouse = {
        x: useMotionValue(0),
        y: useMotionValue(0),

        opacity: useMotionValue(0),

        scale: useMotionValue(1)
    }

    const smoothOptions = { damping: 20 }
    const smoothMouse = {
        x: useSpring(mouse.x, smoothOptions),
        y: useSpring(mouse.y, smoothOptions),

        opacity: useSpring(mouse.opacity, smoothOptions),

        scale: useSpring(mouse.scale)
    }

    const manageMouseMove = (e: MouseEvent) => {
        const { clientX, clientY, target } = e

        const element = target as HTMLElement
        setIsPointer(window.getComputedStyle(element).getPropertyValue("cursor") === "pointer")

        mouse.x.set(clientX - cursorSize / 2)
        mouse.y.set(clientY - cursorSize / 2)
    }

    const manageMouseEnter = () => {
        mouse.opacity.set(1)
    }

    const manageMouseLeave = () => {
        mouse.opacity.set(0)
    }

    useEffect(() => {
  window.addEventListener("mousemove", manageMouseMove);
  window.addEventListener("mouseover", manageMouseEnter);
  window.addEventListener("mouseout", manageMouseLeave);
  return () => {
    window.removeEventListener("mousemove", manageMouseMove);
    window.removeEventListener("mouseover", manageMouseEnter);
    window.removeEventListener("mouseout", manageMouseLeave);
  };
}, [manageMouseMove, manageMouseEnter, manageMouseLeave]);

useEffect(() => {
  if (isPointer) {
    mouse.scale.set(1.5);
  } else {
    mouse.scale.set(1);
  }
}, [isPointer, mouse.scale]);

    return (
        <div className="fixed top-0 left-0 z-[100] mix-blend-difference">
            <motion.div
                style={{
                    left: smoothMouse.x,
                    top: smoothMouse.y,
                    opacity: smoothMouse.opacity,
                    scale: smoothMouse.scale
                }}
                className={`${isPointer ? "bg-white" : "bg-transparent"} border-[1.5px] absolute w-12 h-12 border-white border-opacity-75 rounded-full pointer-events-none`}>
            </motion.div>
        </div>
    )
}