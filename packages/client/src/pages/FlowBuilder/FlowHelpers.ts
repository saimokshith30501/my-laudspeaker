import { ApiConfig } from "../../constants";
import ApiService from "../../services/api.service";

export const getCampaigns = async (id: string) => {
  return ApiService.get({
    url: `${ApiConfig.campaigns}/${id}`,
    options: {
      jsonServer: true,
    },
  });
};

export const getAudienceDetails = async (id: string) => {
  return ApiService.get({
    url: `${ApiConfig.audiences}/${id}`,
    //options: {
    //  jsonServer: true,
    //},
  });
};

export const getFlow = async (id: string, needStats = false) => {
  return ApiService.get({
    url: `${ApiConfig.flow}/${id}?needsStats=${needStats}`,
  });
};
