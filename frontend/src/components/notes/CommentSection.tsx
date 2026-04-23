"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, Heart, Trash2, Reply, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import { useToast } from "@/components/ui/Toast";
import Link from "next/link";
import Image from "next/image";


interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
    username: string;
    avatar: string;
  };
  likes: string[];
  createdAt: string;
  parentComment?: string;
}


export default function CommentSection({ noteId }: { noteId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [replies, setReplies] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState("");
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const { user, isAuthenticated } = useAuthStore();
  const { showToast } = useToast();

  const fetchComments = useCallback(async () => {
    try {
      const { data } = await api.get(`/comments/note/${noteId}`);
      setComments(data.comments);
      setReplies(data.replies);
    } catch (err) {
      console.error("Failed to fetch comments", err);
    } finally {
      setLoading(false);
    }
  }, [noteId]);

  useEffect(() => {
    if (noteId) fetchComments();
  }, [noteId, fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast("Please log in to share your thoughts.", "error");
      return;
    }
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      const { data } = await api.post("/comments", {
        noteId,
        content,
        parentCommentId: replyTo?._id || null,
      });

      if (replyTo) {
        setReplies([data.comment, ...replies]);
        setReplyTo(null);
      } else {
        setComments([data.comment, ...comments]);
      }
      setContent("");
      showToast("Comment deployed to the vault.", "success");
    } catch (err) {
      showToast("Failed to transmit comment.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (commentId: string) => {
    if (!isAuthenticated) return;
    try {
      const { data } = await api.post(`/comments/${commentId}/like`);
      const updateList = (list: Comment[]) => 
        list.map(c => c._id === commentId 
          ? { ...c, likes: data.liked ? [...c.likes, user!._id] : c.likes.filter(id => id !== user!._id) } 
          : c
        );
      setComments(updateList(comments));
      setReplies(updateList(replies));
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Are you sure you want to remove this thought?")) return;
    try {
      await api.delete(`/comments/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
      setReplies(replies.filter(c => c._id !== commentId));
      showToast("Comment retracted.", "success");
    } catch (err) {
      showToast("Failed to delete comment.", "error");
    }
  };

  if (loading) return (
    <div className="py-10 flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Accessing Discussion Stream...</p>
    </div>
  );

  return (
    <div className="space-y-8 mt-20">
      <div className="flex items-center gap-3">
        <MessageSquare className="w-6 h-6 text-indigo-400" />
        <h2 className="text-2xl font-bold text-white tracking-tight">Academic Discussion</h2>
        <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black text-zinc-500">
          {comments.length + replies.length}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="relative group">
        <div className={`absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-indigo-500 via-cyan-500 to-indigo-500 opacity-20 blur transition-all group-focus-within:opacity-40 group-focus-within:blur-md`} />
        <div className="relative rounded-[1.8rem] border border-white/10 bg-zinc-950 p-2 overflow-hidden">
          {replyTo && (
            <div className="px-6 py-2 bg-indigo-500/10 border-b border-white/5 flex items-center justify-between">
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                <Reply className="w-3 h-3" />
                Replying to {replyTo.author.name}
              </p>
              <button type="button" onClick={() => setReplyTo(null)} className="text-[10px] font-black text-zinc-600 hover:text-white uppercase">Cancel</button>
            </div>
          )}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={isAuthenticated ? "Contribute to the discussion..." : "Authorize your account to comment..."}
            disabled={!isAuthenticated || submitting}
            className="w-full bg-transparent p-6 text-white text-sm outline-none resize-none h-32 placeholder:text-zinc-600"
          />
          <div className="flex items-center justify-between p-4 bg-white/[0.02]">
            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Nexus Chat Protocol v2.1</p>
            <button
              type="submit"
              disabled={!isAuthenticated || submitting || !content.trim()}
              className="px-6 py-3 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-50 transition-all active:scale-95 disabled:opacity-30"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Transmit
            </button>
          </div>
        </div>
      </form>

      <div className="space-y-6">
        <AnimatePresence initial={false}>
          {comments.map((comment) => (
            <CommentItem 
              key={comment._id} 
              comment={comment} 
              replies={replies.filter(r => r.parentComment === comment._id)}
              onLike={handleLike}
              onDelete={handleDelete}
              onReply={setReplyTo}
              currentUser={user}
            />
          ))}
        </AnimatePresence>
        
        {comments.length === 0 && (
          <div className="py-20 text-center rounded-[2.5rem] border border-dashed border-white/5">
             <p className="text-zinc-600 font-bold uppercase tracking-widest text-sm">No thoughts shared yet in this segment.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CommentItem({ 
  comment, 
  replies, 
  onLike, 
  onDelete, 
  onReply, 
  currentUser 
}: { 
  comment: Comment; 
  replies: Comment[];
  onLike: (id: string) => void;
  onDelete: (id: string) => void;
  onReply: (c: Comment) => void;
  currentUser: any;
}) {
  const isLiked = currentUser && comment.likes.includes(currentUser._id);
  const isAuthor = currentUser && comment.author._id === currentUser._id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-4"
    >
      <div className="rounded-[2rem] border border-white/5 bg-white/[0.03] p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Link href={`/profile/${comment.author.username}`}>
              <Image 
                src={comment.author.avatar} 
                alt={comment.author.name} 
                width={40}
                height={40}
                className="h-10 w-10 rounded-xl border border-white/10 hover:scale-105 transition-transform" 
                unoptimized
              />
            </Link>
            <div>
              <Link href={`/profile/${comment.author.username}`} className="text-sm font-bold text-white hover:text-indigo-400 transition-colors">
                {comment.author.name}
              </Link>
              <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">
                {new Date(comment.createdAt).toLocaleDateString()} at {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {isAuthor && (
              <button onClick={() => onDelete(comment._id)} className="p-2 text-zinc-600 hover:text-red-400 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        
        <p className="text-zinc-300 text-sm leading-relaxed mb-6">{comment.content}</p>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => onLike(comment._id)}
            className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${isLiked ? 'text-rose-500' : 'text-zinc-500 hover:text-white'}`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            {comment.likes.length} Appreciations
          </button>
          <button 
            onClick={() => onReply(comment)}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-indigo-400 transition-colors"
          >
            <Reply className="w-4 h-4" />
            Reply
          </button>
        </div>
      </div>

      {replies.length > 0 && (
        <div className="ml-12 space-y-4 border-l border-white/5 pl-8">
           {replies.map(reply => (
             <CommentItem 
               key={reply._id} 
               comment={reply} 
               replies={[]} 
               onLike={onLike} 
               onDelete={onDelete} 
               onReply={onReply} 
               currentUser={currentUser} 
             />
           ))}
        </div>
      )}
    </motion.div>
  );
}
