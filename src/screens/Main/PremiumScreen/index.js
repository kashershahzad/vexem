import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, RefreshControl, View } from 'react-native';
import { Images } from '../../../assets/images';
import Header from '../../../components/Header';
import ScreenWrapper from '../../../components/ScreenWrapper';
import TopTab from '../../../components/TopTab';
import ApiRequest from '../../../services/ApiRequest';
import { colors } from '../../../utils/colors';
import { imgUrl } from '../../../utils/constants';
import PremiumCard from './molecules/PremiumCard';

const { width: screenWidth } = Dimensions.get('window');

const PremiumScreen = ({ route, navigation }) => {
  const [tab, setTab] = useState(0);
  const focus = useIsFocused();

  // const premiumPackages = [
  //   {
  //     type: 'Free Package',
  //     category: 'Free Account',
  //     price: 'Free',
  //     opportunities: ['Ad Boosts', 'Re-list Ads', 'Highlight Ads'],
  //     buttonTitle: 'Current Plan',
  //     img: Images.premium1,
  //   },
  //   {
  //     type: 'Bronze Package',
  //     category: 'Ultimate',
  //     price: '$49.99',
  //     opportunities: [
  //       'Explore Premium Ads',
  //       'Bookmark Ads',
  //       'Featured Listings',
  //     ],
  //     buttonTitle: 'Upgrade Now',
  //     img: Images.premium2,
  //   },
  //   {
  //     type: 'Silver Package',
  //     category: 'All-in-One',
  //     price: '$99.99',
  //     opportunities: ['All Features', 'Priority Support', 'Custom Ads'],
  //     buttonTitle: 'Buy Now',
  //     img: Images.premium3,
  //   },
  //   {
  //     type: 'Gold Package',
  //     category: 'All-in-One',
  //     price: '$149.99',
  //     opportunities: ['All Features', 'Priority Support', 'Custom Ads'],
  //     buttonTitle: 'Buy Now',
  //     img: Images.premium4,
  //   },
  // ];

  const userData = {
    user_type: 'free',
  };
  const [packages, setPackages] = useState([]);
  const [refreshing, setRefreshing] = useState(true);

  const fetchData = async () => {
    try {
      const dataToGet = {
        type: 'get_data',
        table_name: 'packages',
      };

      const response = await ApiRequest(dataToGet);

      if (response.data.data) {
        setPackages(response.data.data);
      }
      setRefreshing(false);
    } catch (error) {
      console.log(error, 'err in getting favourites');
      setRefreshing(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [focus]);

  const filteredData = packages?.filter(item =>
    tab === 0 ? item?.pack_type === 'package' : item?.pack_type === 'featured',
  );

  return (
    <ScreenWrapper
      scrollEnabled
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
      }
      statusBarColor={colors.white}
      headerUnScrollable={() => (
        <>
          <Header title={'Subscription Plan'} headerColor={colors.white} />
          <TopTab
            tabNames={['Ad Listing', 'Featured Ads']}
            tab={tab}
            setTab={setTab}
            backgroundColor={colors.white}
            paddingVertical={2}
            marginBottom={0}
            customStyle={{ marginTop: 3, backgroundColor: colors.white }}
          />
        </>
      )}>
      <Image
        source={Images.activePlan}
        style={{ height: 27, width: 262, alignSelf: 'center', marginTop: 24 }}
      />

      {packages && filteredData?.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <FlatList
            data={filteredData}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={{ width: screenWidth - 42, paddingHorizontal: 20 }}>
                <PremiumCard
                  width={'100%'}
                  type={item?.name}
                  category={item?.category}
                  price={`$${item?.price}`}
                  source={{ uri: imgUrl + item?.image }}
                  days={item?.days == 0 ? 'Unlimited' : item?.days}
                  ads={item?.items == 0 ? 'Unlimited' : item?.ads}
                  buttonTitle={'Select'}
                  disabled={
                    userData?.user_type === 'free' && item?.type === 'Essential'
                  }
                  description={item?.description}
                />
              </View>
            )}
          />
        </View>
      )}
    </ScreenWrapper>
  );
};

export default PremiumScreen;
