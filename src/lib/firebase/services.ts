import {
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  setDoc,
  startAfter,
  WhereFilterOp,
  where,
  updateDoc,
} from "firebase/firestore";
import app from "./init";
import { v4 as uuidv4 } from "uuid";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

export const firestore = getFirestore(app);
const storage = getStorage(app);

export async function retrieveData(collectionName: string) {
  const snapshot = await getDocs(collection(firestore, collectionName));

  const data = snapshot.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
    };
  });

  return data;
}

export async function detailData(
  collectionName: string,
  id: string,
  callback: Function
) {
  const snapshot = await getDoc(doc(firestore, collectionName, id));

  if (snapshot.exists()) {
    const data = {
      id: snapshot.id,
      ...snapshot.data(),
    };
    callback({ status: true, data });
  } else {
    callback({ status: false, data: {} });
  }
}

export async function retrieveDataDetail(collectionName: string, id: string) {
  const docDetail = await getDoc(doc(firestore, collectionName, id));
  if (docDetail.exists()) {
    return {
      id: docDetail.id,
      ...docDetail.data(),
    };
  } else {
    return null;
  }
}

export async function retrieveDataByField(
  collectionName: string,
  filter: any[]
) {
  const q = query(collection(firestore, collectionName), ...filter);
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return data;
}

export async function retrievePaginationData(
  collectionName: string,
  filter: any,
  limitData: number
) {
  const colRef = collection(firestore, collectionName);
  const q = query(colRef, ...filter, limit(limitData));
  const count = query(colRef, ...filter);
  const snapshotCount = await getCountFromServer(count);
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  const totalCount = snapshotCount.data().count - snapshot.size;
  const total = snapshotCount.data().count;
  return { data, total, totalCount };
}

export async function setData(
  collectionName: string,
  data: any,
  callback: Function,
  id?: string
) {
  const dataId = id ? id : uuidv4();
  await setDoc(doc(firestore, collectionName, dataId), data)
    .then(() => callback(true))
    .catch(() => callback(false));
}

export async function deleteData(
  collectionName: string,
  id: string,
  callback: Function
) {
  await deleteDoc(doc(firestore, collectionName, id))
    .then(() => callback(true))
    .catch(() => callback(false));
}

export async function sortedData(
  collectionName: string,
  sortedField: string,
  sortMethod: string
) {
  const sorting = sortMethod === "asc" ? "asc" : "desc";
  const collectionRef = collection(firestore, collectionName);
  const q = query(collectionRef, orderBy(sortedField));
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return data;
}

export async function searchAndPaginationData(
  querySearch: string,
  field: string,
  collectionName: string,
  loadMore: boolean,
  limitData: number,
  methodSearcher: WhereFilterOp,
  start: any[]
) {
  const pagination = loadMore ? [startAfter(...start)] : [];
  const collectionRef = collection(firestore, collectionName);
  const count = query(
    collectionRef,
    orderBy(field),
    where(field, methodSearcher, querySearch),
    where(field, "<=", querySearch + "\uf8ff"),
    ...pagination
  );
  const q = query(
    collectionRef,
    orderBy(field),
    where(field, methodSearcher, querySearch),
    where(field, "<=", querySearch + "\uf8ff"),
    ...pagination,
    limit(limitData)
  );
  const snapshot = await getDocs(q);
  const snapshotCount = await getCountFromServer(count);
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  const totalCount = snapshotCount.data().count - snapshot.size;
  return { data, totalCount };
}

export function uploadFile(
  file: File,
  dir: string,
  setUrl: React.Dispatch<React.SetStateAction<string[]>>,
  setProgress: React.Dispatch<React.SetStateAction<number>>
) {
  if (file.size < 1048576) {
    const storageRef = ref(storage, `images/${dir}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setProgress(0);
          setUrl((prev) => [downloadURL, ...prev]);
        });
      }
    );
  } else {
    return false;
  }
}

export async function updateData(
  collectionName: string,
  id: string,
  data: any,
  callback: Function
) {
  await updateDoc(doc(firestore, collectionName, id), data)
    .then(() => callback(true))
    .catch(() => callback(false));
}
