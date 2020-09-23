import React, {Component} from 'react';
import Navigation from './components/navigation/Navigation.js';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Logo from './components/logo/Logo.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Rank from './components/rank/Rank.js';
import FaceRecognition from './components/facerecognition/FaceRecognition.js';
import './App.css';

const particlesOption = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 300
      }
    } 
  }               
}

const app = new Clarifai.App({
  apiKey: '4d69b5b18c3745c88d6785625fa4aa6a'
 });

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageURL: ''
    }
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onSubmit = (event) => {
    this.setState({imageURL: this.state.input});
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input)
      .then(
        function(response){
          console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
        },
        function(err){

        }
      );
  }

  render() {
    return (
      <div className="App">
        <Particles className='particles'
              params={particlesOption}
        />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit}/>
        <FaceRecognition imageURL={this.state.imageURL}/>
      </div>
    );
  }
}

export default App;
