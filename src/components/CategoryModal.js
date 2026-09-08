import React, { useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import fonts from '../assets/fonts';
import { colors } from '../utils/colors';
import CustomText from './CustomText';
import EmptyComponent from './EmptyComponent';
import Icons from './Icons';
import ImageFastWrapper from './ImageFast';
import { useSelector } from 'react-redux';
import CustomButton from './CustomButton';

const CategoryModal = ({ visible, setVisible, setItem }) => {
  const { categories } = useSelector(store => store.category);
  const { loginUser } = useSelector(store => store.user);

  const [data, setData] = useState(categories);
  const [selected, setSelected] = useState([]);
  const [history, setHistory] = useState([]);

  const hideModal = () => {
    setVisible(false);
    setData(categories);
    setSelected([]);
    setHistory([]);
  };

  const handleSelect = item => {
    if (!item) return;

    const translation = JSON.parse(item?.translations || '{}');
    const userLang = loginUser?.user_lang;
    const name = translation[userLang] || translation?.en || '';

    const lastItem = selected[selected.length - 1];
    const newSelectedItem = { name, id: item.id };

    const isExist = selected.some(e => e.name === name && e.id === item.id);

    const isSameParent = data?.find(
      e => e?.name === lastItem?.name && e?.id === lastItem?.id,
    );

    if (isExist) {
      if (!item.sub) return;

      setHistory([...history, data]);
      setData(item.sub);
      return;
    }

    if (isSameParent) {
      const updatedSelection = [...selected];
      updatedSelection[updatedSelection.length - 1] = newSelectedItem;

      setSelected(updatedSelection);

      if (item.sub) {
        setHistory([...history, data]);
        setData(item.sub);
      }
      return;
    }

    setSelected([...selected, newSelectedItem]);

    if (item.sub) {
      setHistory([...history, data]);
      setData(item.sub);
    }
  };

  const handleBack = () => {
    if (history.length > 0) {
      const previousData = history.pop();
      setHistory([...history]);
      setData(previousData);
      setSelected(selected.slice(0, -1));
    } else {
      hideModal();
    }
  };

  const handlePress = () => {
    setItem(selected[selected.length - 1]);
    hideModal();
  };

  const renderItem = item => (
    <TouchableOpacity
      activeOpacity={0.6}
      style={styles.main_map}
      onPress={() => handleSelect(item)}>
      <View style={styles.box}>
        <ImageFastWrapper
          source={{ uri: item?.image }}
          style={styles.img}
          svgW={30}
          svgH={30}
          marginRight={15}
        />
        <CustomText
          label={item?.translations}
          fontFamily={fonts.regular}
          fontSize={15}
          numberOfLines={1}
          translation
        />
      </View>
      <View style={styles.icn}>
        <Icons family={'AntDesign'} name={'right'} />
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={hideModal}
      onBackButtonPress={hideModal}>
      <View style={styles.container}>
        <View style={styles.top}>
          <TouchableOpacity onPress={handleBack}>
            <Icons
              name="arrowleft"
              color={colors.black}
              size={20}
              family={'AntDesign'}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => hideModal()}>
            <Icons
              name="closecircleo"
              color={colors.black}
              size={20}
              family={'AntDesign'}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.mapContainer}>
          {selected.map((item, index) => (
            <View style={styles.head} key={index}>
              <Icons family={'Entypo'} name={'chevron-small-right'} size={16} />
              <CustomText
                label={item?.name}
                fontFamily={fonts.regular}
                fontSize={13}
              />
            </View>
          ))}
        </View>
        <FlatList
          data={data}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={EmptyComponent}
          renderItem={({ item }) => renderItem(item)}
        />
        <CustomButton
          title={'Done'}
          onPress={handlePress}
          customStyle={styles.btn}
        />
      </View>
    </Modal>
  );
};

export default CategoryModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    marginTop: 10,
    borderRadius: 10,
    height: '90%',
    overflow: 'hidden',
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingHorizontal: 15,
  },
  main_map: {
    backgroundColor: colors.white,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomColor: colors?.mainBg,
    borderBottomWidth: 2,
  },

  icn: {
    backgroundColor: colors.mainBg,
    width: 32,
    height: 32,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: 30,
    height: 30,
    marginRight: 15,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 30,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5,
  },
  mapContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 10,
    flexWrap: 'wrap',
  },
  btn: {
    margin: 10,
    width: '90%',
  },
});
