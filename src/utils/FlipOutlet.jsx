import { useRef, useState } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import './FlipOutlet.css'

const FlipOutlet = () => {
  const location = useLocation()
  const outlet = useOutlet()
  const flipRef = useRef(null)

  const [displayOutlet, setDisplayOutlet] = useState(outlet)
  const currentPath = useRef(location.pathname)
  const isFirstRender = useRef(true)
  const rotation = useRef(0)

  useGSAP(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      currentPath.current = location.pathname
      return
    }

    if (location.pathname === currentPath.current) return

    const midpoint = rotation.current + 180
    const target = rotation.current + 360

    const tl = gsap.timeline()
    tl.to(flipRef.current, {
      rotateY: midpoint,
      filter: "blur(6px)",
      duration: 0.22,
      ease: "power1.in",
      onComplete: () => {
        setDisplayOutlet(outlet)
        currentPath.current = location.pathname
      }
    })
      .to(flipRef.current, {
        rotateY: target,
        filter: "blur(0px)",
        duration: 0.26,
        ease: "power2.out",
        onComplete: () => {
          rotation.current = target
        }
      })
  }, [location.pathname])

  return (
    <div className="flip-viewport">
      <div className="flip-card" ref={flipRef}>
        {displayOutlet}
      </div>
    </div>
  )
}

export default FlipOutlet