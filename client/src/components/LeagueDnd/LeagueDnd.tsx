import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd'
import { useEffect, useState } from 'react'
import styles from './LeagueDnd.module.css'
import { Association, Team } from '../../types'

interface LeagueDndProps {
  teams: Team[]
  nation: Association
  setTeams: (teams: Team[]) => void
  disabled?: boolean
}

const LeagueDnd = ({
  teams: initialTeams,
  nation,
  setTeams,
  disabled = false,
}: LeagueDndProps) => {
  // For storing teams with ids converted to strings
  const [modTeams, setModTeams] = useState<Team[]>(initialTeams)

  useEffect(() => {
    initialTeams.map(team => (team.id = team.id.toString()))
    setModTeams(initialTeams)
  }, [initialTeams])

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(modTeams)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    setModTeams(items)

    // Convert ids back to numbers when sent back to parent
    items.map(item => (item.id = parseInt(item.id.toString())))
    setTeams(items)
  }

  return (
    <div className={styles.container}>
      <h3>{nation?.leagueName}</h3>
      <div className={`${styles.content} ${disabled ? styles.disabled : ''}`}>
        <div className={styles.rankColumn}>
          {modTeams.map((_, index) => (
            <div key={index} className={styles.rankNumber}>
              {index + 1}
            </div>
          ))}
        </div>
        <DragDropContext onDragEnd={disabled ? () => {} : handleOnDragEnd}>
          <Droppable droppableId='teams'>
            {provided => (
              <ul
                className={styles.listContainer}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {modTeams.map(({ id, name, logo }, index) => (
                  <Draggable
                    key={id}
                    draggableId={id.toString()}
                    index={index}
                    isDragDisabled={disabled}
                  >
                    {provided => (
                      <li
                        className={`${styles.listItem} ${
                          disabled ? styles.disabledItem : ''
                        }`}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <div className={styles.itemInfo}>
                          <div className={styles.imgContainer}>
                            <img className={styles.img} src={logo} alt='logo' />
                          </div>
                          <div className={styles.clubName}>{name}</div>
                        </div>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  )
}

export default LeagueDnd
