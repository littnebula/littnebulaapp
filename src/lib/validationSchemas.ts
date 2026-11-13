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
  owner: Yup.string().required(),
  creatorId: Yup.number().required(),
});
