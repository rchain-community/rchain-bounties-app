import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet, Text, TouchableOpacity, AsyncStorage } from 'react-native'

export default class BountyItem extends React.Component {
  static propTypes = {
    data: PropTypes.object
  }

  state = {
    unread: false
  }

  componentDidMount () {
    return this.calculateRead(this.props)
  }

  componentWillReceiveProps (nextProps, nextContext) {
    return this.calculateRead(nextProps)
  }

  async calculateRead (props) {
    const {data} = props
    const {id} = data
    const {unread} = this.state

    let isSeen = await AsyncStorage.getItem('seen.' + id)

    if (unread && isSeen) {
      this.setState({unread: false})
    }
    if (!unread && !isSeen) {
      this.setState({unread: true})
    }
  }

  goToBounty (id) {
    AsyncStorage.setItem('seen.' + id, '' + Date.now())
    this.setState({unread: false})

    this.props.navigator.push({
      screen: 'com.rchain.bountiesapp.BountyDetailsScreen',
      title: 'Details',
      passProps: {
        id
      }
    })
  }

  render () {
    let {title, labels, number } = this.props.data
    let {unread} = this.state
    return (
      <TouchableOpacity
        {...this.props}
        onPress={() => this.goToBounty(number)}
        style={[styles.container, this.props.style]}>
        {unread ? (<View style={styles.unread}/>) : null}
        <Text numberOfLines={3} style={styles.title}>{title}</Text>
        <Text numberOfLines={2} style={styles.tags}>{labels.map((label) => label.name).join(', ')}</Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingLeft: 40
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22
  },
  tags: {
    fontSize: 15,
    lineHeight: 19,
    color: '#8F8F94',
    marginTop: 3
  },
  unread: {
    borderRadius: 12,
    width: 12,
    height: 12,
    backgroundColor: '#157EFB',
    position: 'absolute',
    top: 22.5,
    left: 16
  }
})
