import {faTimes} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {DrawerContentScrollView, DrawerItem, DrawerItemList} from '@react-navigation/drawer';
import React from 'react';
import {Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {CustomerTheme} from '../base/Theme';
import {RootText} from '../components/RootText';
import {signOut} from '../redux/auth';
import {resetAction, resetActionSoft, startScanning} from '../redux/scanProduct';
import {StateType} from '../redux/store';
import {isProd} from '../../config';

import XiphooLogoGray from '../assets/svg/logo_gray.svg';
import XiphooLogoWhite from '../assets/svg/logo_white.svg';

const emailARegex = /^(.+)\.(.+)@.*/;
const emailBRegex = /^(.+)@(.+)/;
function getInitials(email: string) {
  var regexResult = emailARegex.exec(email);
  if (regexResult) {
    return regexResult[1].slice(0, 1).toUpperCase() + regexResult[2].slice(0, 1).toUpperCase();
  }
  regexResult = emailBRegex.exec(email);
  if (regexResult) {
    return regexResult[1].slice(0, 1).toUpperCase() + regexResult[2].slice(0, 1).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

export function DrawerContent(props) {
  const customProps = {...props, state: {...props.state, routes: props.state.routes.filter((r) => r.name != 'Login' && r.name != 'Scan'), routeNames: props.state.routeNames.filter((r) => r != 'Login' && r != 'Scan')}};

  const {fetching, user} = useSelector((state: StateType) => state.auth);
  const dispatch = useDispatch();
  const scanPressed = async () => {
    props.navigation.jumpTo('Scan');
    await dispatch(resetActionSoft());
    if(Platform.OS == "android")
    await dispatch(startScanning())
    // props.navigation.navigate('Home');
  };
  //console.log(props)
  //console.log(props.navigation.isFocused())
  let homeFocused = /^Scan/.test([...props.state.history].reverse().find(r=> r.type == "route")?.key??"")
  return (
    <View style={{flex: 1, paddingVertical: 16}}>
      <DrawerContentScrollView {...props}>
        <TouchableOpacity style={styles.closeButton} onPress={() => props.navigation.closeDrawer()}>
          <FontAwesomeIcon color={"white"} icon={faTimes} size={18} />
        </TouchableOpacity>
        <RootText style={styles.title}>Menu</RootText>
        <DrawerItem
          focused={homeFocused}
          label={({focused}) => (
            <RootText
              fontWeight={700}
              style={[
                styles.drawerTitle,
                {
                  color: !focused ? 'white' : CustomerTheme.colors['main-gray'],
                },
              ]}>
              Scanning
            </RootText>
          )}
          activeBackgroundColor={CustomerTheme.colors['bg-gray']}
          inactiveBackgroundColor={CustomerTheme.colors['main-brown']}
          onPress={scanPressed}
          style={{margin: 0, padding: 0, borderRadius: 50}}
          icon={({focused}) => (!focused ? <XiphooLogoWhite style={[styles.drawerIcon]} width={26} /> : <XiphooLogoGray style={[styles.drawerIcon]} width={26} />)}
        />
        <DrawerItemList
          {...customProps}
          style={{padding: 0, margin: 0}}
          itemStyle={{
            borderRadius: 50,
            paddingVertical: 0,
          }}
          labelStyle={{
            color: CustomerTheme.colors['main-gray'],
            fontSize: 18,
            padding: 0,
            margin: 0,
          }}
          activeBackgroundColor={CustomerTheme.colors['bg-gray']}
          inactiveBackgroundColor={CustomerTheme.colors['main-brown']}
        />
      </DrawerContentScrollView>
      {user && (
        <View style={styles.userCon}>
          <View style={styles.userInitialsCon}>
            <RootText style={styles.userIntialsText}>{getInitials(user.email)}</RootText>
          </View>
          <View style={{marginLeft: 12}}>
            <RootText fontWeight={600} style={styles.userNameText}>
              {user.email}
            </RootText>
            <TouchableOpacity
              onPress={() => {
                dispatch(signOut());
              }}>
              <RootText style={styles.userLogoutText}>Logout</RootText>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {!user && Platform.OS !== "ios" && (
        <TouchableOpacity onPress={() => props.navigation.jumpTo('Login')}>
          <RootText style={styles.loginTitle}>{isProd ? 'Corporate Login' : 'Corporate Login (DEV)'}</RootText>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomSection: {
    width: '100%',
    marginBottom: 0,
  },
  title: {
    fontSize: 16,
    marginTop: 20,
    marginLeft: 12,
    marginBottom: 10,
  },
  loginTitle: {
    fontSize: 16,
    fontStyle: 'italic',
    textDecorationLine: 'underline',
    marginLeft: 12,
    color: CustomerTheme.colors['light-grey'],
  },
  closeButton: {
    marginLeft: 12,
    backgroundColor: CustomerTheme.colors['main-brown'],
    alignItems: 'center',
    justifyContent: 'center',
    width: 42,
    height: 42,
    borderRadius: 100,
  },
  userCon: {
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#DADADA',
    padding: 8,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  userInitialsCon: {
    borderRadius: 100,
    aspectRatio: 1,
    backgroundColor: CustomerTheme.colors['main-gray'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  userIntialsText: {
    fontSize: 18,
    color: 'white',
  },
  userNameText: {
    fontSize: 15,
    maxHeight: 20,
    overflow: 'hidden',
    color: CustomerTheme.colors['main-gray'],
  },
  userLogoutText: {
    fontSize: 14,
    color: CustomerTheme.colors['main-gray'],
  },
  drawerIcon: {
    height: 24,
    width: 24,
    padding: 0,
    margin: 0,
    marginLeft: 8,
    marginRight: -20, //Fix to look like in the XD Design
  },
  drawerTitle: {
    fontSize: 15,
    padding: 0,
    margin: 0,
    marginRight: -20, //Fix to look like in the XD Design
  },
});
