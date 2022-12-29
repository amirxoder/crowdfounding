import React from "react";
import { useNavigate } from "react-router-dom";

import { loader } from "../assets";
import { FundCard } from "./";


const DisplayCampaign = ({ title, isLoading, campaings }) => {
  const navigate = useNavigate();

  const handleNavigate = (campaign) => {
    navigate(`/campaign-details/${campaign.title}`, { state: campaign });
  };

  return (
    <div>
      <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">
        {title} ({campaings.length})
      </h1>

      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && (
          <img
            src={loader}
            alt="loader"
            className="w-[100px] h-[100px] object-contain"
          />
        )}

        {!isLoading && campaings.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px]  text-[#818183]">
            You have not created any campaigns
          </p>
        )}

        {!isLoading &&
          campaings.length > 0 &&
          campaings.map((campaign) => (
            <FundCard
              key={campaign.id}
              {...campaign}
              handleClick={() => handleNavigate(campaign)}
            />
          ))}
      </div>
    </div>
  );
};

export default DisplayCampaign;
