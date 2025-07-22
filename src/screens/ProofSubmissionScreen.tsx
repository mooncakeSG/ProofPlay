import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
  TextInput,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useXionAuth } from '../services/XionAuthService';

interface ProofFile {
  uri: string;
  name: string;
  type: string;
  size: number;
}

const ProofSubmissionScreen: React.FC = () => {
  const { user, verifyProof } = useXionAuth();
  const [selectedFile, setSelectedFile] = useState<ProofFile | null>(null);
  const [challengeId, setChallengeId] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Handle image selection from camera
  const handleTakePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Camera permission is required to take photos');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setSelectedFile({
          uri: asset.uri,
          name: asset.fileName || 'photo.jpg',
          type: asset.type || 'image/jpeg',
          size: asset.fileSize || 0,
        });
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  // Handle image selection from gallery
  const handleSelectImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Gallery permission is required to select images');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setSelectedFile({
          uri: asset.uri,
          name: asset.fileName || 'image.jpg',
          type: asset.type || 'image/jpeg',
          size: asset.fileSize || 0,
        });
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };

  // Handle document selection
  const handleSelectDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain',
        ],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        setSelectedFile({
          uri: file.uri,
          name: file.name,
          type: file.mimeType || 'application/octet-stream',
          size: file.size || 0,
        });
      }
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        console.error('Document picker error:', error);
        Alert.alert('Error', 'Failed to select document');
      }
    }
  };

  // Handle file removal
  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  // Handle proof submission
  const handleSubmitProof = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to submit a proof');
      return;
    }

    if (!challengeId.trim()) {
      Alert.alert('Error', 'Please enter a challenge ID');
      return;
    }

    if (!selectedFile) {
      Alert.alert('Error', 'Please select a file to upload');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please provide a description of your proof');
      return;
    }

    setIsSubmitting(true);
    setIsVerifying(true);

    try {
      // Prepare proof data for XION verification
      const proofData = {
        challengeId: challengeId.trim(),
        proofFile: selectedFile.uri,
        metadata: {
          fileName: selectedFile.name,
          fileType: selectedFile.type,
          fileSize: selectedFile.size,
          description: description.trim(),
          submittedBy: user.id,
          submittedAt: new Date().toISOString(),
        },
      };

      // Call XION zkTLS verification
      console.log('Submitting proof for verification:', proofData);

      const verificationResult = await verifyProof(proofData);

      if (verificationResult.success) {
        Alert.alert(
          'Success!',
          `Proof verified successfully!\n\nProof Hash: ${verificationResult.proofHash}\n\nYour proof has been submitted and verified using XION's zkTLS technology.`,
          [
            {
              text: 'OK',
              onPress: () => {
                // Reset form
                setSelectedFile(null);
                setChallengeId('');
                setDescription('');
              },
            },
          ]
        );
      } else {
        Alert.alert(
          'Verification Failed',
          `Proof verification failed: ${verificationResult.error}\n\nPlease ensure your proof meets the challenge requirements and try again.`
        );
      }
    } catch (error) {
      console.error('Proof submission error:', error);
      Alert.alert('Error', 'Failed to submit proof. Please try again.');
    } finally {
      setIsSubmitting(false);
      setIsVerifying(false);
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Submit Proof</Text>
        <Text style={styles.subtitle}>
          Upload your proof and verify it with XION zkTLS
        </Text>
      </View>

      {/* Challenge ID Input */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Challenge ID</Text>
        <TextInput
          style={styles.input}
          value={challengeId}
          onChangeText={setChallengeId}
          placeholder="Enter the challenge ID (e.g., 1, 2, 3...)"
          placeholderTextColor="#999"
        />
      </View>

      {/* File Upload Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upload Proof</Text>

        {!selectedFile ? (
          <View style={styles.uploadOptions}>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handleTakePhoto}
            >
              <Text style={styles.uploadButtonText}>📷 Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handleSelectImage}
            >
              <Text style={styles.uploadButtonText}>🖼️ Select Image</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handleSelectDocument}
            >
              <Text style={styles.uploadButtonText}>📄 Select Document</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.filePreview}>
            {selectedFile.type.startsWith('image/') ? (
              <Image
                source={{ uri: selectedFile.uri }}
                style={styles.imagePreview}
              />
            ) : (
              <View style={styles.documentPreview}>
                <Text style={styles.documentIcon}>📄</Text>
                <Text style={styles.documentName}>{selectedFile.name}</Text>
              </View>
            )}

            <View style={styles.fileInfo}>
              <Text style={styles.fileName}>{selectedFile.name}</Text>
              <Text style={styles.fileSize}>
                {formatFileSize(selectedFile.size)}
              </Text>
              <Text style={styles.fileType}>{selectedFile.type}</Text>
            </View>

            <TouchableOpacity
              style={styles.removeButton}
              onPress={handleRemoveFile}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Description Input */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Describe your proof and how it demonstrates completion of the challenge..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      {/* XION Verification Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>XION zkTLS Verification</Text>
        <View style={styles.verificationInfo}>
          <Text style={styles.verificationText}>
            Your proof will be verified using XION's zero-knowledge TLS (zkTLS)
            technology, ensuring:
          </Text>
          <Text style={styles.verificationBullet}>
            • Privacy-preserving verification
          </Text>
          <Text style={styles.verificationBullet}>
            • Cryptographic proof of completion
          </Text>
          <Text style={styles.verificationBullet}>
            • Immutable record on XION blockchain
          </Text>
        </View>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[
          styles.submitButton,
          (!selectedFile ||
            !challengeId.trim() ||
            !description.trim() ||
            isSubmitting) &&
            styles.submitButtonDisabled,
        ]}
        onPress={handleSubmitProof}
        disabled={
          !selectedFile ||
          !challengeId.trim() ||
          !description.trim() ||
          isSubmitting
        }
      >
        {isSubmitting ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#ffffff" />
            <Text style={styles.submitButtonText}>
              {isVerifying ? 'Verifying with XION...' : 'Submitting...'}
            </Text>
          </View>
        ) : (
          <Text style={styles.submitButtonText}>Submit Proof</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  section: {
    padding: 20,
    backgroundColor: '#ffffff',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1a1a1a',
    backgroundColor: '#ffffff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  uploadOptions: {
    gap: 12,
  },
  uploadButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  uploadButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  filePreview: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  documentPreview: {
    alignItems: 'center',
    padding: 20,
    marginBottom: 12,
  },
  documentIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  documentName: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  fileInfo: {
    marginBottom: 12,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  fileSize: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  fileType: {
    fontSize: 14,
    color: '#666',
  },
  removeButton: {
    backgroundColor: '#ff3b30',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  removeButtonText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  verificationInfo: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 16,
  },
  verificationText: {
    fontSize: 14,
    color: '#1a1a1a',
    lineHeight: 20,
    marginBottom: 8,
  },
  verificationBullet: {
    fontSize: 14,
    color: '#1a1a1a',
    lineHeight: 20,
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    margin: 20,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
});

export default ProofSubmissionScreen;
