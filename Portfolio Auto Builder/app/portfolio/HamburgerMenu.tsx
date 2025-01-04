import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getArtworkByUser, updateArtwork } from '../lib/firestore'
import { useAuth } from '../contexts/AuthContext'

/**
 * HamburgerMenu component displays available artworks and allows adding them to the portfolio.
 * @param {Object} props - The component props.
 * @param {boolean} props.isOpen - Whether the menu is open.
 * @param {Function} props.onClose - Function to close the menu.
 * @param {Array} props.artworks - Array of artworks currently in the portfolio.
 * @param {Function} props.setArtworks - Function to update the artworks in the portfolio.
 */
export default function HamburgerMenu({ isOpen, onClose, artworks, setArtworks }) {
  const [availableArtworks, setAvailableArtworks] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchAvailableArtworks()
    }
  }, [user])

  /**
   * Fetches artworks that are not currently in the portfolio.
   */
  const fetchAvailableArtworks = async () => {
    if (user) {
      const allArtworks = await getArtworkByUser(user.uid)
      const availableArtworks = allArtworks.filter(
        artwork => !artworks.some(portfolioArtwork => portfolioArtwork.id === artwork.id)
      )
      setAvailableArtworks(availableArtworks)
    }
  }

  /**
   * Adds an artwork to the portfolio.
   * @param {Object} artwork - The artwork to be added.
   */
  const addArtwork = async (artwork) => {
    setArtworks([...artworks, artwork])
    setAvailableArtworks(availableArtworks.filter(a => a.id !== artwork.id))
    await updateArtwork(artwork.id, { inPortfolio: true })
  }

  return (
    <div className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-20`}>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Available Artworks</h2>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          {availableArtworks.map((artwork) => (
            <div key={artwork.id} className="flex items-center mb-4">
              <Image
                src={artwork.imageUrl}
                alt={artwork.title}
                width={50}
                height={50}
                className="rounded-md mr-2"
              />
              <span className="flex-grow">{artwork.title}</span>
              <Button onClick={() => addArtwork(artwork)} size="sm">Add</Button>
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  )
}

