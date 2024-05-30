import React from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import { Text, Image, View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useAppContext } from "../../AppContext";
import CardContainer from '../../Components/CardContainer';
import MemberRequestCard from '../../Components/MemberRequestCard';
import theme from '../../theme';
import * as Clipboard from 'expo-clipboard';

/* This component is the Share Group Screen  */
const ShareGroupScreen = ({ route }) => {
  const { state, isLoading } = useAppContext();
  let group = null;
  if (route.params.groupData) {
    group = route.params.groupData
  }

  group = route.params.group;

  const inviteLink = route.params.inviteLink; // Get invite link from params
  console.log(inviteLink)
  return (
      <ScrollView style={{ backgroundColor: theme.colors.white }}>
          {isLoading ? <Text>Loading...</Text>
          : <View style={styles.screen}>
              <Text style={styles.groupName}>{group.groupName}</Text>
              <GroupPhoto groupPhoto={group.photoURL} />
              <Text style={styles.linkDescription}>Get friends to join by sharing the link below:</Text>
              <GroupLink link={inviteLink} />
              <Text style={styles.memberReqsTitle}>Member Requests</Text>
              <View style={styles.requests}>
                {group.memberRequests.map((user, index) => (
                        <MemberRequestCard
                            key={index}
                            user={user}
                            group={group}
                        />
                    ))}
              </View>
          </View>}
      </ScrollView>
  )
};

const GroupPhoto = ({ groupPhoto }) => {
    return (
      <View style={styles.centerImage}>
          <Image style={styles.groupPhoto} source={{ uri : groupPhoto}} />
      </View>
    );
  };

const GroupLink = ({ link }) => {
    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(link);
    };

    return (
        <TouchableOpacity
            onPress={() => copyToClipboard()}
        >
            <CardContainer>
                <View style={styles.groupLink}>
                    <FontAwesome6
                        name="link"
                        size={18}
                        color={theme.colors.black}
                    />
                    <Text style={styles.groupLinkText}>{link}</Text>
                </View>
            </CardContainer>
        </TouchableOpacity>
    );
  };

export default ShareGroupScreen;

const styles = StyleSheet.create({
    screen: {
      display: 'flex',
      flexDirection: 'column',
      padding: 20,
      gap: 20,
      color: theme.colors.black
    },
    groupPhoto: {
      width: 150,
      height: 150,
      borderRadius: 150,
    },
    centerImage: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 10,
    },
    groupName: {
      padding: 10,
      fontSize: 60,
      fontFamily: "PatrickHandSC_400Regular",
      textAlign: 'center',
    },
    linkDescription: {
      fontSize: 16,
      paddingTop: 10,
    },
    groupLink: {
      flexDirection: 'row',
      gap: 20,
    },
    groupLinkText: {
        flex: 2,
        fontSize: 16,
    },
    memberReqsTitle: {
        fontSize: 36,
        fontFamily: "PatrickHandSC_400Regular",
        paddingLeft: 25
    },
    requests: {
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: 20,
        gap: 20,
    }
  });