import { useState } from 'react'
import styles from './DomCupSelect.module.css' // Adjust the import path as needed
import { Association, Team } from '../../types'

interface DropdownListProps {
  teams: Team[]
  nation: Association
  cupWinner: Team | null
  setCupWinner: (team: Team) => void
  disabled: boolean
}

const DomCupSelect = ({
  teams,
  nation,
  cupWinner,
  setCupWinner,
  disabled = false,
}: DropdownListProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelection = (team: Team) => {
    if (disabled) return
    setCupWinner(team)
    setIsOpen(false)
  }

  return (
    <div className={`${styles.container} ${disabled ? styles.disabled : ''}`}>
      <h3>{nation.cupName}</h3>
      <div className={`${styles.content} ${disabled ? styles.disabled : ''}`}>
        <p className={styles.p}>Winner</p>
        <div className={styles.dropdownContainer}>
          <div
            className={`${styles.selectedItem} ${
              disabled ? styles.disabled : ''
            }`}
            onClick={() => !disabled && setIsOpen(!isOpen)}
          >
            {cupWinner ? (
              <>
                <div className={styles.imgContainer}>
                  <img
                    className={styles.img}
                    src={cupWinner.logo}
                    alt={cupWinner.name}
                  />
                </div>
                {cupWinner.name}
              </>
            ) : (
              'Select a team'
            )}
          </div>
          {isOpen && !disabled && (
            <div className={styles.dropdownMenu}>
              {teams.map(team => (
                <div
                  key={team.id}
                  className={styles.dropdownItem}
                  onClick={() => handleSelection(team)}
                >
                  <div className={styles.imgContainer}>
                    <img className={styles.img} src={team.logo} alt='logo' />
                  </div>
                  <div className={styles.p}>{team.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DomCupSelect
