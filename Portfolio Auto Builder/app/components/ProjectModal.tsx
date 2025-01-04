'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function ProjectModal({ project, onClose, onUpdate }) {
  const [title, setTitle] = useState(project.title)
  const [description, setDescription] = useState(project.description)

  useEffect(() => {
    setTitle(project.title)
    setDescription(project.description)
  }, [project])

  const handleSave = () => {
    onUpdate({ title, description })
    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="mb-4">
              <Image
                src={project.imageUrl}
                alt={project.title}
                width={800}
                height={600}
                objectFit="contain"
                className="rounded-lg"
              />
            </div>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mb-4 w-full"
              placeholder="Project Title"
            />
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mb-4 w-full"
              placeholder="Project Description"
              rows={4}
            />
            <div className="flex justify-end space-x-2">
              <Button onClick={onClose} variant="outline">Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

