import {
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import ImageFastWrapper from '../../../components/ImageFast';
import CustomButton from '../../../components/CustomButton';
import fonts from '../../../assets/fonts';
import { colors } from '../../../utils/colors';
import CustomText from '../../../components/CustomText';
import Header from '../../../components/Header';
import ScreenWrapper from '../../../components/ScreenWrapper';
import { Images } from '../../../assets/images';
import { useSelector } from 'react-redux';
import ApiRequest from '../../../services/ApiRequest';
import { useEffect, useState } from 'react';
import EmptyProfile from './EmptyProfile';
import Icons from '../../../components/Icons';
import { useIsFocused } from '@react-navigation/native';
import { imgUrl } from '../../../utils/constants';
import { t } from 'i18next';
import { ToastMessage } from '../../../utils/ToastMessage';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import ConfirmationModal from '../../../components/ConfirmationModal';
const height = Dimensions.get('screen').height;
const NewJobProfile = ({ navigation, route }) => {
  const addId = route.params?.addId;

  const [Data, setData] = useState([]);

  const [visible, setvisible] = useState(false);
  const [DelLoading, setDelLoading] = useState(false);

  const isfocued = useIsFocused();
  const [Selected, setSelected] = useState({});
  const [lodaing, setlodaing] = useState(false);
  const { loginUser, token } = useSelector(store => store.user);
  const [refreshing, setrefreshing] = useState(true);
  const [DelteId, setDelteId] = useState(false);

  const getJobProfile = async () => {
    try {
      const dataToGet = {
        type: 'get_data',
        table_name: 'job_description',
        specific_user: token,
      };
      const response = await ApiRequest(dataToGet);

      if (response.data?.data) {
        const array = response.data?.data;
        setData(array);
        setrefreshing(false);
      } else {
        setrefreshing(false);
        setData([]);
      }
    } catch (error) {
      console.log(error, 'err in getting job profile');
    }
  };

  const handlePress = async () => {
    setlodaing(true);
    const body = {
      type: 'add_data',
      table_name: 'job_applications',
      ad_id: addId,
      user_id: token,
      profile_id: Selected?.id,
      job_data: JSON.stringify(Selected),
    };

    const res = await ApiRequest(body);
    if (res?.data?.result) {
      setlodaing(false);
      ToastMessage(res?.data?.message);
      navigation.navigate('JobDone', { apply: true });
    } else {
      ToastMessage(res?.data?.message);
      setlodaing(false);
    }
  };

  const deleteProfile = async item => {
    setvisible(true);
    setDelteId(item);
  };

  const DeleteConfirm = async () => {
    setDelLoading(true);
    const dataToGet = {
      type: 'delete_data',
      table_name: 'job_description',
      user_id: token,
      id: DelteId,
    };

    const res = await ApiRequest(dataToGet);
    ToastMessage(res?.data?.message);
    setvisible(false);
    setDelLoading(false);
    getJobProfile();
  };

  useEffect(() => {
    getJobProfile();
  }, [isfocued]);

  return (
    <>
      <ScreenWrapper
        scrollEnabled
        refreshControl={
          <RefreshControl
            onRefresh={getJobProfile}
            refreshing={refreshing}
            colors={[colors.primaryColor]}
          />
        }
        statusBarColor="white"
        headerUnScrollable={() => <Header title={'Select Job Profile'} />}
        footerUnScrollable={() => (
          <>
            {addId && (
              <>
                {Data?.length > 0 && (
                  <View style={{ paddingHorizontal: 20 }}>
                    <CustomButton
                      loading={lodaing}
                      disabled={!Selected.id}
                      onPress={handlePress}
                      title={'Apply'}
                      borderRadius={7}
                    />
                  </View>
                )}
              </>
            )}
          </>
        )}>
        <View>
          {Data?.length > 0 ? (
            <>
              <FlatList
                data={Data}
                keyExtractor={(item, index) =>
                  item.id?.toString() || index.toString()
                }
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                  let parsedExtra = {};

                  try {
                    if (item?.extra_data) {
                      parsedExtra = JSON.parse(item.extra_data);
                    }
                  } catch (e) {
                    console.warn('Error parsing extra_data:', e);
                  }

                  return (
                    <>
                      <TouchableOpacity
                        style={styles.container}
                        activeOpacity={0.8}
                        onPress={addId ? () => setSelected(item) : () => {}}>
                        <ImageFastWrapper
                          source={
                            parsedExtra?.image?.startsWith('http')
                              ? { uri: parsedExtra.image }
                              : parsedExtra?.image
                              ? { uri: `${imgUrl}${parsedExtra.image}` }
                              : Images.profileUser
                          }
                          resizeMode={'cover'}
                          style={styles.jobCover}
                        />
                        <View
                          style={{
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            height: 100,
                          }}>
                          <CustomText
                            label={item?.fullname}
                            numberOfLines={2}
                            width={200}
                            fontSize={17}
                            fontFamily={fonts.semiBold}
                          />

                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}>
                            <TouchableOpacity
                              onPress={() =>
                                navigation.navigate('ProfileIntro', {
                                  data: item,
                                })
                              }
                              style={styles.applicants}>
                              <CustomText
                                label={'Edit Profie'}
                                fontSize={14}
                                fontFamily={fonts.semiBold}
                              />
                            </TouchableOpacity>
                            {Selected.id === item.id && (
                              <View style={styles.done}>
                                <Icons
                                  family={'MaterialIcons'}
                                  name={'done'}
                                  size={18}
                                  color={colors.white}
                                />
                              </View>
                            )}
                          </View>
                        </View>
                      </TouchableOpacity>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginTop: 10,
                        }}>
                        <CustomButton
                          onPress={() => deleteProfile(item.id)}
                          title={'Delete'}
                          borderRadius={7}
                          width={'48%'}
                        />
                        <CustomButton
                          onPress={() =>
                            navigation.navigate('ApplicantProfile', {
                              profiledata: item,
                            })
                          }
                          title={'View'}
                          borderRadius={7}
                          width={'48%'}
                        />
                      </View>
                    </>
                  );
                }}
              />

              <View style={{ marginTop: 20 }}>
                <CustomButton
                  onPress={() => navigation.navigate('ProfileIntro')}
                  title={'+ Add New Job Profile'}
                  borderRadius={7}
                  backgroundColor={'transparent'}
                  marginBottom={50}
                  color={'#828282'}
                  customStyle={{ borderColor: '#C1C1C1', borderWidth: 1 }}
                />
              </View>
            </>
          ) : (
            <>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  height: height - 200,
                }}>
                <EmptyProfile />
              </View>
            </>
          )}
        </View>
      </ScreenWrapper>
      <ConfirmationModal
        visible={visible}
        hideModal={() => setvisible(false)}
        onPress={DeleteConfirm}
        loading={DelLoading}
        message={'Are you sure you want to delete this Profile?'}
      />
    </>
  );
};

export default NewJobProfile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    marginTop: 20,
    borderRadius: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  jobCover: {
    width: 124,
    height: 123,
    borderRadius: 7,
  },

  applicants: {
    backgroundColor: '#D9FFDBDE',
    width: 120,
    height: 31,
    borderRadius: 16,
    gap: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: 30,
    height: 30,
    marginRight: 15,
  },

  done: {
    backgroundColor: '#A28DB8',
    borderRadius: 100,
    padding: 5,
  },

  applicants1: {
    backgroundColor: colors.primaryColor,
    padding: 5,
    borderRadius: 8,
    position: 'absolute',
    right: -50,
    top: 0,
  },
});
