import React, {Component} from "react";
import hash from "hash";
import * as $ from "jquery";
import Player from "./Player";
import logo from "./logo.svg";
import "./App.css";
import SongForm from "./SongForm";

export const authEndpoint = 'https://accounts.spotify.com/authorize?';
// Replace with your app's client ID, redirect URI and desired scopes
const clientId = "5545bf5fa80240649db0c2d86d348623";
const redirectUri = "http://localhost:3000";
const scopes = [
    "user-read-currently-playing",
    "user-read-playback-state",
    "user-modify-playback-state"
];
// Get the hash of the url
let wHash = window.location.hash
    .substring(1)
    .split("&")
    .reduce(function (initial, item) {
        if (item) {
            var parts = item.split("=");
            initial[parts[0]] = decodeURIComponent(parts[1]);
        }
        return initial;
    }, {});
window.location.hash = "";

class App extends Component {
    constructor() {
        super();
        this.state = {
            token: null,
            item: {
                album: {
                    images: [{url: ""}]
                },
                name: "",
                artists: [{name: ""}],
                duration_ms: 0,
            },
            is_playing: "Paused",
            progress_ms: 0
        };
        this.getCurrentlyPlaying = this.getCurrentlyPlaying.bind(this);
    }

    getCurrentlyPlaying(token) {
        // Make a call using the token
        $.ajax({
            url: "https://api.spotify.com/v1/me/player",
            type: "GET",
            beforeSend: (xhr) => {
                xhr.setRequestHeader("Authorization", "Bearer " + token);
            },
            success: (data) => {
                if (data == null && token != null) {
                    this.setState({
                        token: token,
                        item: {
                            album: {
                                images: [{url: ""}]
                            },
                            name: "",
                            artists: [{name: ""}],
                            duration_ms: 0,
                        },
                        is_playing: "Nothing",
                        progress_ms: 0,
                    });
                } else {
                    this.setState({
                        token: token,
                        item: data.item,
                        is_playing: data.is_playing,
                        progress_ms: data.progress_ms,
                    });
                }
            }
        });
    }

    onChangeSong = (songUrl) => {
        let url = songUrl.split("/")
        let uri_props = url[4].split("#")
        let time = uri_props[1].split(":")
        let ms = time[0] * 60 * 1000 + time[1] * 1000
        $.ajax({
            url: "https://api.spotify.com/v1/me/player/play",
            type: "PUT",
            contentType: 'application/json',
            data: JSON.stringify({
                "uris": ["spotify:track:" + uri_props[0]],
                "position_ms": ms
            }),
            beforeSend: (xhr) => {
                xhr.setRequestHeader("Authorization", "Bearer " + this.state.token);
            },
            success: (data) => {
                setTimeout(() => {  this.getCurrentlyPlaying(this.state.token) }, 500);

            }
        })
    }

    pause = () => {
        $.ajax({
            url: "https://api.spotify.com/v1/me/player/pause",
            type: "PUT",
            contentType: 'application/json',
            beforeSend: (xhr) => {
                xhr.setRequestHeader("Authorization", "Bearer " + this.state.token);
            },
        })
    }

    play = () => {
        $.ajax({
            url: "https://api.spotify.com/v1/me/player/play",
            type: "PUT",
            contentType: 'application/json',
            beforeSend: (xhr) => {
                xhr.setRequestHeader("Authorization", "Bearer " + this.state.token);
            },
        })
    }

    componentDidMount() {
        // Set token
        let _token = wHash.access_token;
        if (_token) {
            // Set token
            this.setState({
                token: _token
            });
            this.getCurrentlyPlaying(_token)
        }
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <div className="inline-form">
                        <SongForm
                            songUrl={""}
                            onChangeSong={this.onChangeSong}
                            play={this.play}
                            pause={this.pause}
                        />
                    </div>
                    <div className="content">
                        {!this.state.token && (
                            <a
                                className="btn btn--loginApp-link"
                                href={`${authEndpoint}client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`}
                            >
                                Login to Spotify
                            </a>
                        )}
                        {this.state.token && (
                            <Player
                                item={this.state.item}
                                is_playing={this.state.is_playing}
                                progress_ms={this.progress_ms}
                            />
                        )}
                    </div>
                </header>
            </div>

        );
    }
}

export default App;