import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {CustomerTheme} from '../../base/Theme';
import {MainButton, MainHeader, MainTextInput, MainTextInputWithClearButton} from '../../components';
import {RootText} from '../../components/RootText';
import {signIn} from '../../redux/auth';
import {StateType} from '../../redux/store';
import {MainStackParamList} from '../MainParamList';

const isDevMode = process.env.NODE_ENV === 'development';

const initialEmail = isDevMode ? 'fabio.moretti@seekinnovation.at' : '';
const initialPassword = isDevMode ? 'lL0p9WO9LlB4dsQhv0L2' : '';
export const Login = ({navigation, route}: MainStackParamList<'Login'>) => {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState(initialPassword);

  const passwordError = password.length < 5 && email.length > 5 ? "Please enter a valid password" : null;
  const {fetching, user} = useSelector((state: StateType) => state.auth);
  const dispatch = useDispatch();
  //console.log(navigation);

  const login = async () => {
    if (passwordError) {
      return;
    }
    await dispatch(signIn(email, password, ()=> navigation.jumpTo('ProductRegistration')))
  };

  return (
    <SafeAreaView style={[{backgroundColor: 'white', height: '100%'}]}>
      <MainHeader title="Login" onMenuPress={() => navigation.openDrawer()} />
      <View style={styles.mainView}>
        <MainTextInputWithClearButton onClearPress={() => setEmail("")} type="email-address" autoCapitalize="none" value={email} placeholder="E-Mail" onTextChange={(value) => setEmail(value)} />
        <MainTextInputWithClearButton onClearPress={() => setPassword("")} password value={password} placeholder="Password" autoCapitalize="none" onTextChange={(value) => setPassword(value)} />
        <MainButton onPress={login} disabled={fetching.signIn.fetching}>
          <RootText style={{color: 'white'}}>{fetching.signIn.fetching ? 'Loggin In...' : 'Log in'}</RootText>
        </MainButton>
        {fetching.signIn.error && <Text style={{ color: "#900", marginTop: 30, fontSize: 18 }}>{fetching.signIn.error.message}</Text>}
        {passwordError && <Text style={{ color: "#900", marginTop: 30, fontSize: 18 }}>{passwordError}</Text>}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainView: {
    width: '100%',
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    color: CustomerTheme.colors['main-gray'],
    marginTop: 18,
  },
  text: {
    fontSize: 16,
    color: CustomerTheme.colors['main-gray'],
    textAlign: 'center',
    marginTop: 4,
  },
});
