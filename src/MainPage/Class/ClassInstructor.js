import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'

import { Button } from "native-base";
import firestore from '@react-native-firebase/firestore';

import MaterialCommunityIconsIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useAuth } from '../../Authentication/AuthProvider';
import { generateNumber } from "../../utils";

import Card from '../../Card';

export default function ClassInstructor({ navigation, route }) {

  const { setClassInfo } = route.params;

  const { database, currentUser } = useAuth()

  const [classID, setClassID] = useState("0000")
  const [flatListWidth, setFlatListWidth] = useState(0);
  const [list, setList] = useState([])

  const handleEndClass = async () => {
    const ref = database.ref(`/${currentUser.uid}`)
    await ref.once('value').then(async snap => {
      await firestore()
        .collection('classData')
        .doc(currentUser.uid)
        .collection('classInfo')
        .add(snap.val())
        .then(async () => {
          await ref.remove();
          navigation.navigate("Main")
        })
    })
  }


  useEffect(() => {
    const getData = async () => {
      const classSet = new Set()
      let exist = false

      const snapshot = await database.ref('/').once('value')

      snapshot.forEach(child => {
        classSet.add(child.key)
        if (currentUser.uid === child.key) {
          setClassID(child.val().ClassID)
          setClassInfo({
            classID: child.val().ClassID,
            group: "T"
          })
          exist = true
        }
      })

      if (!exist) {
        let check = true
        let ClassID = 0
        while (check) {
          const newNumber = Number(generateNumber())
          const reuslt = classSet.has(newNumber)
          if (!reuslt) {
            check = false
            ClassID = newNumber
          }
        }
        setClassID(ClassID)
        setClassInfo(
          {
            classID: ClassID,
            group: "T"
          }
        )
        database.ref(`/${currentUser.uid}`).update({
          ClassID: ClassID
        })
      }
    }
    getData()
  }, [currentUser, database])


  useEffect(() => {
    const onValueChange = database
      .ref(`/${currentUser.uid}/user`)
      .on('value', snapshot => {
        setList([])
        snapshot.forEach(child => {
          setList(pre => {
            let newArray = [...pre]
            newArray.push({
              id: child.key,
              BPM: child.val()
            })
            return newArray
          })
        })
      });

    // Stop listening for updates when no longer required
    return () => database.ref(`/${currentUser.uid}/user`).off('value', onValueChange);
  }, [currentUser, database]);

  const renderItem = ({ item }) => {
    return (
      <Card style={{
        height: 117,
        width: flatListWidth / 3 - 10,
        margin: 5,
        backgroundColor: item.BPM >= 100 ? "#FF5050" : "#ffffff",
      }}>
        <View style={{ margin: 5 }}>
          <Text style={classes.nameText}>{item.id.substring(0, 2)}</Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "center", justifyContent: "space-around" }}>
          <Text style={[classes.resultText, { fontStyle: item.BPM >= 100 ? "italic" : "normal" }]}>{item.BPM[item.BPM.length - 1]}</Text>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <MaterialCommunityIconsIcon
              name="heart-outline"
              size={24}
            />
            <Text style={classes.unitText}>BPM</Text>
          </View>
        </View>
      </Card>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Card style={{
        height: 52,
        backgroundColor: "#ffffff",
        margin: 10,
      }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={classes.classTitle}>
            Class ID
          </Text>
          <View style={{ position: "relative" }}>
            <View style={classes.backgroundColor} />
            <Text style={classes.classText}>{classID}</Text>
          </View>
        </View>
      </Card>
      <View style={{ flex: 1, marginHorizontal: 10 }}>
        <FlatList
          data={list}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          horizontal={false}
          onLayout={e => setFlatListWidth(e.nativeEvent.layout.width)}
        />
      </View>
      <View style={{ marginVertical: 10, marginHorizontal: 10 }}>
        <Button size="lg" _text={classes.ButtonText} style={{ borderRadius: 40, backgroundColor: "#5F2EEA" }} onPress={handleEndClass}>
          End Class
        </Button>
      </View>
    </View>
  )
}

const classes = StyleSheet.create({
  ButtonText: {
    fontWeight: 600,
    fontSize: 16,
    lineHeight: 28,
    letterSpacing: 0.75,
    paddingY: 1.5
  },
  backgroundColor: {
    backgroundColor: "#FFB400",
    flex: 1,
    height: "40%",
    width: "65%",
    position: "absolute",
    marginTop: "8%",
    marginLeft: "40%"
  },
  classText: {
    fontSize: 48,
    fontWeight: "bold",
    letterSpacing: 1,
    lineHeight: 50,
    marginVertical: 5,
    marginLeft: 84,
    fontStyle: "italic"
  },
  classTitle: {
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 32,
    letterSpacing: 1,
    margin: 10
  },
  nameText: {
    fontSize: 18,
    lineHeight: 34,
    letterSpacing: 0.75
  },
  resultText: {
    fontSize: 36,
    fontWeight: "bold",
    lineHeight: 50,
    letterSpacing: 1
  },
  unitText: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 22,
    letterSpacing: 0.25
  }
})