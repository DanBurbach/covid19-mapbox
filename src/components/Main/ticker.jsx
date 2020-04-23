import React, { Component, useState, useEffect } from "react";
import $ from "jquery";
import Ticker from "react-ticker";
import PageVisibility from "react-page-visibility";

const USER_ID = "d359bea4502a44948cc3ee7a77b2afbf";

class Covid19_ticker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageIsVisible: false,
      newsList: []
    };
    this.newsTicker = this.newsTicker.bind(this);
    this.makeAPICall = this.makeAPICall.bind(this);
    this.getNewsFromAPI = this.getNewsFromAPI.bind(this);
    this.makeAPICall = this.makeAPICall.bind(this);
  }

  componentDidMount() {
    this.makeAPICall();
  }

  makeAPICall = () => {
    $.getJSON(
      "https://newsapi.org/v2/everything?q=covid19&apiKey=" + `${USER_ID}`
    )
    .then(({ results }) => 
        this.setState({ 
            newsList: results 
        }));
  };

  getNewsFromAPI = () => {
    const [news, setNews] = useState("");
    useEffect(() => {
        const newsCall = this.state.newsList;
      async function fetchData() {
        const newsFromAPI = newsCall;
        setNews(newsFromAPI);
      }
      fetchData();
    }, []);
    // A placeholder is needed, to tell react-ticker, that width and height might have changed
    // It uses MutationObserver internally
    return news ? (
      <p style={{ whiteSpace: "nowrap" }}>{news.join(" +++ ")} +++ </p>
    ) : (
      <p style={{ visibility: "hidden" }}>Placeholder</p>
    );
  };

  newsTicker = () => {
    const [pageIsVisible, setPageIsVisible] = useState(true);

    const handleVisibilityChange = (isVisible) => {
      setPageIsVisible(isVisible);
    };

    return (
      <PageVisibility 
        onChange={handleVisibilityChange}>
        {pageIsVisible && 
            <Ticker>{() => 
                <this.getNewsFromAPI />
            }</Ticker>}
      </PageVisibility>
    );
  };

  render() {
    return (
        <div>
            <this.newsTicker />
        </div>
    );
  }
}

export default Covid19_ticker;


