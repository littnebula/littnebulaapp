'use server';
import { Condition } from '@prisma/client';
import { Stuff, VisibilityType, Prisma } from '@prisma/client';
import { hash } from 'bcrypt';
import { redirect } from 'next/navigation';
import { prisma } from './prisma';
import { generateWordCloudData, WCGenData  } from './WordCloudActions';
import { revalidatePath } from 'next/cache';

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
  displayColorHue: number;
  displayColorSat: number;
  displayColorLit: number;
  displayIcon: string;
  owner: string;
  creatorId: number;
  }) {
  console.log(`new cloud data: ${JSON.stringify(wc, null, 2)}`);
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
    tags: wc.tags.split(" ").filter((str) => str.trim().length > 0),
    visibility: vis,
    displayColorHue: wc.displayColorHue,
    displayColorSat: wc.displayColorSat,
    displayColorLit: wc.displayColorLit,
    displayIcon: wc.displayIcon,
    owner: wc.owner,
    creatorId: wc.creatorId,
  }
  // console.log(wcdata);
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
  displayColorHue: number;
  displayColorSat: number;
  displayColorLit: number;
  displayIcon: string;
  owner: string;
  creatorId: number;
  }) {
  // console.log(`given cloud data: ${JSON.stringify(wc, null, 2)}`);
  let vis: VisibilityType = 'PRIVATE';
  if (wc.visibility === 'RESTRICTED') {
    vis = 'RESTRICTED';
  } else if (wc.visibility === 'PUBLIC') {
    vis = 'PUBLIC';
  }

  await prisma.wordCloud.update({
    where: { id: wc.id },
    data: {
      title: wc.title,
      description: wc.description,
      bibliography: wc.bibliography,
      visibility: vis,
      displayCount: wc.displayCount,
      language: wc.language,

      displayColorHue: wc.displayColorHue,
      displayColorSat: wc.displayColorSat,
      displayColorLit: wc.displayColorLit,
      displayIcon: wc.displayIcon,

      tags: wc.tags.split(" ").filter((str) => str.trim().length > 0),
      editors: wc.editors?.split(" ").filter((str) => str.trim().length > 0),

      owner: wc.owner,
      creatorId: wc.creatorId
    },
  });
}

export async function incrementWordCloudViews(id: number) {
  await prisma.wordCloud.update({
    where: { id },
    data: {
      views: { increment: 1 }
    },
  });
}

export async function onIgnoreText({words, wcid, path}: {words: string, wcid: number, path?: string}) {
  const wordset: string[] = words.toUpperCase().split(' ').filter((str) => str.trim().length > 0);
  await prisma.word.updateMany({
    where: {
      wordcloudId: wcid,
      text: { in: wordset }, 
      value: { gt: 0},
      },
    data: {
      value: { multiply: -1.0 }
    },
  });
  console.log(path)
  if (path !== undefined) {
    revalidatePath(path);
  }
}

export async function onIgnoreValue({threshold, wcid, path}: {threshold: number, wcid: number, path?: string}) {
  await prisma.word.updateMany({
    where: {
      wordcloudId: wcid,
      value: { gt: 0, lt: threshold},
      },
    data: {
      value: { multiply: -1.0 }
    },
  });
  if (path) {
    revalidatePath(path);
  }
}

export async function reEnableText({words, wcid, path}: {words: string, wcid: number, path?: string}) {
  const wordset: string[] = words.toUpperCase().split(' ').filter((str) => str.trim().length > 0);
  await prisma.word.updateMany({
    where: {
      wordcloudId: wcid,
      text: { in: wordset }, 
      value: { lt: 0},
      },
    data: {
      value: { multiply: -1.0 }
    },
  });
  if (path) {
    revalidatePath(path);
  }
}

export async function reEnableValue({threshold, wcid, path}: {threshold: number, wcid: number, path?: string}) {
  await prisma.word.updateMany({
    where: {
      wordcloudId: wcid,
      value: { lt: threshold },
      },
    data: {
      value: { multiply: -1.0 }
    },
  });
  if (path) {
    revalidatePath(path);
  }
}

export async function deleteText({words, wcid, path}: {words: string, wcid: number, path?: string}) {
  const wordset: string[] = words.toUpperCase().split(' ').filter((str) => str.trim().length > 0);
  await prisma.word.deleteMany({
    where: {
      wordcloudId: wcid,
      text: { in: wordset },
    }
  });
  if (path) {
    revalidatePath(path);
  }
}

export async function deleteLowValue({threshold, wcid, path}: {threshold: number, wcid: number, path?: string}) {
  await prisma.word.deleteMany({
      where: {
      wordcloudId: wcid,
      value: {lt: threshold},
    }
  });
  if (path) {
    revalidatePath(path);
  }
}

export async function increaseWord(id: number, add: number) {
  await prisma.word.update({
    where: { id },
    data: {
      value: { increment: add }
    },
  });
}

export async function annotateWord(id: number, annotation: string) {
  await prisma.word.update({
    where: { id },
    data: { annotation: annotation },
  });
}

export async function deleteWordCloud(id: number) {
  // console.log(`deleteWordCloud id: ${id}`);
  await prisma.wordCloud.delete({
    where: { id },
  });
  // After deleting, redirect to the landing page
  redirect('/myprofile');
}

export async function deleteWord(id: number) {
  await prisma.word.delete({
    where: { id },
  });
}

export async function addComment({
  comment, 
  wordcloudId, 
  collectionId,
  owner
  }: { 
    comment: string, 
    wordcloudId?: number, 
    collectionId?: number,
    owner: string 
  }) {
  await prisma.comment.create({
    data: {
      comment,
      wordcloudId,
      collectionId,
      owner,
    },
  });

}

export async function toggleWCBookmark(userId: number, wordcloudId: number) {
  const existingBookmark = await prisma.bookmarkedWC.findUnique({
    where: {
      userId_wordcloudId: {
        userId,
        wordcloudId,
      },
    },
  });

  if (existingBookmark) {
    await prisma.bookmarkedWC.delete({
      where: {
        userId_wordcloudId: {
          userId,
          wordcloudId,
        },
      },
    });
    await prisma.wordCloud.update({
      where: { id: wordcloudId },
      data: {
        bookmarks: { decrement: 1 },
      },
    });
  } else {
    await prisma.bookmarkedWC.create({
      data: {
        userId,
        wordcloudId,
      },
    });
    await prisma.wordCloud.update({
      where: { id: wordcloudId },
      data: {
        bookmarks: { increment: 1 },
      },
    });
  }
}

export async function createCollection(coll: {
  title: string;
  description: string;
  visibility: string;
  wordcloudIds: number[];
  owner: string;
  userId: number;
  }) {
  // console.log(`given cloud data: ${JSON.stringify(coll, null, 2)}`);
  let vis: VisibilityType = 'PRIVATE';
  if (coll.visibility === 'RESTRICTED') {
    vis = 'RESTRICTED';
  } else if (coll.visibility === 'PUBLIC') {
    vis = 'PUBLIC';
  }
  
  await prisma.collection.create({
    data: {
      title: coll.title,
      description: coll.description,
      visibility: vis,
      dataset: {
        create: coll.wordcloudIds.map((id) => ({
          wordcloud: {
            connect: { id: id }
          }
        }))
      },
      owner: coll.owner,
      userId: coll.userId,
    }
  });
}


export async function revalidatepage(pagepath: string) {
  revalidatePath(pagepath);
}
