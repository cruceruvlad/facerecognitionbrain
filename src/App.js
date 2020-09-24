import React, {Component} from 'react';
import Navigation from './components/navigation/Navigation.js';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Logo from './components/logo/Logo.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Signin from './components/Signin/Signin.js';
import Register from './components/register/Register.js';
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
      imageURL: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    this.setState({box:
        {leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height -(clarifaiFace.bottom_row * height)}
    })
  }

  onRouteChange = (route) => {
    if(route === 'signout') {
      this.setState({isSignedIn: false});
    } else if(route === 'home') {
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
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
      .then(response => this.calculateFaceLocation(response))
      .catch(err => console.log(err));
  }

  render() {
    const { isSignedIn, imageURL, route, box } = this.state;
    return (
      <div className="App">
        <Particles className='particles'
              params={particlesOption}
        />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
        { route === 'home'
            ? <div>
                <Logo />
                <Rank />
                <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit}/>
                <FaceRecognition imageURL={imageURL} box={box}/>
              </div>
            : (
                route === 'signin'
                ? <Signin onRouteChange={this.onRouteChange}/>
                : <Register onRouteChange={this.onRouteChange}/>
            )
        }
      </div>
    );
  }
}

export default App;
