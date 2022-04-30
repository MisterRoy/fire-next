import UserProfile from "../../components/UserProfile";
import PostFeed from "../../components/PostFeed";
import {
  firestore,
  getPosts,
  getUserWithUsername,
  postToJSON,
} from "../../lib/firebase";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  where,
  query,
} from "firebase/firestore";

// const getPosts = async (userDoc) => {
//   const postsQuery = query(
//     collection(firestore, `users/${userDoc.id}/posts`),
//     where("published", "==", true),
//     orderBy("createdAt", "desc"),
//     limit(5)
//   );
//   const posts = (await getDocs(postsQuery)).docs.map(postToJSON);
//   return posts;
// };

export async function getServerSideProps({ query }) {
  const { username } = query;
  const userDoc = await getUserWithUsername(username);

  // If no user, short circuit to 404 page
  if (!userDoc) {
    return {
      notFound: true,
    };
  }

  // JSON serializable data
  let user = null;
  let posts = null;

  if (userDoc) {
    user = userDoc.data();
    posts = await getPosts(userDoc);
    console.log("posts", posts);
  }

  return {
    props: { user, posts },
  };
}

export default function UserProfilePage({ user, posts }) {
  return (
    <main>
      <UserProfile user={user} posts={undefined} />
      <PostFeed posts={posts} admin={undefined} />
    </main>
  );
}
