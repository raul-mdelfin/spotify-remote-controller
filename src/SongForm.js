import React from "react";

class SongForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { songUrl: '' };
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
                    <input type='text' name='song' value={this.state.songUrl} onChange={this.myChangeHandler} />
                </label>
            </form>
        );
    }
}
export default SongForm