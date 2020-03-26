import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import { Icon, Image } from 'react-native-elements';

import Menu from './Menu';
import Market from './Market';
import MarketEdit from './MarketEdit';
import Markets from './Markets';
import HomeUser from './../Home';

import I18n from '../../i18n/i18n';
import styles from '../../styles';

const Home = createDrawerNavigator(
	{
		Home: {
			screen: Markets,
			navigationOptions: {
				title: I18n.t('menu.bakeries'),
				drawerIcon: ({  }) => (
					<Image source={require('../../assets/store_pin.png')} style={{
						width: 38,
						height: 38,
						padding: 8,
						borderRadius: 15,
						shadowColor: '#000',
						shadowOffset: { width: 0, height: 1 },
						shadowOpacity: 0.8,
						shadowRadius: 5,
					}} />
				),
			},
		},
		// Profile: {
		//   screen: Profile,
		//   navigationOptions: {
		//     drawerIcon: ({ tintColor }) => (<Icon name="person" size={24} color={tintColor } />)
		//   }
		// },
		Privacy: {
			screen: () => {},
			navigationOptions: {
				title: I18n.t('menu.privacy'),
				drawerIcon: ({  }) => <Image source={require('../../assets/rgpd_icon.png')} style={{
					width: 38,
					height: 38,
					margin: 8,
					borderRadius: 15,
					shadowColor: "#000",
					shadowOffset: {
						width: 0,
						height: 1,
					},
					shadowOpacity: 0.22,
					shadowRadius: 2.22,
				}} />,
			},
		},
		ContactUs: {
			screen: () => {},
			navigationOptions: {
				title: I18n.t('menu.contact'),
				drawerIcon: ({  }) => <Image source={require('../../assets/contact_icon.png')} style={{
					width: 38,
					height: 38,
					margin: 8,
					borderRadius: 15,
					shadowColor: "#000",
					shadowOffset: {
						width: 0,
						height: 1,
					},
					shadowOpacity: 0.22,
					shadowRadius: 2.22,
				}} />,
			},
		},
		Signout: {
			// Hack see Menu.js
			screen: () => {},
			navigationOptions: {
				title: I18n.t('menu.signout'),
				drawerIcon: ({  }) => <Image source={require('../../assets/logout_icon.png')} style={{
					width: 38,
					height: 38,
					margin: 8,
					borderRadius: 15,
					shadowColor: "#000",
					shadowOffset: {
						width: 0,
						height: 1,
					},
					shadowOpacity: 0.22,
					shadowRadius: 2.22,
				}} />,
			},
		},
		Signin: {
			// Hack see Menu.js
			screen: () => {},
			navigationOptions: {
				title: I18n.t('home.signin'),
				drawerIcon: ({  }) => <Image source={require('../../assets/logout_icon.png')} style={{
					width: 38,
					height: 38,
					margin: 8,
					borderRadius: 15,
					shadowColor: "#000",
					shadowOffset: {
						width: 0,
						height: 1,
					},
					shadowOpacity: 0.22,
					shadowRadius: 2.22,
				}} />,
			},
		},
	},
	{
		// drawerBackgroundColor: styles.colors.primary,
		contentComponent: Menu,
		// contentOptions: {
		// 	activeTintColor: styles.colors.primary,
		// 	activeBackgroundColor: 'white',
		// 	itemsContainerStyle: {
		// 		marginVertical: 0,
		// 		backgroundColor: 'white',
		// 	},
		// 	iconContainerStyle: {
		// 		opacity: 1,
		// 		marginRight: 0,
		// 	},
		// },
	}
);

const AppNavigator = createStackNavigator(
	{
		Home: { screen: Home },
		Market: { screen: Market },
		HomeUser: { screen: HomeUser },
		MarketEdit: { screen: MarketEdit, navigationOptions: () => ({ gesturesEnabled: false }) },
	},
	{
		headerMode: 'none',
		initialRouteName: 'Home',
	}
);

export default createAppContainer(AppNavigator);
