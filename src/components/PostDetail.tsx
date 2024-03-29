import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PostProps } from "./PostList";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import { toast } from "react-toastify";
import Comments from "./Comments";

export default function PostDetail() {
  const [post, setPost] = useState<PostProps | null>(null);
  const params = useParams();
  const navigate = useNavigate();

  const getPost = async (id: string) => {
    const docRef = doc(db, "posts", id);
    const docSnap = await getDoc(docRef);
    setPost({ id: docSnap.id, ...(docSnap.data() as PostProps) });
  };

  const handleDelete = async () => {
    const confirm = window.confirm("해당 게시글을 삭제하시겠습니까?");

    if (confirm && post && post.id) {
      await deleteDoc(doc(db, "posts", post.id));
      toast.success("게시글이 성공적으로 지워졌습니다");
      navigate("/");
    }
  };

  useEffect(() => {
    if (params?.id) {
      getPost(params?.id);
    }
  }, []);

  return (
    <>
      <div className="post__detail">
        {post ? (
          <>
            <div className="post__box">
              <div className="post__title">{post.title}</div>
              <div className="post__profile-box">
                <div className="post__profile"></div>
                <div className="post__author-name">{post.email}</div>
                <div className="post__date">{post.createAt}</div>
              </div>
              <div className="post__utils-box">
                <div className="post__update">
                  <Link to={`/posts/edit/${post.id}`}>수정</Link>
                </div>
                <div className="post__delete" onClick={handleDelete}>
                  삭제
                </div>
              </div>
              <div className="post__text post__text--pre-wrap">
                {post.content}
              </div>
            </div>
            <Comments post={post} getPost={getPost} />
          </>
        ) : (
          "로딩중"
        )}
      </div>
    </>
  );
}
