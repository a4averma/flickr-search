// NPM Imports
import React from "react";
import Headroom from "react-headroom";
import "normalize.css";
import Image from "react-graceful-image";
import Loader from "react-loaders";
import Rodal from "rodal";
import "rodal/lib/rodal.css";

// Named Imports
import Header from "./components/Header";
import "./App.scss";

var colours = ["#69779B", "#9692AF", "#ACDBDF", "#D7EAEA"];

export default class App extends React.Component {
  state = {
    photos: [],
    page: 1,
    query: "",
    loading: "",
    visible: false,
    picture: "",
    title: ""
  };

  openModal = (title, src) => {
    this.setState({ visible: true, picture: src, title });
  };

  hide = () => this.setState({ visible: false });

  loadImages = query => {
    return fetch(
      `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=68718a972b685914728b4a71cd542e28&tags=${query}&page=${
        this.state.page
      }&format=json&nojsoncallback=1`
    )
      .then(res => res.json())
      .then(res => {
        this.setState({ loading: <Loader type="pacman" /> });
        if (res.code === 3) {
          this.setState({ photos: <h1>Found nothing</h1>, loading: "" });
        } else if (res.photos.photo.length === 0) {
          this.setState({
            photos: (
              <p>
                Your search -{" "}
                <span style={{ fontWeight: 800 }}>{this.state.query}</span> -
                did not match any tags.
              </p>
            ),
            loading: ""
          });
        } else {
          var imageArray = res.photos.photo.map(pic => {
            var src =
              "https://farm" +
              pic.farm +
              ".staticflickr.com/" +
              pic.server +
              "/" +
              pic.id +
              "_" +
              pic.secret +
              ".jpg";
            return (
              <div
                className="card"
                onClick={() => this.openModal(pic.title, src)}
              >
                <Image
                  src={src}
                  alt={pic.title}
                  className="image"
                  placeholderColor={
                    colours[Math.floor(Math.random() * colours.length)]
                  }
                  retry={{ count: 15, delay: 3, accumulate: "add" }}
                />
              </div>
            );
          });
          return imageArray;
        }
      });
  };

  handlePhotoChange = async query => {
    this.setState({
      query,
      page: 1,
      loading: <Loader type="pacman" />,
      photos: []
    });
    let imageArray = await this.loadImages(query);
    this.setState({ photos: imageArray, page: 1 });
    if (this.state.query) {
      if (window.localStorage.getItem("query") === null) {
        let queries = [];
        queries.push(this.state.query);
        window.localStorage.setItem("query", JSON.stringify(queries));
      } else {
        let storedQueries = JSON.parse(window.localStorage.getItem("query"));
        storedQueries.push(this.state.query);
        let uniqueQueries = [...new Set(storedQueries)];
        window.localStorage.setItem("query", JSON.stringify(uniqueQueries));
      }
    }
    this.setState({ loading: "" });
  };

  loadMore = async () => {
    this.setState({
      page: this.state.page + 1,
      loading: <Loader type="pacman" />
    });
    let imageArray = await this.loadImages(this.state.query);
    this.setState({
      photos: [...this.state.photos, ...imageArray],
      loading: ""
    });
  };

  handleScroll = () => {
    if (
      window.innerHeight + window.scrollY + 500 >=
      document.body.offsetHeight
    ) {
      this.loadMore();
    }
  };

  async componentDidMount() {
    this.setState({ loading: <Loader type="pacman" /> });
    let initImages = await this.loadImages("cats");
    this.setState({ photos: initImages, loading: "" });
    window.addEventListener("scroll", this.handleScroll);
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }
  render() {
    return (
      <>
        <Headroom
          style={{
            boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)"
          }}
        >
          <Header
            handlePhotoChange={this.handlePhotoChange}
            query={this.state.query}
          />
        </Headroom>

        <div
          className="container"
          style={{ position: this.state.visible ? "fixed" : "inherit" }}
        >
          {this.state.photos}
        </div>
        <Rodal
          visible={this.state.visible}
          onClose={this.hide}
          width="100vw"
          height="100vh"
        >
          <Image
            src={this.state.picture}
            alt={this.state.title}
            retry={{ count: 15, delay: 3, accumulate: "add" }}
            className="modal-image"
            placeholderColor="rgba(0,0,0,0)"
          />
          <div style={{ top: "50%", zIndex: -5 }} className="loader-wrapper">
            <Loader type="pacman" />
          </div>
          <h4 style={{ textAlign: "center" }}>{this.state.title}</h4>
        </Rodal>
        <div style={{ top: "50%" }} className="loader-wrapper">
          <div className="loader-container">{this.state.loading}</div>
        </div>
      </>
    );
  }
}
