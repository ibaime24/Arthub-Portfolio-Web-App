import Image from 'next/image'
import { Draggable } from 'react-beautiful-dnd'

export default function DraggableImage({ project, index, onClick }) {
  return (
    <Draggable draggableId={project.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`relative aspect-square overflow-hidden rounded-lg shadow-md transition-transform duration-200 ease-in-out ${
            snapshot.isDragging ? 'scale-105' : ''
          }`}
          onClick={onClick}
        >
          <Image
            src={project.imageUrl}
            alt={project.title}
            layout="fill"
            objectFit="cover"
            className="transition-opacity duration-200 ease-in-out hover:opacity-80"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
            <h3 className="text-sm font-semibold truncate">{project.title}</h3>
          </div>
        </div>
      )}
    </Draggable>
  )
}

