import React from 'react';
import Headroom from 'react-headroom';
import 'normalize.css';
import Header from './components/Header';
import Image from 'react-graceful-image';
import 'react-lazy-load-image-component/src/effects/blur.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: false,
      photos: '',
      page: 1,
      query: ''
    }

    window.onscroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        === document.documentElement.offsetHeight
      ) {
        this.reloadImage();
      }
    };
  }
  
  handlePhotoChange = (photos) => {
    this.setState({query: photos, page: 1});
    fetch(`https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=68718a972b685914728b4a71cd542e28&tags=${photos}&page=${this.state.page}&format=json&nojsoncallback=1`)
    .then(res => res.json()).then(res => {
      this.setState({loading: 'Loading...'});
      if(res.code === 3) {
        this.setState({photos: <p>Your search - <span style={{fontWeight: 800}}>{this.state.query}</span> - did not match any tags.</p>});
      } else if(res.photos.photo.length === 0) {
        this.setState({photos: <p>Your search - <span style={{fontWeight: 800}}>{this.state.query}</span> - did not match any tags.</p>});
      } else {
        var imageArray = res.photos.photo.map((pic) => {
          var src = 'https://farm'+pic.farm+'.staticflickr.com/'+pic.server+'/'+pic.id+'_'+pic.secret+'.jpg';
          return(
          
             <Image src={src} alt="Lazy Load Example"  style={{ alignSelf: 'center', margin: "10px"}} retry={{ count: 15, delay: 3, accumulate: "add" }}/>
           
            
          ) 
        })
        this.setState({photos: imageArray, page: 1});
        this.setState({loading: 'Done'});
      }
      
    })
  }
  reloadImage = () => {
      this.setState({page: this.state.page + 1});
      fetch(`https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=68718a972b685914728b4a71cd542e28&tags=${this.state.query}&page=${this.state.page}&format=json&nojsoncallback=1`)
    .then(res => res.json()).then(res => {
      this.setState({loading: 'Loading...'});
      if(res.code === 3) {
        this.setState({photos: <h1>Found nothing</h1>});
      } else if(res.photos.photo.length === 0) {
        this.setState({photos: <p>Your search - <span style={{fontWeight: 800}}>{this.state.query}</span> - did not match any tags.</p>});
      } else {
        var imageArray = res.photos.photo.map((pic) => {
          var src = 'https://farm'+pic.farm+'.staticflickr.com/'+pic.server+'/'+pic.id+'_'+pic.secret+'.jpg';
          return(
            
             <Image src={src} alt="Lazy Load Example"  style={{ alignSelf: 'center', margin: "10px"}} retry={{ count: 15, delay: 3, accumulate: "add" }}/>
      
            
          ) 
        })
        let newArray = this.state.photos.concat(imageArray);
        this.setState({photos: newArray});
      }
      
    });

  }

  render() {
    return (
      <>
      <Headroom>
        <Header handlePhotoChange={this.handlePhotoChange}/>
      </Headroom>
  
      <div style={{display: 'flex', flexWrap: 'wrap', padding: "0 4px", justifyContent: 'space-around', alignItems: 'space-around'}}>
        {this.state.photos}
      </div>
      
      </>
    );
  }
}

