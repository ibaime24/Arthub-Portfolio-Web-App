'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getArtworkByUser, subscribeToNewArtworks, deleteArtwork } from '../lib/firestore'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import HamburgerMenu from './HamburgerMenu'
import RemoveArtworkDialog from './RemoveArtworkDialog'

/**
 * PortfolioPage component displays a user's artwork portfolio with editing capabilities.
 */
export default function PortfolioPage() {
  const { user } = useAuth()
  const [artworks, setArtworks] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [artworkToRemove, setArtworkToRemove] = useState(null)

  useEffect(() => {
    let unsubscribe;
    if (user) {
      // Fetch initial artworks
      fetchArtworks()
      // Subscribe to real-time updates for new artworks
      unsubscribe = subscribeToNewArtworks(user.uid, (newArtwork) => {
        setArtworks(prevArtworks => [...prevArtworks, newArtwork])
      })
    }
    // Cleanup function to unsubscribe from real-time updates
    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [user])

  /**
   * Fetches all artworks for the current user.
   */
  const fetchArtworks = async () => {
    if (user) {
      const userArtworks = await getArtworkByUser(user.uid)
      setArtworks(userArtworks)
    }
  }

  /**
   * Toggles the editing mode and opens/closes the hamburger menu.
   */
  const handleEditToggle = () => {
    setIsEditing(!isEditing)
    setIsMenuOpen(!isMenuOpen)
  }

  /**
   * Sets the artwork to be removed when the remove button is clicked.
   * @param {Object} artwork - The artwork to be removed.
   */
  const handleRemoveArtwork = (artwork) => {
    setArtworkToRemove(artwork)
  }

  /**
   * Confirms the removal of an artwork and updates the state and database.
   */
  const confirmRemoveArtwork = async () => {
    if (artworkToRemove) {
      const updatedArtworks = artworks.filter(a => a.id !== artworkToRemove.id)
      setArtworks(updatedArtworks)
      setArtworkToRemove(null)
      await deleteArtwork(artworkToRemove.id)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Button
        onClick={handleEditToggle}
        className="fixed top-4 left-4 z-10"
      >
        {isEditing ? 'Done' : 'Edit'}
      </Button>

      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {artworks.map((artwork) => (
          <div key={artwork.id} className="relative">
            <Image
              src={artwork.imageUrl}
              alt={artwork.title}
              width={500}
              height={500}
              className="w-full h-auto object-cover rounded-lg"
            />
            {isEditing && (
              <Button
                onClick={() => handleRemoveArtwork(artwork)}
                className="absolute top-2 right-2 p-2 bg-white rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <HamburgerMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        artworks={artworks}
        setArtworks={setArtworks}
      />

      <RemoveArtworkDialog
        isOpen={!!artworkToRemove}
        onClose={() => setArtworkToRemove(null)}
        onConfirm={confirmRemoveArtwork}
      />
    </div>
  )
}

