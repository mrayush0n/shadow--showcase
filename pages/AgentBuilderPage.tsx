
import React, { useState } from 'react';
import { Icon } from '../components/Icon';

interface AgentBuilderPageProps {
    onNavigate: (page: string) => void;
}

interface Agent {
    id: string;
    name: string;
    avatar: string;
    description: string;
    systemPrompt: string;
    personality: string;
    createdAt: Date;
}

interface ChatMessage {
    role: 'user' | 'agent';
    content: string;
}

export const AgentBuilderPage: React.FC<AgentBuilderPageProps> = ({ onNavigate }) => {
    const [view, setView] = useState<'library' | 'create' | 'chat'>('library');
    const [agents, setAgents] = useState<Agent[]>([
        { id: '1', name: 'Math Tutor', avatar: '🧮', description: 'Expert at explaining math concepts', systemPrompt: 'You are a friendly math tutor...', personality: 'Patient and encouraging', createdAt: new Date() },
        { id: '2', name: 'Coding Buddy', avatar: '👨‍💻', description: 'Helps debug and write code', systemPrompt: 'You are an expert programmer...', personality: 'Helpful and technical', createdAt: new Date() },
        { id: '3', name: 'Creative Writer', avatar: '✍️', description: 'Assists with creative writing', systemPrompt: 'You are a creative writing assistant...', personality: 'Imaginative and inspiring', createdAt: new Date() },
    ]);
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    // Create form state
    const [newAgent, setNewAgent] = useState({
        name: '',
        avatar: '🤖',
        description: '',
        systemPrompt: '',
        personality: 'helpful'
    });

    const avatarOptions = ['🤖', '🧮', '👨‍💻', '✍️', '🎨', '🔬', '📚', '💼', '🎮', '🌍', '🧠', '💡'];
    const personalityOptions = ['Helpful', 'Professional', 'Friendly', 'Technical', 'Creative', 'Patient', 'Enthusiastic'];

    const handleCreateAgent = () => {
        if (!newAgent.name.trim() || !newAgent.systemPrompt.trim()) return;
        const agent: Agent = {
            id: Date.now().toString(),
            ...newAgent,
            createdAt: new Date()
        };
        setAgents(prev => [...prev, agent]);
        setNewAgent({ name: '', avatar: '🤖', description: '', systemPrompt: '', personality: 'helpful' });
        setView('library');
    };

    const handleStartChat = (agent: Agent) => {
        setSelectedAgent(agent);
        setChatMessages([{
            role: 'agent',
            content: `Hi! I'm ${agent.name}. ${agent.description}. How can I help you today?`
        }]);
        setView('chat');
    };

    const handleSendMessage = () => {
        if (!chatInput.trim() || !selectedAgent) return;
        setChatMessages(prev => [...prev, { role: 'user', content: chatInput }]);
        setChatInput('');
        setIsTyping(true);

        setTimeout(() => {
            setChatMessages(prev => [...prev, {
                role: 'agent',
                content: `As ${selectedAgent.name}, I'd be happy to help with that! Based on my expertise, here's my response...`
            }]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50 dark:from-slate-950 dark:via-indigo-950/20 dark:to-slate-950 p-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                            <Icon name="smart_toy" className="text-white text-3xl" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Custom AI Agents</h1>
                            <p className="text-slate-500">Build and chat with personalized AI assistants</p>
                        </div>
                    </div>
                    {view !== 'library' && (
                        <button
                            onClick={() => setView('library')}
                            className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-indigo-500 transition-colors"
                        >
                            <Icon name="arrow_back" />
                            Back to Library
                        </button>
                    )}
                </div>

                {view === 'library' && (
                    <>
                        {/* Create Button */}
                        <button
                            onClick={() => setView('create')}
                            className="w-full mb-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                        >
                            <Icon name="add" className="text-2xl" />
                            Create New Agent
                        </button>

                        {/* Agent Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {agents.map(agent => (
                                <div
                                    key={agent.id}
                                    className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-5 hover:shadow-lg transition-all group"
                                >
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-3xl">
                                            {agent.avatar}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-slate-900 dark:text-white">{agent.name}</h3>
                                            <p className="text-sm text-slate-500">{agent.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="px-2 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs rounded-lg">
                                            {agent.personality}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleStartChat(agent)}
                                            className="flex-1 py-2 bg-indigo-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-indigo-600 transition-colors"
                                        >
                                            <Icon name="chat" /> Chat
                                        </button>
                                        <button className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:text-indigo-500 transition-colors">
                                            <Icon name="edit" />
                                        </button>
                                        <button className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:text-red-500 transition-colors">
                                            <Icon name="delete" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {view === 'create' && (
                    <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 md:p-8">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Create New Agent</h2>
                        <div className="space-y-6">
                            {/* Avatar Selection */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Avatar</label>
                                <div className="flex flex-wrap gap-2">
                                    {avatarOptions.map(emoji => (
                                        <button
                                            key={emoji}
                                            onClick={() => setNewAgent(prev => ({ ...prev, avatar: emoji }))}
                                            className={`w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-all ${newAgent.avatar === emoji ? 'bg-indigo-500/20 border-2 border-indigo-500 scale-110' : 'bg-slate-100 dark:bg-slate-800 hover:scale-105'}`}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Agent Name</label>
                                <input
                                    type="text"
                                    value={newAgent.name}
                                    onChange={(e) => setNewAgent(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Math Tutor, Coding Buddy, etc."
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Short Description</label>
                                <input
                                    type="text"
                                    value={newAgent.description}
                                    onChange={(e) => setNewAgent(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="What does this agent do?"
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                                />
                            </div>

                            {/* System Prompt */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">System Prompt</label>
                                <textarea
                                    value={newAgent.systemPrompt}
                                    onChange={(e) => setNewAgent(prev => ({ ...prev, systemPrompt: e.target.value }))}
                                    rows={4}
                                    placeholder="You are a helpful assistant that specializes in..."
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white resize-none"
                                />
                            </div>

                            {/* Personality */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Personality</label>
                                <div className="flex flex-wrap gap-2">
                                    {personalityOptions.map(p => (
                                        <button
                                            key={p}
                                            onClick={() => setNewAgent(prev => ({ ...prev, personality: p.toLowerCase() }))}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${newAgent.personality === p.toLowerCase() ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-indigo-500/20'}`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleCreateAgent}
                                disabled={!newAgent.name.trim() || !newAgent.systemPrompt.trim()}
                                className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                            >
                                Create Agent
                            </button>
                        </div>
                    </div>
                )}

                {view === 'chat' && selectedAgent && (
                    <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl flex flex-col h-[600px]">
                        {/* Chat Header */}
                        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-2xl">
                                {selectedAgent.avatar}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white">{selectedAgent.name}</h3>
                                <p className="text-xs text-slate-500">{selectedAgent.personality}</p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {chatMessages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] ${msg.role === 'user' ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'} rounded-2xl px-4 py-3`}>
                                        <p className="text-sm">{msg.content}</p>
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3 flex gap-1">
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder={`Ask ${selectedAgent.name} anything...`}
                                    className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!chatInput.trim() || isTyping}
                                    className="px-4 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors disabled:opacity-50"
                                >
                                    <Icon name="send" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
