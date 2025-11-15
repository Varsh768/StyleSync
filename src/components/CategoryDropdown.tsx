import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CategoryDropdownProps {
  selectedValue: string;
  onValueChange: (value: string) => void;
  categories: string[];
  placeholder?: string;
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  selectedValue,
  onValueChange,
  categories,
  placeholder = 'Select category',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (category: string) => {
    onValueChange(category);
    setIsOpen(false);
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.7}
      >
        <Text style={[styles.dropdownText, !selectedValue && styles.placeholderText]}>
          {selectedValue || placeholder}
        </Text>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#666"
        />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={categories}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.categoryItem,
                    selectedValue === item && styles.selectedCategoryItem,
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selectedValue === item && styles.selectedCategoryText,
                    ]}
                  >
                    {item}
                  </Text>
                  {selectedValue === item && (
                    <Ionicons name="checkmark" size={20} color="#007AFF" />
                  )}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    backgroundColor: '#fff',
    minHeight: 50,
  },
  dropdownText: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  placeholderText: {
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '85%',
    maxHeight: '70%',
    overflow: 'hidden',
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
    fontSize: 18,
    fontWeight: '600',
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    backgroundColor: '#fff',
  },
  selectedCategoryItem: {
    backgroundColor: '#f0f7ff',
  },
  categoryText: {
    fontSize: 16,
    color: '#000',
  },
  selectedCategoryText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginLeft: 18,
  },
});

export default CategoryDropdown;

