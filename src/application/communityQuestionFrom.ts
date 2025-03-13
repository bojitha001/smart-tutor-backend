import CommunityQuestionForm from "../infrastructure/schemas/communityQuestionFrom";

export const getAllCommunityQuestionForm = async (req, res) => {

    const jobs = await CommunityQuestionForm.find(); // call the dtabse and find the data that get shaped as Job(model)
    // throw new Error("");
    return res.status(200).json(jobs);
  
}

export const createCommunityQuestionForm = async (req, res) => {
  const communityQuestionForm = req.body;
  const createCommunityQuestionForm = await CommunityQuestionForm.create(
    communityQuestionForm
  );
  return res.status(201).send();
};

export const getCommunityQuestionFormById = async (req, res) => {
  const {id} = req.params;
  const commmunityQuestionForm = await CommunityQuestionForm.findById(id);
  if (commmunityQuestionForm === null) {
    return res.status(404).send();
  }
  return res.status(200).json(commmunityQuestionForm);
}

export const getCommunityQuestionForm = async (req, res) => {
  // try {
  const { communityId } = req.query; //const jobId = req.query.jobId;
  console.log(communityId);
  if (communityId) {
    const communityQuestionForm = await CommunityQuestionForm.find({
      community: communityId,
    }); // find the same id that in job filed of the JobApplication and the req.query(jobId) in this
    return res.status(200).json(communityQuestionForm);
  }
  const communityQuestionForms = await CommunityQuestionForm.find()
    .populate("community")
    .exec();
  return res.status(200).json(communityQuestionForms);
  // } catch (error) {

  // }
};
