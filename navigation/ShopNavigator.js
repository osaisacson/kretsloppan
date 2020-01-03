import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Platform } from 'react-native';

import ProductsOverviewScreen from '../screens/shop/ProductsOverviewScreen';
import Colors from '../constants/Colors';

const ProductsNavigator = createStackNavigator(
  //Lists all the screens in the shop, in the order they will by default be rendered. This relates eg to how the backbutton functions and animations.
  {
    ProductsOverview: ProductsOverviewScreen
  },
  //Sets the default navigation options that are true for all screens listed above, unless they get overridden on the individual screen
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: Platform.OS === 'android' ? Colors.primary : ''
      },
      headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary //headerTintColor === 'color'
    }
  }
);

export default createAppContainer(ProductsNavigator);
