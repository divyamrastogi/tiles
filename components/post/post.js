import Image from "next/image";
import { useCallback } from "react";
import styles from "./post.module.css";

export default function Post({
  post,
  layout = "responsive",
  onClick = () => {},
}) {
  const { filename, path, _id } = post;
  const onImageClick = useCallback(() => {
    onClick(post);
  }, [onClick, post]);
  return (
    <div className={styles.post} onClick={onImageClick}>
      {layout === "fill" ? (
        <Image src={`/${path}`} alt={filename} layout={layout} />
      ) : (
        <Image
          src={`/${path}`}
          alt={filename}
          width={300}
          height={300}
          layout={layout}
        />
      )}
    </div>
  );
}
