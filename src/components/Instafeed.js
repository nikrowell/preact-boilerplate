import { Component, h } from 'preact';

class Instafeed extends Component {

  constructor(props) {
    super(props);
    this.state = {photos: null};
    this.accessToken = '5478446321.b17e40d.e55231b48fbf4cf3b0885d5229578626';
  }

  componentDidMount() {

    // don't make another api call if we've already done so.
    // session storage usage won't be necessary when it's 100% React
    if (sessionStorage.instafeed) {
      const photos = JSON.parse(sessionStorage.instafeed);
      this.setState({photos});
      return;
    }

    fetch(`https://api.instagram.com/v1/users/self/media/recent/?access_token=${this.accessToken}&count=8`)
      .then(res => res.json())
      .then(res => {

        const photos = res.data.map(item => ({
          link: item.link,
          src: item.images.low_resolution.url
        }));

        sessionStorage.setItem('instafeed', JSON.stringify(photos));
        this.setState({photos});
      });
  }

  shouldComponentUpdate() {
    return this.state.photos === null;
  }

  render() {

    if (!this.state.photos) return null;

    const photos = this.state.photos.map(photo => (
      <a href={photo.link} style={{backgroundImage:`url(${photo.src})`}} target="_blank"></a>
    ));

    return (
      <div className="instafeed">
        {photos}
      </div>
    );
  }
}

export default Instafeed;