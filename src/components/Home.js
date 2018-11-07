import React, { Component } from "react";
import { Tabs, Button, Spin } from "antd";
import { Gallery } from "./Gallery.js";
import { CreatePostButton } from "./CreatePostButton.js";
import {
    GEO_OPTIONS,
    POS_KEY,
    API_ROOT,
    AUTH_HEADER,
    TOKEN_KEY
} from "../constant.js";

const TabPane = Tabs.TabPane;

export class Home extends Component {
    state = {
        isLoadingGeoLocation: false,
        error: "",
        isLoadingPosts: false,
        posts: []
    };

    componentDidMount() {
        if ("geolocation" in navigator) {
            this.setState({ isLoadingGeoLocation: true, error: "" });
            navigator.geolocation.getCurrentPosition(
                this.onSuccessLoadGeoLocation,
                this.onFailedLoadGeoLocation,
                GEO_OPTIONS
            );
        } else {
            this.setState({ error: "No geo location available" });
        }
    }

    onSuccessLoadGeoLocation = position => {
        console.log(position);
        const { latitude, longitude } = position.coords;
        localStorage.setItem(
            POS_KEY,
            JSON.stringify({ lat: latitude, lon: longitude })
        );
        this.setState({ isLoadingGeoLocation: false });
        this.loadNearbyPost();
    };

    onFailedLoadGeoLocation = () => {
        this.setState({
            isLoadingGeoLocation: false,
            error: "Failed to load geolocation"
        });
    };

    loadNearbyPost = () => {
        const { lat, lon } = JSON.parse(localStorage.getItem(POS_KEY));
        const jwtToken = localStorage.getItem(TOKEN_KEY);
        this.setState({ isLoadingPosts: true, error: "" });
        return fetch(`${API_ROOT}/search?lat=${lat}&lon=${lon}&range=20000`, {
            method: "GET",
            headers: {
                Authorization: `${AUTH_HEADER} ${jwtToken}`
            }
        })
            .then(response => {
                if (response.ok) return response.json();
                throw new Error("Failed to load posts");
            })
            .then(data => {
                console.log(data);
                this.setState({
                    isLoadingPosts: false,
                    posts: data ? data : []
                });
            })
            .catch(err => {
                console.log(err.message);
                this.setState({ isLoadingPosts: false, error: err.message });
            });
    };

    getImagePosts = () => {
        const {
            error,
            isLoadingGeoLocation,
            isLoadingPosts,
            posts
        } = this.state;
        if (error) return error;
        else if (isLoadingGeoLocation)
            return <Spin tip="Loading geo location..." />;
        else if (isLoadingPosts) return <Spin tip="Loading posts..." />;
        else if (posts.length > 0) {
            const images = this.state.posts.map(post => {
                return {
                    user: post.user,
                    src: post.url,
                    thumbnail: post.url,
                    caption: post.message,
                    thumbnailWidth: 400,
                    thumbnailHeight: 300
                };
            });
            return <Gallery images={images} />;
        } else return "No nearby posts";
    };

    render() {
        const operations = (
            <CreatePostButton loadNearbyPosts={this.loadNearbyPosts} />
        );
        return (
            <Tabs tabBarExtraContent={operations} className="main-tabs">
                <TabPane tab="Image Posts" key="1">
                    {this.getImagePosts()}
                </TabPane>
                <TabPane tab="Video Posts" key="2">
                    Content of tab 2
                </TabPane>
                <TabPane tab="Map" key="3">
                    Content of tab 3
                </TabPane>
            </Tabs>
        );
    }
}
