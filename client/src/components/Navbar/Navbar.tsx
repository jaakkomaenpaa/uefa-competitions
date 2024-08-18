import { Link, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

import styles from './Navbar.module.css'

const Navbar = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const location = useLocation()

  useEffect(() => {
    const path = location.pathname
    if (path === '/') {
      setActiveIndex(0)
    } else if (path.startsWith('/seasons')) {
      setActiveIndex(1)
    } else if (path.startsWith('/teams')) {
      setActiveIndex(2)
    } else if (path.startsWith('/ranking')) {
      setActiveIndex(3)
    }
  }, [location.pathname])

  useEffect(() => {
    if (containerRef.current) {
      const links = containerRef.current.querySelectorAll<HTMLAnchorElement>(
        `.${styles.navbarTab}`
      )

      const activeBar = containerRef.current.querySelector<HTMLDivElement>(
        `.${styles.activeBar}`
      ) as HTMLElement

      const link = links[activeIndex]

      activeBar.style.transform = `translateX(${link.offsetLeft}px)`
      activeBar.style.width = `${link.offsetWidth}px`
    }
  }, [activeIndex])

  return (
    <div className={styles.container} ref={containerRef}>
      <Link className={styles.navbarTab} to='/' onClick={() => setActiveIndex(0)}>
        Home
      </Link>
      <Link
        className={styles.navbarTab}
        to='/seasons'
        onClick={() => setActiveIndex(1)}
      >
        Seasons
      </Link>
      <Link
        className={styles.navbarTab}
        to='/teams'
        onClick={() => setActiveIndex(2)}
      >
        Teams
      </Link>
      <Link
        className={styles.navbarTab}
        to='/ranking'
        onClick={() => setActiveIndex(3)}
      >
        Ranking
      </Link>
      <div className={styles.activeBar}></div>
    </div>
  )
}

export default Navbar
