import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

/**
 * RemoveArtworkDialog component displays a confirmation dialog for removing an artwork.
 * @param {Object} props - The component props.
 * @param {boolean} props.isOpen - Whether the dialog is open.
 * @param {Function} props.onClose - Function to close the dialog.
 * @param {Function} props.onConfirm - Function to confirm the removal of the artwork.
 */
export default function RemoveArtworkDialog({ isOpen, onClose, onConfirm }) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will remove the artwork from your portfolio. You can add it back later from the menu.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Remove</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

