const aiService = require("../../services/aiService");

const promptWithGemini = async ({ question }) => {
  const response = await aiService.prompt(question);
  return response;
};

module.exports = promptWithGemini;
