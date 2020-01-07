import React from 'react'
import { Text, View, Button } from 'react-native'
import Record from './Record'
// import {Audio} from 'expo-av'

class Comp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      names: ['https://img.icons8.com/nolan/2x/play.png', 'https://img.icons8.com/nolan/2x/play.png', 'https://img.icons8.com/nolan/2x/play.png'],
      imageurl: 'https://i.imgur.com/ayfPsQk.jpg',
      sounds: [
        {
          sound: 'https://storage.googleapis.com/frnd-cbt/upload_media/Air_Google_Sounds_Classical_Harmonies-637892.mp3',
          name: "air_google"
        },
        {
          sound: 'https://storage.googleapis.com/frnd-cbt/upload_media/Home_Alone_-_Merry_Christmas_Ya_Filthy_Animal_No_Gunshots-638197.mp3',
          name: "homealone"
        },
        {
          sound: 'https://storage.googleapis.com/frnd-cbt/upload_media/Home_Alone_-_Merry_Christmas_Ya_Filthy_Animal_No_Gunshots-638197.mp3',
          name: "homealone"
        }
      ],
      color: 'blue',
      text_from_input: ''
    }
  }
  add_me = async (name) => {
    Alert.alert(name)
    await Audio.Sound.createAsync({ uri: name }, { shouldPlay: true });

  }
  render() {

    let me_map = this.state.sounds.map((a, i) => {                      //Mapping the image from state
      return <View>
        <Text style={{}}>{a.name}</Text>
        <Button title={' me'} onPress={() => this.add_me(a.sound)}></Button>
      </View>
    })

    return (
      <View style={{ borderWidth: 2 }} >
        {/* {me_map} */}
        <Text>check</Text>
        <Record />
      </View>
    )
  }
}
export default Comp