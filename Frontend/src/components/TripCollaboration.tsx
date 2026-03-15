import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Users, UserPlus, MessageSquare, Send, X, Loader2, Mail, ShieldCheck, MailCheck } from "lucide-react";

interface Member {
  _id: string;
  email: string;
  role: "owner" | "member";
  fullName: string;
  hasJoined: boolean;
}

interface Suggestion {
  _id: string;
  userId: {
    fullName: string;
    email: string;
  };
  text: string;
  category: string;
  createdAt: string;
}

interface TripCollaborationProps {
  tripId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const TripCollaboration: React.FC<TripCollaborationProps> = ({ tripId, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"members" | "suggestions">("members");
  const [members, setMembers] = useState<Member[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [suggestionText, setSuggestionText] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

  const fetchMembers = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/trips/${tripId}/members`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setMembers(res.data);
    } catch (err) {
      console.error("Error fetching members:", err);
    }
  }, [tripId]);

  const fetchSuggestions = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/trips/${tripId}/suggestions`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setSuggestions(res.data);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    }
  }, [tripId]);

  useEffect(() => {
    if (isOpen && tripId) {
      setLoading(true);
      Promise.all([fetchMembers(), fetchSuggestions()]).finally(() => setLoading(false));
    }
  }, [isOpen, tripId, fetchMembers, fetchSuggestions]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    setActionLoading(true);
    setMessage(null);
    try {
      await axios.post(`http://localhost:8000/api/trips/${tripId}/invite`, { email: emailInput }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setMessage({ type: "success", text: `Invitation sent to ${emailInput}!` });
      setEmailInput("");
      fetchMembers();
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to invite email" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddSuggestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestionText) return;
    setActionLoading(true);
    try {
      await axios.post(`http://localhost:8000/api/trips/${tripId}/suggestions`, { text: suggestionText }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setSuggestionText("");
      fetchSuggestions();
    } catch (err) {
      console.error("Error adding suggestion:", err);
    } finally {
      setActionLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-white dark:bg-zinc-950 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black italic tracking-tighter flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-500" /> COLLABORATION
            </h2>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">Invite any email address</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex border-b border-zinc-200 dark:border-zinc-800">
          <button 
            onClick={() => setActiveTab("members")}
            className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all ${activeTab === "members" ? "border-b-2 border-blue-500 text-blue-500 bg-blue-500/5" : "text-zinc-400"}`}
          >
            Team
          </button>
          <button 
            onClick={() => setActiveTab("suggestions")}
            className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all ${activeTab === "suggestions" ? "border-b-2 border-blue-500 text-blue-500 bg-blue-500/5" : "text-zinc-400"}`}
          >
            Suggestions
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center opacity-50">
              <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
              <p className="font-black italic text-zinc-400 text-xs">LOADING DATA...</p>
            </div>
          ) : activeTab === "members" ? (
            <div className="space-y-6">
              <form onSubmit={handleInvite} className="space-y-3">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Invite by Email</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input 
                      type="email" 
                      placeholder="e.g. 820msnl@gmail.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 ring-blue-500 outline-none transition-all font-medium"
                    />
                  </div>
                  <button 
                    disabled={actionLoading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-3 rounded-xl transition-all shadow-lg text-center flex items-center justify-center min-w-[44px]"
                  >
                    {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
                  </button>
                </div>
                {message && (
                  <p className={`text-[10px] font-bold ${message.type === "success" ? "text-emerald-500" : "text-red-500"} italic`}>
                    {message.text}
                  </p>
                )}
              </form>

              <div className="space-y-3">
                <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800 pb-2 flex items-center gap-2">
                  MEMBERS ({members.length})
                </h3>
                {members.map((member) => (
                  <div key={member._id} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs ${member.hasJoined ? "bg-blue-600/10 text-blue-500" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500"}`}>
                        {member.fullName[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-xs flex items-center gap-1.5">
                          {member.fullName}
                          {!member.hasJoined && <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-500 text-[8px] font-black uppercase rounded">Pending</span>}
                        </p>
                        <p className="text-[10px] text-zinc-400">{member.email}</p>
                      </div>
                    </div>
                    {member.role === "owner" ? (
                      <ShieldCheck className="w-4 h-4 text-blue-500" />
                    ) : (
                      <MailCheck className={`w-4 h-4 ${member.hasJoined ? "text-blue-500" : "text-zinc-300"}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <form onSubmit={handleAddSuggestion} className="space-y-3">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Share with Group</label>
                <textarea 
                  placeholder="Ask a question or share a destination idea..."
                  value={suggestionText}
                  onChange={(e) => setSuggestionText(e.target.value)}
                  className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 ring-blue-500 outline-none transition-all font-medium h-24 resize-none"
                />
                <button 
                  disabled={actionLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black py-3 rounded-2xl transition-all shadow-lg flex justify-center items-center gap-2 text-xs uppercase tracking-widest"
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} SEND TO TEAM
                </button>
              </form>

              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800 pb-2">CHATS / SUGGESTIONS</h3>
                {suggestions.length === 0 ? (
                  <div className="p-8 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl opacity-30">
                    <MessageSquare className="w-10 h-10 mx-auto mb-2" />
                    <p className="font-black italic text-[10px]">NO MESSAGES YET</p>
                  </div>
                ) : (
                  suggestions.map((s) => (
                    <div key={s._id} className="p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-100 dark:border-zinc-800 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-blue-500 uppercase">{s.userId.fullName}</span>
                        <span className="text-[8px] font-bold text-zinc-300 ml-auto">{new Date(s.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm font-medium leading-relaxed italic opacity-80">"{s.text}"</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};