import React, {Component} from 'react';
import Navigation from './components/navigation/Navigation.js';
import Particles from 'react-particles-js';
import Logo from './components/logo/Logo.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Rank from './components/rank/Rank.js';
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
class App extends Component {
  render() {
    return (
      <div className="App">
        <Particles className='particles'
              params={particlesOption}
        />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm />
        {/*<FaceRecognition />*/}
      </div>
    );
  }
}

export default App;
