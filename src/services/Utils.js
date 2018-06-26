import { Platform, ActionSheetIOS, Alert } from 'react-native'

export const actionSheet = (title, message, options) => {
  return new Promise((resolve) => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions({
        title,
        message,
        options
      }, (buttonIndex) => {
        return resolve(options[buttonIndex])
      })

      return
    }

    Alert.alert(title, message, options.map((option) => ({
      text: option,
      onPress: () => resolve(option)
    })))
  })
}
