import { View, Text, StyleSheet, Image, ImageBackground, TextInput, ScrollView, Pressable } from 'react-native'
import { ButtonGroup } from '@rneui/themed'
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react'
import MatchCard from '../components/MatchCard'
import { FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Participation({navigation}) {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [userId, setUserId] = useState('')
    const [accToken, setAccToken] = useState('')

    const [matchData, setMatchData] = useState([])

    async function setLocalStorage(){
        try {
            const id = await AsyncStorage.getItem('@id')
            const access_token = await AsyncStorage.getItem('@access_token')

            setUserId(id)
            setAccToken(access_token)
        } catch (error) {
            console.log(error);
        }
    }

    async function fetchMatchApproved(){
        try {
            const { data } = await axios.get(`https://m2m-api.herokuapp.com/matches?userId=${userId}&status=1`,
                {
                    headers: {
                        access_token: accToken
                    }
                })
            setMatchData(data)
        } catch (error) {
            console.log(error);
        }
    }

    async function fetchMatchPending(){
        try {
            const { data } = await axios.get(`https://m2m-api.herokuapp.com/matches?userId=${userId}&status=0`,
                {
                    headers: {
                        access_token: accToken
                    }
                })
            setMatchData(data)
        } catch (error) {
            console.log(error);
        }
    } 

    useEffect(() => {
        setLocalStorage()
        fetchMatchApproved()
    }, [])

    useEffect(() => {
        if(selectedIndex == 0){
            fetchMatchApproved()
        } else {
            fetchMatchPending()
        }
    }, [selectedIndex])

    if (!matchData) {
        return (
            <ActivityIndicator size='large' color='#ADD6FF' />
        )
    }

    const renderItem = ({ item }) => {
        return (
            <MatchCard match={item} navigation={navigation} />
        )
    }

   
    return (
        <View style={{
            backgroundColor: "#FFF",
            flex: 1
        }}>
            <View style={{
                backgroundColor: "#FD841F",
                height: "20%",
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
                paddingHorizontal: 20
            }}>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    width: "100%",
                }}>
                    <View style={{
                        width: "100%"
                    }}>
                        <Text style={{
                            fontSize: 28,
                            color: "#FFF",
                            fontWeight: "bold",
                            marginTop: 40
                        }}>All your joined match here
                        </Text>
                    </View>
                </View>
            </View>

            <ButtonGroup
                buttons={['Approved', 'Pending']}
                selectedIndex={selectedIndex}
                onPress={(value) => {
                    setSelectedIndex(value);
                }}
                selectedButtonStyle={{
                    backgroundColor: "#FD841F"
                }}
                containerStyle={{
                    borderRadius:20,
                    marginBottom: 0,
                    marginTop: -50
                }}
            />

            <FlatList
                style={{ height: 400 }}
                contentContainerStyle={{ justifyContent: 'center'}}
                data={matchData} renderItem={renderItem} keyExtractor={(item, idx) => idx}
            />
        </View>
    )
}
