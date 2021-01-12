import React, { useState, useEffect } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  TouchableNativeFeedback,
  SafeAreaView,
} from "react-native";
import {Picker} from "@react-native-community/picker"
import axios from "axios";
import { Snackbar, Text, Provider, Portal, Modal, Button } from "react-native-paper";
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from "expo-app-loading";
import Constants from "expo-constants";
import NetInfo from '@react-native-community/netinfo';

//Configs
import { API } from "../configs/API";
import colors from "../configs/colors";

//Components
import CardContent from "../components/molecules/CardContent";
import ModalContent from "../components/molecules/ModalContent";

const Home = (props) => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [filter, setFilter] = useState("Popularity");
    const [modal, setModal] = useState(false)

    const getPost = async () => {
        try {
            setIsLoading(true);
            const Data = await AsyncStorage.getItem("posts");
            const parsingData = JSON.parse(Data)

            const latest = await axios.get("https://api.themoviedb.org/3/discover/movie?api_key=f7b67d9afdb3c971d4419fa4cb667fbf");

            if (parsingData !== null && parsingData.length === latest.data.results.length) {
                if (filter === "Popularity") {
                    const sortByPopularity = await parsingData.sort(function(a, b) {
                        return parseFloat(b.popularity) - parseFloat(a.popularity);
                    });
                    setPosts(sortByPopularity)
                    setIsLoading(false);
                } else {
                    const sortByDate = await parsingData.sort(function(a, b) {
                        return new Date(b.release_date) - new Date(a.release_date);
                    });
                    setPosts(sortByDate)
                    setIsLoading(false);
                }
                
            } else if (parsingData == null || parsingData !== latest.data.results) {
                const res = await axios.get("https://api.themoviedb.org/3/discover/movie?api_key=f7b67d9afdb3c971d4419fa4cb667fbf");
                
                const sortByPopularity = res.data.results.sort(function(a, b) {
                    return parseFloat(b.popularity) - parseFloat(a.popularity);
                });

                await AsyncStorage.setItem('posts', JSON.stringify(sortByPopularity));
                setPosts(sortByPopularity);
                setIsLoading(false);
                setVisible(true)
            }
        }   catch (error) {
                setIsLoading(false);
                alert("Error fetching data");
                console.log(error);
                }
    };

    useEffect(() => {
        getPost();

        const MINUTE_MS = 60000;
        const interval = setInterval(() => {
            getPost();
        }, MINUTE_MS );
    
        return () => clearInterval(interval);
    }, [filter])

    useEffect(() => {
        NetInfo.fetch().then(state => {
            console.log('Connection type', state.type);
            console.log('Is connected?', state.isConnected);
            if (state.isConnected == false) {

            } else {
                setVisible(true)
            }
        });
    }, [])

    const renderItem = ({ item }) => {
        return (
        <CardContent
            key={item.id}
            id={item.id}
            title={item.original_title}
            date={item.release_date}
            popularity={item.popularity}
            props={props}
        />
        );
    };

    const toLatestMovie = () => {
        setFilter("Latest Movie")
    }

return posts == [] ? (
    <AppLoading />
  ) : (
    <SafeAreaView style={styles.container}>
        <Provider>
            <Portal>
                <Modal visible={modal} onDismiss={() => setModal(false)} contentContainerStyle={{backgroundColor: colors.white, padding: 20}}>
                    <Text style={{textAlign: "center"}}>Perangkat tidak terhubung dengan internet</Text>
                    <Button style={{marginTop: 30}} onPress={() => setModal(false)}>
                        OK
                    </Button>
                </Modal>
            </Portal>
            <Picker
                selectedValue={filter}
                style={{ height: 50, alignSelf: "stretch" }}
                onValueChange={(itemValue, itemIndex) => setFilter(itemValue)}>
                <Picker.Item label="Filter by Popularity" value="Popularity" />
                <Picker.Item label="Filter by Latest Movie" value="Latest Movie" />
            </Picker>
            <FlatList
                data={posts.slice(0,10)}
                refreshing={isLoading}
                onRefresh={getPost}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />
            <Snackbar
            visible={visible}
            onDismiss={() => setVisible(false)}
            action={{
                label: "Tampilkan",
                onPress: () => toLatestMovie()
            }}
            >
                <Text style={styles.snackbar}>Penyimpanan lokal telah diperbaharui</Text>
            </Snackbar>
        </Provider>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: Constants.statusBarHeight,
  },
  titleBar: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 16,
  },
  snackContainer : {
    flexWrap: "wrap",
  },
  snackbar : {
    color: colors.white,
  }
});