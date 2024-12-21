'use client'

import { useState, useEffect } from 'react'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import Link from 'next/link'
import EditMode from './components/EditMode'
import PreviewMode from './components/PreviewMode'
import { ImageData } from './types'

// Firebase configuration
const firebaseConfig = {
  // Your Firebase config here
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export default function PortfolioCreator() {
  const [images, setImages] = useState<ImageData[]>([])
  const [isEditMode, setIsEditMode] = useState(true)

  useEffect(() => {
    const fetchImages = async () => {
      const querySnapshot = await getDocs(collection(db, 'images'))
      const fetchedImages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ImageData[]
      setImages(fetchedImages)
    }

    fetchImages()
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Portfolio Creator</h1>
      <button
        onClick={() => setIsEditMode(!isEditMode)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        {isEditMode ? 'Switch to Preview' : 'Switch to Edit'}
      </button>
      {isEditMode ? (
        <EditMode images={images} setImages={setImages} />
      ) : (
        <PreviewMode images={images} />
      )}
    </div>
  )
}

