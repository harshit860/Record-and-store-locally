import React from 'react'
import { View, Text, Button, StyleSheet, Alert, fs, ScrollView, styles ,AsyncStorage, SafeAreaView} from 'react-native'
import AudioRecord from 'react-native-audio-record';
import Sound from 'react-native-sound';
import Permissions from 'react-native-permissions';
import { Buffer } from 'buffer'
import axios from 'axios'

class Record extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            audiofile: "",
            recording: false,
            loaded: false,
            paused: false,
            answer: 'consoleing',
            sound: null,
            files: [],
            count: 1,
            upload: false
        }
    }


    async componentDidMount() {
        await this.checkPermissions()
        try {
            const myArray = await AsyncStorage.getItem('@MySuperStore:key');
            if (myArray !== null) {
                // We have data!!
                console.log('retrieved')
                var my = JSON.parse(myArray)
                this.setState({
                    files:my
                })
            }
        } catch (error) {
            // Error retrieving data
        }
    }

    checkPermissions = async () => {
        const p = await Permissions.check('android.permission.RECORD_AUDIO')
        if (p == 'authorized') {
            return this.requestPermission();
        }
    }

    requestPermission = async () => {
        console.log('in request')
        const p = await Permissions.request('android.permission.RECORD_AUDIO')
        console.log(p, 'microphone request')
    }

    Audioinit() {
        // Alert.alert('audioinit')
        let rstr = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
        const options = {
            sampleRate: 16000,
            channels: 1,
            bitsPerSample: 16,
            wavFile: 'test' + rstr + '.wav'
        }

        AudioRecord.init(options)

        AudioRecord.on('data', data => {
            const chunk = Buffer.from(data, 'base64');


        })
    }

    start_rec = () => {                                                         // Function to start the recording
        console.log('start')
        
        this.setState({
            count: this.state.count + 1
        })
        
        this.Audioinit()

        this.setState({
            audiofile: '',
            recording: true
        })
        AudioRecord.start();
    }

    stopcall() {                                                               
        return AudioRecord.stop();
    }

    stop_rec = async () => {                                                     //Function to stop the recording

        let audioFile1 = await this.stopcall()

        this.setState({
            audiofile: audioFile1
        })
        console.log(this.state)
        // Sending the file to upload serve
        // Alert.alert(this.state.audioFile)
    }


    load = (ind) => {
        console.log(ind)
        return new Promise((resolve, reject) => {
            if (!this.state.files[ind]) {
                return reject('file path is empty');
            }

            this.sound = new Sound(this.state.files[ind], '', error => {
                if (error) {
                    console.log('failed to load the file', error);
                    return reject(error);
                }
                this.setState({ loaded: true });
                return resolve();
            });
        });
    };

    _storeData = async () => {                                                              //Function to store the data in android
        var myArray = this.state.files
        console.log('in files',myArray)
        try {
            await AsyncStorage.setItem('@MySuperStore:key', JSON.stringify(myArray));
        } catch (error) {
            // Error saving data
        }

       

      };
    //   _retrieveData = async () => {
    //       console.log("in retrieve")
    //     try {
    //       const value = await AsyncStorage.getItem('files');
    //       console.log(value)
    //       if (value !== null) {

    //         console.log(value);
    //       }
    //     } catch (error) {
    //     }
    //   };
    axios_call() {
        this.setState({
            files: [...this.state.files, this.state.audiofile]
        })
        this._storeData()
        
        // var form = new FormData()
        // var urlpath = this.state.audiofile.split("/");
        // console.log(urlpath);
        // var uri = urlpath.subarray(0,-1).join('');
        // console.log(urlpath);
        // console.log(uri);
        // form.append('media', {
        //     "uri": "content://",
        //     "type":"audio/wav",
        //     "filename": this.state.audiofile
        // })
        // console.log(form)

        // var xhr = new XMLHttpRequest();
        // xhr.withCredentials = true;

        // xhr.addEventListener("readystatechange", function () {
        //     if (this.readyState === 4) {
        //         console.log('success')
        //         console.log(this.responseText);
        //     }
        // });

        // xhr.open("POST", "http://34.93.132.144:8080/api/uploadMedia");
        // xhr.setRequestHeader("Content-Type", "application/json");
        // xhr.setRequestHeader("Content-Type", "multipart");
        // xhr.setRequestHeader("idd", "1");
        // xhr.setRequestHeader("User-Agent", "PostmanRuntime/7.20.1");
        // xhr.setRequestHeader("Accept", "*/*");
        // xhr.setRequestHeader("Cache-Control", "no-cache");
        // xhr.setRequestHeader("Postman-Token", "e6878b03-ee56-45e9-9526-f86e31384e67,cf414de0-70b1-4e63-a286-9ff4f971a246");
        // xhr.setRequestHeader("Host", "34.93.132.144:8080");
        // xhr.setRequestHeader("Accept-Encoding", "gzip, deflate");
        // xhr.setRequestHeader("Content-Length", "100342");
        // xhr.setRequestHeader("Connection", "keep-alive");
        // xhr.setRequestHeader("cache-control", "no-cache");

        // xhr.send(data);
        // axios({
        //     method: 'POST',
        //     url: 'http://34.93.132.144:8080/api/uploadMedia',
        //     data:form,
        //     headers: {
        //         'content-type': 'multipart/form-data'
        //     }

        // })
        // .then(resp => Alert.alert('success'))
        // .catch(err => Alert.alert(err))


        //         const data = new FormData();
        // data.append("media",' /home/harshit/frnd task/frndtask/AwesomeProject/assets/sounds/sample.mp3');
        // Axios.post("http://127.0.0.1:132/api/upload_profile", data)
        //   .then(resp => {
        //     Alert.alert('success')
        //   })
        //   .catch(err => Alert.alert(err));


    }




    play = async (check1) => {                                                                  //Function to play every file coming from storage
        
        try {
            await this.load(check1);
        } catch (error) {
            console.log(error);
        }


        this.setState({ paused: false });
        Sound.setCategory('Playback');
        console.log(this.state.files[check1])
        this.sound.play(success => {
            if (success) {
                console.log('successfully finished playing');
            } else {
                console.log('playback failed due to audio decoding errors');
            }
            this.setState({ paused: true });
        });
    };

    pause = () => {
        this.sound.pause();
        this.setState({ paused: true });
    };
    render() {
        () => this.requestPermission

        let map = this.state.files.map((a, i) => {
            return <View>
                <Button title={a} style={{ width: 10, height: 200 }} onPress={(a) => this.play(i)} color="#04cd59"></Button>
            </View>
        })


            const scrollEnabled = true
        return (
            
            <View style={{ height: 850 }}>
                <Text style={{ textAlign: 'center', fontSize: 40 }} >Record</Text>
                <Button title="Record" onPress={() => this.start_rec()}  color="red" ></Button>
                <Button title="Stop and send" onPress={() => this.stop_rec()} color="black"></Button>
                {this.state.upload ? ('') : (
                    <View>
                        <Button title="Upload" onPress={() => this.axios_call()} ></Button>
                    </View>
                )}
                
                <Button title="store" onPress={()=>this._storeData()}></Button>
                <Button title="Paus" onPress={() => this.pause()}   ></Button>
                <SafeAreaView>
                <ScrollView style={{borderWidth:2 , height:300}} >
                   
                   {map}
               
           </ScrollView>
                </SafeAreaView>
              

            </View>
            
        )
    }
}
export default Record

