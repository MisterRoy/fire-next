import Link from "next/link";

function PostFeed({ posts, admin }) {
  console.log(posts);
  return posts
    ? posts.map((post) => (
        <PostItem post={post} admin={admin} key={post.slug} />
      ))
    : null;
}

function PostItem({ post, admin = false }) {
  // Naive mehod to calc word count and read time
  const wordCount = post?.content.trim().split(/\s+/g).length;
  const minutesToRead = (wordCount / 100 + 1).toFixed(0);

  return (
    <div className="card">
      <Link href={`/${post.username}`}>
        <a>
          <strong>By @{post.username}</strong>
        </a>
      </Link>

      <Link href={`/${post.username}/${post.slug}`}>
        <h2>
          <a>{post.title}</a>
        </h2>
      </Link>

      <footer>
        <span>
          {wordCount} words. {minutesToRead} min read
        </span>
        <span>❤️ {post.heartCount} Hearts</span>
      </footer>
    </div>
  );
}

export default PostFeed;
