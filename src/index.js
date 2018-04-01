import React from 'react';
import ReactDOM from 'react-dom';
import {Grid,Row,Col} from 'react-bootstrap';
import YoutubePlayer from './components/YoutubePlayer';
import Marquee from './components/Marquee';
import FilterableList from './components/FilterableList';
import {secondsToDuration} from './utils/time';
import './index.css';

class MusicPlayer extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            artists : []
        }
    }

    // https://reactjs.org/docs/react-component.html#componentdidmount
    componentDidMount(){
        this.loadSongArtists(this.props.vid);
    }

    // https://reactjs.org/docs/react-component.html#componentwillreceiveprops
    componentWillReceiveProps(nextProps){
        if(this.props.vid !== nextProps.vid){
            this.loadSongArtists(nextProps.vid);
        }
    }

    /**
     * Load list of artists for current playing video
     */
    loadSongArtists(vid){
        fetch("http://while1.co.il/musicTube/explorer2.php?get_vid_artists=" + vid)
            .then(response => response.json())
            .then( artists => {
                this.setState({
                    artists : artists
                });
            })
            .catch( error => {
                alert("getSongArtists error: \n" + error);
            });
    }

    render(){
        return (
            <div id="MusicPlayer">
                <YoutubePlayer vid={this.props.vid} />
                <Marquee text={this.props.title} />

                <div className="artists">
                    <p>מבצעים:</p>
                    <ol>
                    {
                        this.state.artists.map((artist) => {
                            let artistPrefix = "";
                            if(artist.prefix){
                                artistPrefix = "(" + artist.prefix + ")";
                            }

                            return (
                                <li key={artist.id}>{artist.name} {artistPrefix}</li>
                            );
                        })
                    }
                    </ol>
                </div>
            </div>
        );
    }
}

class FilterableArtists extends React.Component {
    constructor(props){
        super(props);

        this.handleArtistClick = this.handleArtistClick.bind(this);
    }

    handleArtistClick(event){
        this.props.onArtistClick(event);
    }

    render(){
        const artists = this.props.items.map(
            (item) => {
                return {
                    "id" : item.id,
                    "value" : item.name,
                    "badge" : item.total
                };
            }
        );

        return (
            <FilterableList 
                searchPlaceHolder="חיפוש אמן..."
                emptyListText="אין אמנים להצגה"
                emptyResultText="אין תוצאות"
                items={artists}
                selectedId={this.props.selectedId}
                onItemClick={this.handleArtistClick}
            />
        );
    }
}

class FilterableSongs extends React.Component {
    constructor(props){
        super(props);

        this.handleSongClick = this.handleSongClick.bind(this);
    }

    handleSongClick(event){
        this.props.onSongClick(event);
    }

    render(){  
        const songs = this.props.items.map(
            (item) => {
                return {
                    "id" : item.vid,
                    "value" : item.title,
                    "badge" : secondsToDuration(item.duration)
                };
            }
        );

        return (
            <FilterableList 
                searchPlaceHolder="חיפוש שיר..."
                emptyListText="בחר אמן מהרשימה"
                emptyResultText="אין תוצאות"
                items={songs}
                selectedId={this.props.selectedId}
                onItemClick={this.handleSongClick}
            />
        );
    }
}

class MusicTube extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            "artists" : [],
            "songs" : [],
            "selectedArtist" : {},
            "selectedSong" : {
                "vid" : "8aRor905cCw",
                "title" : "Travie McCoy: Billionaire ft. Bruno Mars [OFFICIAL VIDEO]"
            }
        }

        this.handleArtistClick = this.handleArtistClick.bind(this);
        this.handleSongClick = this.handleSongClick.bind(this);
    }

    componentDidMount(){
        this.loadArtists();
    }

    handleArtistClick(event){
        const selectedArtistId = event.target.id;

        this.setState((prevState , props) => {
            //https://stackoverflow.com/a/35397839
            const selectedArtist = prevState.artists.find( (artist) => artist.id === selectedArtistId );

            return {
                "selectedArtist" : selectedArtist
            };
        });

        this.loadSongsForArtists(selectedArtistId);
    }

    handleSongClick(event){
        const selectedSongId = event.target.id;

        this.setState((prevState , props) => {
            //https://stackoverflow.com/a/35397839
            const selectedSong = prevState.songs.find( (song) => song.vid === selectedSongId );

            return {
                "selectedSong" : selectedSong
            }
        });

        this.loadAutoCollect(selectedSongId);
    }

    loadArtists(){
        fetch("http://while1.co.il/musicTube/explorer2.php?list=artists")
            .then( response => {
                return response.json();
            })
            .then( artists => {
                this.setState({'artists' : artists});
            })
            .catch( error => {
                alert("loadArtists error: \n" + error);
            });
    }

    loadSongsForArtists(artistId){
        fetch("http://while1.co.il/musicTube/explorer2.php?list=songs&artistId=" + artistId)
            .then( response => {
                return response.json();
            })
            .then( songs => {
                this.setState({'songs' : songs});
            })
            .catch( error => {
                alert("loadSongsForArtists error: \n" + error);
            });
    }

    loadAutoCollect(vid){
        fetch("http://while1.co.il/musicTube/autoCollect.php?vid=" + vid)
            .then((response) => {
                this.loadSongsForArtists(this.state.selectedArtist.id)
            });
    }

    render(){
        return (
            <div>
                <div id="cover">
                    <Grid>
                        <Row>
                            <Col md={12}>
                                <h1>MusicTube</h1>
                                <h2>ספריית שירים מ-YouTube ממויינת לפי אמנים</h2>
                            </Col>
                        </Row>
                    </Grid>
                </div>

                <Grid>
                    <Row>
                        <Col md={4} sm={4}>
                            <MusicPlayer
                                vid={this.state.selectedSong.vid}
                                title={this.state.selectedSong.title} />
                        </Col>
                        <Col md={4} sm={4}>
                            <FilterableArtists
                                onArtistClick={this.handleArtistClick}
                                items={this.state.artists}
                                selectedId={this.state.selectedArtist.id} />
                        </Col>
                        <Col md={4} sm={4}>
                            <FilterableSongs
                                onSongClick={this.handleSongClick}
                                items={this.state.songs}
                                selectedId={this.state.selectedSong.vid} />
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

ReactDOM.render(
    <MusicTube />,
    document.getElementById('root')
);