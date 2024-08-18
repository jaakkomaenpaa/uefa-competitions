import { useState } from 'react'

import { Association } from '../../types'
import styles from './NationSelect.module.css'

interface DropdownListProps {
  nations: Association[]
  currentNation: Association | null
  setNation: (nation: Association) => void
  disabled?: boolean
}

const NationSelect = ({
  nations,
  currentNation,
  setNation,
  disabled = false,
}: DropdownListProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelection = (nation: Association) => {
    if (disabled) return
    setIsOpen(false)
    setNation(nation)
  }

  return (
    <div className={`${styles.container} ${disabled ? styles.disabled : ''}`}>
      <div className={`${styles.content} ${disabled ? styles.disabled : ''}`}>
        <p className={styles.p}>Nation</p>
        <div className={styles.dropdownContainer}>
          <div
            className={`${styles.selectedItem} ${disabled ? styles.disabled : ''}`}
            onClick={() => !disabled && setIsOpen(!isOpen)}
          >
            {currentNation ? (
              <>
                <img className={styles.flag} src={currentNation.flag} alt='flag' />
                {currentNation.code}
              </>
            ) : (
              'Select'
            )}
          </div>
          {isOpen && !disabled && (
            <div className={styles.dropdownMenu}>
              <div className={styles.dropdownItem}>All</div>
              {nations.map((nation: Association) => (
                <div
                  key={nation.id}
                  className={styles.dropdownItem}
                  onClick={() => handleSelection(nation)}
                >
                  <img className={styles.flag} src={nation.flag} alt='flag' />
                  {nation.code}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NationSelect
