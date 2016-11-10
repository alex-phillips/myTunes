'use strict';
import React, { Component } from 'react';
import {
  AppRegistry,
  Image,
  Dimensions,
  StyleSheet,
  Text,
  View,
  Slider
} from 'react-native';
import Button from 'react-native-button';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';
import Koel from '../api/Koel';


const window = Dimensions.get('window');

class Player extends Component {
  constructor(props){
    super(props);
    this.state = {
      playing: true,
      muted: false,
      shuffle: false,
      sliding: false,
      currentTime: 0,
      songIndex: props.songIndex,
      songDuration: props.song.length,
      url: props.url,
      scrubbedTo: 0,
    };
  }

  togglePlay(){
    clearInterval(this.state.progressInterval);

    this.setState({
      playing: !this.state.playing,
      progressInterval: this.state.playing ? null : this.getProgressInterval(),
      startTime: Date.now(),
      scrubbedTo: this.state.currentTime,
      elapsed: 0,
    });
  }

  toggleVolume(){
    this.setState({
      muted: !this.state.muted,
    });
  }

  toggleShuffle(){
    this.setState({
      shuffle: !this.state.shuffle,
    });
  }

  goBackward(){
    console.log(`[Player][goBackward]`);
    if(this.state.currentTime < 3 && this.state.songIndex !== 0 ){
      this.setState({
        songIndex: this.state.songIndex - 1,
        currentTime: 0,
      });
    } else {
      if (!this.state.url.match(/http/)) {
        this.refs.audio.seek(0);
      } else {
        Koel.getInstance().getPlayUrl(this.props.song.id)
          .then(url => {
            this.setState({
              url: url,
              currentTime: 0,
            });
          });
      }
    }
  }

  goForward(){
    console.log(`[Player][goForward]`);
    this.setState({
      songIndex: this.state.shuffle ? this.randomSongIndex() : this.state.songIndex + 1,
      currentTime: 0,
    });
    this.refs.audio.seek(0);
  }

  randomSongIndex(){
    let maxIndex = this.props.songs.length - 1;
    return Math.floor(Math.random() * (maxIndex - 0 + 1)) + 0;
  }

  setTime(params){
    console.log('[Player][setTime]');
    if(!this.state.sliding){
      this.setState({
        currentTime: this.state.currentTime + (Date.now() - this.state.startTime),
      });
    }
  }

  onLoad(params){
    console.log(`[Player][onLoad]`);

    clearInterval(this.state.progressInterval);
    this.setState({
      startTime: Date.now(),
      elapsed: 0,
      progressInterval: this.getProgressInterval(),
    });
  }

  getProgressInterval() {
    return setInterval(() => {
      let timeElapsed = (Date.now() - this.state.startTime) / 1000;
      console.log(`[Player][progressInterval] current time: ${timeElapsed}`);
      this.setState({
        currentTime: this.state.scrubbedTo + timeElapsed,
      });
    }, 1000);
  }

  onSlidingStart(){
    console.log(`[Player][onSlidingStart]`);
    this.setState({
      sliding: true,
    });
  }

  onSlidingChange(value){
    console.log(`[Player][onSlidingChange]`);
    clearInterval(this.state.progressInterval);
    let newPosition = value * this.state.songDuration;
    this.setState({
      startTime: Date.now(),
      scrubbedTo: newPosition,
      currentTime: newPosition,
    });
  }

  onSlidingComplete(){
    console.log(`[Player][onSlidingComplete]`);
    this.setState({ sliding: false });
    console.log(`[Player][onSlidingChange] new value: ${this.state.currentTime}`);

    if (!this.state.url.match(/http/)) {
      this.refs.audio.seek( this.state.currentTime );
    } else {
      let self = this;
      Koel.getInstance().getPlayUrl(this.props.song.id, Math.round(this.state.currentTime, 2))
        .then(url => {
          self.setState({
            startTime: Date.now(),
            url: url,
          });
        });
    }
  }

  onEnd(){
    console.log(`[Player][onEnd]`);
    this.setState({ playing: false });
  }

  componentWillUnmount() {
    clearInterval(this.state.progressInterval);
  }

  render() {
    let songPlaying = this.props.song;
    for (let index in this.props.album.songs) {
      if (this.props.album.songs[index].id === songPlaying.id) {
        this.state.songIndex = index;
        break;
      }
    }

    let songPercentage;
    if( this.state.songDuration !== undefined ){
      songPercentage = this.state.currentTime / this.state.songDuration;
    } else {
      songPercentage = 0;
    }

    let playButton;
    if( this.state.playing ){
      playButton = <Icon onPress={ this.togglePlay.bind(this) } style={ styles.play } name="ios-pause" size={70} color="#fff" />;
    } else {
      playButton = <Icon onPress={ this.togglePlay.bind(this) } style={ styles.play } name="ios-play" size={70} color="#fff" />;
    }

    let forwardButton;
    if( !this.state.shuffle && this.state.songIndex + 1 === this.props.album.songs.length ){
      forwardButton = <Icon style={ styles.forward } name="ios-skip-forward" size={25} color="#333" />;
    } else {
      forwardButton = <Icon onPress={ this.goForward.bind(this) } style={ styles.forward } name="ios-skip-forward" size={25} color="#fff" />;
    }

    let volumeButton;
    if( this.state.muted ){
      volumeButton = <Icon onPress={ this.toggleVolume.bind(this) } style={ styles.volume } name="ios-volume-off" size={18} color="#fff" />;
    } else {
      volumeButton = <Icon onPress={ this.toggleVolume.bind(this) } style={ styles.volume } name="ios-volume-up" size={18} color="#fff" />;
    }

    let shuffleButton;
    if( this.state.shuffle ){
      shuffleButton = <Icon onPress={ this.toggleShuffle.bind(this) } style={ styles.shuffle } name="ios-shuffle" size={18} color="#f62976" />;
    } else {
      shuffleButton = <Icon onPress={ this.toggleShuffle.bind(this) } style={ styles.shuffle } name="ios-shuffle" size={18} color="#fff" />;
    }

    let image = this.props.album.cover ? this.props.album.cover.replace('http://', 'https://') : 'https://facebook.github.io/react/img/logo_og.png';
    console.log(`[Player] cover image - ${image}`);
    console.log(`[Player][render] current song url: ${this.state.url}`);

    return (
      <View style={styles.container}>
        <Video source={{uri: this.state.url }}
            ref="audio"
            volume={ this.state.muted ? 0 : 1.0}
            muted={false}
            paused={ !this.state.playing }
            onLoad={ this.onLoad.bind(this) }
            onProgress={ this.setTime.bind(this) }
            onEnd={ this.onEnd.bind(this) }
            resizeMode="cover"
            playInBackground={true}
            repeat={false}/>

        <View style={ styles.header }>
          <Text style={ styles.headerText }>
            { this.props.artist.name }
          </Text>
        </View>
        <View style={ styles.headerClose }>
          <Icon onPress={ Actions.pop } name="ios-arrow-down" size={30} color="#fff" />
        </View>
        <Image
          style={ styles.songImage }
          source={{uri: image}}
          style={{
            width: 300,
            height: 300
          }}/>
        <Text style={ styles.songTitle }>
          { songPlaying.title }
        </Text>
        <Text style={ styles.albumTitle }>
          { this.props.album.name }
        </Text>
        <View style={ styles.sliderContainer }>
          <Slider
            onSlidingStart={ this.onSlidingStart.bind(this) }
            onSlidingComplete={ this.onSlidingComplete.bind(this) }
            onValueChange={ this.onSlidingChange.bind(this) }
            minimumTrackTintColor='#851c44'
            style={ styles.slider }
            trackStyle={ styles.sliderTrack }
            thumbStyle={ styles.sliderThumb }
            value={ songPercentage }/>

          <View style={ styles.timeInfo }>
            <Text style={ styles.time }>{ formattedTime(this.state.currentTime)  }</Text>
            <Text style={ styles.timeRight }>- { formattedTime( this.state.songDuration - this.state.currentTime ) }</Text>
          </View>
          <View style={ styles.controls }>
            { shuffleButton }
            <Icon onPress={ this.goBackward.bind(this) } style={ styles.back } name="ios-skip-backward" size={25} color="#fff" />
            { playButton }
            { forwardButton }
            { volumeButton }
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#000',
  },
  header: {
    marginTop: 17,
    marginBottom: 17,
    width: window.width,
  },
  headerClose: {
    position: 'absolute',
    top: 10,
    left: 0,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  headerText: {
    color: "#FFF",
    fontSize: 18,
    textAlign: 'center',
  },
  songImage: {
    marginBottom: 20,
  },
  songTitle: {
    color: "white",
    fontFamily: "Helvetica Neue",
    marginBottom: 10,
    marginTop: 13,
    fontSize: 19
  },
  albumTitle: {
    color: "#BBB",
    fontFamily: "Helvetica Neue",
    fontSize: 14,
    marginBottom: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  back: {
    marginTop: 22,
    marginLeft: 45,
  },
  play: {
    marginLeft: 50,
    marginRight: 50,
  },
  forward: {
    marginTop: 22,
    marginRight: 45,
  },
  shuffle: {
    marginTop: 26,
  },
  volume: {
    marginTop: 26,
  },
  sliderContainer: {
    width: window.width - 40,
  },
  timeInfo: {
    flexDirection: 'row',
  },
  time: {
    color: '#FFF',
    flex: 1,
    fontSize: 10,
  },
  timeRight: {
    color: '#FFF',
    textAlign: 'right',
    flex: 1,
    fontSize: 10,
  },
  slider: {
    height: 40,
  },
  sliderTrack: {
    height: 2,
    backgroundColor: '#333',
  },
  sliderThumb: {
    width: 5,
    height: 5,
    backgroundColor: '#f62976',
    borderRadius: 5 / 2,
    shadowColor: 'red',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 2,
    shadowOpacity: 1,
  }
});

//TODO: Move this to a Utils file
function withLeadingZero(amount){
  if (amount < 10 ){
    return `0${ amount }`;
  } else {
    return `${ amount }`;
  }
}

function formattedTime( timeInSeconds ){
  let minutes = Math.floor(timeInSeconds / 60);
  let seconds = timeInSeconds - minutes * 60;

  if( isNaN(minutes) || isNaN(seconds) ){
    return "";
  } else {
    return(`${ withLeadingZero( minutes ) }:${ withLeadingZero( seconds.toFixed(0) ) }`);
  }
}


module.exports = Player;
