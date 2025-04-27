import React from 'react';
import { motion } from 'framer-motion';
import Post from './Post';

const AnimatedPost = ({ post }) => {
  const postVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={postVariants}
      className="animated-post-wrapper"
    >
      <Post post={post} />
    </motion.div>
  );
};

export default AnimatedPost;