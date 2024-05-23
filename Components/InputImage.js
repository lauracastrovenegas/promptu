import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import addGroupPicture from "../assets/add_group_picture.png";
import addProfilePicture from "../assets/add_profile_picture.png";
import editIcon from "../assets/edit_icon.png";
import * as ImagePicker from "expo-image-picker";

const InputImage = ({ image, setImage, profile }) => {
    const [hasGalleryPermission, setHasGalleryPermission] = React.useState(false);

    React.useEffect(() => {
        (async () => {
            const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasGalleryPermission(galleryStatus.status === 'granted');
        })();
    }, []);

    const pickImage = async () => {
        if (!hasGalleryPermission) {
            // Handle case where permission is not granted
            alert("Please grant access to your media library to select an image.");
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setImage(result.assets[0].uri);

        } else {
            Alert("Photo selection cancelled.")
        }
    };


    if (!image)
        return (
            <TouchableOpacity onPress={() => pickImage()}>
                {profile ?
                    <Image source={addProfilePicture} style={styles.addGroupPicture} />
                    :
                    <Image source={addGroupPicture} style={styles.addGroupPicture} />
                }
            </TouchableOpacity>
        );

    return (
        <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.selectedImage} />
            <TouchableOpacity onPress={() => pickImage()}>
                <Image source={editIcon} style={styles.icon} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    addGroupPicture: {
        width: 149.64,
        height: 146.57,
        marginBottom: 30,
        marginTop: -30
    },
    imageContainer: {
        position: 'relative',
        width: 149.64,
        height: 146.57,
        marginBottom: 30,
        marginTop: -30,
    },
    selectedImage: {
        width: '100%',
        height: '100%',
        borderRadius: 100,
    },
    icon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 44.06, // Adjust size as needed
        height: 43.15, // Adjust size as needed
        zIndex: 1, // Ensure icon is above image
    },
});

export default InputImage;