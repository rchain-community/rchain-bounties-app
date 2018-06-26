import React from 'react'
import { ActivityIndicator, SafeAreaView, SectionList, StyleSheet, Text, View } from 'react-native'
import moment from 'moment'

import BountyItem from '../components/BountyItem'

import FilterIcon from '../assets/filter.png'
import { actionSheet } from '../services/Utils'

export default class HomeScreen extends React.Component {
  static navigatorStyle = {
    largeTitle: true
  }

  static navigatorButtons = {
    rightButtons: [{
      id: 'filter',
      icon: FilterIcon
    }]
  }

  state = {
    loading: true,
    refreshing: false,
    sections: [],
    filterType: 'date'
  }

  filterType = 'date'

  limit = 20

  constructor (props) {
    super(props)
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this))
  }

  componentDidMount () {
    return this.loadContent()
  }

  async onNavigatorEvent (event) {
    if (event.id === 'filter') {
      let sort = await actionSheet('Group by', 'How do you want to see your bounties?', ['Group by date', 'Group by amount'])
      if (sort) {
        this.switchFilterType(sort)
      }
    }
  }

  async loadContent () {
    const url = `https://api.github.com/repos/rchain/bounties/issues`
    let results = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    }).then(async (response) => {
      return response.json()
    })
    
    let sections = this.filterOnDate(results)

    this.setState({
      sections,
      numberOfItems: results.length,
      loading: false,
      refreshing: false,
      endOfList: this.state.numberOfItems === results.length
    })
  }

  loadMore () {
    this.limit = this.limit + 20

    return this.loadContent()
  }

  filterOnDate (results) {
    let dates = {}
    const today = moment().subtract(1, 'day').endOf('day')
    const yesterday = moment().subtract(2, 'day').endOf('day')
    results.forEach((item) => {

      let created = moment(item.created_at)
      let date
      if (created.isAfter(today)) {
        date = 'Today'
      } else if (created.isAfter(yesterday)) {
        date = 'Yesterday'
      } else {
        date = created.fromNow()
      }

      if (!(date in dates)) {
        dates[date] = []
      }

      dates[date].push(item)
    })

    let sections = []
    for (let date in dates) {
      if (!dates.hasOwnProperty(date)) {
        continue
      }
      sections.push({title: date, data: dates[date]})
    }
    return sections
  }

  switchFilterType (value) {
    this.filterType = value === 'Group by date' ? 'date' : 'amount'
    this.setState({loading: true, filterType: this.filterType})

    return this.loadContent()
  }

  _onRefresh () {
    this.setState({refreshing: true})

    return this.loadContent()
  }

  _renderContent () {
    if (this.state.loading) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator/>
        </View>
      )
    }

    return (
      <SectionList
        style={styles.content}
        onRefresh={() => this._onRefresh()}
        refreshing={this.state.refreshing}
        sections={this.state.sections}
        renderItem={({item}) => (
          <BountyItem navigator={this.props.navigator} data={item}/>
        )}
        onEndReachedThreshold={1}
        onEndReached={() => this.loadMore()}
        ListFooterComponent={() => {
          if (!this.state.endOfList) return <ActivityIndicator style={{marginVertical: 32}}/>
          return []
        }}
        renderSectionHeader={({section: {title}}) => (
          <View style={styles.section}>
            <Text style={styles.sectionText}>{title}</Text>
          </View>
        )}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => (
          <View style={styles.separator}/>
        )}
      />
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
    backgroundColor: '#fff'
  },
  content: {
    flex: 1
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  section: {
    backgroundColor: '#F7F7F7',
    height: 26,
    paddingHorizontal: 16,
    justifyContent: 'center'
  },
  sectionText: {
    fontSize: 15,
    fontWeight: 'bold'
  },
  separator: {
    backgroundColor: '#DFDFDF',
    height: StyleSheet.hairlineWidth,
    marginLeft: 40
  }
})
