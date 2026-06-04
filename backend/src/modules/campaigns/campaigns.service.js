const campaignsModel = require('./campaigns.model');
const broker = require('../../events/broker');

const createCampaign = async (
  title, description, associationId,
  location, date, maxParticipants
) => {
  const campaign = await campaignsModel.createCampaign(
    title, description, associationId,
    location, date, maxParticipants
  );

  await broker.publishEvent('campaign.created', {
    campaignId: campaign.id,
    title: campaign.title,
    associationId: campaign.association_id,
    location: campaign.location,
    date: campaign.date,
  });

  return campaign;
};

const getAllCampaigns = async () => {
  return await campaignsModel.getAllCampaigns();
};

const getCampaignById = async (id) => {
  return await campaignsModel.getCampaignById(id);
};

const joinCampaign = async (campaignId, citizenId) => {
  const result = await campaignsModel.joinCampaign(
    campaignId, citizenId
  );

  await broker.publishEvent('campaign.joined', {
    campaignId,
    citizenId,
  });

  return result;
};

const leaveCampaign = async (campaignId, citizenId) => {
  return await campaignsModel.leaveCampaign(
    campaignId, citizenId
  );
};

const getMyCampaigns = async (citizenId) => {
  return await campaignsModel.getMyCampaigns(citizenId);
};

module.exports = {
  createCampaign,
  getAllCampaigns,
  getCampaignById,
  joinCampaign,
  leaveCampaign,
  getMyCampaigns,
};