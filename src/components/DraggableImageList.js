import React from 'react';
import { View, Image, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import Icons from './Icons';

const DraggableImageList = ({ 
  imgDouble, 
  imgLoading1, 
  handleRemoveImg, 
  onReorder, // New prop to handle reordering
  
}) => {
  
  const renderItem = ({ item, index, drag, isActive }) => {
    return (
      <ScaleDecorator>
        <View style={[styles.imgBox, isActive && styles.activeImgBox]} key={index}>
          {imgLoading1 && (
            <View style={styles.loader}>
              <ActivityIndicator size={25} color={'#fff'} />
            </View>
          )}
          
          {/* Remove Button */}
          <TouchableOpacity
            disabled={imgLoading1}
            style={styles.crossIcon}
            onPress={() => handleRemoveImg(index)}>
            <Icons name={'close'} size={20} color={'black'} />
          </TouchableOpacity>
          
          {/* Drag Handle */}
          <TouchableOpacity
            style={styles.dragHandle}
            onLongPress={drag}
            disabled={isActive}>
            <Icons name={'drag-handle'} size={20} color={'#666'} />
          </TouchableOpacity>
          
          <Image source={{ uri: item }} style={styles.img} />
        </View>
      </ScaleDecorator>
    );
  };

  const handleDragEnd = ({ data }) => {
    onReorder(data); // Call parent function with reordered data
  };

  if (!imgDouble || imgDouble.length === 0) {
    return null;
  }

  return (
    <View style={styles.imgContainer}>
      <DraggableFlatList
        data={imgDouble}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item}-${index}`}
        onDragEnd={handleDragEnd}
        numColumns={2} // Adjust based on your layout
        horizontal={false}
        scrollEnabled={true}
      />
    </View>
  );
};

// Alternative implementation without external library (more complex but no dependencies)
const DraggableImageListNative = ({ 
  imgDouble, 
  imgLoading1, 
  handleRemoveImg, 
  onReorder,
  styles 
}) => {
  const [draggedIndex, setDraggedIndex] = React.useState(null);
  const [images, setImages] = React.useState(imgDouble);

  React.useEffect(() => {
    setImages(imgDouble);
  }, [imgDouble]);

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDrop = (targetIndex) => {
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      return;
    }

    const newImages = [...images];
    const draggedItem = newImages[draggedIndex];
    
    // Remove from original position
    newImages.splice(draggedIndex, 1);
    
    // Insert at new position
    newImages.splice(targetIndex, 0, draggedItem);
    
    setImages(newImages);
    onReorder(newImages);
    setDraggedIndex(null);
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <View style={styles.imgContainer}>
      {images.map((item, index) => {
        return (
          <View 
            style={[
              styles.imgBox, 
              draggedIndex === index && styles.draggedImgBox
            ]} 
            key={`${item}-${index}`}
          >
            {imgLoading1 && (
              <View style={styles.loader}>
                <ActivityIndicator size={25} color={'#fff'} />
              </View>
            )}
            
            {/* Remove Button */}
            <TouchableOpacity
              disabled={imgLoading1}
              style={styles.crossIcon}
              onPress={() => handleRemoveImg(index)}>
              <Icons name={'close'} size={20} color={'black'} />
            </TouchableOpacity>
            
            {/* Drag Handle */}
            <TouchableOpacity
              style={styles.dragHandle}
              onPressIn={() => handleDragStart(index)}
              onPressOut={() => handleDrop(index)}>
              <Icons name={'drag-handle'} size={20} color={'#666'} />
            </TouchableOpacity>
            
            <Image source={{ uri: item }} style={styles.img} />
          </View>
        );
      })}
    </View>
  );
};

// Usage in your parent component:
const ParentComponent = () => {
  const [imgDouble, setImgDouble] = React.useState(['url1', 'url2', 'url3']);
  
  const handleReorder = (reorderedImages) => {
    setImgDouble(reorderedImages);
    // Save to your backend/storage here
  };

  const handleRemoveImg = (index) => {
    const newImages = imgDouble.filter((_, i) => i !== index);
    setImgDouble(newImages);
  };

  return (
    <DraggableImageList
      imgDouble={imgDouble}
      imgLoading1={false}
      handleRemoveImg={handleRemoveImg}
      onReorder={handleReorder}
      styles={styles}
    />
  );
};

// Additional styles you'll need to add:



const styles = StyleSheet.create({
    activeImgBox: {
        opacity: 0.8,
        transform: [{ scale: 1.05 }],
      },
      draggedImgBox: {
        opacity: 0.5,
      },
      dragHandle: {
        position: 'absolute',
        top: 5,
        left: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 12,
        padding: 4,
        zIndex: 2,
      },
      // Update crossIcon to not overlap with drag handle
      crossIcon: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 12,
        padding: 4,
        zIndex: 2,
      },
  });

export default DraggableImageList;