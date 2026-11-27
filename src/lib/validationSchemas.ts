import * as Yup from 'yup';

export const AddStuffSchema = Yup.object({
  name: Yup.string().required(),
  quantity: Yup.number().positive().required(),
  condition: Yup.string().oneOf(['excellent', 'good', 'fair', 'poor']).required(),
  owner: Yup.string().required(),
});

export const EditStuffSchema = Yup.object({
  id: Yup.number().required(),
  name: Yup.string().required(),
  quantity: Yup.number().positive().required(),
  condition: Yup.string().oneOf(['excellent', 'good', 'fair', 'poor']).required(),
  owner: Yup.string().required(),
});

export const GenerateWordCloudSchema = Yup.object({
  sourceText: Yup.string().required(),
  bibliography: Yup.string().required(),
  language: Yup.string().required(),
  title: Yup.string().required(),
  description: Yup.string().required(),
  tags: Yup.string().required(),
  visibility: Yup.string().oneOf(['PUBLIC', 'RESTRICTED', 'PRIVATE']).required(),
  displayColorHue: Yup.number().required(),
  displayColorSat: Yup.number().required(),
  displayColorLit: Yup.number().required(),
  displayIcon: Yup.string().required(),
  owner: Yup.string().required(),
  creatorId: Yup.number().required(),
});

export const ModifyWordCloudSchema = Yup.object({
  id: Yup.number().required(),
  bibliography: Yup.string().required(),
  language: Yup.string().required(),
  title: Yup.string().required(),
  description: Yup.string().required(),
  tags: Yup.string().required(),
  editors: Yup.string(),
  displayCount: Yup.number().required(),
  visibility: Yup.string().oneOf(['PUBLIC', 'RESTRICTED', 'PRIVATE']).required(),
  displayColorHue: Yup.number().required(),
  displayColorSat: Yup.number().required(),
  displayColorLit: Yup.number().required(),
  displayIcon: Yup.string().required(),
  owner: Yup.string().required(),
  creatorId: Yup.number().required(),
});

export const OperatingOnWordsbyText = Yup.object({
  wcid: Yup.number().required(),
  words: Yup.string().required(),
  pagepath: Yup.string()
})

export const OperatingOnWordsbyValue= Yup.object({
  wcid: Yup.number().required(),
  threshold: Yup.number().required(),
  pagepath: Yup.string()
})

export const AddCommentSchema = Yup.object({
  comment: Yup.string().required(),
  wordcloudId: Yup.number(),
  collectionId: Yup.number(),
  owner: Yup.string().required(),
})

export const CreateCollectionSchema = Yup.object({
  title: Yup.string().required(),
  description: Yup.string().required(),
  wordcloudIds: Yup.array()
  .of(Yup.number().integer("Must be a whole number").required())
  .min(1, "Select at least one word cloud") // Ensures the array isn't empty
  .required("Word cloud IDs are required"),
  visibility: Yup.string().oneOf(['PUBLIC', 'RESTRICTED', 'PRIVATE']).required(),
  owner: Yup.string().required(),
  userId: Yup.number().required(),
})
