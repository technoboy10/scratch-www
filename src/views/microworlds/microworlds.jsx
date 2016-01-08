var classNames = require('classnames');
var React = require('react');
var render = require('../../lib/render.jsx');
var omit = require('lodash.omit');

require('./microworlds.scss');

var Api = require('../../mixins/api.jsx');
var Session = require('../../mixins/session.jsx');
var Box = require('../../components/box/box.jsx');
var Carousel = require('../../components/carousel/carousel.jsx');
var Modal = require('../../components/modal/modal.jsx');
var TipsSlider = require('../../components/tipsslider/tipsslider.jsx');

var Microworld = React.createClass({
    type: 'Microworld',
    mixins: [
        Api,
        Session
    ],
    showVideo: function (key) {
        var videoOpenArr = this.state.videoOpen;
        videoOpenArr[key] = true;
        this.setState({videoOpen: videoOpenArr});
    },
    closeVideo: function (key) {
        var videoOpenArr = this.state.videoOpen;
        videoOpenArr[key] = false;
        this.setState({videoOpen: videoOpenArr});
    },
    getInitialState: function () {
        return {
            videoOpen: {},
            featuredGlobal: {},
            featuredLocal: {},
            microworlds_data: require("./microworlds_art.json")
        };
    },
    componentDidMount: function () {
        this.getFeaturedGlobal();
    },
    getFeaturedGlobal: function () {
        this.api({
            uri: '/proxy/featured'
        }, function (err, body) {
            if (!err) {
                this.setState({featuredGlobal: body});
            }
        }.bind(this));
    },
    renderVideos: function () {
        var videos = this.state.microworlds_data.videos
        if (!videos || videos.length <= 0) {
            return null;
        }

        return (
            <div className="videos-section section">
                <h1>Get Inspired...</h1>
                <div className="videos-container">
                    <div className="videos">
                        {videos.map(this.renderVideo)}
                    </div>
                </div>
            </div>
        );
    },
    renderVideo: function (video, key) {
        var frameProps = {
            width: 570,
            height: 357,
            padding: 15
        };
        var left = 25 * (key+1)
        return (
            <div>
                <div className="video">
                    <div className="play-button" onClick={this.showVideo.bind(this, key)} style={{ left: left +'%', top: '60%' }}>
                    </div>
                    <img src={video.image} />
                </div>
                <Modal
                    className="video-modal"
                    isOpen={this.state.videoOpen[key]}
                    onRequestClose={this.closeVideo.bind(this, key)}
                    style={{content:frameProps}}>
                    <iframe src={video.link} width="560" height="315" frameBorder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
                </Modal>
                
            </div>
        )
    },
    renderEditorWindow: function() {
        var projectId = this.state.microworlds_data.microworld_project_id;
        
        if (!projectId) {
            return null;
        }
        return (
            <div className="editor section">
                <h1>Start Creating!</h1>
                <a href={"//scratch.mit.edu/projects/"+ projectId +"/#editor"}>
                  <img src="/images/scratch-og.png" style={{width:"6%", position: "absolute", left: "75%"}}></img>
                </a>
                <iframe src={"//scratch.mit.edu/projects/embed-editor/" + projectId + "/?isMicroworld=true"}
                        frameBorder="0"> </iframe>
                {this.renderTips()}
                
            </div>
        )
    },
    renderTips: function() {
        var tips =  this.state.microworlds_data.tips;
        if (!tips || tips.length <= 0) {
            return null;
        }

        return (
            <div className="box tipsslider">
                <div className="box-header">
                    <h4>Start Painting</h4>
                </div>
                <div className="box-content">
                    <TipsSlider items={tips} settings={{slidesToShow:1,slidesToScroll:1}}/>
                </div>
            </div>
            )
    },
    renderStarterProject: function() {
        var starterProjects = this.state.microworlds_data.starter_projects;
        if (!starterProjects || starterProjects.length <= 0){
            return null;
        }

        return (
            <div className="project-ideas">
                <h1>Check out ideas for more projects</h1>
                <Box
                    title="More Starter Projects"
                    key="design_studio">
                    <Carousel items={starterProjects} />
                </Box>
            </div>
        )
    },
    renderProjectIdeasBox: function() {
        var communityProjects = this.state.microworlds_data.community_projects;
        if (!communityProjects || communityProjects.size <= 0) {
            return null;
        }

        var featured = communityProjects.featured_projects;
        var all = communityProjects.newest_projects;

        var rows = []
        if (featured && featured.length > 0){
            rows.push(
                <Box
                    title="Featured Community Projects"
                    key="community_featured_projects">
                    <Carousel items={featured} />
               </Box>
            )
        }
        if (all && all.length > 0) {
            rows.push(
                <Box
                     title="All Community Projects"
                     key="community_all_projects">
                     <Carousel items={all} />
               </Box>
            )
        }
        if (rows.length <= 0) {
            return null;
        }
        return (
            <div className="project-ideas">
                <h1>Get inspiration from other projects</h1>
                {rows}
            </div>
        )
    },
    renderForum: function() {
        if (!this.state.microworlds_data.show_forum) {
            return null;
        }

        return (
        <div className="forum">
            <h1>Chat with others!</h1>
            <img src="/images/forum-image.png"/>
        </div>
        )
    },
    renderDesignStudio: function() {
        var designChallenge = this.state.microworlds_data.design_challenge;
        if (!designChallenge) {
            return null;
        }

        return (
            <div className="side-by-side section">
                <h1>Join our Design Challenge!</h1>
                <div className="design-studio">
                    <iframe src={"https://scratch.mit.edu/projects/" + designChallenge.project_id + "/#fullscreen"} frameBorder="0"> </iframe>
                </div>
                <div className="design-studio-projects">
                    <Box title="Examples"
                         key="scratch_desgin_studio"
                         moreTitle="Visit the studio"
                         moreHref={'/studios/' + designChallenge.studio_id + '/'}>
                        <Carousel settings={{slidesToShow:2,slidesToScroll:2}} items={this.state.microworlds_data.design_challenge.studio1} />
                        <Carousel settings={{slidesToShow:2,slidesToScroll:2}} items={this.state.microworlds_data.design_challenge.studio2} />
                    </Box>
                </div>
            </div>
        )
    },
    render: function () {
        var classes = classNames(
            'top-banner'
        );

        var microworldData = this.state.microworlds_data;
        

        return (
            <div>
                <div className="top-banner section">
                    <h1>{microworldData.title}</h1>
                    <p>{microworldData.description.join(" ")}</p>
                </div>
                {this.renderVideos()}

                <div className="content">
                    {this.renderEditorWindow()}
                    {this.renderStarterProject()}
                    {this.renderDesignStudio()}
                    {this.renderProjectIdeasBox()}
                    {this.renderForum()}
                </div>
            </div>

        );
    }
});

render(<Microworld />, document.getElementById('view'));
Modal.setAppElement(document.getElementById('view'));