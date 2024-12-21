import Link from 'next/link'
import { ImageData } from '../types'

interface PreviewModeProps {
  images: ImageData[]
}

export default function PreviewMode({ images }: PreviewModeProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image) => (
        <div key={image.id} className="border p-4 rounded">
          <Link href={`/art/${image.id}`}>
            <img src={image.url} alt={image.title} className="w-full h-48 object-cover mb-2" />
            <h3 className="font-bold">{image.title}</h3>
          </Link>
        </div>
      ))}
    </div>
  )
}

