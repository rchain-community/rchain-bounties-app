import { Navigation } from 'react-native-navigation';
import HomeScreen from './screens/HomeScreen'
import BountyDetailsScreen from './screens/BountyDetailsScreen'


Navigation.registerComponent('com.rchain.bountiesapp.HomeScreen', () => HomeScreen)
Navigation.registerComponent('com.rchain.bountiesapp.BountyDetailsScreen', () => BountyDetailsScreen)

Navigation.startSingleScreenApp({
  screen: {
    screen: 'com.rchain.bountiesapp.HomeScreen',
    title: 'Bounties'
  }
})
