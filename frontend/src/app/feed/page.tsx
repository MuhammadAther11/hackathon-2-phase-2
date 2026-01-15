"use client";

import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Search,
} from "lucide-react";

interface Post {
  id: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
  };
  timestamp: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  liked: boolean;
}

// Mock data for posts
const MOCK_POSTS: Post[] = [
  {
    id: "1",
    author: {
      name: "Sarah Anderson",
      handle: "@sarahdesigns",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    },
    timestamp: "2 hours ago",
    content:
      "Just launched our new design system! Excited to share how it's transformed our workflow. Check out the detailed case study in our blog.",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop",
    likes: 342,
    comments: 28,
    shares: 15,
    liked: false,
  },
  {
    id: "2",
    author: {
      name: "Marcus Chen",
      handle: "@marcusdev",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    },
    timestamp: "4 hours ago",
    content:
      "Loving the new updates to React 19! The performance improvements are incredible. Already seeing 40% faster renders in our app.",
    likes: 856,
    comments: 92,
    shares: 124,
    liked: false,
  },
  {
    id: "3",
    author: {
      name: "Emma Wilson",
      handle: "@emmadevelops",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    },
    timestamp: "6 hours ago",
    content:
      "Tips for better TypeScript in React: 1. Use strict mode 2. Leverage generics 3. Type your props explicitly 4. Use discriminated unions 5. Avoid any at all costs!",
    likes: 523,
    comments: 67,
    shares: 89,
    liked: false,
  },
  {
    id: "4",
    author: {
      name: "David Kim",
      handle: "@davidkim_dev",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    },
    timestamp: "8 hours ago",
    content:
      "Building a scalable Next.js app? Remember to optimize your images, implement proper caching strategies, and use server components for data fetching. Your users will thank you!",
    likes: 612,
    comments: 43,
    shares: 67,
    liked: false,
  },
  {
    id: "5",
    author: {
      name: "Olivia Martinez",
      handle: "@oliviadesign",
      avatar: "https://images.unsplash.com/photo-1517746915202-e1a29e30b4e6?w=400&h=400&fit=crop",
    },
    timestamp: "10 hours ago",
    content:
      "Redesigned our dashboard today! The new minimalist approach is getting amazing feedback from users. Sometimes less really is more.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
    likes: 734,
    comments: 84,
    shares: 102,
    liked: false,
  },
];

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const handleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes:
                post.likes + (likedPosts.has(postId) ? -1 : 1),
              liked: !post.liked,
            }
          : post
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-1/2 -left-20 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 right-1/3 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <NavBar />

      <main className="py-8 relative z-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="mb-8 animate-fade-in-down">
            <div className="mb-6">
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                Your Feed
              </h1>
              <p className="mt-2 text-gray-600 text-lg">
                Stay connected with the latest updates from the community.
              </p>
            </div>

            {/* Search bar */}
            <div className="relative animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts, people, and topics..."
                className="w-full pl-10 pr-4 py-2 bg-white/60 backdrop-blur-md border border-white/20 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              />
            </div>
          </header>

          {/* Posts Feed */}
          <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white/60 backdrop-blur-md border border-white/20 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300 overflow-hidden group"
              >
                {/* Post Header */}
                <div className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                      {/* Avatar */}
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="h-12 w-12 rounded-full object-cover flex-shrink-0 ring-2 ring-indigo-200/50"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {post.author.name}
                          </h3>
                          <span className="text-gray-500 text-sm truncate">
                            {post.author.handle}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {post.timestamp}
                        </p>
                      </div>
                    </div>

                    {/* More options button */}
                    <button className="ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Post Content */}
                  <p className="text-gray-800 text-base leading-relaxed mb-4">
                    {post.content}
                  </p>

                  {/* Post Image */}
                  {post.image && (
                    <img
                      src={post.image}
                      alt="Post content"
                      className="w-full h-48 sm:h-64 object-cover rounded-xl mb-4 transition-transform duration-300 group-hover:scale-105"
                    />
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200/50 text-gray-600 text-sm">
                    {/* Like Button */}
                    <button
                      onClick={() => handleLike(post.id)}
                      className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg transition-all duration-200 group/btn hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      <Heart
                        className={`h-5 w-5 transition-all duration-200 ${
                          likedPosts.has(post.id)
                            ? "fill-red-500 text-red-500 scale-110"
                            : "text-gray-500 group-hover/btn:text-red-500"
                        }`}
                      />
                      <span
                        className={`transition-colors duration-200 ${
                          likedPosts.has(post.id)
                            ? "text-red-500 font-semibold"
                            : "group-hover/btn:text-red-500"
                        }`}
                      >
                        {post.likes}
                      </span>
                    </button>

                    {/* Comment Button */}
                    <button className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg transition-all duration-200 group/btn hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      <MessageCircle className="h-5 w-5 text-gray-500 group-hover/btn:text-blue-500 transition-colors duration-200" />
                      <span className="group-hover/btn:text-blue-500 transition-colors duration-200">
                        {post.comments}
                      </span>
                    </button>

                    {/* Share Button */}
                    <button className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg transition-all duration-200 group/btn hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                      <Share2 className="h-5 w-5 text-gray-500 group-hover/btn:text-green-500 transition-colors duration-200" />
                      <span className="group-hover/btn:text-green-500 transition-colors duration-200">
                        {post.shares}
                      </span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Load More Button */}
          <div className="mt-8 text-center animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              Load More Posts
            </button>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.6s ease-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
