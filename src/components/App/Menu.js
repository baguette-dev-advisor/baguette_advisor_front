import React, { Component } from 'react';
import { ScrollView, StyleSheet, ImageBackground, Image, View, Platform, Linking, Text, TouchableHighlight } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import VersionNumber from 'react-native-version-number';
import { DrawerActions } from 'react-navigation-drawer';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { logout, get, onUpdate } from '../../providers/user.js';
import styles from '../../styles';
import CONST from '../../core/const';
import I18n from '../../i18n/i18n';
import DrawerItem from '../../fragments/DrawerItem';
import { Icon } from 'react-native-elements';

export default class Menu extends Component {
	constructor(props) {
		super(props);

		const items = [];
		for (var i = 0; i < props.items.length; i++) {
			const item = props.items[i];
			if (item.key !== 'Signout' && item.key !== 'Signin') {
				items.push(item);
			}
		}

		const user = get();

		this.state = {
			l1: _.cloneDeep(props),
			l2: _.cloneDeep(props),
		};
    this.state.l1.items = items;
    
		this.state.l2.items = [
			{
				key: user.handle ? 'Signout' : 'Signin',
        routeName: user.handle ? I18n.t('menu.signout') : I18n.t('home.signin'),
        text: user.handle ? I18n.t('menu.signout') : I18n.t('home.signin')
			},
		];

		onUpdate(user => {
			const l2 = _.cloneDeep(props);
			l2.items = [
				{
					key: user.handle ? 'Signout' : 'Signin',
          routeName: user.handle ? I18n.t('menu.signout') : I18n.t('home.signin'),
          text: user.handle ? I18n.t('menu.signout') : I18n.t('menu.signin')
				},
			];

			this.setState({
				l2,
			});
		});

		this.onItemPress = this.onItemPress.bind(this);
		this.buyUsACoffee = this.buyUsACoffee.bind(this);
	}

	onItemPress({ route, focused }) {
    return () => {
      if (route.key === 'Signout') {
        logout();

        this.props.navigation.dispatch(DrawerActions.closeDrawer());
        return false;
      } else if (route.key === 'Signin') {
        this.props.navigation.navigate('HomeUser', {
          next: () => {
            setTimeout(() => {
              this.props.navigation.dispatch(DrawerActions.closeDrawer());
            });
          },
        });
        return false;
      } else if (route.key === 'Privacy') {
        Linking.openURL('https://www.baguetteadvisor.com/privacy/');
        this.props.navigation.dispatch(DrawerActions.closeDrawer());
        return false;
      }

      if (route.key === 'ContactUs') {
        const email = CONST.SUPPORT_EMAIL;
        const subject = '[Support] Baguette Advisor';
        let body = '\n\n--------------\n';
        body += 'Identifier: ' + VersionNumber.bundleIdentifier + '\n';
        body += 'Version: ' + VersionNumber.appVersion + '\n';
        body += 'Build: ' + VersionNumber.buildVersion + '\n';
        body += 'Handle: ' + get().handle + '\n';

        const link =
          Platform.OS === 'android'
            ? 'mailto:' + email + '?cc=?subject=' + subject + '&body=' + body
            : 'mailto:' + email + '?cc=&subject=' + subject + '&body=' + body;

        Linking.openURL(link);

        this.props.navigation.dispatch(DrawerActions.closeDrawer());
        return false;
      }

      if (!focused) {
        this.props.onItemPress({ route, focused });
      }
    }
	}

	buyUsACoffee() {
		Linking.openURL("https://ko-fi.com/baguetteadvisor");
	}

	render() {
		return (
			<View style={_styles.container}>
				<ScrollView style={_styles.scrollContainer}>
					<SafeAreaView style={_styles.inset} forceInset={{ top: 'always', horizontal: 'never' }}>
						<View style={_styles.head}>
							<ImageBackground
								source={require('../../assets/home.jpg')}
								style={{ width: null, height: 200 }}
								blurRadius={8}
								back
							>
								<View
									style={{
										flex: 1,
										justifyContent: 'space-between',
										alignItems: 'center',
										backgroundColor: 'rgba(0, 0, 0, 0.6)',
										padding: 50,
									}}
								>
									<Image
										source={require('../../assets/login_signup_logo.png')}
										style={{ height: 100, justifyContent: 'center', resizeMode: 'contain' }}
									/>
								</View>
							</ImageBackground>
						</View>

						<View style={{ marginTop: 0, paddingTop: 16, backgroundColor: 'white', display: 'flex' }}>
              <DrawerItem key2='Home' icon={require('../../assets/boulangeries_icon.png')} label={I18n.t('menu.bakeries')} onItemPress={this.onItemPress} navigation={this.props.navigation} />
              <DrawerItem key2='Privacy' icon={require('../../assets/rgpd_icon.png')} label={I18n.t('menu.privacy')} onItemPress={this.onItemPress} navigation={this.props.navigation} />
              <DrawerItem key2='ContactUs' icon={require('../../assets/contact_icon.png')} label={I18n.t('menu.contact')} onItemPress={this.onItemPress} navigation={this.props.navigation} />
              <DrawerItem key2={this.state.l2.items[0].key} icon={require('../../assets/logout_icon.png')} label={this.state.l2.items[0].text} onItemPress={this.onItemPress} navigation={this.props.navigation} />


							{/* <DrawerItems
								{...this.state.l2}
								onItemPress={this.onItemPress}
								labelStyle={_styles.drawerLabelStyle}
								itemStyle={_styles.drawerItemStyle}
								itemsContainerStyle={{ marginTop: -10, backgroundColor: 'white' }}
							/> */}
							<TouchableHighlight
								onPress={this.buyUsACoffee}
								style={{borderRadius: 4, padding: 14, margin: 10, backgroundColor: styles.colors.primary }}
							>
								<View style={{display: "flex", flexDirection: "row", alignItems: 'center'}}>
									<Image source={require('../../assets/mug_icon.png')} style={{width: 21.375, height: 18, marginRight: 18, marginLeft: 4}} />
									<Text style={{fontSize: 16, fontWeight: 'bold', color: 'black', flex: 1}}>Buy us a coffee</Text>
									<Image source={require('../../assets/arrow_see_more.png')} style={{width: 10.5, height: 18}} />
								</View>
							</TouchableHighlight>
						</View>
					</SafeAreaView>
				</ScrollView>
			</View>
		);
	}
}

Menu.propTypes = {
	navigation: PropTypes.object,
	onItemPress: PropTypes.func,
};

const _styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollContainer: {
		height: '100%',
		backgroundColor: 'white',
	},
	inset: {
		backgroundColor: styles.colors.primary,
	},
	head: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		// backgroundColor: styles.colors.primary
	},
	footnote: {
		textAlign: 'center',
		fontSize: 16,
		paddingBottom: 16,
	},
	drawerLabelStyle: {
		fontSize: 16,
    color: 'black',
    fontWeight: '600',
    color: '#323232'
	},
	drawerItemStyle: {
    display: 'flex', 
    flexDirection:'row', 
    height: 62, 
    overflow: 'visible',
    position: 'relative',
    alignItems: 'center',
    backgroundColor: 'white', 
    shadowColor: '#000',
    marginTop: 8,
    marginBottom: 8,
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
  },
  drawerIconStyle: {
    height: 32, 
    width: 48, 
    marginRight: 18, 
    marginLeft: 16, 
    shadowColor: '#ccc',
    overflow: 'visible',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 5
  },
	drawerLabelStyle: {
		fontSize: 16,
    color: 'black',
    fontWeight: '600',
    color: '#323232'
	},
});
