import { db } from './firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDoc, getDocs, query, where, onSnapshot } from 'firebase/firestore';

/**
 * Creates a new user in the Firestore 'users' collection.
 * @param {Object} userData - The user data to be added.
 * @param {string} userData.username - The user's unique username.
 * @param {string} userData.UID - The user's unique identifier.
 * @param {string} userData.email - The user's email address.
 * @param {string} userData.name - The user's full name.
 * @returns {Promise<string>} The ID of the newly created user document.
 * @throws {Error} If the username already exists or if there's an error creating the user.
 */
export const createUser = async (userData: {
  username: string;
  UID: string;
  email: string;
  name: string;
}) => {
  try {
    // Check if username already exists
    const usernameQuery = query(collection(db, 'users'), where('username', '==', userData.username));
    const usernameSnapshot = await getDocs(usernameQuery);
    
    if (!usernameSnapshot.empty) {
      throw new Error('Username already exists');
    }

    const docRef = await addDoc(collection(db, 'users'), userData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Retrieves a user from the Firestore 'users' collection by their UID.
 * @param {string} UID - The unique identifier of the user.
 * @returns {Promise<Object|null>} The user data if found, null otherwise.
 * @throws {Error} If there's an error retrieving the user.
 */
export const getUserByUID = async (UID: string) => {
  try {
    const q = query(collection(db, 'users'), where('UID', '==', UID));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

/**
 * Creates a new artwork in the Firestore 'artwork' collection.
 * @param {Object} artworkData - The artwork data to be added.
 * @param {string} artworkData.title - The title of the artwork.
 * @param {string} artworkData.description - A description of the artwork.
 * @param {string} artworkData.location - The location of the artwork.
 * @param {string} artworkData.medium - The medium used for the artwork.
 * @param {string} artworkData.imageUrl - The URL of the artwork image.
 * @param {string} artworkData.userUID - The UID of the user who created the artwork.
 * @returns {Promise<string>} The ID of the newly created artwork document.
 * @throws {Error} If there's an error creating the artwork.
 */
export const createArtwork = async (artworkData: {
  title: string;
  description: string;
  location: string;
  medium: string;
  imageUrl: string;
  userUID: string;
}) => {
  try {
    const docRef = await addDoc(collection(db, 'artwork'), artworkData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating artwork:', error);
    throw error;
  }
};

/**
 * Retrieves all artworks for a specific user from the Firestore 'artwork' collection.
 * @param {string} userUID - The unique identifier of the user.
 * @returns {Promise<Array>} An array of artwork objects.
 * @throws {Error} If there's an error retrieving the artworks.
 */
export const getArtworkByUser = async (userUID: string) => {
  try {
    const q = query(collection(db, 'artwork'), where('userUID', '==', userUID));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting artwork:', error);
    throw error;
  }
};

/**
 * Updates an existing artwork in the Firestore 'artwork' collection.
 * @param {string} artworkId - The ID of the artwork to update.
 * @param {Object} updateData - The data to update in the artwork document.
 * @throws {Error} If there's an error updating the artwork.
 */
export const updateArtwork = async (artworkId: string, updateData: Partial<{
  title: string;
  description: string;
  location: string;
  medium: string;
  imageUrl: string;
}>) => {
  try {
    const artworkRef = doc(db, 'artwork', artworkId);
    await updateDoc(artworkRef, updateData);
  } catch (error) {
    console.error('Error updating artwork:', error);
    throw error;
  }
};

/**
 * Deletes an artwork from the Firestore 'artwork' collection.
 * @param {string} artworkId - The ID of the artwork to delete.
 * @throws {Error} If there's an error deleting the artwork.
 */
export const deleteArtwork = async (artworkId: string) => {
  try {
    await deleteDoc(doc(db, 'artwork', artworkId));
  } catch (error) {
    console.error('Error deleting artwork:', error);
    throw error;
  }
};

/**
 * Sets up a real-time listener for new artwork uploads for a specific user.
 * @param {string} userUID - The unique identifier of the user.
 * @param {Function} callback - The function to call when a new artwork is added.
 * @returns {Function} A function to unsubscribe from the listener.
 */
export const subscribeToNewArtworks = (userUID: string, callback: (newArtwork: any) => void) => {
  const q = query(collection(db, 'artwork'), where('userUID', '==', userUID));
  return onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        callback({ id: change.doc.id, ...change.doc.data() });
      }
    });
  });
};

