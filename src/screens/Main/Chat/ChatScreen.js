/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { pick } from '@react-native-documents/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  Keyboard,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';
import { useSelector } from 'react-redux';
import { connect } from 'socket.io-client';

import fonts from '../../../assets/fonts';
import { Images } from '../../../assets/images';
import { AppLoader } from '../../../components/AppLoader';
import CustomButton from '../../../components/CustomButton';
import CustomModal from '../../../components/CustomModal';
import CustomText from '../../../components/CustomText';
import Icons from '../../../components/Icons';
import MessageBox from '../../../components/MessageBox';
import ScreenWrapper from '../../../components/ScreenWrapper';
import ApiRequest, { get, put } from '../../../services/ApiRequest';
import { colors } from '../../../utils/colors';
import { imgUrl } from '../../../utils/constants';
import { ToastMessage } from '../../../utils/ToastMessage';
import FileDisplayer from './FileDisplayer';
import { styles } from './styles';

const LoaderComponent = () => {
  return (
    <View style={styles.loader}>
      <ActivityIndicator color={colors.primaryColor} size={30} />
    </View>
  );
};

const CustomHeader = ({ user, setShow }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icons name="arrow-left" size={22} family={'FontAwesome5'} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('UserAdd', { id: user?.chatUserId , username: user?.name})}
        style={styles.headerBox}>
        <Image
          source={user?.img ? { uri: imgUrl + user?.img } : Images.user}
          style={styles.avatar}
        />
        <CustomText label={user?.name} fontFamily={fonts.bold} fontSize={16} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setShow(true)}>
        <Icons family={'Entypo'} name={'dots-three-vertical'} />
      </TouchableOpacity>
    </View>
  );
};

const ChatFooter = ({ message, setMessage, isData, sendMessage, onPicker }) => (
  <View style={styles.inputContainer}>
    <View style={styles.inputBox}>
      <TextInput
        style={styles.input}
        placeholder="Write message..."
        placeholderTextColor={colors.gray}
        value={message}
        onChangeText={text => setMessage(text)}
        // multiline
      />
      <TouchableOpacity style={styles.uploadBtn} onPress={onPicker}>
        <Icons family={'AntDesign'} name="link" color={colors.gray} size={20} />
      </TouchableOpacity>
    </View>
    <TouchableOpacity
      disabled={!isData}
      style={[styles.sendButton]}
      onPress={sendMessage}>
      <Icons
        name="telegram"
        family={'FontAwesome'}
        color={!isData ? colors.grey1 : colors.primaryColor}
        size={45}
      />
    </TouchableOpacity>
  </View>
);

const ChatScreen = () => {
  //

  const socketRef = useRef();
  const { params } = useRoute();
  const navigation = useNavigation();

  const data = params?.data;


  

  const jobData = params?.jobData;

  const formattedJobData = jobData
    ? `Name: ${jobData?.name}\nEmail: ${jobData?.email}\nPhone: ${jobData?.phone}\nGender: ${jobData?.gender}\nQualification: ${jobData?.qualification}\nJob Status: ${jobData?.jobStatus}\nLanguage: ${jobData?.language}`
    : '';

  const { token } = useSelector(store => store.user);

  const [file, setFile] = useState('');
  
  const [type, setType] = useState('');
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const [loader, setLoader] = useState(false);
  const [messages, setMessages] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [fileLoader, setFileLoader] = useState(false);
  const [blockLoader, setBlockLoader] = useState(false);
  const [reportLoader, setReportLoader] = useState(false);
  const [bottomLoader, setBottomLoader] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(new Animated.Value(0));

  const handleScroll = () => {
    setScrolled(true);
  };

  const pickDocument = async () => {
    try {
      const [pickResult] = await pick({
        type: ['image/*', 'application/pdf'],
      });
      const res = [pickResult];

      setFile(res[0].uri);

      const fileData = {
        fileCopyUri: null,
        name: res[0].name,
        size: res[0].size,
        type: res[0].type,
        uri: res[0].uri,
      };

      setType(res[0].type);
      setFileLoader(true);

      const body = new FormData();
      body.append('type', 'upload_data');
      body.append('dir', 'chat_uploads');
      body.append('file', fileData);

      const response = await ApiRequest(body);

      if (response.data?.file_path) {
        setFile(response.data?.file_name);
      } else {
        setFile('');
        setType('');
        ToastMessage('Upload again');
      }
      setFileLoader(false);
    } catch (err) {
      console.log(err);
      setFileLoader(false);
    }
  };

  const handleClose = () => {
    setFile('');
    setType('');
  };

  const handleDownload = async url => {
    const fileName = url?.split('/')?.pop();
        const destination =
              Platform.OS === 'ios'
                ? `${RNFS.DocumentDirectoryPath}/${fileName}`
                : `${RNFS.DownloadDirectoryPath}/${fileName}`;
    

    setLoader(true);

    const fileUrl = 'https://vexem.co/api/chat_uploads/' + url;

    try {
      const download = RNFS.downloadFile({
        fromUrl: fileUrl,
        toFile: destination,
      });

      const result = await download.promise;

      if (result.statusCode === 200) {
        ToastMessage('File downloaded successfully');
        FileViewer.open(destination, { showOpenWithDialog: true });
      } else {
        console.log('Failed to download file:', result);
      }
      setLoader(false);
    } catch (err) {
      console.log('Error downloading file:', err);
      setLoader(false);
    }
  };

  const fetchMessages = useCallback(async () => {
    try {
      const response = await get('msg/messages/' + data?.id);

      if (response.data.success) {
        setMessages(response.data?.messages);
      }
    } catch (error) {
      console.log('err in getting msg', error);
    }
  }, [data.id]);

  const getMoreMessages = async () => {
    try {
      if (messages?.length > 0 && !bottomLoader) {
        setBottomLoader(true);
        const lastId = messages[messages?.length - 1]?._id;
        const url = 'msg/messages/' + data?.id + '/' + lastId;
        const response = await get(url);
        if (response.data?.success) {
          setMessages([...messages, ...response.data?.messages]);
        }
        setBottomLoader(false);
        setScrolled(false);
      }
    } catch (error) {
      console.log(error, 'in getting more msgs');

      setBottomLoader(false);
      setScrolled(false);
    }
  };

  const sendMsg = () => {
    if (socketRef.current) {
      const dataToPost = {
        to_id: data?.id,
        message: message,
        type: type ? (type === 'application/pdf' ? 'doc' : 'image') : 'text',
      };
      

      socketRef.current.emit('clientSendMessage', dataToPost);
      setMessage('');
      handleClose();
    } else {
      console.log('Socket is null or not properly initialized');
    }
  };

  const cleanupSocket = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  };

  const handleSeen = async () => {
    try {
      const url = `msg/seen/${data?.id}`;

      const res = await put(url);
      console.log(res.data);
    } catch (error) {
      console.log(error, 'err in seen msgs');
    }
  };

  const handleBuiltInMsg = async () => {
    if (jobData && Object.keys(jobData)?.length > 0) {
      const resumeData = {
        to_id: data?.id,
        message: jobData.resume,
        type: 'doc',
      };

      const jobMessage = {
        to_id: data?.id,
        message: formattedJobData,
        type: 'text',
      };

      socketRef.current.emit('clientSendMessage', jobMessage);
      socketRef.current.emit('clientSendMessage', resumeData);
      navigation.setParams({
        jobData: '',
      });

      
    }
  };

  const handleReport = async isBlock => {
    try {
      if (isBlock) {
        setBlockLoader(true);
      } else {
        setReportLoader(true);
      }
      const dataToPost = {
        type: 'add_data',
        table_name: 'chat_reports',
        user_id: token,
        chat_user_id: data?.chatUserId,
        reason: '',
      };

      const res = await ApiRequest(dataToPost);
      if (res.data?.result) {
        ToastMessage(
          isBlock ? 'User Blocked Successfully' : 'User Reported Successfully',
        );
        navigation.navigate('Home');
      }
      setBlockLoader(false);
      setReportLoader(false);
    } catch (error) {
      console.log(error, 'in report chat');
      setBlockLoader(false);
      setReportLoader(false);
    }
  };

  useEffect(() => {
    const initializeSocket = async () => {
      const url = 'https://cdn.utecho.com:5000/';
      const token = await AsyncStorage.getItem('chatToken');

      socketRef.current = connect(url, {
        query: { token: token },
      });

      socketRef.current.on('message', msg => {
        setMessages(prevMessages => [msg, ...prevMessages]);
      });

      socketRef.current.on('connect_error', error => {
        ToastMessage('Something went wrong');
        console.error('Socket connection error:', error);
      });
    };

    initializeSocket();
    handleSeen();

    return cleanupSocket;
  }, []);

  useLayoutEffect(() => {
    fetchMessages();
  }, [data, fetchMessages]);

  useEffect(() => {
    if (socketRef.current) {
      handleBuiltInMsg();
    }
  }, [socketRef.current]);

  useEffect(() => {
    getMoreMessages();
  }, [scrolled]);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener('keyboardWillShow', event => {
      Animated.timing(keyboardHeight, {
        duration: event.duration,
        toValue: event.endCoordinates.height,
        useNativeDriver: false,
      }).start();
    });
    const keyboardWillHide = Keyboard.addListener('keyboardWillHide', event => {
      Animated.timing(keyboardHeight, {
        duration: event.duration,
        toValue: 0,
        useNativeDriver: false,
      }).start();
    });
    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  return (
    <>
      <ScreenWrapper
        headerUnScrollable={() => (
          <CustomHeader user={data} setShow={setShow} />
        )}
        footerUnScrollable={() => (
          <Animated.View style={{ marginBottom: keyboardHeight }}>
            <ChatFooter
              isData={message?.trim()}
              message={message}
              setMessage={setMessage}
              sendMessage={sendMsg}
              onPicker={pickDocument}
            />
          </Animated.View>
        )}>
        <FlatList
          data={messages}
          inverted={messages?.length === 0 ? false : true}
          onScrollEndDrag={handleScroll}
          ListFooterComponent={bottomLoader && LoaderComponent}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item?._id?.toString()}
          renderItem={({ item }) => (
            <MessageBox
              item={item}
              user_id={data?.id}
              time={moment(item?.createdAt).format('HH:mm A')}
              onDownload={() => handleDownload(item?.message)}
            />
          )}
        />
      </ScreenWrapper>
      {file && (
        <FileDisplayer
          file={file}
          loader={fileLoader}
          onClose={handleClose}
          onPress={sendMsg}
          type={type}
        />
      )}
      <AppLoader show={loader} />
      <CustomModal isChange isVisible={show} onDisable={() => setShow(false)}>
        <View style={styles.sheetContainer}>
          <CustomText
            fontSize={17}
            marginTop={5}
            marginBottom={20}
            label={'Report & Block'}
            alignSelf={'center'}
            fontFamily={fonts.semiBold}
          />
          <CustomButton
            marginBottom={10}
            title={'Report'}
            loading={reportLoader}
            onPress={() => handleReport(false)}
          />
          <CustomButton
            title={'Block'}
            color={colors.red}
            loading={blockLoader}
            indicatorcolor={colors.red}
            customStyle={styles.blockBtn}
            onPress={() => handleReport(true)}
          />
        </View>
      </CustomModal>
    </>
  );
};

export default ChatScreen;
