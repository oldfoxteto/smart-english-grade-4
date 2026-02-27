import { storageInstance } from '../firebase-config';
import { launchImageLibrary } from 'react-native-image-picker';

// Storage Service
class StorageService {
  // Upload user avatar
  async uploadAvatar(userId: string, imageUri: string): Promise<string> {
    try {
      const reference = storageInstance().ref(`avatars/${userId}`);
      const task = reference.putFile(imageUri);
      
      await task;
      
      const downloadURL = await reference.getDownloadURL();
      return downloadURL;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Pick image from gallery
  async pickImage(): Promise<string | null> {
    return new Promise((resolve, reject) => {
      const options = {
        mediaType: 'photo' as const,
        quality: 0.8,
        maxWidth: 500,
        maxHeight: 500,
      };

      launchImageLibrary(options, (response) => {
        if (response.assets && response.assets[0]) {
          resolve(response.assets[0].uri || null);
        } else {
          resolve(null);
        }
      });
    });
  }

  // Upload lesson audio
  async uploadLessonAudio(lessonId: string, audioUri: string): Promise<string> {
    try {
      const reference = storageInstance().ref(`lessons/audio/${lessonId}`);
      const task = reference.putFile(audioUri);
      
      await task;
      
      const downloadURL = await reference.getDownloadURL();
      return downloadURL;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Upload user speech recording
  async uploadSpeechRecording(userId: string, lessonId: string, audioUri: string): Promise<string> {
    try {
      const timestamp = Date.now();
      const reference = storageInstance().ref(`speech/${userId}/${lessonId}/${timestamp}`);
      const task = reference.putFile(audioUri);
      
      await task;
      
      const downloadURL = await reference.getDownloadURL();
      return downloadURL;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Get download URL for a file
  async getDownloadURL(filePath: string): Promise<string> {
    try {
      const reference = storageInstance().ref(filePath);
      const downloadURL = await reference.getDownloadURL();
      return downloadURL;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Delete file
  async deleteFile(filePath: string): Promise<void> {
    try {
      const reference = storageInstance().ref(filePath);
      await reference.delete();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // List files in a directory
  async listFiles(directoryPath: string): Promise<string[]> {
    try {
      const reference = storageInstance().ref(directoryPath);
      const result = await reference.listAll();
      
      const downloadURLs = await Promise.all(
        result.items.map(async (item) => {
          return await item.getDownloadURL();
        })
      );
      
      return downloadURLs;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Upload lesson image
  async uploadLessonImage(lessonId: string, imageUri: string): Promise<string> {
    try {
      const reference = storageInstance().ref(`lessons/images/${lessonId}`);
      const task = reference.putFile(imageUri);
      
      await task;
      
      const downloadURL = await reference.getDownloadURL();
      return downloadURL;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Upload achievement icon
  async uploadAchievementIcon(achievementId: string, imageUri: string): Promise<string> {
    try {
      const reference = storageInstance().ref(`achievements/${achievementId}`);
      const task = reference.putFile(imageUri);
      
      await task;
      
      const downloadURL = await reference.getDownloadURL();
      return downloadURL;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Get file metadata
  async getFileMetadata(filePath: string): Promise<any> {
    try {
      const reference = storageInstance().ref(filePath);
      const metadata = await reference.getMetadata();
      return metadata;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Update file metadata
  async updateFileMetadata(filePath: string, metadata: any): Promise<void> {
    try {
      const reference = storageInstance().ref(filePath);
      await reference.updateMetadata(metadata);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

export default new StorageService();
