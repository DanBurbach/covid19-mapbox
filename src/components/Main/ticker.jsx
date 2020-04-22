import React from "react";
import Ticker from "react-ticker";
import PageVisibility from "react-page-visibility";

const makeAPICall = () => {

};

const GetRatesFromAPI = () => {
  const [rates, setRates] = useState("");
  useEffect(() => {
    async function fetchData() {
      const ratesFromAPI = await makeAPICall();
      setRates(ratesFromAPI);
    }
    fetchData();
  }, []);
  // A placeholder is needed, to tell react-ticker, that width and height might have changed
  // It uses MutationObserver internally
  return rates ? (
    <p style={{ whiteSpace: "nowrap" }}>{rates.join(" +++ ")} +++ </p>
  ) : (
    <p style={{ visibility: "hidden" }}>Placeholder</p>
  );
};

const Covid19_ticker = () => {
  const [pageIsVisible, setPageIsVisible] = useState(true);

  const handleVisibilityChange = (isVisible) => {
    setPageIsVisible(isVisible);
  };

  return (
    <PageVisibility 
        onChange={ handleVisibilityChange }>
        { pageIsVisible && 
            <Ticker>{() => 
                <GetRatesFromAPI />
            }</Ticker>
        }
    </PageVisibility>
  );
};

export default Covid19_ticker;


