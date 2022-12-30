import React, { useContext, createContext } from "react";

//thirdweb
import {
  useAddress,
  useContract,
  useMetamask,
  useContractWrite,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract(
    "0xB48C55d82E04baFA45f6ed9896e72EBd2a592C9e"
  );
  const { mutateAsync: createCompaign } = useContractWrite(
    contract,
    "createCompaign"
  );

  const address = useAddress();
  const connect = useMetamask();

  const publishCampaign = async (form) => {
    try {
      const data = await createCompaign([
        address, //owner
        form.title, //title
        form.description, //description
        form.target, //target
        new Date(form.deadline).getTime(), //deadline,
        form.image, //imageurl
      ]);
      console.log("contract call success", data);
    } catch (error) {
      console.log("contract call failur", error);
    }
  };

  const getUserCampaigns = async () => {
    const allCompaign = await getCampaigns();

    const filterdCapmaigns = allCompaign.filter(
      (campaign) => campaign.owner === address
    );
    console.log(filterdCapmaigns);
    return filterdCapmaigns;
  };

  const donate = async (pId, amount) => {
    const data = await contract.call("donateToCampaign", pId, {
      value: ethers.utils.parseEther(amount),
    });
    return data;
  };

  const getDonations = async (pId) => {
    const donations = await contract.call("getDonator", pId);
    const numberOfDonatins = donations[0].length;

    const parsedDonations = [];
    for (let i = 0; i < numberOfDonatins; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString()),
      });
    }

    return parsedDonations;
  };

  const getCampaigns = async () => {
    const campaigns = await contract.call("getCampaigns");
    console.log(campaigns);

    const parsedCampaigns = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(
        campaign.amountCollect.toString()
      ),
      image: campaign.image,
      pId: i,
    }));

    console.log(parsedCampaigns);
    return parsedCampaigns;
  };

  return (
    <StateContext.Provider
      value={{
        getCampaigns,
        address,
        contract,
        connect,
        createCompaign: publishCampaign,
        getUserCampaigns,
        donate,
        getDonations,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
