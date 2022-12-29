import React, { useState, useEffect } from "react";
import { useStateContext } from "../context";

import { DisplayCampaign } from "../components";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [campaings, setCampaings] = useState([]);

  const { address, contract, getCampaigns } = useStateContext();

  const fetchCampaigns = async () => {
    setLoading(true);
    const data = await getCampaigns();
    setCampaings(data);
    // console.log(`this is data in our Home section ${data}`);
    setLoading(false);
  };

  useEffect(() => {
    if (contract) fetchCampaigns();
    console.log(campaings);
  }, [address, contract]);

  return (
    <DisplayCampaign
      title="All Campaigns"
      isLoading={loading}
      campaings={campaings}
    />
  );
};

export default Home;
