"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import { Search, UserCog, Mail, Shield, User as UserIcon, Loader2, XCircle } from "lucide-react";

import { useToast } from "@/components/ui/Toast";
import CustomSelect from "@/components/ui/CustomSelect";



interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  avatar: string;
  level: number;
  xp: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { showToast } = useToast();

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/admin/users");
      setUsers(data.users);
    } catch (err) {
      console.error("Failed to fetch users", err);
      showToast("Failed to fetch users.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await api.patch(`/admin/users/${userId}/role`, { role: newRole });
      showToast(`User role updated to ${newRole}`, "success");
      fetchUsers(); // Refresh list
    } catch (err) {
      console.error("Failed to update role", err);
      showToast("Failed to update user role.", "error");
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to purge this student from the Nexus?")) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      showToast("Student purged successfully", "success");
      fetchUsers();
    } catch (err) {
      console.error("Failed to delete user", err);
      showToast("Failed to purge student.", "error");
    }
  };


  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter">Student Registry</h1>
          <p className="text-zinc-500 mt-1">Manage user roles and permissions across the platform.</p>
        </div>
        
        <div className="relative w-full md:w-80 group">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
           <input 
            type="text" 
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/5 text-white focus:border-indigo-500 outline-none transition-all text-xs font-bold"
           />
        </div>
      </header>

      <div className="grid gap-4">
         {filteredUsers.map((user, i) => (
           <motion.article
            key={user._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group flex flex-col md:flex-row md:items-center justify-between p-6 rounded-[2rem] border border-white/5 bg-white/5 hover:border-white/10 transition-all gap-6"
           >
             <div className="flex items-center gap-4">
                <img src={user.avatar} alt={user.username} className="h-14 w-14 rounded-2xl border border-white/10 object-cover" />
                <div>
                   <h3 className="text-white font-bold text-lg flex items-center gap-2">
                     {user.name}
                     {user.role === "admin" && <Shield className="w-4 h-4 text-indigo-400" />}
                   </h3>
                   <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                      <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest flex items-center gap-1">
                        <UserIcon className="w-3 h-3" /> @{user.username}
                      </p>
                      <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {user.email}
                      </p>
                   </div>
                </div>
             </div>

             <div className="flex flex-wrap items-center gap-4">
                <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-center">
                   <p className="text-[10px] text-zinc-600 font-black uppercase tracking-tighter">Level {user.level}</p>
                   <p className="text-xs font-black text-white">{user.xp} XP</p>
                </div>

                <CustomSelect 
                  value={user.role}
                  onChange={(val) => handleRoleChange(user._id, val)}
                  options={[
                    { value: "student", label: "Student" },
                    { value: "moderator", label: "Moderator" },
                    { value: "admin", label: "Admin" }
                  ]}
                />


                <button 
                  onClick={() => handleDelete(user._id)}
                  className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/10"
                >
                   <XCircle className="w-5 h-5" />
                </button>

             </div>
           </motion.article>
         ))}
      </div>
    </div>
  );
}
