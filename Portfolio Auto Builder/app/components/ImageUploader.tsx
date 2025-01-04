'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function ImageUploader({ onUpload }) {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)

    try {
      // In a real application, you would upload the file to a server here
      // For this example, we'll use a local URL
      const imageUrl = URL.createObjectURL(file)

      const newProject = {
        id: Date.now().toString(),
        title: file.name.split('.')[0],
        imageUrl: imageUrl,
        description: 'Click to add a description for your project.'
      }

      onUpload(newProject)
    } catch (error) {
      console.error('Error uploading image:', error)
      // Handle error (e.g., show an error message to the user)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="mb-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
        id="image-upload"
        disabled={uploading}
      />
      <label htmlFor="image-upload">
        <Button as="span" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload Image'}
        </Button>
      </label>
    </div>
  )
}

