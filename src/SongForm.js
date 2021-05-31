import React from "react";

class SongForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {songUrl: ''};
    }

    mySubmitHandler = (event) => {
        event.preventDefault();
        this.props.onChangeSong(this.state.songUrl)
    }

    myChangeHandler = (event) => {
        event.preventDefault();
        this.setState({songUrl: event.target.value})
    }

    render() {
        return (
            <form onSubmit={this.mySubmitHandler}>
                <label>
                    Song URL:
                    <input type='text' name='song' value={this.state.songUrl} onChange={this.myChangeHandler}/>
                </label>
                <br/>
                <div>
                    <input type="button" value="Play" onClick={this.props.play}/>
                    <input type="button" value="Pause" onClick={this.props.pause}/>
                </div>
            </form>
        );
    }
}

export default SongForm