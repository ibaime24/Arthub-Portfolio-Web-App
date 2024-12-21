'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { getFirestore, doc, getDoc } from 'firebase/firestore'
import Link from 'next/link'
import { ImageData } from '../../types'

const db = getFirestore()

export default function ArtPage() {
  const { id } = useParams()
  const [image, setImage] = useState<ImageData | null>(null)

  useEffect(() => {
    const fetchImage = async () => {
      const docRef = doc(db, 'images', id as string)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        setImage({ id: docSnap.id, ...docSnap.data() } as ImageData)
      } else {
        console.log('No such document!')
      }
    }

    fetchImage()
  }, [id])

  if (!image) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <Link href="/" className="text-blue-500 hover:underline mb-4 inline-block">
        &larr; Back to Portfolio
      </Link>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img src={image.url} alt={image.title} className="w-full h-auto" />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{image.title}</h1>
          <p className="mb-4">{image.description}</p>
          <p className="mb-2"><strong>Medium:</strong> {image.medium}</p>
          <p className="mb-2"><strong>Date:</strong> {image.date}</p>
        </div>
      </div>
    </div>
  )
}

