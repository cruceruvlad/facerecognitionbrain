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
      isSignedIn: false,
      user: {
        email: '',
        id:'',
        name:'',
        entries: 0,
        joined: ''
      }
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

  loadUser = (data) => {
    this.setState({user: {
      email: data.email,
      id: data.id,
      name: data.name,
      entries: data.entries,
      joined: data.joined
    }});
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
      .then(response => {
        if(response)
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id:this.state.user.id})
        }).then(res => res.json()).then(count => {
          this.setState(Object.assign(this.state.user,{entries: count}))
        })
        this.calculateFaceLocation(response);
      })
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
                <Rank name={this.state.user.name} entries={this.state.user.entries}/>
                <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit}/>
                <FaceRecognition imageURL={imageURL} box={box}/>
              </div>
            : (
                route === 'signin'
                ? <Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
                : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
            )
        }
      </div>
    );
  }
}

export default App;
