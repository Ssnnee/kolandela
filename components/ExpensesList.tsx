import React from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
} from 'react-native';

// Sample data for expenses
const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d73',
    title: 'Fourth Item',
  },
  // Add more items as needed
];

// Type definition for item properties
type ItemProps = { title: string };

// Item component to display each expense item
const Item = ({ title }: ItemProps) => (
  <View style={styles.item}>
    <Text>{title}</Text>
  </View>
);

// Main ExpensesList component
export default function ExpensesList() {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={DATA}
        renderItem={({ item }) => <Item title={item.title} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contentContainer}
      />
    </SafeAreaView>
  );
}

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  item: {
    height: 64,
    backgroundColor: '#f0f0f0', // Adjust this color to match your theme
    padding: 16,
    marginVertical: 8,
  },
  contentContainer: {
    paddingBottom: 200, // Adjust this value as needed
  },
});

