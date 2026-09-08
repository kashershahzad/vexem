import React, { useState, useRef } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  PanResponder,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icons from './Icons';

const { width } = Dimensions.get('window');
const ITEM_GAP = 8; 
const ITEM_WIDTH = 70; 

const DraggableImagesGrid = ({ imgDouble, imgLoading1, handleRemoveImg }) => {
  
  const [images, setImages] = useState(imgDouble || []);
  const [dragging, setDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  const itemPositions = useRef(
    images.map((_, index) => ({
      position: new Animated.ValueXY({
        x: (index % 2) * (ITEM_WIDTH + ITEM_GAP),
        y: Math.floor(index / 2) * (70 + ITEM_GAP),
      }),
      index,
    }))
  ).current;

  // Update positions when images change
  React.useEffect(() => {
    if (imgDouble && imgDouble.length !== itemPositions.length) {
      itemPositions.splice(0, itemPositions.length);
      imgDouble.forEach((_, index) => {
        itemPositions.push({
          position: new Animated.ValueXY({
            x: (index % 2) * (ITEM_WIDTH + ITEM_GAP),
            y: Math.floor(index / 2) * (70 + ITEM_GAP),
          }),
          index,
        });
      });
    }
    setImages(imgDouble || []);
  }, [imgDouble]);

  // Create the panResponder for each item
  const createPanResponder = (index) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => !imgLoading1,
      onMoveShouldSetPanResponder: () => !imgLoading1,
      onPanResponderGrant: () => {
        setDragging(true);
        setDraggedIndex(index);
      },
      onPanResponderMove: (_, gesture) => {
        itemPositions[index].position.setValue({
          x: gesture.dx + (index % 2) * (ITEM_WIDTH + ITEM_GAP),
          y: gesture.dy + Math.floor(index / 2) * (70 + ITEM_GAP),
        });
        
        const dragX = gesture.dx + (index % 2) * (ITEM_WIDTH + ITEM_GAP) + ITEM_WIDTH / 2;
        const dragY = gesture.dy + Math.floor(index / 2) * (70 + ITEM_GAP) + 35;
        
        let hoveredIdx = null;
        
        itemPositions.forEach((item, idx) => {
          if (idx !== index) {
            const itemX = (idx % 2) * (ITEM_WIDTH + ITEM_GAP);
            const itemY = Math.floor(idx / 2) * (70 + ITEM_GAP);
            
            if (
              dragX >= itemX && 
              dragX <= itemX + ITEM_WIDTH &&
              dragY >= itemY && 
              dragY <= itemY + 70
            ) {
              hoveredIdx = idx;
            }
          }
        });
        
        if (hoveredIdx !== null && hoveredIdx !== hoveredIndex) {
          setHoveredIndex(hoveredIdx);
        }
      },
      onPanResponderRelease: () => {
        setDragging(false);
        
        if (hoveredIndex !== null && hoveredIndex !== index) {
          const newImages = [...images];
          const temp = newImages[index];
          newImages[index] = newImages[hoveredIndex];
          newImages[hoveredIndex] = temp;
          
          if (typeof handleReorderImages === 'function') {
            handleReorderImages(newImages);
          }
          
          itemPositions.forEach((item, idx) => {
            Animated.spring(item.position, {
              toValue: {
                x: (idx % 2) * (ITEM_WIDTH + ITEM_GAP),
                y: Math.floor(idx / 2) * (70 + ITEM_GAP),
              },
              useNativeDriver: false,
              friction: 5,
            }).start();
          });
        } else {
          Animated.spring(itemPositions[index].position, {
            toValue: {
              x: (index % 2) * (ITEM_WIDTH + ITEM_GAP),
              y: Math.floor(index / 2) * (70 + ITEM_GAP),
            },
            useNativeDriver: false,
            friction: 5,
          }).start();
        }
        
        setDraggedIndex(null);
        setHoveredIndex(null);
      }
    });
  };

  const handleReorderImages = (newOrder) => {
    setImages(newOrder);
    if (typeof updateImgDouble === 'function') {
      updateImgDouble(newOrder);
    }
  };

  return (
    <View style={styles.imgContainer}>
      {images.map((item, index) => {
        const panResponder = createPanResponder(index);
        
        return (
          <Animated.View
            key={`image-${index}`}
            style={[
              styles.imgBox,
              { 
                zIndex: draggedIndex === index ? 2 : 1,
                transform: itemPositions[index].position.getTranslateTransform(),
                opacity: hoveredIndex === index ? 0.5 : 1,
                elevation: draggedIndex === index ? 5 : 0,
                shadowColor: '#000',
                shadowOffset: draggedIndex === index ? { width: 0, height: 2 } : { width: 0, height: 0 },
                shadowOpacity: draggedIndex === index ? 0.3 : 0,
                shadowRadius: draggedIndex === index ? 3 : 0,
              }
            ]}
            {...panResponder.panHandlers}
          >
            {imgLoading1 && (
              <View style={styles.loader}>
                <ActivityIndicator size={25} color={'#fff'} />
              </View>
            )}
            <TouchableOpacity
              disabled={imgLoading1}
              style={styles.crossIcon}
              onPress={() => handleRemoveImg(index)}
            >
              <Icons name={'close'} size={20} color={'black'} />
            </TouchableOpacity>
            <Image source={{ uri: item }} style={styles.img} />
          </Animated.View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  imgContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width:'100%',
    position: 'relative',
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
    marginVertical: 8,
    height: 230, 
  },
  imgBox: {
    width: 70,
    height: 70,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'absolute',
    backgroundColor: '#f0f0f0',
  },
  img: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  crossIcon: {
    position: 'absolute',
    top: 4,
    right: 4,
    zIndex: 2,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 10,
    padding: 2,
  },
});

export default DraggableImagesGrid;
