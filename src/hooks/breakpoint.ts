// hooks/useBreakpoint.ts
import { useEffect, useState } from "react"

export default function useBreakpoint(breakpoint: number) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const check = () => setIsVisible(window.innerWidth >= breakpoint)
        check()
        window.addEventListener("resize", check)
        return () => window.removeEventListener("resize", check)
    }, [breakpoint])

    return isVisible
}
