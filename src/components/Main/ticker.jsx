import React, { Component, useState, useEffect } from "react";
// import $ from "jquery";
import Ticker from "react-ticker";
import PageVisibility from "react-page-visibility";

const USER_ID = "d359bea4502a44948cc3ee7a77b2afbf";

class Covid19Ticker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageIsVisible: false,
      newsList: [],
      list: [],
      listLink: []
    };
    this.newsTicker = this.newsTicker.bind(this);
    this.makeAPICall = this.makeAPICall.bind(this);
    this.getNewsFromAPI = this.getNewsFromAPI.bind(this);
    this.makeAPICall = this.makeAPICall.bind(this);
  }

  componentDidMount() {
    this.makeAPICall();
  }

  async makeAPICall() {
    await fetch(
      "https://newsapi.org/v2/everything?q=covid19&apiKey=" + USER_ID
    )
    .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.setState({
          newsList: data
        })
        console.log(this.state.newsList);

        const arrayList = this.state.newsList.articles;

        console.log(arrayList);

        let listArray = [];
        let linkArray = [];

        for (var i = 0; i < arrayList.length; i++) {
          if (arrayList.hasOwnProperty(i)) {
            listArray.push(arrayList[i].title);
            linkArray.push(arrayList[i].url);
          }
        }

        let filteredTitles = listArray.filter(function (el) {
          return el != null;
        });

        let filteredLinks = linkArray.filter(function (el) {
          return el != null;
        });

        this.setState({
          list: filteredTitles,
          listLink: filteredLinks,
        });
        
        console.log(this.state.list);
        console.log(this.state.listLink);
      });
  };

  getNewsFromAPI = () => {
    const [news, setNews] = useState("");
    useEffect(() => {
      const newsCall = this.state.list;
      async function fetchData() {
        const newsFromAPI = await newsCall;
        setNews(newsFromAPI);
      }
      fetchData();
    }, []);
    // A placeholder is needed, to tell react-ticker, that width and height might have changed
    // It uses MutationObserver internally
    return news ? (
      <p style={{ whiteSpace: "nowrap" }}>
        {news.join(" ++ ")} ++ 
      </p>
    ) : (
      <p style={{ visibility: "hidden" }}>
        Placeholder
      </p>
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
            <Ticker>
              { () => <this.getNewsFromAPI /> }
            </Ticker>}
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

export default Covid19Ticker;


