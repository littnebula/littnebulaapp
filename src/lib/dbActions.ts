'use server';

import { Condition } from '@prisma/client';
import { Stuff, VisibilityType, Prisma } from '@prisma/client';
import { hash } from 'bcrypt';
import { redirect } from 'next/navigation';
import { prisma } from './prisma';
import { generateWordCloudData, WCGenData  } from './WordCloudActions';

/**
 * Adds a new stuff to the database.
 * @param stuff, an object with the following properties: name, quantity, owner, condition.
 */
export async function addStuff(stuff: { name: string; quantity: number; owner: string; condition: string }) {
  console.log(`addStuff data: ${JSON.stringify(stuff, null, 2)}`);
  let condition: Condition = 'good';
  if (stuff.condition === 'poor') {
    condition = 'poor';
  } else if (stuff.condition === 'excellent') {
    condition = 'excellent';
  } else {
    condition = 'fair';
  }
  await prisma.stuff.create({
    data: {
      name: stuff.name,
      quantity: stuff.quantity,
      owner: stuff.owner,
      condition,
    },
  });
  // After adding, redirect to the list page
  redirect('/list');
}

/**
 * Edits an existing stuff in the database.
 * @param stuff, an object with the following properties: id, name, quantity, owner, condition.
 */
export async function editStuff(stuff: Stuff) {
  // console.log(`editStuff data: ${JSON.stringify(stuff, null, 2)}`);
  await prisma.stuff.update({
    where: { id: stuff.id },
    data: {
      name: stuff.name,
      quantity: stuff.quantity,
      owner: stuff.owner,
      condition: stuff.condition,
    },
  });
  // After updating, redirect to the list page
  redirect('/list');
}

/**
 * Deletes an existing stuff from the database.
 * @param id, the id of the stuff to delete.
 */
export async function deleteStuff(id: number) {
  // console.log(`deleteStuff id: ${id}`);
  await prisma.stuff.delete({
    where: { id },
  });
  // After deleting, redirect to the list page
  redirect('/list');
}

/**
 * Creates a new user in the database.
 * @param credentials, an object with the following properties: email, password.
 */
export async function createUser(credentials: { email: string; password: string }) {
  // console.log(`createUser data: ${JSON.stringify(credentials, null, 2)}`);
  const password = await hash(credentials.password, 10);
  await prisma.user.create({
    data: {
      email: credentials.email,
      password,
    },
  });
}

/**
 * Changes the password of an existing user in the database.
 * @param credentials, an object with the following properties: email, password.
 */
export async function changePassword(credentials: { email: string; password: string }) {
  // console.log(`changePassword data: ${JSON.stringify(credentials, null, 2)}`);
  const password = await hash(credentials.password, 10);
  await prisma.user.update({
    where: { email: credentials.email },
    data: {
      password,
    },
  });
}

export async function addNewWordCloud(wc: { 
  sourceText: string; 
  bibliography: string;
  language: string;
  title: string;
  description: string;
  tags: string;
  visibility: string;
  owner: string;
  creatorId: number;
  }) {
  // console.log(`new cloud data: ${JSON.stringify(wc, null, 2)}`);
  const wordCloudGenResult: WCGenData = generateWordCloudData(wc.sourceText, wc.language)
  // console.log(wordCloudGenResult);
  const wordsToBeAdded: Prisma.WordCreateWithoutWordcloudInput[] = []
  wordCloudGenResult.wordcloud.forEach((word) => {
    wordsToBeAdded.push(
      { text: word.text, value: word.value }
    )
  })
  let vis: VisibilityType = 'PRIVATE';
  if (wc.visibility === 'RESTRICTED') {
    vis = 'RESTRICTED';
  } else if (wc.visibility === 'PUBLIC') {
    vis = 'PUBLIC';
  }

  const wcdata = {
    title: wc.title,
    description: wc.description,
    language: wc.language,
    sourceTotal: wordCloudGenResult.totalwords,
    wordData: {
      create: wordsToBeAdded
    },
    displayCount: 10,
    bibliography: wc.bibliography,
    tags: wc.tags.split(" ",).filter((str) => str.trim().length > 0),
    visibility: vis,
    owner: wc.owner,
    creatorId: wc.creatorId,
  }
  console.log(wcdata);
  await prisma.wordCloud.create({
    data: wcdata
  });
}

export async function editWordCloud(wc: { 
  id: number;
  bibliography: string;
  language: string;
  title: string;
  description: string;
  displayCount: number;
  tags: string;
  editors?: string | undefined;
  visibility: string;
  owner: string;
  creatorId: number;
  }) {
  console.log(`given cloud data: ${JSON.stringify(wc, null, 2)}`);
}
