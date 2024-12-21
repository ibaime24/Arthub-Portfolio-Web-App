'use client'

import { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import Link from 'next/link'
import { ImageData } from '../types'

interface EditModeProps {
  images: ImageData[]
  setImages: React.Dispatch<React.SetStateAction<ImageData[]>>
}

export default function EditMode({ images, setImages }: EditModeProps) {
  const [editingId, setEditingId] = useState<string | null>(null)

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const newImages = Array.from(images)
    const [reorderedItem] = newImages.splice(result.source.index, 1)
    newImages.splice(result.destination.index, 0, reorderedItem)

    setImages(newImages)
  }

  const handleEdit = (id: string) => {
    setEditingId(id)
  }

  const handleSave = (id: string, newData: Partial<ImageData>) => {
    setImages(images.map(img => 
      img.id === id ? { ...img, ...newData } : img
    ))
    setEditingId(null)
  }

  const handleDelete = (id: string) => {
    setImages(images.filter(img => img.id !== id))
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="images">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <Draggable key={image.id} draggableId={image.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="border p-4 rounded"
                  >
                    <Link href={`/art/${image.id}`}>
                      <img src={image.url} alt={image.title} className="w-full h-48 object-cover mb-2" />
                    </Link>
                    {editingId === image.id ? (
                      <div>
                        <input
                          type="text"
                          value={image.title}
                          onChange={(e) => handleSave(image.id, { title: e.target.value })}
                          className="border p-1 mb-1 w-full"
                        />
                        <textarea
                          value={image.description}
                          onChange={(e) => handleSave(image.id, { description: e.target.value })}
                          className="border p-1 mb-1 w-full"
                        />
                        <input
                          type="text"
                          value={image.medium}
                          onChange={(e) => handleSave(image.id, { medium: e.target.value })}
                          className="border p-1 mb-1 w-full"
                        />
                        <button onClick={() => setEditingId(null)} className="bg-green-500 text-white px-2 py-1 rounded">Save</button>
                      </div>
                    ) : (
                      <div>
                        <h3 className="font-bold">{image.title}</h3>
                        <p>{image.description}</p>
                        <p>Medium: {image.medium}</p>
                        <p>Date: {image.date}</p>
                        <button onClick={() => handleEdit(image.id)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                        <button onClick={() => handleDelete(image.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                      </div>
                    )}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

