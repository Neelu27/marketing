import React from 'react'
import {View,Text}from 'react-native';

const Suggestions = (props) => {
  const options = props.results.map(r => (
    <Text key={r.id}>
      {r.name}
    </Text>
  ))
  return <Text>{options}</Text>
}

export default Suggestions
