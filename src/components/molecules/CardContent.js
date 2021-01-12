import React from "react";
import { StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import { TouchableNativeFeedback } from "react-native-gesture-handler";

const CardContent = ({
  id,
  title,
  date,
  popularity,
  props,
}) => (
  <Card
    style={styles.container}
  >
    <TouchableNativeFeedback>
      <Card.Title
        title={title}
        subtitle={`Release Date: ${date} | Popularity : ${popularity}`}
      />
    </TouchableNativeFeedback>
  </Card>
); 

const styles = StyleSheet.create({
  container: {
  }
});

export default CardContent;