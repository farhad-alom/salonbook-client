import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    // ইনিশিয়াল স্টেটেই উইন্ডোর সাইজ চেক করে সেট করা হলো
    return typeof window !== "undefined" ? window.innerWidth < MOBILE_BREAKPOINT : false
  })

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    mql.addEventListener("change", onChange)
    // ইফেক্টের ভেতরের সরাসরি setIsMobile() কলটি এখানে বাদ দেওয়া হয়েছে

    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}