import { AnimatePresence, motion } from "motion/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { CircleDecoration } from "@/components/graphics/decoration"
import React from "react"

const MotionLink = motion(Link)

export default function NavLink({ href, label, active }: { href: string, label: string, active: string }) {
    const pathname = usePathname()

    return (
        <>
            <MotionLink initial={{ y: -100 }} animate={{ y: 0 }} href={href} className="px-6 py-2 relative hover:text-blue-500">
                <span className={`${pathname === active ? "z-[2] relative" : ""} transition font-medium`}>{label}</span>
                <AnimatePresence mode="wait">
                    {pathname == active && (
                        <motion.span transition={{ type: "spring", damping: 20 }} className="absolute z-[1] inset-0 flex justify-center items-center"><CircleDecoration className="scale-110 -rotate-6 text-blue-500" strokeWidth={2} delay={1} /> </motion.span>
                    )}
                </AnimatePresence>
            </MotionLink>
        </>
    )
}