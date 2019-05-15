import React from "react";
import Headroom from "react-headroom";
import "normalize.css";
import "./App.css";
import Header from "./components/Header";
import Image from "react-graceful-image";
import Loader from "react-loaders";
import "./App.scss";
import Rodal from "rodal";

// include styles
import "rodal/lib/rodal.css";

var colours = ["#69779B", "#9692AF", "#ACDBDF", "#D7EAEA"];

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: "",
      page: 1,
      query: "",
      loading: "",
      visible: false,
      picture: "",
      title: ""
    };
  }
  openModal = (title, src) => {
    this.setState({ visible: true, picture: src, title });
  };
  handlePhotoChange = photos => {
    this.setState({
      query: photos,
      page: 1,
      loading: <Loader type="pacman" />,
      photos: []
    });

    fetch(
      `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=68718a972b685914728b4a71cd542e28&tags=${photos}&page=${
        this.state.page
      }&format=json&nojsoncallback=1`
    )
      .then(res => res.json())
      .then(res => {
        this.setState({ loading: <Loader type="pacman" /> });
        if (res.code === 3) {
          if (this.state.query) {
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
            this.setState({ loading: "" });
          }
        } else if (res.photos.photo.length === 0) {
          if (this.state.query) {
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
            this.setState({ loading: "" });
          }
        } else {
          this.setState({ loading: "" });
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
                  placeholderColor={
                    colours[Math.floor(Math.random() * colours.length)]
                  }
                  retry={{ count: 15, delay: 3, accumulate: "add" }}
                  className="image"
                />
              </div>
            );
          });
          this.setState({ photos: imageArray, page: 1 });
          if (this.state.query) {
            if (window.localStorage.getItem("query") === null) {
              let queries = new Array();
              queries.push(this.state.query);
              window.localStorage.setItem("query", JSON.stringify(queries));
            } else {
              let storedQueries = JSON.parse(
                window.localStorage.getItem("query")
              );
              storedQueries.push(this.state.query);
              let uniqueQueries = [...new Set(storedQueries)];
              window.localStorage.setItem(
                "query",
                JSON.stringify(uniqueQueries)
              );
            }
          }
          this.setState({ loading: "" });
        }
      });
  };
  reloadImage = () => {
    this.setState({
      page: this.state.page + 1,
      loading: <Loader type="pacman" />
    });
    fetch(
      `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=68718a972b685914728b4a71cd542e28&tags=${
        this.state.query
      }&page=${this.state.page}&format=json&nojsoncallback=1`
    )
      .then(res => res.json())
      .then(res => {
        this.setState({ loading: "Loading..." });
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
          let newArray = this.state.photos.concat(imageArray);
          this.setState({ photos: newArray });
        }
      });
  };
  hide = () => this.setState({ visible: false });
  handleScroll = () => {
    if (
      window.innerHeight + window.scrollY + 500 >=
      document.body.offsetHeight
    ) {
      this.reloadImage();
    }
  };
  componentDidMount() {
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
          <Header handlePhotoChange={this.handlePhotoChange} />
        </Headroom>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            width: "100%",
            flexGrow: 0,
            flexShrink: 0,
            justifyContent: "center",
            marginLeft: "auto",
            marginRight: "auto",
            overflow: "hidden",
            position: this.state.visible ? "fixed" : "inherit"
          }}
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
            placeholder={<Loader type="pacman" />}
            noLazyLoad={true}
            retry={{ count: 15, delay: 3, accumulate: "add" }}
            style={{
              objectFit: "contain",
              height: "90%",
              width: "100%"
            }}
          />
          <h4 style={{ textAlign: "center" }}>{this.state.title}</h4>
        </Rodal>
        <div style={{ position: "absolute", left: "50%", top: "50%" }}>
          <div style={{ position: "relative", left: "-50%" }}>
            {this.state.loading}
          </div>
        </div>
      </>
    );
  }
}
