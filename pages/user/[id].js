import Image from "next/image";
import Footer from "components/footer";
import { server } from "../../config";
import styles from "./user.module.css";
import { useCallback, useEffect, useRef, useState } from "react";

export default function User({
  user: { name, bio, profilePhotoPath, _id },
  posts = [],
}) {
  const [photoUrl, setPhoto] = useState(profilePhotoPath);
  const [userPosts, setUserPosts] = useState(posts);

  const myWidgetRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const uploadPhoto = useCallback((source) => {
    if (myWidgetRef.current === null) {
      myWidgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          uploadPreset: process.env.NEXT_PUBLIC_COULDINARY_PRESET,
        },
        async (error, result) => {
          if (!error && result && result.event === "success") {
            if (source === "profile") {
              const res = await fetch(`/api/user/profilephoto/${_id}`, {
                method: "PUT",
                body: JSON.stringify({ path: result.info.path }),
              });
              const { url } = await res.json();
              setPhoto(url);
            } else {
              const res = await fetch(`/api/user/posts/${_id}`, {
                method: "POST",
                body: JSON.stringify({ post: result.info }),
              });
              const uploadedPost = await res.json();
              setUserPosts([...userPosts, uploadedPost]);
            }
            console.log("Done! Here is the image info: ", result.info);
          }
        }
      );
    }
    myWidgetRef.current.open();
  });

  const onProfileUploadClick = useCallback(() => {
    uploadPhoto("profile");
  });

  return (
    <div className={styles.main}>
      <header>
        <div className={styles.profile}>
          {photoUrl ? (
            <div className={styles.photo} onClick={onProfileUploadClick}>
              <Image
                src={`/${photoUrl}`}
                alt={`${name}'s profile picture`}
                width={100}
                height={100}
              />
            </div>
          ) : (
            <button id="upload_widget" onClick={onProfileUploadClick}>
              Upload Profile Photo
            </button>
          )}

          <div className={styles.details}>
            <div className={styles.name}>{name}</div>
            <div className={styles.postsInfo}>
              {userPosts.length} post{userPosts.length > 1 ? "s" : ""}
            </div>
            <div className={styles.bio}>{bio}</div>
          </div>
          <div className={styles.photos}>
            <button className={styles.uploadPhoto} onClick={uploadPhoto}>
              Add Photos
            </button>
          </div>
        </div>
      </header>
      <div className={styles.posts}>
        {userPosts.map(({ _id, path, original_filename }) => (
          <Image
            key={_id}
            src={`/${path}`}
            alt={original_filename}
            height={300}
            width={300}
          />
        ))}
      </div>
      <Footer />
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const { id } = params;
  console.log("URL for deployment is: ", process.env.VERCEL_URL);
  const userResponse = await fetch(`${server}/api/user/${id}`);
  const user = await userResponse.json();
  const userPostsResponse = await fetch(`${server}/api/user/posts/${id}`);
  const posts = await userPostsResponse.json();
  return {
    props: { user, posts },
  };
}
