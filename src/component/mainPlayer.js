import React, { Component } from "react";
import ReactPlayer from 'react-player';
import './mainPlayer.css'
import http from './http-axios'

class TestPlayer extends Component {
    constructor (props) {
        super (props);
        this.state = {
            //we now extract from backend, but have not yet send to player, only separate two colume now
            importDB: {}, //import whole data from backend as an object
            currentDB: [], // for uploading and reading current buttons
            oddPlayList: [], // separate renderingDB to odd colume
            evenPlayList: [], // separate renderingDB to even colume

            visible: false, // for toggle the bottom button

            //player setting
            playing: false,
            controls: true,
            light: false,
            muted: false,
            played: 0,
            loaded: 0,
            duration: 0,
            loop: false,

            //button selection
            buttonPressed: false,
            filePressed: [], //store which file is selected

            // uploading part
            creator: null,
            desireTitle: null,
            //dropDownValue: "Select Type", // video, audio and others
            linkAddress: null,
            selectedFile: null,
            uploadingStatus: null,

            // setting part
            startPlayUpdate: null, // start time value
            volumeUpdate: 0.3, // defualt value

            collaborationTitle: null, //collaborationTitle
            textRemark: null
        }
        
        this.playAll = this.playAll.bind(this);
        this.stopAll = this.stopAll.bind(this);
        this.flipbottom = this.flipbottom.bind(this); // flip bottom
        this.settingVolume = this.settingVolume.bind(this); // seek volume value
        this.fileSelection = this.fileSelection.bind(this); // select file we want to replace or set
        this.handleFileUpload = this.handleFileUpload.bind(this) // triggered when selecting file
        this.uploadingProcess = this.uploadingProcess.bind(this) //uploading button trigger 
        this.resetAll = this.resetAll.bind(this)
        this.adjustingParameter = this.adjustingParameter.bind(this) // parameter submit button
        this.finalSubmit = this.finalSubmit.bind(this) //final uploading to real DB

        this.duePlayer = React.createRef();
        //this.triplePlayer = React.createRef();
    }
    componentDidMount () {
        http.get("/").then(res => {
            console.log(res)
            // extract from backend and store in importDB
            this.setState({ importDB: res.data })
            console.log("the collaboration name is: " + Object.keys(this.state.importDB)[0])
            var urlLastName = Object.keys(this.state.importDB)[0] //store latest collaboration name in var
            this.setState({ currentDB: this.state.importDB[urlLastName]}) // get the latest collaboration
            console.log(this.state.currentDB)
            // separate odd colume and even colume
            // if we want to extend to 3 rows, maybe we can add something like
            // if (this.state.importDB.X92ndjfucso.length < 9) { then pass to this.duePlayer}
            // else goes as below
            const oddMemory = []
            const evenMemory = []
            let count = this.state.importDB[urlLastName].length //this.state.importDB.X92ndjfucso.length;
            while (count--) {
                if ( count % 2 === 0) {
                    oddMemory.push(this.state.importDB[urlLastName][count])
                    //oddMemory.push(this.state.importDB.X92ndjfucso[count])
                } else { evenMemory.push(this.state.importDB[urlLastName][count]) } //evenMemory.push(this.state.importDB.X92ndjfucso[count])
            }
            this.setState({ oddPlayList: oddMemory, evenPlayList: evenMemory})
            console.log("OK, this is our playlist: " + JSON.stringify(this.state.oddPlayList) + JSON.stringify(this.state.evenPlayList))
    
        }).catch(err => console.log("Here is the error from axios: ", err))
    }
    stopAll() {
        this.setState({ playing: false })
      }
      
    playAll() {
        this.setState({ playing: true })
    }
    flipbottom() { //flipping showing bottom
        this.setState({visible: !this.state.visible})
    }
    settingVolume(e) { // seek volume value 
        this.setState({ volumeUpdate: parseFloat(e.target.value) })
    }
    fileSelection(e) {
        //select file we want to replace or set
        this.setState({ buttonPressed: !this.state.buttonPressed})
        if (this.state.buttonPressed === true) {
            const arrayMemory = this.state.filePressed
            if (arrayMemory.includes(e.target.value) === false) { // if button never pressed before
                arrayMemory.push(e.target.value)
            }
            this.setState({ filePressed: arrayMemory})
            console.log("button select: " + this.state.filePressed)
        } else { // if button is de-selected
            const arrayMemory = this.state.filePressed // import current array
            const index = arrayMemory.indexOf(e.target.value) //check pressed button is in current array index
            if (index > -1) { // if index == -1, means there is no pressed button
                arrayMemory.splice(index, 1) // "1" here means replace, replace third parameter (which is null here) to array[index]  
                this.setState({ filePressed: arrayMemory})
                console.log("button select: " + this.state.filePressed)
            }
        }
    }
    handleFileUpload(e) {
        this.setState({ selectedFile: e.target.files[0] })
    }
    uploadingProcess(e) {//uploading button trigger
        e.preventDefault();
        // take down the selected file 
        // compare two array, and take out identical item
        const updateArray = this.state.currentDB.filter(s => 
            !this.state.filePressed.find(a => a === s.title)
        )
        console.log("Array after taking down: " + JSON.stringify(updateArray))
        //then upload via Nodejs
        const headers = { 'content-type': 'multipart/form-data' }
        const formData = new FormData();
        // verify whether there is link address input
        if (this.state.linkAddress == null) {
            // choose uploading file
            formData.append('artist', this.state.creator)
            formData.append('file', this.state.selectedFile) // uploading file itself
            formData.append('title', this.state.desireTitle)
            formData.append('type', "video")
            formData.append('playlist', JSON.stringify(updateArray)) //send array after take down
            console.log('now it is loading: ' + formData)
            // upload file via axios
            http.post("/playingVideo", formData, {headers}).then(() => {
                this.resetAll();
            }).catch(err => {this.uploadingStatus = "Failure !! " + err})
            } 
        else {
            // choose Link
            // create a new object and push onto original array on backend
            updateArray.push({
                "artist": this.state.creator,
                "source": this.state.linkAddress,
                "type": "link",
                "title": this.state.desireTitle,
                "startPlay": 0,
                "volume": 0.5
            })
            console.log("if user goes for update by link: " + JSON.stringify(updateArray))
            formData.append('playlist', JSON.stringify(updateArray))
            // upload update array via axios
            http.post("/playingLink", formData).then(() => {
                this.resetAll();
                window.location = '/'
            }).catch(err => {this.uploadingStatus = "Failure !! " + err})
            }
        }
    resetAll() {
        this.setState({
            creator: null,
            linkAddress: null,
            selectedFile: null,
            uploadingStatus: null,  
        })
    }
    adjustingParameter () {
        // check which button is pressed
        // take down the selected file 
        // compare two array, and take out identical item
        const updateArray = this.state.currentDB.filter(s => 
            this.state.filePressed.find(a => a === s.title)
        )
        // compare two array, and keep unchange object
        const remainArray = this.state.currentDB.filter(s => 
            !this.state.filePressed.find(a => a === s.title)
        )
        console.log("The file(s) user wants to set: " + JSON.stringify(updateArray))
        const setData = new FormData();
        setData.append("startPlay", this.state.startPlayUpdate)
        setData.append("volume", this.state.volumeUpdate)
        setData.append("waitChange", JSON.stringify(updateArray))
        setData.append("unChange", JSON.stringify(remainArray))
        // upload file via axios
        http.post("/updateParameter", setData).then(() => {
            this.resetAll();
            window.location = '/'
        }).catch(err => {this.uploadingStatus = "Failure !! " + err})
    }
    finalSubmit() {
        console.log("upload to DB")
    }
    render() {
        // this is for odd colume player
        let dynamicOddPlayer = this.state.oddPlayList.map((items) => {
            return (
                <ReactPlayer
                key={items.source}
                className="player-itself"
                ref={oddPlayer => (this.oddPlayer = oddPlayer)}
                onReady={() => {this.oddPlayer.seekTo(parseFloat(items.startPlay))}} //set start time once it is ready
                url= {items.source}
                width='480px'
                height='270px'
                playing={this.state.playing}
                volume={items.volume}
                loop = {this.state.loop}
                controls = {this.state.controls}
                />)
        })
        //this is for even colume player
        let dynamicEvenPlayer = this.state.evenPlayList.map((items) => {
            return (
                <ReactPlayer
                key={items.source}
                className="player-itself"
                ref={evenPlayer => (this.evenPlayer = evenPlayer)} //set this player ref
                onReady={() => {this.evenPlayer.seekTo(parseFloat(items.startPlay))}} //set start time once it is ready
                url= {items.source}
                width='480px'
                height='270px'
                playing={this.state.playing}
                volume={items.volume}
                loop = {this.state.loop}
                controls = {this.state.controls}
                />)
        })
        // this generates dynemic buttons
        let dynemicButton = this.state.currentDB.map((buttons) => {
            return (
                <Button outline color="success"
                    key={buttons.title}
                    value={buttons.title}
                    onClick={this.fileSelection}>{buttons.title}</Button>
            )
        })
        return (
            <div></div>
        );
    }
}


export default TestPlayer;