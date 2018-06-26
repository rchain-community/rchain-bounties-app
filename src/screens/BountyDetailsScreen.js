import React from 'react'
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Linking,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  Image,
  Dimensions
} from 'react-native'
import Markdown from 'react-native-markdown-renderer'
import moment from 'moment'

const bountyStages = ['Draft', 'Active', 'Completed', 'Expired', 'Dead']
const colors = ['#C0C0C0', '#4A90E2', '#3BC08F', '#FF8F53', '#F9461C']

export default class BountyDetailsScreen extends React.Component {
  static navigatorStyle = {
    largeTitle: false
  }

  state = {
    loading: true
  }

  componentDidMount () {
    return this.loadContent()
  }

  async loadContent () {
    const url = 'https://api.github.com/repos/rchain/bounties/issues/' + this.props.id
    let bounty = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    }).then((response) => response.json())

    this.setState({
      bounty,
      loading: false,
      refreshing: false,
    })
  }

  openURL (type) {
    if (type === 'web') {
      Linking.openURL(this.state.bounty.webReferenceURL)
      return
    }

    Linking.openURL('https://beta.bounties.network/user/' + this.state.bounty.issuer)
  }

  _onRefresh () {
    this.setState({refreshing: true})
    return this.loadContent()
  }

  _renderContent () {
    const {loading, bounty} = this.state
    console.log(bounty)
    const regex = new RegExp('[\*]{2}\$\[(\d+)\][\*]{2}')
    if (loading) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator/>
        </View>
      )
    }
    let dollarAmount = bounty.body.match(/[\*]{2}\$\[(\d+)\][\*]{2}/)
    return (
      <View style={{flex: 1}}>
        <ScrollView
          style={{flex: 1}}
          refreshControl={
            <RefreshControl
              style={{zIndex: 100}}
              onRefresh={() => this._onRefresh()}
              refreshing={this.state.refreshing}
            />
          }>
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>{bounty.title}</Text>
            <View style={styles.bountyStageContainer}>
              <View style={[styles.bountyStageIndicator, {backgroundColor: colors[2]}]}/>
              <Text style={styles.bountyStageText}>Open</Text>
            </View>
          </View>
          <View style={styles.metaContainer}>
            <View style={styles.cryptoContainer}>
              <Image source={require('../assets/rchain_logo.png')} style={styles.cryptoImage}/>
              <View style={styles.cryptoAmount}>
                <Text style={styles.cryptoText}>RChain</Text>
                <Text style={styles.cryptoSubtext}>RHOCs</Text>
              </View>
              <Text style={styles.cryptoDollars}>{dollarAmount ? '$' + dollarAmount[1] : ''}</Text>
            </View>
            <ScrollView
              style={styles.tagsContainer}
              horizontal
              showsHorizontalScrollIndicator={false}>
              {bounty.labels ? bounty.labels.map(label => (
                <View key={label.name} style={styles.tag}>
                  <Text style={styles.tagName}>{label.name}</Text>
                </View>
              )): []}
              <View style={{width: 22}}/>
            </ScrollView>
          </View>
          <View style={styles.infoContainer}>
            <View style={styles.infoParagraph}>
              <Markdown style={markdown}>{bounty.body}</Markdown>
            </View>
            <View style={styles.infoParagraph}>
              <Text style={styles.infoTitle}>Bounty issuer</Text>
              <TouchableOpacity onPress={() => this.openURL('address')}>
                <Text style={[styles.infoDescription, styles.link]}>{bounty.issuer}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.infoParagraph}>
              <Text style={styles.infoTitle}>URL</Text>
            </View>
            <View style={styles.infoParagraph}>
              <Text style={styles.infoTitle}>Deadline</Text>
            </View>
          </View>
        </ScrollView>
        <View style={styles.bottomFiller}/>
      </View>
    )
  }

  render () {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          {this._renderContent()}
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  metaContainer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ccc',
    borderBottomColor: '#ccc',
    backgroundColor: '#F7F7F7'
  },
  headerContainer: {
    paddingVertical: 16,
    paddingHorizontal: 22
  },
  headerTitle: {
    marginBottom: 10,
    fontSize: 26,
    fontWeight: '800',
    color: '#000',
    lineHeight: 32
  },
  bountyStageContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  bountyStageIndicator: {
    width: 10,
    height: 10,
    borderRadius: 10,
    marginRight: 6
  },
  bountyStageText: {
    color: '#555',
    fontSize: 14,
    fontWeight: '600'
  },
  tagsContainer: {
    paddingHorizontal: 22,
    paddingVertical: 20,
    flexDirection: 'row',
  },
  tag: {
    paddingVertical: 4,
    paddingHorizontal: 15,
    backgroundColor: '#ccc',
    alignItems: 'center',
    marginRight: 16,
    borderRadius: 100
  },
  tagName: {
    textAlign: 'center',
    fontSize: 14,
    color: '#fff',
    fontWeight: '700'
  },
  infoContainer: {
    padding: 22,
    paddingTop: 12
  },
  infoParagraph: {
    marginBottom: 20
  },
  infoTitle: {
    marginBottom: 10,
    fontSize: 16,
    color: '#000',
    fontWeight: '600'
  },
  infoDescription: {
    color: '#333',
    fontSize: 16,
    fontWeight: '300',
    lineHeight: 24
  },
  cryptoContainer: {
    paddingHorizontal: 22,
    paddingTop: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  cryptoImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eee'
  },
  cryptoAmount: {
    height: 40,
    flex: 1,
    marginLeft: 10,
    justifyContent: 'space-between'
  },
  cryptoText: {
    color: '#3C4252',
    fontSize: 16,
    fontWeight: '600'
  },
  cryptoSubtext: {
    color: '#666A73',
    fontSize: 13,
    fontWeight: '300'
  },
  cryptoDollars: {
    color: '#3BC08F',
    fontSize: 30,
    fontWeight: '800'
  },
  link: {
    color: '#4A90E2',
    textDecorationLine: 'underline'
  },
  bottomFiller: {
    position: 'absolute',
    height: 100,
    width: Dimensions.get('window').width,
    backgroundColor: '#fff',
    bottom: -100
  }
})

const standards = {
  color: '#81848A',
  fontSize: 16,
  fontWeight: '300',
  lineHeight: 24
}

const markdown = StyleSheet.create({
  heading: {
    ...standards,
    marginTop: 20,
  },
  heading1: {
    fontSize: 32,
  },
  heading2: {
    fontSize: 24,
  },
  heading3: {
    fontSize: 18,
  },
  heading4: {
    fontSize: 16,
  },
  heading5: {
    fontSize: 13,
  },
  heading6: {
    fontSize: 11,
  },
  text: {
    ...standards,
    lineHeight: 2,
    color: '#666A73',
  }
})
