import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ClosetStackParamList } from '../../types';
// FIREBASE COMMENTED OUT FOR TESTING
// import { collection, addDoc } from 'firebase/firestore';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { db, storage } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { performOCR, parseReceiptText, ParsedItem } from '../../utils/receiptParser';
import { saveClosetItem } from '../../services/localStorage';
import CategoryDropdown from '../../components/CategoryDropdown';

type AddItemScreenNavigationProp = StackNavigationProp<ClosetStackParamList, 'AddItem'>;

interface Props {
  navigation: AddItemScreenNavigationProp;
}

const CATEGORIES = [
  'Top',
  'Bottom',
  'Dress',
  'Outerwear',
  'Shoes',
  'Accessories',
  'Saree',
  'Blazer',
  'Other',
];

const AddItemScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanningReceipt, setScanningReceipt] = useState(false);
  const [parsedItems, setParsedItems] = useState<ParsedItem[]>([]);
  const [showParsedItemsModal, setShowParsedItemsModal] = useState(false);
  const receiptImageUriRef = useRef<string | null>(null);
  const sneakerImageUriRef = useRef<string | null>(null);

  const pickImages = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission needed', 'Please grant permission to access your photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map((asset) => asset.uri);
      setImages([...images, ...newImages]);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission needed', 'Please grant permission to access your camera');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const scanReceipt = async () => {
    Alert.alert(
      'Scan Receipt',
      'Choose how you want to scan your receipt',
      [
        {
          text: 'Take Photo',
          onPress: async () => {
            const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
            if (!permissionResult.granted) {
              Alert.alert('Permission needed', 'Please grant permission to access your camera');
              return;
            }

            const result = await ImagePicker.launchCameraAsync({
              quality: 0.8,
              allowsEditing: true,
            });

            if (!result.canceled && result.assets[0]) {
              await processReceiptImage(result.assets[0].uri);
            }
          },
        },
        {
          text: 'From Photo Library',
          onPress: async () => {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissionResult.granted) {
              Alert.alert('Permission needed', 'Please grant permission to access your photos');
              return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
              await processReceiptImage(result.assets[0].uri);
            }
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const processReceiptImage = async (imageUri: string) => {
    setScanningReceipt(true);
    try {
      // Perform OCR on the receipt image
      const receiptText = await performOCR(imageUri);
      
      // Parse the receipt text to extract items
      const items = parseReceiptText(receiptText);

      if (items.length === 0) {
        Alert.alert(
          'No Items Found',
          'Could not find any clothing items in the receipt. Please try again or add items manually.'
        );
        setScanningReceipt(false);
        return;
      }

      // Store receipt image URI for later use when item is selected
      receiptImageUriRef.current = imageUri;

      // HARDCODED: Add a random sneaker image URL
      const sneakerImages = [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
        'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800',
        'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800',
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800',
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800',
      ];
      const randomSneakerImage = sneakerImages[Math.floor(Math.random() * sneakerImages.length)];
      sneakerImageUriRef.current = randomSneakerImage;

      // Show parsed items modal
      setParsedItems(items);
      setShowParsedItemsModal(true);
    } catch (error: any) {
      console.error('Error processing receipt:', error);
      Alert.alert('Error', 'Failed to process receipt. Please try again.');
    } finally {
      setScanningReceipt(false);
    }
  };

  const useParsedItem = (item: ParsedItem) => {
    // Auto-populate form with parsed item data
    if (item.name) {
      setTitle(item.name);
    }
    if (item.category) {
      setCategory(item.category);
    }
    if (item.brand) {
      setBrand(item.brand);
    }
    if (item.size) {
      setSize(item.size);
    }
    if (item.price) {
      setNotes(`Price: $${item.price}`);
    }

    // Add images: sneaker image first, then receipt image
    const newImages: string[] = [];
    
    // Add random sneaker image first
    if (sneakerImageUriRef.current) {
      newImages.push(sneakerImageUriRef.current);
      sneakerImageUriRef.current = null; // Clear after use
    }
    
    // Add receipt image
    if (receiptImageUriRef.current) {
      newImages.push(receiptImageUriRef.current);
      receiptImageUriRef.current = null; // Clear after use
    }
    
    // Add existing images
    setImages([...newImages, ...images]);

    setShowParsedItemsModal(false);
    Alert.alert('Item Loaded', 'Item details, sneaker photo, and receipt photo have been added. You can add more photos if needed.');
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const uploadImage = async (uri: string, itemId: string, index: number): Promise<string> => {
    // FIREBASE COMMENTED OUT - MOCK IMPLEMENTATION
    // const response = await fetch(uri);
    // const blob = await response.blob();
    // const imageRef = ref(storage, `closet_items/${itemId}/${index}`);
    // await uploadBytes(imageRef, blob);
    // return await getDownloadURL(imageRef);
    return uri; // Mock: Return local URI
  };

  const handleSave = async () => {
    if (!user) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    if (images.length === 0) {
      Alert.alert('Error', 'Please add at least one image');
      return;
    }

    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for the item');
      return;
    }

    if (!category) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    setLoading(true);
    try {
      // Save item to local storage (hardcoded, no Firebase)
      await saveClosetItem({
        ownerId: user.id,
        images: images, // Store local image URIs
        title: title.trim(),
        category,
        brand: brand.trim() || undefined,
        size: size.trim() || undefined,
        notes: notes.trim() || undefined,
        isActive: true,
      });

      Alert.alert('Success', 'Item added to your closet!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      console.error('Error adding item:', error);
      Alert.alert('Error', error.message || 'Failed to add item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Photos *</Text>
        <View style={styles.imageContainer}>
          {images.map((uri, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri }} style={styles.image} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeImage(index)}
              >
                <Text style={styles.removeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addImageButton} onPress={pickImages}>
            <Text style={styles.addImageText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cameraButton} onPress={takePhoto}>
            <Text style={styles.cameraButtonText}>📷</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.receiptButton} onPress={scanReceipt}>
            <Text style={styles.receiptButtonText}>🧾</Text>
            <Text style={styles.receiptButtonLabel}>Receipt</Text>
          </TouchableOpacity>
        </View>
        {scanningReceipt && (
          <View style={styles.scanningIndicator}>
            <Text style={styles.scanningText}>Scanning receipt...</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Blue Denim Jacket, Red Summer Dress"
          placeholderTextColor="#999"
          value={title}
          onChangeText={setTitle}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Category *</Text>
        <CategoryDropdown
          selectedValue={category}
          onValueChange={setCategory}
          categories={CATEGORIES}
          placeholder="Select category"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Brand</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Zara, H&M"
          value={brand}
          onChangeText={setBrand}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Size</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., M, 8, One Size"
          value={size}
          onChangeText={setSize}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Color, fit, condition, etc."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
        />
      </View>

      <TouchableOpacity
        style={[styles.saveButton, loading && styles.buttonDisabled]}
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={styles.saveButtonText}>{loading ? 'Saving...' : 'Save Item'}</Text>
      </TouchableOpacity>

      {/* Parsed Items Modal */}
      <Modal
        visible={showParsedItemsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowParsedItemsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Items Found in Receipt</Text>
              <TouchableOpacity onPress={() => setShowParsedItemsModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={parsedItems}
              keyExtractor={(item, index) => `${item.name}-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.parsedItemCard}
                  onPress={() => useParsedItem(item)}
                >
                  <Text style={styles.parsedItemName}>{item.name}</Text>
                  <View style={styles.parsedItemDetails}>
                    {item.brand && <Text style={styles.parsedItemDetail}>Brand: {item.brand}</Text>}
                    {item.category && (
                      <Text style={styles.parsedItemDetail}>Category: {item.category}</Text>
                    )}
                    {item.size && <Text style={styles.parsedItemDetail}>Size: {item.size}</Text>}
                    {item.price && <Text style={styles.parsedItemDetail}>Price: ${item.price}</Text>}
                  </View>
                  <Text style={styles.useItemText}>Tap to use this item</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No items found in receipt</Text>
              }
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  imageWrapper: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ff3b30',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageText: {
    fontSize: 24,
    color: '#999',
  },
  cameraButton: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButtonText: {
    fontSize: 24,
  },
  receiptButton: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f7ff',
  },
  receiptButtonText: {
    fontSize: 24,
    marginBottom: 4,
  },
  receiptButtonLabel: {
    fontSize: 10,
    color: '#007AFF',
    fontWeight: '600',
  },
  scanningIndicator: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f0f7ff',
    borderRadius: 8,
    alignItems: 'center',
  },
  scanningText: {
    color: '#007AFF',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalClose: {
    fontSize: 24,
    color: '#666',
  },
  parsedItemCard: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  parsedItemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  parsedItemDetails: {
    marginBottom: 8,
  },
  parsedItemDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  useItemText: {
    fontSize: 12,
    color: '#007AFF',
    fontStyle: 'italic',
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    margin: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddItemScreen;

